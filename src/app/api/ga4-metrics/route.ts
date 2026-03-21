import { NextResponse } from "next/server";

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const GA4_API_SECRET = process.env.GA4_API_SECRET;
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

interface GA4RunReportResponse {
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
  totals?: Array<{
    metricValues?: Array<{ value: string }>;
  }>;
}

async function fetchGA4Report(body: object): Promise<GA4RunReportResponse | null> {
  if (!GA4_PROPERTY_ID || !GA4_API_SECRET) return null;

  try {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GA4_API_SECRET}`,
        },
        body: JSON.stringify(body),
        next: { revalidate: 60 }, // cache 60s
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchGA4RealtimeReport(body: object): Promise<GA4RunReportResponse | null> {
  if (!GA4_PROPERTY_ID || !GA4_API_SECRET) return null;

  try {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runRealtimeReport`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GA4_API_SECRET}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const isConfigured =
    !!GA4_PROPERTY_ID &&
    !!GA4_API_SECRET &&
    GA4_PROPERTY_ID !== "your-ga4-property-id" &&
    GA4_API_SECRET !== "your-ga4-api-secret";

  if (!isConfigured) {
    return NextResponse.json({
      configured: false,
      measurementId: MEASUREMENT_ID && MEASUREMENT_ID !== "your-google-analytics-id-here" ? MEASUREMENT_ID : null,
    });
  }

  // Fetch all reports in parallel
  const [pageViewsReport, eventsReport, realtimeReport, conversionReport] = await Promise.all([
    // Page views last 30 days by page
    fetchGA4Report({
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "sessions" }, { name: "bounceRate" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    }),
    // Custom events (artist_click, booking_form_start, booking_form_submit)
    fetchGA4Report({
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }, { name: "eventCountPerUser" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: {
            values: ["artist_click", "booking_form_start", "booking_form_submit", "page_view", "booking_cta_click"],
          },
        },
      },
    }),
    // Realtime active users
    fetchGA4RealtimeReport({
      dimensions: [{ name: "unifiedScreenName" }],
      metrics: [{ name: "activeUsers" }],
      limit: 5,
    }),
    // Conversion: sessions vs booking submissions (last 7 days)
    fetchGA4Report({
      dateRanges: [
        { startDate: "7daysAgo", endDate: "today" },
        { startDate: "14daysAgo", endDate: "8daysAgo" },
      ],
      metrics: [{ name: "sessions" }, { name: "screenPageViews" }, { name: "averageSessionDuration" }],
    }),
  ]);

  // Parse page views
  const topPages =
    pageViewsReport?.rows?.map((row) => ({
      path: row.dimensionValues?.[0]?.value || "/",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
      sessions: parseInt(row.metricValues?.[1]?.value || "0"),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || "0"),
    })) || [];

  // Parse events
  const eventMap: Record<string, number> = {};
  eventsReport?.rows?.forEach((row) => {
    const name = row.dimensionValues?.[0]?.value || "";
    const count = parseInt(row.metricValues?.[0]?.value || "0");
    eventMap[name] = count;
  });

  const artistClicks = eventMap["artist_click"] || 0;
  const bookingFormStarts = eventMap["booking_form_start"] || 0;
  const bookingFormSubmits = eventMap["booking_form_submit"] || 0;
  const bookingCtaClicks = eventMap["booking_cta_click"] || 0;
  const totalPageViews = eventMap["page_view"] || topPages.reduce((s, p) => s + p.views, 0);

  // Conversion rate: form submits / form starts
  const conversionRate =
    bookingFormStarts > 0 ? Math.round((bookingFormSubmits / bookingFormStarts) * 100 * 10) / 10 : 0;

  // Realtime active users
  const activeUsers =
    realtimeReport?.rows?.reduce((sum, row) => sum + parseInt(row.metricValues?.[0]?.value || "0"), 0) || 0;

  // Sessions this week vs last week
  const sessionsThisWeek = parseInt(conversionReport?.rows?.[0]?.metricValues?.[0]?.value || "0");
  const sessionsLastWeek = parseInt(conversionReport?.rows?.[1]?.metricValues?.[0]?.value || "0");
  const sessionChange =
    sessionsLastWeek > 0 ? Math.round(((sessionsThisWeek - sessionsLastWeek) / sessionsLastWeek) * 100) : 0;

  const avgSessionDuration = parseFloat(conversionReport?.rows?.[0]?.metricValues?.[2]?.value || "0");

  return NextResponse.json({
    configured: true,
    measurementId: MEASUREMENT_ID,
    lastUpdated: new Date().toISOString(),
    realtime: {
      activeUsers,
    },
    overview: {
      totalPageViews,
      sessionsThisWeek,
      sessionChange,
      avgSessionDuration: Math.round(avgSessionDuration),
    },
    events: {
      artistClicks,
      bookingFormStarts,
      bookingFormSubmits,
      bookingCtaClicks,
      conversionRate,
    },
    topPages,
  });
}
