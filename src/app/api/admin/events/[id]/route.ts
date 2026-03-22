import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  try {
    if (body.featured) {
      await prisma.event.updateMany({
        where: {
          featured: true,
          NOT: { id },
        },
        data: { featured: false },
      });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        venue: body.venue,
        city: body.city,
        country: body.country ?? "Mauritius",
        genre: body.genre,
        description: body.description,
        image: body.image,
        imageAlt: body.imageAlt,
        eventDate: body.event_date ? new Date(body.event_date) : null,
        featured: Boolean(body.featured),
        soldOut: Boolean(body.sold_out),
        eventTime: body.eventTime || body.event_time || null,
        artists: body.artists ?? [],
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}