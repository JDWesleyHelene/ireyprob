"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { events as allEvents } from "@/lib/data";
import { useEvents } from "@/lib/useLiveData";

const filters = ["All", "Reggae", "Dub", "Hip-Hop", "World", "Festival", "Electronic", "R&B", "Sega"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return { day, month: months[d.getUTCMonth()], year: String(d.getUTCFullYear()) };
}

export default function EventsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const { events: liveEvents } = useEvents();
  // Use static data directly as liveEvents starts with static data already
  const { t } = useLanguage();

  const filtered = activeFilter === "All"
    ? liveEvents
    : liveEvents.filter((e) => e.genre.toLowerCase().includes(activeFilter.toLowerCase()));

  const [featured, ...rest] = filtered;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.06, rootMargin: "0px 0px -5% 0px" }
    );
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative pt-28 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">{t.events.sectionLabel}</span>
            <h1 className="reveal font-display text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-light italic text-white leading-[0.9] tracking-tight mb-4">{t.events.pageTitle}</h1>
            <p className="reveal text-[14px] text-white/70 font-light max-w-lg leading-relaxed">{t.events.pageSubtitle}</p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 sm:px-5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase rounded-sm border transition-all duration-300 ${activeFilter === f ? "bg-foreground text-background border-foreground" : "bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white"}`}>
                {f}
              </button>
            ))}
          </div>
        </section>

        <section ref={sectionRef} className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-24">
          {filtered.length === 0 ? (
            <div className="text-center py-20"><p className="text-white/50 text-[13px]">{t.events.noEvents}</p></div>
          ) : (
            <>
              {featured && (
                <div className="reveal mb-6">
                  <div className="group relative overflow-hidden rounded-sm img-zoom-wrap h-[380px] sm:h-[460px] md:h-[520px]">
                    <AppImage src={featured.image} alt={featured.image_alt || featured.title} fill className="img-zoom object-cover" sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 bg-foreground/10 backdrop-blur-md border border-foreground/15 rounded-sm">
                      <span className="w-1 h-1 rounded-full bg-accent pulse-dot" />
                      <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/80">{t.events.nextEvent}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row justify-between items-end gap-4 sm:gap-6">
                      <div>
                        {(() => { const d = formatDate(featured.event_date); return (
                          <div className="flex items-baseline gap-3 mb-3">
                            <span className="font-display text-[2.5rem] sm:text-[3rem] font-light italic text-white leading-none">{d.day}</span>
                            <div className="flex flex-col"><span className="text-[12px] font-semibold tracking-widest uppercase text-accent">{d.month}</span><span className="text-[11px] text-white/60">{d.year}</span></div>
                          </div>
                        ); })()}
                        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-light italic text-white mb-1">{featured.title}</h3>
                        <p className="text-[13px] text-white/70">{featured.venue} · {featured.city}, {featured.country}</p>
                        <div className="flex flex-wrap gap-2 mt-3">{featured.artists?.map((a) => <span key={a} className="text-[10px] text-white/60 border border-white/20 px-2 py-0.5 rounded-sm">{a}</span>)}</div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-3">
                        <span className="px-3 py-1 border border-white/30 rounded-sm text-[10px] font-medium tracking-widest uppercase text-white/70">{featured.genre}</span>
                        <Link href={`/events/${featured.slug}`} className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase text-white hover:text-accent transition-colors duration-300">
                          {t.events.viewDetails}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {rest.length > 0 && (
                <div className="space-y-px">
                  {rest.map((event) => {
                    const d = formatDate(event.event_date);
                    return (
                      <div key={event.id} className="reveal group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-b border-white/5 hover:border-white/15 transition-all duration-300">
                        <div className="flex items-center gap-5 sm:gap-8 flex-1 min-w-0">
                          <div className="flex-shrink-0 text-center w-12">
                            <span className="font-display text-[1.8rem] font-light italic text-white leading-none block">{d.day}</span>
                            <span className="text-[9px] font-semibold tracking-widest uppercase text-accent">{d.month}</span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display text-[1.1rem] sm:text-[1.3rem] font-light italic text-white group-hover:text-accent transition-colors duration-300 truncate">{event.title}</h3>
                            <p className="text-[12px] text-white/50 mt-0.5">{event.venue} · {event.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="hidden sm:block px-3 py-1 border border-white/15 rounded-sm text-[10px] font-medium tracking-widest uppercase text-white/50">{event.genre}</span>
                          <Link href={`/events/${event.slug}`} className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-1.5">
                            {t.events.viewDetails}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
