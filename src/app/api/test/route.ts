import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const eventCount = await prisma.event.count();

  return NextResponse.json({
    ok: true,
    eventCount,
  });
}