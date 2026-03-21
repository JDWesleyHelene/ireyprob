"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9000] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="bg-[#0a0a0a] border border-foreground/10 rounded-sm px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl backdrop-blur-xl">
          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-foreground/5 border border-foreground/8 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15v-4m0-4h.01" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-foreground/60 leading-relaxed">
              We use cookies to enhance your experience and analyse site traffic.{" "}
              <Link href="/contact" className="text-foreground/80 underline underline-offset-2 hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/30 hover:text-foreground/60 transition-colors duration-200"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase bg-foreground text-background rounded-sm hover:bg-foreground/90 transition-all duration-200"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
