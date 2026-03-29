import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
type Ctx = { params: Promise<{ id: string }> };

const sl = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
    // Sort-order only update — don't touch other fields
    if (body.sort_order !== undefined && Object.keys(body).length === 1) {
      const updated = await prisma.artist.update({
        where: { id },
        data:  { sortOrder: Number(body.sort_order) },
      });
      return NextResponse.json(updated);
    }

    // Full update
    const slug = body.slug ? sl(body.slug) : sl(body.name || "");
    const updated = await prisma.artist.update({ where: { id }, data: {
      name:      body.name      ?? undefined,
      slug:      slug           || undefined,
      genre:     body.genre     ?? undefined,
      origin:    body.origin    ?? undefined,
      bio:       body.bio       ?? undefined,
      image:     body.image     ?? undefined,
      imageAlt:  body.image_alt ?? undefined,
      tags:        body.tags        ?? undefined,
      socialLinks: body.socialLinks  ?? undefined,
      featured:    body.featured !== undefined ? Boolean(body.featured) : undefined,
      sortOrder: body.sort_order !== undefined ? Number(body.sort_order) : undefined,
    }});
    return NextResponse.json(updated);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Update failed" }, { status: 500 }); }
}
