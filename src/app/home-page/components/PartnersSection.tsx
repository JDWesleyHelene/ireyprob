"use client";
import React, { useEffect, useState } from "react";

interface Partner { id: string; name: string; logo: string; }

const DUMMY_PARTNERS: Partner[] = [
  { id:"1", name:"Partner 1", logo:"https://placehold.co/120x56/1a1a1a/555555?text=Partner+1" },
  { id:"2", name:"Partner 2", logo:"https://placehold.co/120x56/1a1a1a/555555?text=Partner+2" },
  { id:"3", name:"Partner 3", logo:"https://placehold.co/120x56/1a1a1a/555555?text=Partner+3" },
  { id:"4", name:"Partner 4", logo:"https://placehold.co/120x56/1a1a1a/555555?text=Partner+4" },
  { id:"5", name:"Partner 5", logo:"https://placehold.co/120x56/1a1a1a/555555?text=Partner+5" },
  { id:"6", name:"Partner 6", logo:"https://placehold.co/120x56/1a1a1a/555555?text=Partner+6" },
];

export default function PartnersSection({ initialSettings = {} }: { initialSettings?: Record<string,string> }) {
  const [partners, setPartners] = useState<Partner[]>(DUMMY_PARTNERS);
  const [heading,  setHeading]  = useState("Our Partners");
  const [subtext,  setSubtext]  = useState("Trusted by the best in the industry");
  // Speed in seconds for one full loop — lower = faster. Default 20s
  const [speed,    setSpeed]    = useState(20);
  const [logoW,    setLogoW]    = useState(120);
  const [logoH,    setLogoH]    = useState(56);

  useEffect(() => {
    const tryParse = (raw: string) => {
      try { const p = JSON.parse(raw); return Array.isArray(p) && p.length > 0 ? p : null; } catch { return null; }
    };

    const apply = (d: Record<string,string>) => {
      const p = d.partners_list ? tryParse(d.partners_list) : null;
      if (p) setPartners(p);
      if (d.partners_heading) setHeading(d.partners_heading);
      if (d.partners_subtext) setSubtext(d.partners_subtext);
      if (d.partners_speed)   setSpeed(Math.max(5, Math.min(60, Number(d.partners_speed))));
      if (d.partners_logo_w)  setLogoW(Math.max(40, Math.min(300, Number(d.partners_logo_w))));
      if (d.partners_logo_h)  setLogoH(Math.max(20, Math.min(200, Number(d.partners_logo_h))));
    };

    // Initial settings from server
    if (Object.keys(initialSettings).length > 0) { apply(initialSettings); return; }

    // Live fetch fallback
    fetch("/api/admin/settings").then(r => r.ok ? r.json() : {}).then(apply).catch(() => {});
  }, [initialSettings]);

  // Triple the list so we always have enough items to fill screen during loop
  const track = [...partners, ...partners, ...partners];

  return (
    <section className="py-12 sm:py-16 bg-[#040404] border-t border-foreground/5 overflow-hidden">
      {/* Heading */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-8 sm:mb-10 text-center">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/50 block mb-3">— Partners</span>
        <h2 className="font-display text-[1.8rem] sm:text-[2.5rem] font-extrabold italic text-foreground">{heading}</h2>
        {subtext && <p className="text-[13px] text-foreground/40 mt-2">{subtext}</p>}
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#040404] to-transparent pointer-events-none"/>
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#040404] to-transparent pointer-events-none"/>

        {/* Track — CSS animation, never pauses */}
        <div
          className="flex items-center gap-12"
          style={{
            width: "max-content",
            animationName: "partners-scroll",
            animationDuration: `${speed}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: "running",
          }}>
          {track.map((p, i) => (
            <div key={`${p.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: `${logoW}px`, height: `${logoH}px` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo} alt={p.name}
                className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                style={{ maxWidth: `${logoW}px`, maxHeight: `${logoH}px`, objectFit: "contain", width: `${logoW}px`, height: `${logoH}px` }}
              />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes partners-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-${partners.length} * ${logoW + 48}px)); }
        }
      `}}/>
    </section>
  );
}
