import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(contacts.map(c => ({
      id: c.id, name: c.name, email: c.email,
      budget: c.budget ?? "", timeframe: c.timeframe ?? "",
      project: c.project ?? "", status: c.status,
      created_at: c.createdAt.toISOString(),
    })));
  } catch (e) { console.error(e); return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await prisma.contactSubmission.create({ data: {
      name: body.name ?? "", email: body.email ?? "",
      budget: body.budget ?? "", timeframe: body.timeframe ?? "",
      project: body.project ?? "", status: "new",
    }});
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}
