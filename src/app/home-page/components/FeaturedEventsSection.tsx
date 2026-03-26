"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";

function parseDateParts(dateStr: string) {
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return { day: String(d.getUTCDate()).padStart(2,"0"), month: months[d.getUTCMonth()], year: String(d.getUTCFullYear()) };
}

export default function FeaturedEventsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/events")
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (!Array.isArray(data)) { setLoading(false); return; }
        const mapped = data.map(e => ({
          ...e,
          event_date: e.eventDate || e.event_date || "",
          image_alt: e.imageAlt || "",
          sold_out: e.soldOut || e.sold_out || false,
          artists: Array.isArray(e.artists) ? e.artists : [],
        }));
        const sorted = mapped.sort((a,b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()).slice(0,3);
        setEvents(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Always render the section — show skeleton while loading
  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/70 block mb-3">— Events</span>
            <h2 className="font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-foreground leading-[0.95]">Latest Events</h2>
          </div>
          <Link href="/events" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80 hover:text-foreground transition-colors">
            View All <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-[320px] bg-foreground/5 rounded-sm animate-pulse"/>)}
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center border border-foreground/5 rounded-sm">
            <p className="text-foreground/70 text-[13px]">No events yet. Add events from the admin dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event, i) => {
              const d = parseDateParts(event.event_date);
              return (
                <Link key={event.id} href={`/events/${event.slug || event.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm h-[240px] mb-4">
                    {event.image ? (
                      <AppImage src={event.image} alt={event.image_alt || event.title} fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
                    ) : (
                      <div className="absolute inset-0 bg-foreground/5"/>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
                    {i === 0 && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-foreground/10 backdrop-blur-md border border-foreground/15 rounded-sm">
                        <span className="w-1 h-1 rounded-full bg-accent pulse-dot"/>
                        <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/80">Latest</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-[2rem] font-light italic text-white leading-none">{d.day}</span>
                        <div>
                          <span className="text-[11px] font-semibold tracking-widest uppercase text-accent block">{d.month}</span>
                          <span className="text-[10px] text-white/85">{d.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent/80 mb-1 block">{event.genre}</span>
                    <h3 className="font-display text-[1.2rem] sm:text-[1.4rem] font-light italic text-foreground group-hover:text-accent transition-colors leading-tight mb-1">{event.title}</h3>
                    <p className="text-[12px] text-foreground/80">{event.venue} · {event.city}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/events" className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80 hover:text-foreground transition-colors">
            View All Events <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
