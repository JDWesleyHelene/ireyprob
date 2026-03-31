"use client";
import React, { useEffect, useState } from "react";

interface Partner { id: string; name: string; logo: string; }

const DUMMY_PARTNERS: Partner[] = [
  { id: "1", name: "Partner 1", logo: "https://placehold.co/120x56/1a1a1a/666666?text=Partner+1" },
  { id: "2", name: "Partner 2", logo: "https://placehold.co/120x56/1a1a1a/666666?text=Partner+2" },
  { id: "3", name: "Partner 3", logo: "https://placehold.co/120x56/1a1a1a/666666?text=Partner+3" },
  { id: "4", name: "Partner 4", logo: "https://placehold.co/120x56/1a1a1a/666666?text=Partner+4" },
  { id: "5", name: "Partner 5", logo: "https://placehold.co/120x56/1a1a1a/666666?text=Partner+5" },
  { id: "6", name: "Partner 6", logo: "https://placehold.co/120x56/1a1a1a/666666?text=Partner+6" },
];

export default function PartnersSection({ initialSettings = {} }: { initialSettings?: Record<string, string> }) {
  const [partners, setPartners] = useState<Partner[]>(DUMMY_PARTNERS);
  const [heading,  setHeading]  = useState("Our Partners");
  const [subtext,  setSubtext]  = useState("Trusted by the best in the industry");

  useEffect(() => {
    const raw = initialSettings.partners_list;
    if (raw) {
      try { const p = JSON.parse(raw); if (Array.isArray(p) && p.length > 0) { setPartners(p); } } catch {}
    }
    if (initialSettings.partners_heading) setHeading(initialSettings.partners_heading);
    if (initialSettings.partners_subtext) setSubtext(initialSettings.partners_subtext);

    if (!raw) {
      fetch("/api/admin/settings").then(r => r.ok ? r.json() : {}).then((d: Record<string,string>) => {
        if (d.partners_list) { try { const p = JSON.parse(d.partners_list); if (Array.isArray(p) && p.length > 0) setPartners(p); } catch {} }
        if (d.partners_heading) setHeading(d.partners_heading);
        if (d.partners_subtext) setSubtext(d.partners_subtext);
      }).catch(() => {});
    }
  }, [initialSettings]);

  const doubled = [...partners, ...partners];

  return (
    <section className="py-12 sm:py-16 bg-[#040404] border-t border-foreground/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-8 sm:mb-10 text-center">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/50 block mb-3">— Partners</span>
        <h2 className="font-display text-[1.8rem] sm:text-[2.5rem] font-extrabold italic text-foreground leading-[0.95]">{heading}</h2>
        {subtext && <p className="text-[13px] text-foreground/40 mt-2">{subtext}</p>}
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#040404] to-transparent pointer-events-none"/>
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#040404] to-transparent pointer-events-none"/>

        <div className="flex gap-10 sm:gap-14 items-center"
          style={{ animation: "marquee 25s linear infinite", width: "max-content" }}>
          {doubled.map((p, i) => (
            <div key={`${p.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-500"
              style={{ width: "120px", height: "56px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name}
                className="grayscale hover:grayscale-0 transition-all duration-500"
                style={{ maxWidth: "120px", maxHeight: "56px", objectFit: "contain", width: "120px", height: "56px" }}/>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}}/>
    </section>
  );
}
