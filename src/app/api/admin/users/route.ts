import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail } from "@/lib/email";
import crypto from "crypto";

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

    // Check duplicate
    if (users.find((u: any) => u.email === body.email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Generate a secure invite token (expires 48h)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const newUser = {
      id:         crypto.randomUUID(),
      email:      body.email,
      full_name:  body.full_name || "",
      role:       body.role || "editor",
      is_active:  false, // inactive until they set their password
      invited_at: new Date().toISOString(),
      invite_token: token,
      invite_expires: expiresAt,
      password_hash: null,
    };

    users.push(newUser);
    await saveUsers(users);

    // Send invite email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ireyprob.vercel.app";
    const inviteUrl = `${baseUrl}/admin/accept-invite?token=${token}&email=${encodeURIComponent(body.email)}`;

    try {
      await sendInviteEmail({
        toEmail:   body.email,
        toName:    body.full_name || body.email,
        role:      body.role || "editor",
        inviteUrl,
      });
    } catch (emailErr) {
      console.error("Invite email failed:", emailErr);
      // Still return success — user was created, just email failed
    }

    // Don't return sensitive fields
    const { invite_token, invite_expires, password_hash, ...safeUser } = newUser;
    return NextResponse.json(safeUser);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const users = await getUsers();
    const updated = users.map((u: any) =>
      u.id === body.id ? { ...u, ...body } : u
    );
    await saveUsers(updated);
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const users = await getUsers();
    await saveUsers(users.filter((u: any) => u.id !== id));
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
