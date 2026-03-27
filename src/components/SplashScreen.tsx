"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const [visible, setVisible]   = useState(false);
  const [hiding, setHiding]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAdmin = pathname?.startsWith("/admin");
    if (isAdmin) return;
    const shown = sessionStorage.getItem("splash_shown");
    if (shown) return;
    sessionStorage.setItem("splash_shown", "1");
    setVisible(true);
    const hideTimer = setTimeout(() => {
      setHiding(true);
      setTimeout(() => setVisible(false), 900);
    }, 2800);
    return () => clearTimeout(hideTimer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className={`fixed inset-0 z-[9999] bg-[#060606] flex flex-col items-center justify-center transition-opacity duration-900 ${hiding ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)" }}
    >
      <div className="absolute inset-0 noise pointer-events-none opacity-40" />
      <div className="absolute inset-0 pointer-events-none flex justify-between px-8 md:px-24">
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d1" /></div>
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden hidden md:block"><div className="beam beam-d2" /></div>
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d3" /></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
        {/* Real IREY PROD logo */}
        <div
          className="splash-logo"
          style={{ animation: "splashLogoIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png"
            alt="IREY PROD"
            style={{ height: "150px", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Tagline */}
        <div style={{ animation: "splashTextIn 0.9s cubic-bezier(0.22,1,0.36,1) 1s both" }}>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white">
            Bookings · Tours · Events · Productions
          </p>
        </div>

        {/* Loading bar */}
        <div
          className="w-32 h-px bg-foreground/10 overflow-hidden rounded-full mt-4"
          style={{ animation: "splashTextIn 0.6s ease 1.2s both" }}
        >
          <div
            className="h-full bg-accent rounded-full"
            style={{ animation: "splashBar 1.4s cubic-bezier(0.4,0,0.2,1) 1.2s both" }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashTextIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}} />
    </div>
  );
}
