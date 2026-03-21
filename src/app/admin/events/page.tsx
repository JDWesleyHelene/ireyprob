"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { events as staticEvents } from "@/lib/data";

interface EventRow { id: string; title: string; venue: string; city: string; genre: string; event_date: string; featured: boolean; sold_out: boolean; _source?: string; }

export default function AdminEventsPage() {
  const [dynamicEvents, setDynamicEvents] = useState<EventRow[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/get-events.php")
      .then(r => r.ok ? r.json() : [])
      .then(data => setDynamicEvents(Array.isArray(data) ? data.map((e: EventRow) => ({ ...e, _source: "db" })) : []))
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/save-event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, _action: "delete" }),
      });
      setDynamicEvents(prev => prev.filter(e => e.id !== id));
      showToast("Event deleted");
    } catch { showToast("Failed to delete"); }
    setDeleting(null);
  };

  const allEvents = [
    ...dynamicEvents,
    ...staticEvents.map(e => ({ ...e, _source: "static" as const })),
  ].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-foreground/10 border border-foreground/20 rounded-sm text-[12px] text-foreground">{toast}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Events <span className="text-foreground/30 text-2xl">({allEvents.length})</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/events" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </a>
          <Link href="/admin/events/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
            Add Event
          </Link>
        </div>
      </div>

      <div className="border border-foreground/8 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/8 bg-foreground/[0.02]">
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Event</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Date</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Venue</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Status</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allEvents.map((event) => (
              <tr key={event.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="text-[13px] text-foreground/80 font-medium">{event.title}</p>
                  <p className="text-[11px] text-foreground/30">{event.genre}</p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-[12px] text-foreground/40">{new Date(event.event_date).toLocaleDateString("en-GB")}</span></td>
                <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[12px] text-foreground/40">{event.venue}, {event.city}</span></td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex gap-1.5">
                    {event.featured && <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase bg-foreground/10 text-foreground/50 rounded-sm">Featured</span>}
                    {event.sold_out && <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase bg-red-500/10 text-red-400/70 rounded-sm">Sold Out</span>}
                    {event._source === "db" && <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase bg-blue-400/5 text-blue-400/50 border border-blue-400/15 rounded-sm">Custom</span>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/events/${event.slug}`} target="_blank"
                      className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-foreground/10 rounded-sm text-foreground/30 hover:text-foreground/60 hover:border-foreground/20 transition-all inline-flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      View
                    </Link>
                    {event._source !== "static" && (
                      <button onClick={() => handleDelete(event.id, event.title)} disabled={deleting === event.id}
                        className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-red-500/20 rounded-sm text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-40">
                        {deleting === event.id ? "..." : "Delete"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
