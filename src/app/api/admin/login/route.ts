import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const SUPER_ADMIN_EMAIL = "info@wesleyhelene.com";

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const attempt = crypto.scryptSync(password, salt, 64).toString("hex");
    return attempt === hash;
  } catch { return false; }
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Super admin — check DB reset password first, fall back to hardcoded
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      const resetPwRow = await prisma.setting.findUnique({ where: { key: "super_admin_password" } });
      if (resetPwRow?.value) {
        // Has a reset password stored — use that
        if (verifyPassword(password, resetPwRow.value)) {
          return NextResponse.json({ success: true, email: SUPER_ADMIN_EMAIL, name: "Wesley", role: "super_admin" });
        }
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      // No reset password — use hardcoded (handled by login page directly)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Invited users — load from DB
    const row   = await prisma.setting.findUnique({ where: { key: "admin_users" } });
    const users = row?.value ? JSON.parse(row.value) : [];
    const user  = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (!user.is_active) {
      return NextResponse.json({ error: "Account not yet activated. Check your invite email." }, { status: 401 });
    }
    if (!user.password_hash) {
      return NextResponse.json({ error: "Password not set. Check your invite email." }, { status: 401 });
    }
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      email:   user.email,
      name:    user.full_name || user.email,
      role:    user.role,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
