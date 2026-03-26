import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// GET — list all images from our ireyprod folder in Cloudinary
export async function GET() {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
    }

    const result = await cloudinary.api.resources({
      type:        "upload",
      prefix:      "ireyprod/",
      max_results: 200,
      resource_type: "image",
    });

    const images = result.resources.map((r: any) => ({
      publicId:  r.public_id,
      url:       r.secure_url,
      width:     r.width,
      height:    r.height,
      sizeKB:    Math.round(r.bytes / 1024),
      createdAt: r.created_at,
      format:    r.format,
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
