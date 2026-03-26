import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingNotification } from "@/lib/email";

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

    // Save to DB
    await prisma.bookingSubmission.create({ data: {
      artistName: body.artist_name ?? body.artistName ?? "",
      fullName:   body.full_name  ?? body.fullName   ?? "",
      email:      body.email      ?? "",
      address:    body.address    ?? "",
      dateTime:   body.date_time  ? new Date(body.date_time) : body.dateTime ? new Date(body.dateTime) : null,
      message:    body.message    ?? "",
      status:     "new",
    }});

    // Send email notification (non-blocking — don't fail if email fails)
    sendBookingNotification({
      artistName: body.artist_name ?? body.artistName ?? "Unknown Artist",
      fullName:   body.full_name   ?? body.fullName   ?? "",
      email:      body.email       ?? "",
      address:    body.address     ?? "",
      dateTime:   body.date_time   ?? body.dateTime   ?? "",
      message:    body.message     ?? "",
    }).catch(err => console.error("Email notification failed:", err));

    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await prisma.bookingSubmission.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Delete failed" }, { status: 500 }); }
}
