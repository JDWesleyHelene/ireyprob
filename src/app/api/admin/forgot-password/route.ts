import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

const SUPER_ADMIN_EMAIL = "info@wesleyhelene.com";

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
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Always return success to avoid email enumeration
    const baseUrl  = process.env.NEXT_PUBLIC_APP_URL || "https://ireyprob.vercel.app";

    // Super admin — send reset to their email directly
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      const token     = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      // Store token in settings
      await prisma.setting.upsert({
        where:  { key: "super_admin_reset_token" },
        update: { value: JSON.stringify({ token, expiresAt }) },
        create: { key: "super_admin_reset_token", value: JSON.stringify({ token, expiresAt }) },
      });

      const resetUrl = `${baseUrl}/admin/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
      await sendPasswordResetEmail({ toEmail: email, toName: "Wesley", resetUrl });
      return NextResponse.json({ success: true });
    }

    // Invited users
    const users = await getUsers();
    const user  = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !user.is_active) {
      // Still return success — don't reveal if email exists
      return NextResponse.json({ success: true });
    }

    const token     = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const updated = users.map((u: any) =>
      u.id === user.id ? { ...u, reset_token: token, reset_expires: expiresAt } : u
    );
    await saveUsers(updated);

    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail({ toEmail: email, toName: user.full_name || email, resetUrl });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
