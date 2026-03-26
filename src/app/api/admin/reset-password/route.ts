import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const SUPER_ADMIN_EMAIL = "info@wesleyhelene.com";

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
    const { email, token, password } = await req.json();
    if (!email || !token || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Super admin reset
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      const row = await prisma.setting.findUnique({ where: { key: "super_admin_reset_token" } });
      if (!row?.value) return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
      const { token: storedToken, expiresAt } = JSON.parse(row.value);
      if (storedToken !== token || new Date(expiresAt) < new Date()) {
        return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
      }
      // Super admin password is hardcoded — store new one in settings
      await prisma.setting.upsert({
        where:  { key: "super_admin_password" },
        update: { value: hashPassword(password) },
        create: { key: "super_admin_password", value: hashPassword(password) },
      });
      // Clear token
      await prisma.setting.delete({ where: { key: "super_admin_reset_token" } }).catch(() => {});
      return NextResponse.json({ success: true });
    }

    // Invited user reset
    const users = await getUsers();
    const user  = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.reset_token !== token) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
    }
    if (!user.reset_expires || new Date(user.reset_expires) < new Date()) {
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
    }

    const updated = users.map((u: any) =>
      u.id === user.id ? {
        ...u,
        password_hash:  hashPassword(password),
        reset_token:    null,
        reset_expires:  null,
      } : u
    );
    await saveUsers(updated);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
