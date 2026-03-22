Deno?.serve(async (req) => {
  if (req?.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    });
  }
  try {
    const body = await req?.json();
    const { type, data } = body;

    const RESEND_API_KEY = Deno?.env?.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    // Fetch notification settings from Supabase
    const SUPABASE_URL = Deno?.env?.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno?.env?.get("SUPABASE_SERVICE_ROLE_KEY");

    let notificationEmail = "booking@ireyprod.com";
    let emailAlertsBookings = true;
    let emailAlertsContacts = true;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const settingsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/site_settings?key=in.(notification_email,email_alerts_bookings,email_alerts_contacts)&select=key,value`,
          {
            headers: {
              "apikey": SUPABASE_SERVICE_ROLE_KEY,
              "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            }
          }
        );
        if (settingsRes?.ok) {
          const settingsData = await settingsRes?.json();
          for (const row of settingsData) {
            if (row?.key === "notification_email" && row?.value) notificationEmail = row?.value;
            if (row?.key === "email_alerts_bookings") emailAlertsBookings = row?.value === "true";
            if (row?.key === "email_alerts_contacts") emailAlertsContacts = row?.value === "true";
          }
        }
      } catch (_) {
        // Use defaults if settings fetch fails
      }
    }

    let subject = "";
    let html = "";

    if (type === "booking") {
      if (!emailAlertsBookings) {
        return new Response(JSON.stringify({ success: true, skipped: "email alerts disabled" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
      subject = `New Booking Request: ${data?.artistName}`;
      html = `
        <div style="font-family: 'DM Sans', Arial, sans-serif; background: #060606; color: #F0EDE8; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 1px solid rgba(240,237,232,0.1); padding-bottom: 24px; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 300; color: #F0EDE8; margin: 0 0 8px 0;">New Booking Request</h1>
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #D4AF37; margin: 0;">IREY PROD — Booking Agency</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; width: 140px;">Artist</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.artistName}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Full Name</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.fullName}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Email</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.email}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Venue</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.address}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Date & Time</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.dateTime}</td></tr>
            ${data?.message ? `<tr><td style="padding: 12px 0; color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; vertical-align: top;">Details</td><td style="padding: 12px 0; color: #F0EDE8; font-size: 14px; line-height: 1.6;">${data?.message}</td></tr>` : ""}
          </table>
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(240,237,232,0.1);">
            <p style="font-size: 11px; color: rgba(240,237,232,0.3); margin: 0;">IREY PROD · Mauritius Island · booking@ireyprod.com</p>
          </div>
        </div>
      `;
    } else if (type === "contact") {
      if (!emailAlertsContacts) {
        return new Response(JSON.stringify({ success: true, skipped: "email alerts disabled" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
      subject = `New Enquiry from ${data?.name}`;
      html = `
        <div style="font-family: 'DM Sans', Arial, sans-serif; background: #060606; color: #F0EDE8; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 1px solid rgba(240,237,232,0.1); padding-bottom: 24px; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 300; color: #F0EDE8; margin: 0 0 8px 0;">New Online Enquiry</h1>
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #D4AF37; margin: 0;">IREY PROD — Contact Form</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; width: 140px;">Name</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.name}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Email</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.email}</td></tr>
            ${data?.budget ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Budget</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.budget}</td></tr>` : ""}
            ${data?.timeframe ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Timeframe</td><td style="padding: 12px 0; border-bottom: 1px solid rgba(240,237,232,0.06); color: #F0EDE8; font-size: 14px;">${data?.timeframe}</td></tr>` : ""}
            <tr><td style="padding: 12px 0; color: rgba(240,237,232,0.5); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; vertical-align: top;">Project</td><td style="padding: 12px 0; color: #F0EDE8; font-size: 14px; line-height: 1.6;">${data?.project}</td></tr>
          </table>
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(240,237,232,0.1);">
            <p style="font-size: 11px; color: rgba(240,237,232,0.3); margin: 0;">IREY PROD · Mauritius Island · booking@ireyprod.com</p>
          </div>
        </div>
      `;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [notificationEmail],
        subject,
        html
      })
    });

    const result = await response?.json();

    if (!response?.ok) {
      throw new Error(result.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});
