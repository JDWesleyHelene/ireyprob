"use client";
import React, { useEffect, useState, useRef } from "react";

interface Partner { id: string; name: string; logo: string; }

export default function PartnersSection({ initialSettings = {} }: { initialSettings?: Record<string, string> }) {
  const [partners,  setPartners]  = useState<Partner[]>([]);
  const [heading,   setHeading]   = useState("Our Partners");
  const [subtext,   setSubtext]   = useState("Trusted by the best in the industry");
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Try initial settings first
    const raw = initialSettings.partners_list;
    if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p)) setPartners(p); } catch {} }
    if (initialSettings.partners_heading) setHeading(initialSettings.partners_heading);
    if (initialSettings.partners_subtext) setSubtext(initialSettings.partners_subtext);

    // Live fallback
    if (!raw) {
      fetch("/api/admin/settings").then(r => r.ok ? r.json() : {}).then((d: Record<string, string>) => {
        if (d.partners_list)    { try { const p = JSON.parse(d.partners_list); if (Array.isArray(p)) setPartners(p); } catch {} }
        if (d.partners_heading) setHeading(d.partners_heading);
        if (d.partners_subtext) setSubtext(d.partners_subtext);
      }).catch(() => {});
    }
  }, [initialSettings]);

  if (!partners.length) return null;

  // Duplicate for seamless loop
  const doubled = [...partners, ...partners];

  return (
    <section className="py-12 sm:py-16 bg-[#040404] border-t border-foreground/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-8 sm:mb-10">
        <div className="text-center">
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/50 block mb-3">— Partners</span>
          <h2 className="font-display text-[1.8rem] sm:text-[2.5rem] font-extrabold italic text-foreground leading-[0.95]">{heading}</h2>
          {subtext && <p className="text-[13px] text-foreground/40 mt-2">{subtext}</p>}
        </div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#040404] to-transparent pointer-events-none"/>
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#040404] to-transparent pointer-events-none"/>

        <div
          ref={trackRef}
          className="flex gap-8 sm:gap-12 items-center"
          style={{ animation: "marquee 30s linear infinite", width: "max-content" }}
        >
          {doubled.map((p, i) => (
            <div key={`${p.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center w-32 h-16 sm:w-40 sm:h-20 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name}
                className="max-w-full max-h-full object-contain"
                style={{ maxWidth: "120px", maxHeight: "56px" }}/>
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
