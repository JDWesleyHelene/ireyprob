"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { artists, events, news, services } from "@/lib/data";

interface Submission { id: number; name: string; email: string; artist?: string; created_at: string; type: string; }

const quickActions = [
  { href: "/admin/artists/new",  label: "Add New Artist" },
  { href: "/admin/events/new",   label: "Add New Event" },
  { href: "/admin/news",         label: "Manage News & Blog" },
  { href: "/admin/homepage",     label: "Edit Homepage Content" },
  { href: "/admin/services",     label: "Manage Services" },
  { href: "/admin/bookings",     label: "View Booking Requests" },
  { href: "/admin/contact",      label: "View Contact Enquiries" },
  { href: "/admin/settings",     label: "Settings & Password" },
];

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    // Try to load submissions from PHP — fallback to empty
    const load = async () => {
      try {
        const [b, c] = await Promise.all([
          fetch("/api/admin/get-bookings.php").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/get-contacts.php").then(r => r.ok ? r.json() : []),
        ]);
        const all = [
          ...(Array.isArray(b) ? b.map((x: any) => ({ ...x, type: "booking" })) : []),
          ...(Array.isArray(c) ? c.map((x: any) => ({ ...x, type: "contact" })) : []),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);
        setSubmissions(all);
      } catch { setSubmissions([]); }
      setLoadingSubs(false);
    };
    load();
  }, []);

  const stats = [
    { label: "Artists",          value: artists.length,                         href: "/admin/artists",  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { label: "Events",           value: events.length,                          href: "/admin/events",   icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "News Articles",    value: news.filter(n => n.status === "published").length, href: "/admin/news", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { label: "Services",         value: services.length,                        href: "/admin/services", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-2">— Overview</span>
        <h1 className="font-display text-3xl sm:text-4xl font-light italic text-foreground">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((card) => (
          <Link key={card.label} href={card.href}
            className="group bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 hover:border-foreground/20 hover:bg-foreground/[0.04] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30 group-hover:text-foreground/50 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20 group-hover:text-foreground/40 transition-colors"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
            <p className="font-display text-3xl font-light text-foreground mb-1">{card.value}</p>
            <p className="text-[11px] text-foreground/40 tracking-wide">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}
                className="flex items-center justify-between px-4 py-3 border border-foreground/8 rounded-sm hover:border-foreground/20 hover:bg-foreground/5 transition-all duration-200 group">
                <span className="text-[12px] text-foreground/60 group-hover:text-foreground transition-colors">{action.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20 group-hover:text-foreground/50 transition-colors"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent submissions */}
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Recent Submissions</h2>
            <Link href="/admin/bookings" className="text-[10px] text-foreground/30 hover:text-foreground/60 transition-colors uppercase tracking-widest">View all →</Link>
          </div>
          {loadingSubs ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-foreground/5 rounded animate-pulse" />)}</div>
          ) : submissions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[13px] text-foreground/20 mb-2">No submissions yet.</p>
              <p className="text-[11px] text-foreground/15">Booking & contact forms will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
                  <div>
                    <p className="text-[12px] text-foreground/70">{s.name}</p>
                    <p className="text-[10px] text-foreground/30">{s.artist || s.email} · <span className="capitalize">{s.type}</span></p>
                  </div>
                  <span className="text-[10px] text-foreground/20">{new Date(s.created_at).toLocaleDateString("en-GB")}</span>
                </div>
              ))}
            </div>
          )}

          {/* Site info banner */}
          <div className="mt-6 pt-5 border-t border-foreground/8">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
              <span className="text-[10px] text-emerald-400/70 font-semibold tracking-widest uppercase">Site Running</span>
            </div>
            <p className="text-[11px] text-foreground/30 leading-relaxed">
              Your website is live at <a href="https://new.ireyprod.com" target="_blank" rel="noreferrer" className="text-foreground/50 hover:text-foreground underline">new.ireyprod.com</a>. Changes made here update the live content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
