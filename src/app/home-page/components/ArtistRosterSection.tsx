"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSettings } from "@/lib/useLiveData";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ArtistRosterSection({ initialArtists = [] }: { initialArtists?: any[] }) {
  const router = useRouter();
  const [artists,  setArtists]  = useState<any[]>(initialArtists);
  const [loading,  setLoading]  = useState(initialArtists.length === 0);
  const settings = useSettings();
  // Prefetch all artist pages for instant navigation
  useEffect(() => {
    artists.forEach(a => {
      const slug = (a.slug||a.name||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
      router.prefetch(`/bookings/${slug}`);
    });
  }, [artists, router]);
  const intervalMs = Math.max(3000, parseInt(settings.artist_carousel_interval || "7000", 10));
  const [active,   setActive]   = useState(0);
  const [dir,      setDir]      = useState<'left'|'right'>('right');
  const [animKey,  setAnimKey]  = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX   = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialArtists.length > 0) return;
    fetch("/api/admin/artists")
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (!Array.isArray(data)) { setLoading(false); return; }
        const sorted = [...data]
          .sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (a.sortOrder || 0) - (b.sortOrder || 0);
          });
        setArtists(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const prev = useCallback(() => { setDir('left');  setAnimKey(k=>k+1); setActive(p => (p - 1 + artists.length) % artists.length); }, [artists.length]);
  const next = useCallback(() => { setDir('right'); setAnimKey(k=>k+1); setActive(p => (p + 1) % artists.length); }, [artists.length]);

  // Touch/drag swipe
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };
  const onMouseDown  = (e: React.MouseEvent) => { startX.current = e.clientX; setDragging(true); };
  const onMouseUp    = (e: React.MouseEvent) => {
    if (!dragging) return;
    const diff = startX.current - e.clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    setDragging(false);
  };

  // Auto-advance
  useEffect(() => {
    if (artists.length <= 1) return;
    const t = setInterval(next, intervalMs);
    return () => clearInterval(t);
  }, [artists.length, next, intervalMs]);

  const getSlug = (a: any) =>
    (a.slug || a.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <section className="py-14 sm:py-20 bg-[#040404] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/70 block mb-3">— Artist Roster</span>
            <h2 className="font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-extrabold italic text-foreground leading-[0.95]">Our Artists</h2>
          </div>
          <Link href="/bookings" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/60 hover:text-foreground transition-colors group">
            View All
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {loading ? (
          <div className="h-[420px] sm:h-[520px] bg-foreground/5 rounded-sm animate-pulse"/>
        ) : artists.length === 0 ? (
          <div className="py-16 text-center border border-foreground/5 rounded-sm">
            <p className="text-foreground/40 text-[13px]">No artists yet.</p>
          </div>
        ) : (
          <div className="relative select-none"
            ref={trackRef}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={()=>setDragging(false)}>

            {/* Main carousel — show 3 cards: prev, active, next */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr_1fr] gap-3 sm:gap-4 items-center">

              {/* Prev card (faded) */}
              <div className="hidden md:block">
                {(() => {
                  const a = artists[(active - 1 + artists.length) % artists.length];
                  return (
                    <button onClick={prev} className="w-full text-left group opacity-40 hover:opacity-60 transition-opacity cursor-pointer">
                      <div className="relative overflow-hidden rounded-sm h-[280px] bg-foreground/10">
                        {a.image && <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover object-center grayscale"/>}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"/>
                        <div className="absolute bottom-0 left-0 p-5">
                          <p className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent mb-1">{a.genre}</p>
                          <h3 className="font-display text-lg font-extrabold italic text-white">{a.name}</h3>
                        </div>
                      </div>
                    </button>
                  );
                })()}
              </div>

              {/* Active card (featured) */}
              {(() => {
                const a = artists[active];
                const tags = Array.isArray(a.tags) ? a.tags : [];
                return (
                  <Link href={`/bookings/${getSlug(a)}`} key={animKey} className="group relative overflow-hidden rounded-sm h-[380px] sm:h-[480px] block cursor-pointer" style={{animation:`slideIn${dir==="right"?"Right":"Left"} 0.45s cubic-bezier(0.25,0.46,0.45,0.94) both`}}>
                    {a.image
                      ? <img src={a.image} alt={a.imageAlt||a.name} className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"/>
                      : <div className="absolute inset-0 bg-foreground/10"/>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"/>
                    {tags.length > 0 && (
                      <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                        {tags.slice(0,2).map((tag:string) => (
                          <span key={tag} className="px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/15 rounded-sm text-[9px] font-semibold tracking-[0.2em] uppercase text-white/80">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <p className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent mb-1.5">{a.genre}</p>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold italic text-white group-hover:text-accent transition-colors mb-1">{a.name}</h3>
                      <p className="text-[12px] text-white/70">{a.origin}</p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 border-b border-white/30 pb-0.5">Book Artist →</span>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {/* Next card (faded) */}
              <div className="hidden md:block">
                {(() => {
                  const a = artists[(active + 1) % artists.length];
                  return (
                    <button onClick={next} className="w-full text-left group opacity-40 hover:opacity-60 transition-opacity cursor-pointer">
                      <div className="relative overflow-hidden rounded-sm h-[280px] bg-foreground/10">
                        {a.image && <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover object-center grayscale"/>}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"/>
                        <div className="absolute bottom-0 left-0 p-5">
                          <p className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent mb-1">{a.genre}</p>
                          <h3 className="font-display text-lg font-extrabold italic text-white">{a.name}</h3>
                        </div>
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              {/* Dots */}
              <div className="flex gap-1.5">
                {artists.map((_,i) => (
                  <button key={i} onClick={() => { setDir(i > active ? 'right' : 'left'); setAnimKey(k=>k+1); setActive(i); }}
                    className={`h-1 rounded-full transition-all duration-300 ${i===active ? "bg-accent w-6" : "bg-foreground/20 w-1.5"}`}/>
                ))}
              </div>
              {/* Arrows */}
              <div className="flex gap-2">
                <button onClick={prev}
                  className="w-10 h-10 flex items-center justify-center border border-foreground/15 rounded-sm text-foreground/40 hover:text-foreground hover:border-foreground/40 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={next}
                  className="w-10 h-10 flex items-center justify-center border border-foreground/15 rounded-sm text-foreground/40 hover:text-foreground hover:border-foreground/40 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            {/* Mobile View All */}
            <div className="mt-6 text-center sm:hidden">
              <Link href="/bookings" className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/60 hover:text-foreground transition-colors">
                View All Artists <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes slideInRight { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-60px); } to { opacity:1; transform:translateX(0); } }
      `}}/>
    </section>
  );
}
