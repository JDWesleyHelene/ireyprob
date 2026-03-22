import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json(logs.map(l => ({
      id: l.id, action: l.action, resource: l.resource ?? "",
      details: l.details ?? "", created_at: l.createdAt.toISOString(),
    })));
  } catch (e) { console.error(e); return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await prisma.auditLog.create({ data: {
      action: body.action, resource: body.resource ?? "", details: body.details ?? "",
    }});
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}
