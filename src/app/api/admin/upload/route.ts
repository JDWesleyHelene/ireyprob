import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data, filename } = await req.json();
    if (!data || !data.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    // Return the data URL directly — it works as an image src
    // For production: integrate with Cloudinary, AWS S3, or Vercel Blob
    return NextResponse.json({ url: data, filename });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
