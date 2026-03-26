import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { data, filename } = await req.json();
    if (!data || !data.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    // Check size — base64 images > 500KB will be too large for Neon text field
    const sizeKB = Math.round(data.length * 0.75 / 1024);
    if (sizeKB > 500) {
      return NextResponse.json({
        error: `Image too large (${sizeKB}KB). Please use an image URL instead, or compress the image below 500KB.`,
        tooLarge: true,
      }, { status: 413 });
    }

    return NextResponse.json({ url: data, filename, sizeKB });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
