import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function getUsers() {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "admin_users" } });
    return row?.value ? JSON.parse(row.value) : [];
  } catch { return []; }
}

async function saveUsers(users: any[]) {
  await prisma.setting.upsert({
    where:  { key: "admin_users" },
    update: { value: JSON.stringify(users) },
    create: { key: "admin_users", value: JSON.stringify(users) },
  });
}

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find((u: any) => u.email === email && u.invite_token === token);

    if (!user) {
      return NextResponse.json({ error: "Invalid invite link" }, { status: 400 });
    }

    // Check expiry
    if (user.invite_expires && new Date(user.invite_expires) < new Date()) {
      return NextResponse.json({ error: "This invite link has expired. Please ask for a new invite." }, { status: 400 });
    }

    // Hash password and activate user
    const updated = users.map((u: any) =>
      u.id === user.id ? {
        ...u,
        password_hash:   hashPassword(password),
        is_active:       true,
        invite_token:    null,
        invite_expires:  null,
        activated_at:    new Date().toISOString(),
      } : u
    );

    await saveUsers(updated);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
