import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.bookingSubmission.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(bookings.map(b => ({
      id: b.id, artist_name: b.artistName ?? "", full_name: b.fullName,
      email: b.email, address: b.address ?? "",
      date_time: b.dateTime?.toISOString() ?? "",
      message: b.message ?? "", status: b.status,
      created_at: b.createdAt.toISOString(),
    })));
  } catch (e) { console.error(e); return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await prisma.bookingSubmission.create({ data: {
      artistName: body.artist_name ?? "",
      fullName: body.full_name ?? body.fullName ?? "",
      email: body.email ?? "",
      address: body.address ?? "",
      dateTime: body.date_time ? new Date(body.date_time) : null,
      message: body.message ?? "",
      status: "new",
    }});
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}
