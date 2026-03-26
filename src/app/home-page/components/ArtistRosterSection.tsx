"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";

export default function ArtistRosterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/artists")
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (!Array.isArray(data)) { setLoading(false); return; }
        const sorted = [...data]
          .sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (a.sortOrder || 0) - (b.sortOrder || 0);
          })
          .slice(0, 6);
        setArtists(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section ref={sectionRef} className="pt-12 pb-6 sm:pt-14 sm:pb-8 bg-[#040404]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/70 block mb-3">— Artist Roster</span>
            <h2 className="font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-foreground leading-[0.95]">Our Artists</h2>
          </div>
          <Link href="/bookings" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80 hover:text-foreground transition-colors">
            View All Artists <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-[360px] bg-foreground/5 rounded-sm animate-pulse"/>)}
          </div>
        ) : artists.length === 0 ? (
          <div className="py-16 text-center border border-foreground/5 rounded-sm">
            <p className="text-foreground/70 text-[13px]">No artists yet. Add artists from the admin dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map(artist => {
              const tags = Array.isArray(artist.tags) ? artist.tags : [];
              return (
                <Link key={artist.id} href={`/bookings/${artist.slug}`}
                  className="group relative overflow-hidden rounded-sm h-[340px] sm:h-[380px] block">
                  {artist.image ? (
                    <AppImage src={artist.image} alt={artist.imageAlt || artist.image_alt || artist.name} fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
                  ) : (
                    <div className="absolute inset-0 bg-foreground/10"/>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"/>
                  {tags.length > 0 && (
                    <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                      {tags.slice(0,2).map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/15 rounded-sm text-[9px] font-semibold tracking-[0.2em] uppercase text-white/80">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <p className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent mb-1.5">{artist.genre}</p>
                    <h3 className="font-display text-xl sm:text-2xl font-light italic text-white group-hover:text-accent transition-colors mb-1">{artist.name}</h3>
                    <p className="text-[11px] text-white/85">{artist.origin}</p>
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 border-b border-white/30 pb-0.5">Book Artist →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/bookings" className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/80 hover:text-foreground transition-colors">
            View All Artists <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
