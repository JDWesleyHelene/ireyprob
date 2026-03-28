import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

const WP_BASE = "https://ireyprod.com/wp-content/uploads/";

const HARDCODED_WP_URLS = [
  "https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",
  "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",
  "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg",
  "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",
  "https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg",
  "https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg",
  "https://ireyprod.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-21-at-12.32.07_43897a31.jpg",
  "https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg",
  "https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg",
  "https://ireyprod.com/wp-content/uploads/2023/12/319291225_674505520974726_3683712000139163132_n.jpg",
  "https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d024-qetpkvnnuor9fqhufseegetdgswcuflrz3eovw9x60.jpg",
  "https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d029-qetpkzf0m0weq6cdtu0wqdv7ucdtp80pbm0mt04ch4.jpg",
  "https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d005-qetpkgm8tc6o9z3ovlwdcilzymyhf9y2l0yx7gw7xk.jpg",
  "https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png",
  "https://ireyprod.com/wp-content/uploads/2023/11/IREY-PROD-WHITE.png",
];

function extractWpUrls(val: string): string[] {
  return val.match(/https:\/\/ireyprod\.com\/wp-content\/uploads\/[^\s"'`}\]]+/g) || [];
}

// Convert WP URL → Cloudinary public_id using exact filename
function wpUrlToPublicId(wpUrl: string): string {
  const filename  = wpUrl.split("/").pop() || "image";
  const nameNoExt = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `ireyprod/${nameNoExt}`;
}

// Upload WP image to Cloudinary preserving exact filename
async function uploadFromUrl(wpUrl: string): Promise<{ wpUrl: string; cloudUrl: string; publicId: string; status: string }> {
  const publicId = wpUrlToPublicId(wpUrl);
  try {
    // Check if already uploaded with exact same public_id
    try {
      const existing = await cloudinary.api.resource(publicId);
      return { wpUrl, cloudUrl: existing.secure_url, publicId, status: "already_exists" };
    } catch {}

    const result = await cloudinary.uploader.upload(wpUrl, {
      public_id:     publicId,
      overwrite:     true,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    return { wpUrl, cloudUrl: result.secure_url, publicId, status: "uploaded" };
  } catch (e: any) {
    // Build expected URL anyway — if filename matches it'll work after manual upload
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const fallbackUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
    return { wpUrl, cloudUrl: fallbackUrl, publicId, status: `error: ${e.message}` };
  }
}

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const dbUrls   = new Set<string>();
    settings.forEach((s: any) => { if (s.value) extractWpUrls(s.value).forEach(u => dbUrls.add(u)); });
    const allUrls  = [...new Set([...HARDCODED_WP_URLS, ...dbUrls])];
    return NextResponse.json({ total: allUrls.size, hardcoded: HARDCODED_WP_URLS.length, fromDB: dbUrls.size, urls: allUrls });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST() {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });

    const settings = await prisma.setting.findMany();
    const dbUrls   = new Set<string>();
    settings.forEach((s: any) => { if (s.value) extractWpUrls(s.value).forEach(u => dbUrls.add(u)); });
    const allUrls  = [...new Set([...HARDCODED_WP_URLS, ...dbUrls])];

    // Upload all — each gets exact same filename as public_id
    const results = [];
    for (const url of allUrls) {
      const r = await uploadFromUrl(url);
      results.push(r);
    }

    // Build mapping WP URL → Cloudinary URL
    const mapping: Record<string, string> = {};
    results.forEach(r => { mapping[r.wpUrl] = r.cloudUrl; });

    // Update DB settings — replace all WP URLs with Cloudinary URLs
    let settingsUpdated = 0;
    for (const s of settings) {
      if (!s.value) continue;
      let newVal = s.value; let changed = false;
      for (const [wp, cloud] of Object.entries(mapping)) {
        if (newVal.includes(wp)) { newVal = newVal.split(wp).join(cloud); changed = true; }
      }
      if (changed) { await prisma.setting.update({ where: { key: s.key }, data: { value: newVal } }); settingsUpdated++; }
    }

    // Save mapping to DB for reference
    await prisma.setting.upsert({
      where:  { key: "_migration_mapping" },
      update: { value: JSON.stringify(mapping) },
      create: { key: "_migration_mapping", value: JSON.stringify(mapping) },
    });

    return NextResponse.json({
      success: true, total: results.length,
      uploaded: results.filter(r => r.status === "uploaded").length,
      already:  results.filter(r => r.status === "already_exists").length,
      errors:   results.filter(r => r.status.startsWith("error")).length,
      settingsUpdated, results, mapping,
    });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
