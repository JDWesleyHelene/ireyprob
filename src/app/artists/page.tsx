"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { artists as allArtists } from "@/lib/data";
import { useArtists } from "@/lib/useLiveData";

export default function ArtistsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeGenre, setActiveGenre] = useState("All");
  const { t } = useLanguage();
  const { artists: liveArtists } = useArtists();
  const genres = ["All", "Reggae", "Dub", "Hip-Hop", "World", "Electronic", "Afrobeats", "Jazz", "Sega"];
  const filtered = activeGenre === "All" ? liveArtists : liveArtists.filter((a) => a.tags?.some((tag) => tag === activeGenre));

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); }, { threshold: 0.06, rootMargin: "0px 0px -5% 0px" });
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
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">— Artist Roster</span>
            <h1 className="reveal font-display text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-light italic text-white leading-[0.9] tracking-tight mb-4">{t.artists.pageTitle}</h1>
            <p className="reveal text-[14px] text-white/70 font-light max-w-lg leading-relaxed">{t.artists.pageSubtitle}</p>
          </div>
        </section>
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {genres.map((genre) => (
              <button key={genre} onClick={() => setActiveGenre(genre)}
                className={`px-4 sm:px-5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase rounded-sm border transition-all duration-300 ${activeGenre === genre ? "bg-foreground text-background border-foreground" : "bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white"}`}>
                {genre}
              </button>
            ))}
          </div>
        </section>
        <section ref={sectionRef} className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-24">
          {filtered.length === 0 ? (
            <div className="text-center py-20"><p className="text-white/50 text-[13px]">No artists found for this filter.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((artist, i) => (
                <div key={artist.id} className={`reveal delay-${Math.min(i % 3 * 100, 300)}`}>
                  <div className="group relative overflow-hidden rounded-sm h-[380px] sm:h-[400px] spotlight-card cursor-pointer">
                    <AppImage src={artist.image} alt={artist.image_alt || artist.name} fill className="grayscale-hover object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                    <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                      {artist.tags?.slice(0, 2).map((tag) => <span key={tag} className="px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/15 rounded-sm text-[9px] font-semibold tracking-[0.2em] uppercase text-white/80">{tag}</span>)}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <p className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent mb-1.5">{artist.genre}</p>
                      <h3 className="font-display text-xl sm:text-2xl font-light italic text-white mb-1">{artist.name}</h3>
                      <p className="text-[11px] text-white/60 mb-3">{artist.origin}</p>
                      <p className="text-[12px] text-white/70 leading-relaxed font-light opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 max-h-0 group-hover:max-h-20 overflow-hidden">{artist.bio}</p>
                      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <Link href="/bookings" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80 hover:text-accent transition-colors border-b border-white/30 hover:border-accent pb-0.5">Booking →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
