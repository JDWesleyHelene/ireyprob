"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { artists as staticArtists } from "@/lib/data";
import { useArtists } from "@/lib/useLiveData";

export default function ArtistRosterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { artists } = useArtists();
  const featuredArtists = artists.filter(a => a.featured).slice(0, 6);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
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
        gsap.from(".roster-heading", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".roster-heading", start: "top 85%", once: true } });
        gsap.from(".roster-card", { y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".roster-grid", start: "top 80%", once: true } });
      }, sectionRef);
    };
    initGsap();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-[#040404] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        <div className="roster-heading flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-3">— Artist Roster</span>
            <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-foreground leading-[0.95] tracking-tight">Our Artists</h2>
          </div>
          <Link href="/artists" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300 group">
            View All Artists →
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="roster-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredArtists.map((artist, i) => (
            <div key={artist.id} className={`roster-card reveal delay-${Math.min(i % 3 * 100, 300)}`}>
              <div className="group relative overflow-hidden rounded-sm h-[340px] sm:h-[380px] spotlight-card cursor-pointer">
                <AppImage src={artist.image} alt={artist.image_alt || artist.name} fill className="grayscale-hover object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                  {artist.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/15 rounded-sm text-[9px] font-semibold tracking-[0.2em] uppercase text-white/80">{tag}</span>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <p className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent mb-1.5">{artist.genre}</p>
                  <h3 className="font-display text-xl sm:text-2xl font-light italic text-white mb-1">{artist.name}</h3>
                  <p className="text-[11px] text-white/60 mb-3">{artist.origin}</p>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <Link href="/bookings" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80 hover:text-accent transition-colors border-b border-white/30 hover:border-accent pb-0.5">
                      Booking →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
