import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
  secure:      true,
});

export async function POST(req: Request) {
  try {
    const { data, filename } = await req.json();

    if (!data || !data.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    // Check env vars are set
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(data, {
      folder:         "ireyprod",
      use_filename:   true,
      unique_filename: true,
      overwrite:      false,
      resource_type:  "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return NextResponse.json({
      url:       result.secure_url,
      publicId:  result.public_id,
      width:     result.width,
      height:    result.height,
      sizeKB:    Math.round(result.bytes / 1024),
    });
  } catch (e: any) {
    console.error("Cloudinary upload error:", e);
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
