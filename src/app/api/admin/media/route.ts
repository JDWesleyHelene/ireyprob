import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// GET — list ALL images from Cloudinary account
export async function GET() {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
    }

    // Fetch from ireyprod folder AND root (catches images uploaded without folder)
    const [folderResult, rootResult] = await Promise.all([
      cloudinary.api.resources({
        type:          "upload",
        prefix:        "ireyprod",   // matches ireyprod/ and ireyprod subfolders
        max_results:   500,
        resource_type: "image",
      }).catch(() => ({ resources: [] })),
      cloudinary.api.resources({
        type:          "upload",
        max_results:   500,
        resource_type: "image",
      }).catch(() => ({ resources: [] })),
    ]);

    // Merge and deduplicate by public_id
    const seen = new Set<string>();
    const all  = [...folderResult.resources, ...rootResult.resources].filter(r => {
      if (seen.has(r.public_id)) return false;
      seen.add(r.public_id);
      return true;
    });

    const images = all.map((r: any) => ({
      publicId:  r.public_id,
      url:       r.secure_url,
      width:     r.width,
      height:    r.height,
      sizeKB:    Math.round(r.bytes / 1024),
      createdAt: r.created_at,
      format:    r.format,
      folder:    r.folder || r.public_id.includes("/") ? r.public_id.split("/").slice(0,-1).join("/") : "root",
    }));

    // Sort newest first
    images.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ images, total: images.length });
  } catch (e: any) {
    console.error("Cloudinary list error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — remove an image from Cloudinary
export async function DELETE(req: Request) {
  try {
    const { publicId } = await req.json();
    if (!publicId) return NextResponse.json({ error: "publicId required" }, { status: 400 });
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true, deleted: publicId });
  } catch (e: any) {
    console.error("Cloudinary delete error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
