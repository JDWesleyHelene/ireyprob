"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />

        {/* Beam columns */}
        <div className="absolute inset-0 pointer-events-none flex justify-between px-8 sm:px-16 md:px-32">
          <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d1" /></div>
          <div className="relative w-px h-full bg-white/[0.02] overflow-hidden hidden md:block"><div className="beam beam-d2" /></div>
          <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d3" /></div>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          {/* 404 number */}
          <div className="font-display text-[8rem] sm:text-[12rem] font-light italic text-foreground/[0.06] leading-none mb-6 select-none">
            404
          </div>

          {/* Content */}
          <div className="-mt-8 sm:-mt-12">
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-4">
              — {t?.notFound?.heading}
            </span>
            <h1 className="font-display text-[2.5rem] sm:text-[3.5rem] font-light italic text-foreground leading-[0.95] tracking-tight mb-4">
              {t?.notFound?.heading}
            </h1>
            <p className="text-[14px] text-foreground/50 font-light leading-relaxed mb-8">
              {t?.notFound?.subtext}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-accent transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform duration-300">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                {t?.notFound?.backHome}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 border border-foreground/20 text-foreground text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-foreground/5 transition-all duration-300"
              >
                {t?.notFound?.contactUs}
              </Link>
            </div>

            {/* Broken link report */}
            <div className="mt-8 pt-8 border-t border-foreground/[0.06]">
              <Link
                href="/contact"
                className="text-[11px] text-foreground/30 hover:text-foreground/60 transition-colors tracking-wide"
              >
                {t?.notFound?.brokenLink}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}