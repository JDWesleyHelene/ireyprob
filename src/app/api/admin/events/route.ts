import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body._action === "delete") {
      if (!body.id) {
        return NextResponse.json(
          { error: "Event id is required" },
          { status: 400 }
        );
      }

      await prisma.event.delete({
        where: { id: body.id },
      });

      return NextResponse.json({ success: true });
    }

    if (body.featured) {
      await prisma.event.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    const event = await prisma.event.upsert({
      where: { id: body.id },
      update: {
        title: body.title,
        slug: body.slug,
        venue: body.venue,
        city: body.city,
        country: body.country ?? "Mauritius",
        genre: body.genre,
        image: body.image,
        imageAlt: body.imageAlt,
        description: body.description,
        artists: body.artists ?? [],
        eventDate: body.event_date ? new Date(body.event_date) : null,
        featured: Boolean(body.featured),
        soldOut: Boolean(body.sold_out),
        eventTime: body.eventTime || body.event_time || null,
      },
      create: {
        id: body.id,
        title: body.title,
        slug: body.slug,
        venue: body.venue,
        city: body.city,
        country: body.country ?? "Mauritius",
        genre: body.genre,
        image: body.image,
        imageAlt: body.imageAlt,
        description: body.description,
        artists: body.artists ?? [],
        eventDate: body.event_date ? new Date(body.event_date) : null,
        featured: Boolean(body.featured),
        soldOut: Boolean(body.sold_out),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("POST /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Failed to save event" },
      { status: 500 }
    );
  }
}