import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// Load email recipients from DB settings
async function getEmailSettings() {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: [
        "contact_form_to","contact_form_cc","contact_form_bcc",
        "booking_form_to","booking_form_cc","booking_form_bcc",
      ]}},
    });
    const map: Record<string,string> = {};
    rows.forEach(r => { if (r.value) map[r.key] = r.value; });
    return map;
  } catch { return {}; }
}

// Parse comma-separated emails into array, filter empty
function parseEmails(val?: string): string[] {
  if (!val) return [];
  return val.split(",").map(e => e.trim()).filter(Boolean);
}

const FROM = process.env.RESEND_FROM_EMAIL || "IREY PROD <onboarding@resend.dev>";
const FALLBACK_TO = process.env.NOTIFICATION_EMAIL || "info@wesleyhelene.com";

// ── Booking notification ──────────────────────────────────────────────────────
export async function sendBookingNotification(data: {
  artistName: string;
  fullName:   string;
  email:      string;
  address:    string;
  dateTime:   string;
  message:    string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const cfg = await getEmailSettings();
  const to  = parseEmails(cfg.booking_form_to);
  const cc  = parseEmails(cfg.booking_form_cc);
  const bcc = parseEmails(cfg.booking_form_bcc);

  await resend.emails.send({
    from:    FROM,
    to:      to.length   ? to  : [FALLBACK_TO],
    cc:      cc.length   ? cc  : undefined,
    bcc:     bcc.length  ? bcc : undefined,
    replyTo: data.email,
    subject: `🎤 New Booking Request — ${data.artistName}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#060606;color:#F0EDE8;border-radius:8px;overflow:hidden;">
        <div style="background:#D4AF37;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#060606;letter-spacing:-0.5px;">New Booking Request</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#060606;opacity:0.7;">IREY PROD Dashboard</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);width:140px;">Artist</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;font-weight:600;color:#D4AF37;">${data.artistName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;">${data.fullName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;color:#F0EDE8;"><a href="mailto:${data.email}" style="color:#D4AF37;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Venue</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;">${data.address || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Date & Time</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;">${data.dateTime || "Not specified"}</td>
            </tr>
            ${data.message ? `
            <tr>
              <td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);vertical-align:top;">Message</td>
              <td style="padding:10px 0;font-size:14px;color:rgba(240,237,232,0.7);">${data.message}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top:28px;padding:16px;background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:6px;">
            <p style="margin:0;font-size:12px;color:rgba(240,237,232,0.5);">Reply directly to this email to respond to ${data.fullName}.</p>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="https://ireyprob.vercel.app/admin/bookings" style="display:inline-block;padding:12px 24px;background:#D4AF37;color:#060606;font-size:12px;font-weight:700;text-decoration:none;border-radius:4px;letter-spacing:0.1em;text-transform:uppercase;">View in Dashboard →</a>
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(240,237,232,0.06);font-size:11px;color:rgba(240,237,232,0.25);text-align:center;">IREY PROD · Mauritius Island</div>
      </div>
    `,
  });
}

// ── Contact notification ───────────────────────────────────────────────────────
export async function sendContactNotification(data: {
  name:      string;
  email:     string;
  subject?:  string;
  project:   string;
  budget:    string;
  timeframe: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const cfg = await getEmailSettings();
  const to  = parseEmails(cfg.contact_form_to);
  const cc  = parseEmails(cfg.contact_form_cc);
  const bcc = parseEmails(cfg.contact_form_bcc);

  await resend.emails.send({
    from:    FROM,
    to:      to.length  ? to  : [FALLBACK_TO],
    cc:      cc.length  ? cc  : undefined,
    bcc:     bcc.length ? bcc : undefined,
    replyTo: data.email,
    subject: `✉️ New Contact Enquiry — ${data.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#060606;color:#F0EDE8;border-radius:8px;overflow:hidden;">
        <div style="background:#060606;border-bottom:2px solid #D4AF37;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#F0EDE8;letter-spacing:-0.5px;">New Contact Enquiry</h1>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(240,237,232,0.4);">IREY PROD Dashboard</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);width:140px;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;font-weight:600;color:#F0EDE8;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;color:#F0EDE8;"><a href="mailto:${data.email}" style="color:#D4AF37;">${data.email}</a></td>
            </tr>
            ${data.subject ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;color:#F0EDE8;">${data.subject}</td>
            </tr>` : ""}
            ${data.budget ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Budget</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;">${data.budget}</td>
            </tr>` : ""}
            ${data.timeframe ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);">Timeframe</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(240,237,232,0.08);font-size:14px;">${data.timeframe}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(240,237,232,0.4);vertical-align:top;">Project</td>
              <td style="padding:10px 0;font-size:14px;color:rgba(240,237,232,0.8);">${data.project}</td>
            </tr>
          </table>
          <div style="margin-top:28px;padding:16px;background:rgba(240,237,232,0.04);border:1px solid rgba(240,237,232,0.08);border-radius:6px;">
            <p style="margin:0;font-size:12px;color:rgba(240,237,232,0.5);">Reply directly to this email to respond to ${data.name}.</p>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="https://ireyprob.vercel.app/admin/contact" style="display:inline-block;padding:12px 24px;background:#D4AF37;color:#060606;font-size:12px;font-weight:700;text-decoration:none;border-radius:4px;letter-spacing:0.1em;text-transform:uppercase;">View in Dashboard →</a>
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(240,237,232,0.06);font-size:11px;color:rgba(240,237,232,0.25);text-align:center;">IREY PROD · Mauritius Island</div>
      </div>
    `,
  });
}

// ── User invite email ─────────────────────────────────────────────────────────
export async function sendInviteEmail(data: {
  toEmail:   string;
  toName:    string;
  role:      string;
  inviteUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const FROM = process.env.RESEND_FROM_EMAIL || "IREY PROD <onboarding@resend.dev>";

  await resend.emails.send({
    from:    FROM,
    to:      [data.toEmail],
    subject: `You've been invited to IREY PROD Dashboard`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#060606;color:#F0EDE8;border-radius:8px;overflow:hidden;">
        <div style="background:#D4AF37;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#060606;">You're Invited!</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#060606;opacity:0.7;">IREY PROD Admin Dashboard</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:#F0EDE8;margin-bottom:8px;">Hi ${data.toName || data.toEmail},</p>
          <p style="font-size:14px;color:rgba(240,237,232,0.7);line-height:1.6;margin-bottom:24px;">
            You have been invited to access the <strong style="color:#F0EDE8;">IREY PROD</strong> admin dashboard
            as <strong style="color:#D4AF37;">${data.role.charAt(0).toUpperCase() + data.role.slice(1)}</strong>.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${data.inviteUrl}"
              style="display:inline-block;padding:14px 32px;background:#D4AF37;color:#060606;font-size:13px;font-weight:700;text-decoration:none;border-radius:4px;letter-spacing:0.1em;text-transform:uppercase;">
              Set My Password →
            </a>
          </div>
          <div style="padding:16px;background:rgba(240,237,232,0.04);border:1px solid rgba(240,237,232,0.08);border-radius:6px;margin-top:24px;">
            <p style="margin:0;font-size:12px;color:rgba(240,237,232,0.4);">
              This link expires in 48 hours. If you did not expect this invitation, you can ignore this email.
            </p>
          </div>
          <p style="margin-top:24px;font-size:11px;color:rgba(240,237,232,0.25);text-align:center;">
            Or copy this link: <br/>
            <span style="color:rgba(212,175,55,0.6);word-break:break-all;">${data.inviteUrl}</span>
          </p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(240,237,232,0.06);font-size:11px;color:rgba(240,237,232,0.25);text-align:center;">IREY PROD · Mauritius Island</div>
      </div>
    `,
  });
}

// ── Password reset email ──────────────────────────────────────────────────────
export async function sendPasswordResetEmail(data: {
  toEmail:   string;
  toName:    string;
  resetUrl:  string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const FROM = process.env.RESEND_FROM_EMAIL || "IREY PROD <onboarding@resend.dev>";
  await resend.emails.send({
    from:    FROM,
    to:      [data.toEmail],
    subject: "Reset your IREY PROD password",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#060606;color:#F0EDE8;border-radius:8px;overflow:hidden;">
        <div style="background:#060606;border-bottom:2px solid #D4AF37;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#F0EDE8;">Password Reset</h1>
          <p style="margin:4px 0 0;font-size:13px;color:rgba(240,237,232,0.4);">IREY PROD Admin Dashboard</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:#F0EDE8;margin-bottom:8px;">Hi ${data.toName},</p>
          <p style="font-size:14px;color:rgba(240,237,232,0.7);line-height:1.6;margin-bottom:28px;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${data.resetUrl}"
              style="display:inline-block;padding:14px 32px;background:#D4AF37;color:#060606;font-size:13px;font-weight:700;text-decoration:none;border-radius:4px;letter-spacing:0.1em;text-transform:uppercase;">
              Reset My Password →
            </a>
          </div>
          <div style="padding:16px;background:rgba(240,237,232,0.04);border:1px solid rgba(240,237,232,0.08);border-radius:6px;margin-top:24px;">
            <p style="margin:0;font-size:12px;color:rgba(240,237,232,0.4);">
              This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
            </p>
          </div>
          <p style="margin-top:24px;font-size:11px;color:rgba(240,237,232,0.25);text-align:center;">
            Or copy this link:<br/>
            <span style="color:rgba(212,175,55,0.6);word-break:break-all;">${data.resetUrl}</span>
          </p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(240,237,232,0.06);font-size:11px;color:rgba(240,237,232,0.25);text-align:center;">IREY PROD · Mauritius Island</div>
      </div>
    `,
  });
}
