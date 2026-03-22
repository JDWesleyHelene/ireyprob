import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(articles.map(a => ({
      id: a.id, title: a.title, slug: a.slug,
      excerpt: a.excerpt ?? "", content: a.content ?? "",
      cover_image: a.coverImage ?? "", cover_image_alt: a.coverAlt ?? "",
      author: a.author ?? "IREY PROD", status: a.status,
      published_at: a.publishedAt?.toISOString() ?? "",
      created_at: a.createdAt.toISOString(),
    })));
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body._action === "delete") {
      await prisma.news.delete({ where: { id: body.id } });
      return NextResponse.json({ success: true });
    }
    if (body._action === "toggle_status") {
      await prisma.news.update({ where: { id: body.id }, data: {
        status: body.status,
        publishedAt: body.published_at ? new Date(body.published_at) : null,
      }});
      return NextResponse.json({ success: true });
    }
    const id = body.id || crypto.randomUUID();
    await prisma.news.upsert({
      where: { id },
      update: { title: body.title, slug: body.slug, excerpt: body.excerpt ?? "", content: body.content ?? "", coverImage: body.cover_image ?? "", coverAlt: body.cover_image_alt ?? "", author: body.author ?? "IREY PROD", status: body.status ?? "draft", publishedAt: body.published_at ? new Date(body.published_at) : null },
      create: { id, title: body.title, slug: body.slug, excerpt: body.excerpt ?? "", content: body.content ?? "", coverImage: body.cover_image ?? "", coverAlt: body.cover_image_alt ?? "", author: body.author ?? "IREY PROD", status: body.status ?? "draft", publishedAt: body.published_at ? new Date(body.published_at) : null },
    });
    return NextResponse.json({ success: true, id });
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}
