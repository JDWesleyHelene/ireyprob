"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { events as staticEvents } from "@/lib/data";
import { useEvents } from "@/lib/useLiveData";

function parseDateParts(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return { day, month: months[d.getUTCMonth()], year: String(d.getUTCFullYear()) };
}

export default function FeaturedEventsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { events } = useEvents();
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).slice(0, 5);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ctx: any;
    const initGsap = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".events-heading", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".events-heading", start: "top 85%", once: true } });
        gsap.from(".event-row", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".events-list", start: "top 80%", once: true } });
      }, sectionRef);
    };
    initGsap();
    return () => ctx?.revert();
  }, []);

  if (upcomingEvents.length === 0) return null;
  const [featured, ...rest] = upcomingEvents;

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none flex justify-between px-8 sm:px-12 md:px-32">
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-s1" /></div>
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-s3" /></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        <div className="events-heading flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-3">{t.events.sectionLabel}</span>
            <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-foreground leading-[0.95] tracking-tight">{t.events.sectionHeading}</h2>
          </div>
          <Link href="/events" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300 group">
            {t.events.viewAll}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {/* Featured */}
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
                {(() => { const d = parseDateParts(featured.event_date); return (
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

        {/* Rest */}
        {rest.length > 0 && (
          <div className="events-list space-y-px">
            {rest.map((event) => {
              const d = parseDateParts(event.event_date);
              return (
                <div key={event.id} className="event-row reveal group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-b border-white/5 hover:border-white/15 transition-all duration-300">
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
      </div>
    </section>
  );
}
