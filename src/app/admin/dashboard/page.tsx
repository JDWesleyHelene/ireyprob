"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Submission { id:number; name:string; email:string; artist_name?:string; created_at:string; type:string; }
interface Counts { artists:number; events:number; news:number; }

const quickActions = [
  { href:"/admin/artists/new",  label:"Add New Artist" },
  { href:"/admin/events/new",   label:"Add New Event" },
  { href:"/admin/news",         label:"Manage News & Blog" },
  { href:"/admin/homepage",     label:"Edit Homepage Content" },
  { href:"/admin/services",     label:"Manage Services" },
  { href:"/admin/bookings",     label:"View Booking Requests" },
  { href:"/admin/contact",      label:"View Contact Enquiries" },
  { href:"/admin/settings",     label:"Settings" },
];

export default function AdminDashboard() {
  const [counts, setCounts]         = useState<Counts>({ artists:0, events:0, news:0 });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [artists, events, news, bookings, contacts] = await Promise.all([
          fetch("/api/admin/artists").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/events").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/news").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/bookings").then(r => r.ok ? r.json() : []),
          fetch("/api/admin/contacts").then(r => r.ok ? r.json() : []),
        ]);
        setCounts({
          artists: Array.isArray(artists) ? artists.length : 0,
          events:  Array.isArray(events)  ? events.length  : 0,
          news:    Array.isArray(news)    ? news.filter((n:any) => n.status === "published").length : 0,
        });
        const all = [
          ...(Array.isArray(bookings) ? bookings.map((x:any) => ({ ...x, type:"booking" })) : []),
          ...(Array.isArray(contacts) ? contacts.map((x:any) => ({ ...x, type:"contact" })) : []),
        ].sort((a,b) => new Date(b.created_at||b.createdAt).getTime() - new Date(a.created_at||a.createdAt).getTime()).slice(0,6);
        setSubmissions(all);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const stats = [
    { label:"Artists",       value:counts.artists, href:"/admin/artists",  icon:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { label:"Events",        value:counts.events,  href:"/admin/events",   icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label:"News Articles", value:counts.news,    href:"/admin/news",     icon:"M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { label:"Submissions",   value:submissions.length, href:"/admin/bookings", icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-2">— Overview</span>
        <h1 className="font-display text-3xl sm:text-4xl font-light italic text-foreground">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map(card => (
          <Link key={card.label} href={card.href}
            className="group bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 hover:border-foreground/20 hover:bg-foreground/[0.04] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30 group-hover:text-foreground/50 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon}/>
              </svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20 group-hover:text-foreground/40 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-foreground/5 rounded animate-pulse mb-1"/>
            ) : (
              <p className="font-display text-3xl font-light text-foreground mb-1">{card.value}</p>
            )}
            <p className="text-[11px] text-foreground/40 tracking-wide">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map(action => (
              <Link key={action.href} href={action.href}
                className="flex items-center justify-between px-4 py-3 border border-foreground/8 rounded-sm hover:border-foreground/20 hover:bg-foreground/5 transition-all duration-200 group">
                <span className="text-[12px] text-foreground/60 group-hover:text-foreground transition-colors">{action.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20 group-hover:text-foreground/50 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Recent Submissions</h2>
            <Link href="/admin/bookings" className="text-[10px] text-foreground/30 hover:text-foreground/60 transition-colors uppercase tracking-widest">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-10 bg-foreground/5 rounded animate-pulse"/>)}</div>
          ) : submissions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[13px] text-foreground/20 mb-2">No submissions yet.</p>
              <p className="text-[11px] text-foreground/15">Booking & contact forms will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((s,i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
                  <div>
                    <p className="text-[12px] text-foreground/70">{s.name}</p>
                    <p className="text-[10px] text-foreground/30">{s.artist_name||s.email} · <span className="capitalize">{s.type}</span></p>
                  </div>
                  <span className="text-[10px] text-foreground/20">{new Date(s.created_at||s.createdAt||"").toLocaleDateString("en-GB")}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-5 border-t border-foreground/8">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"/></span>
              <span className="text-[10px] text-emerald-400/70 font-semibold tracking-widest uppercase">Live — Neon DB Connected</span>
            </div>
            <p className="text-[11px] text-foreground/30 leading-relaxed">Changes made here update the live content instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
