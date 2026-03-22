import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// We store admin users in the Setting table as JSON under key "admin_users"
// This avoids needing a separate table migration

async function getUsers() {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "admin_users" } });
    return row?.value ? JSON.parse(row.value) : [];
  } catch { return []; }
}

async function saveUsers(users: any[]) {
  await prisma.setting.upsert({
    where: { key: "admin_users" },
    update: { value: JSON.stringify(users) },
    create: { key: "admin_users", value: JSON.stringify(users) },
  });
}

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (e) { console.error(e); return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const users = await getUsers();
    const newUser = {
      id: crypto.randomUUID(),
      email: body.email,
      full_name: body.full_name || "",
      role: body.role || "editor",
      is_active: body.is_active !== false,
      invited_at: new Date().toISOString(),
    };
    users.unshift(newUser);
    await saveUsers(users);
    return NextResponse.json(newUser);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const users = await getUsers();
    const updated = users.map((u: any) => u.id === body.id ? { ...u, ...body } : u);
    await saveUsers(updated);
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const users = await getUsers();
    const filtered = users.filter((u: any) => u.id !== body.id);
    await saveUsers(filtered);
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
