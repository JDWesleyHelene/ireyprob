"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { homepageContent } from "@/lib/data";
import { useSettings } from "@/lib/useLiveData";

const DEFAULT_IMAGES = [
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",         alt:"IREY PROD live event" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",         alt:"IREY PROD concert" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg",         alt:"IREY PROD artist on stage" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",         alt:"IREY PROD event production" },
  { src:"https://ireyprod.com/wp-content/uploads/2023/12/319291225_674505520974726_3683712000139163132_n.jpg", alt:"IREY PROD live music" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg", alt:"IREY PROD outdoor concert" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", alt:"IREY PROD festival" },
  { src:"https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", alt:"IREY PROD artist" },
  { src:"https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg", alt:"IREY PROD production" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-21-at-12.32.07_43897a31.jpg",  alt:"IREY PROD backstage" },
];

export default function HeroSection({ initialSettings = {} }: { initialSettings?: Record<string,string> }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const _liveSettings = useSettings();
  // Merge: server-side initial data first, then live updates overlay it
  const liveSettings = Object.keys(_liveSettings).length > 0 ? _liveSettings : initialSettings;
  const settingsLoaded = true; // Always true — initialSettings pre-loaded server-side

  // ✅ useMemo so images only recalculate when slider_images setting actually changes
  const slideshowImages = useMemo(() => {
    try {
      const raw = liveSettings.slider_images;
      if (raw) {
        const parsed = JSON.parse(raw);
        // Accept both {src,alt} and {url,alt} formats
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((img: any) => ({
            src: img.src || img.url || "",
            alt: img.alt || "IREY PROD",
          })).filter((img: any) => img.src);
        }
      }
    } catch {}
    return DEFAULT_IMAGES;
  }, [liveSettings.slider_images]);

  // ✅ Reset to slide 0 when DB images load (so order is respected)
  const prevLengthRef = useRef(0);
  useEffect(() => {
    if (settingsLoaded && slideshowImages.length !== prevLengthRef.current) {
      setCurrentSlide(0);
      prevLengthRef.current = slideshowImages.length;
    }
  }, [slideshowImages]);

  const headline1 = liveSettings.hero_headline_1 || homepageContent.hero_headline_line1;
  const headline2 = liveSettings.hero_headline_2 || homepageContent.hero_headline_line2;
  const subtext   = liveSettings.hero_subtext    || homepageContent.hero_subtext;

  // Parallax
  useEffect(() => {
    const hero = heroRef.current; if (!hero) return;
    const onScroll = () => {
      const img = hero.querySelector(".hero-bg-img") as HTMLElement;
      if (img) img.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (slideshowImages.length <= 1) return;
    const interval = setInterval(() => setCurrentSlide(p => (p + 1) % slideshowImages.length), 5000);
    return () => clearInterval(interval);
  }, [slideshowImages.length, settingsLoaded]);

  // Entry animations
  useEffect(() => {
    const hero = heroRef.current; if (!hero) return;
    const elements = [
      { selector:".hero-badge", delay:300 },
      { selector:".hero-headline span:first-child", delay:500 },
      { selector:".hero-headline span:last-child", delay:650 },
      { selector:".hero-desc", delay:800 },
      { selector:".hero-ctas", delay:950 },
    ];
    const cards = hero.querySelectorAll<HTMLElement>(".hero-stat-card");
    elements.forEach(({ selector }) => {
      const el = hero.querySelector<HTMLElement>(selector);
      if (el) { el.style.opacity = "0"; el.style.transform = "translateY(30px)"; el.style.transition = "opacity 0.8s ease, transform 0.8s ease"; }
    });
    cards.forEach(c => { c.style.opacity = "0"; c.style.transform = "translateY(40px)"; c.style.transition = "opacity 0.7s ease, transform 0.7s ease"; });
    elements.forEach(({ selector, delay }) => setTimeout(() => {
      const el = hero.querySelector<HTMLElement>(selector);
      if (el) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
    }, delay));
    cards.forEach((c, i) => setTimeout(() => { c.style.opacity = "1"; c.style.transform = "translateY(0)"; }, 1050 + i * 120));
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-end overflow-hidden" aria-label="Hero">
      {/* Slideshow — renders in DB order */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slideshowImages.map((img, i) => (
          <div key={`${img.src}-${i}`}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ${i === currentSlide ? "opacity-75" : "opacity-0"}`}>
            {img.src && (
              <AppImage src={img.src} alt={img.alt} fill priority={i === 0}
                className="hero-bg-img object-cover object-center" sizes="100vw" />
            )}
          </div>
        ))}
        <div className="absolute inset-0 hero-overlay-bottom" />
        <div className="absolute inset-0 hero-overlay-sides" />
        <div className="absolute inset-0 noise pointer-events-none" />
      </div>

      {/* Beam lines */}
      <div className="absolute inset-0 pointer-events-none z-[1] flex justify-between px-4 sm:px-8 md:px-24">
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d1" /></div>
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden hidden md:block"><div className="beam beam-d2" /></div>
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d3" /></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-14 pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="hero-badge inline-flex items-center gap-2 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white">Booking Agency · Mauritius Island</span>
          </div>
          <h1 className="hero-headline font-display text-[2.2rem] sm:text-[3.2rem] lg:text-[4.2rem] font-light italic text-white leading-[0.92] tracking-tight overflow-hidden">
            <span className="block">{headline1}</span>
            <span className="block">{headline2}</span>
          </h1>
          <div className="hero-desc text-sm sm:text-base md:text-lg text-white font-light leading-relaxed max-w-xl border-l border-white/30 pl-5 rich-content" dangerouslySetInnerHTML={{__html: subtext}}/>
          {/* Mobile slide dots — shown only on mobile, above stat cards */}
          <div className="flex lg:hidden gap-1.5 pt-2">
            {slideshowImages.slice(0, Math.min(slideshowImages.length, 8)).map((_: any, i: number) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-white w-4" : "bg-white/40 w-1"}`}/>
            ))}
          </div>
          <div className="hero-ctas flex flex-col sm:flex-row items-start gap-3 pt-1">
            <Link href="/bookings" className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
              Our Artists <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services" className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 border border-foreground/20 text-foreground text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
              Our Services
            </Link>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 lg:items-end overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {[
            { label:"Agency",   value:"One Stop",  sub:"The only agency you'll ever need", icon:<span className="w-1.5 h-1.5 rounded-full bg-accent"/> },
            { label:"Services", value:"4 piliers", sub:"Bookings · Tours · Events · Productions", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13M6 21c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM18 19c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"/></svg> },
            { label:"Based In", value:"Mauritius", sub:"Island · Indian Ocean",              icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
          ].map((c, i) => (
            <div key={i} className="hero-stat-card flex-shrink-0 w-[200px] sm:w-[220px] lg:w-full max-w-[260px] p-4 sm:p-5 bg-black/40 backdrop-blur-xl border border-foreground/8 rounded-sm hover:bg-black/60 transition-colors cursor-default">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white">{c.label}</span>
                <span className="text-white">{c.icon}</span>
              </div>
              <div className="font-display text-xl sm:text-2xl lg:text-3xl font-light italic text-white">{c.value}</div>
              <div className="text-[11px] text-white mt-1">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {slideshowImages.slice(0, Math.min(slideshowImages.length, 8)).map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-white w-4" : "bg-white/40 w-1"}`} />
          ))}
        </div>
        <span className="text-[9px] tracking-[0.3em] uppercase text-white">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
