import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    const a = await prisma.artist.findUnique({ where: { id } });
    if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(a);
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json();
  try {
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const updated = await prisma.artist.update({ where: { id }, data: {
      name: body.name, slug, genre: body.genre ?? "", origin: body.origin ?? "",
      bio: body.bio ?? "", image: body.image ?? "", imageAlt: body.image_alt ?? "",
      tags: body.tags ?? [], featured: Boolean(body.featured), sortOrder: body.sort_order ?? 0,
    }});
    return NextResponse.json(updated);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Update failed" }, { status: 500 }); }
}
