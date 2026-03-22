import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    return NextResponse.json(artists);
  } catch (e) { console.error(e); return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body._action === "delete") {
      await prisma.artist.delete({ where: { id: body.id } });
      return NextResponse.json({ success: true });
    }
    const id = body.id || crypto.randomUUID();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.artist.upsert({
      where: { id },
      update: { name: body.name, slug, genre: body.genre ?? "", origin: body.origin ?? "", bio: body.bio ?? "", image: body.image ?? "", imageAlt: body.image_alt ?? "", tags: body.tags ?? [], featured: Boolean(body.featured), sortOrder: body.sort_order ?? 0 },
      create: { id, name: body.name, slug, genre: body.genre ?? "", origin: body.origin ?? "", bio: body.bio ?? "", image: body.image ?? "", imageAlt: body.image_alt ?? "", tags: body.tags ?? [], featured: Boolean(body.featured), sortOrder: body.sort_order ?? 0 },
    });
    return NextResponse.json({ success: true, id });
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}
