import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.setting.findMany();
    const out: Record<string, string> = {};
    rows.forEach(r => { if (r.value !== null) out[r.key] = r.value; });
    return NextResponse.json(out);
  } catch (e) { console.error(e); return NextResponse.json({}, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await Promise.all(
      Object.entries(body)
        .filter(([k]) => !k.startsWith("_"))
        .map(([key, value]) => prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        }))
    );
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "DB error" }, { status: 500 }); }
}
