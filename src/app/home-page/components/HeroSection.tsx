"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { homepageContent } from "@/lib/data";
import { useSettings } from "@/lib/useLiveData";

const slideshowImages = [
  { src: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg", alt: "IREY PROD live event with dramatic stage lighting and energetic crowd" },
  { src: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg", alt: "IREY PROD concert performance with vibrant atmosphere" },
  { src: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg", alt: "IREY PROD artist performing on stage under spotlight" },
  { src: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg", alt: "IREY PROD event production with crowd and stage setup" },
  { src: "https://ireyprod.com/wp-content/uploads/2023/12/319291225_674505520974726_3683712000139163132_n.jpg", alt: "IREY PROD live music event in Mauritius" },
  { src: "https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg", alt: "IREY PROD outdoor concert with large audience" },
  { src: "https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", alt: "IREY PROD festival event with colorful stage lighting" },
  { src: "https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", alt: "IREY PROD artist on stage with crowd energy" },
  { src: "https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg", alt: "IREY PROD music production event" },
  { src: "https://ireyprod.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-21-at-12.32.07_43897a31.jpg", alt: "IREY PROD backstage and production setup" },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const liveSettings = useSettings();
  const headline1 = liveSettings.hero_headline_1 || homepageContent.hero_headline_line1;
  const headline2 = liveSettings.hero_headline_2 || homepageContent.hero_headline_line2;
  const subtext = liveSettings.hero_subtext || homepageContent.hero_subtext;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const img = hero.querySelector(".hero-bg-img") as HTMLElement;
      if (img) img.style.transform = `translateY(${scrollY * 0.3}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const elements: { selector: string; delay: number }[] = [
      { selector: ".hero-badge", delay: 300 },
      { selector: ".hero-headline span:first-child", delay: 500 },
      { selector: ".hero-headline span:last-child", delay: 650 },
      { selector: ".hero-desc", delay: 800 },
      { selector: ".hero-ctas", delay: 950 },
    ];
    const statCards = hero.querySelectorAll<HTMLElement>(".hero-stat-card");
    elements.forEach(({ selector }) => {
      const el = hero.querySelector<HTMLElement>(selector);
      if (el) { el.style.opacity = "0"; el.style.transform = "translateY(30px)"; el.style.transition = "opacity 0.8s ease, transform 0.8s ease"; }
    });
    statCards.forEach((card) => {
      card.style.opacity = "0"; card.style.transform = "translateY(40px)"; card.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    });
    elements.forEach(({ selector, delay }) => {
      setTimeout(() => {
        const el = hero.querySelector<HTMLElement>(selector);
        if (el) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
      }, delay);
    });
    statCards.forEach((card, i) => {
      setTimeout(() => { card.style.opacity = "1"; card.style.transform = "translateY(0)"; }, 1050 + i * 120);
    });
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-end overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slideshowImages.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1500 ${i === currentSlide ? "opacity-75" : "opacity-0"}`}>
            <AppImage src={img.src} alt={img.alt} fill priority={i === 0} className="hero-bg-img object-cover object-center" sizes="100vw" />
          </div>
        ))}
        <div className="absolute inset-0 hero-overlay-bottom" />
        <div className="absolute inset-0 hero-overlay-sides" />
        <div className="absolute inset-0 noise pointer-events-none" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-[1] flex justify-between px-4 sm:px-8 md:px-24">
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d1" /></div>
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden hidden md:block"><div className="beam beam-d2" /></div>
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d3" /></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-14 pt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="hero-badge inline-flex items-center gap-2 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white">{t.hero.badge}</span>
          </div>
          <h1 className="hero-headline font-display text-[2.8rem] sm:text-[4rem] lg:text-[5.5rem] font-light italic text-white leading-[0.92] tracking-tight overflow-hidden">
            <span className="block text-white">{headline1}</span>
            <span className="block text-white">{headline2}</span>
          </h1>
          <p className="hero-desc text-sm sm:text-base md:text-lg text-white font-light leading-relaxed max-w-xl border-l border-white/30 pl-5">{subtext}</p>
          <div className="hero-ctas flex flex-col sm:flex-row items-start gap-3 pt-1">
            <Link href="/bookings" className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
              {t.hero.ctaArtists}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/services" className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 border border-foreground/20 text-foreground text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
              {t.hero.ctaServices}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 lg:items-end overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          <div className="hero-stat-card flex-shrink-0 w-[200px] sm:w-[220px] lg:w-full max-w-[260px] p-4 sm:p-5 bg-black/40 backdrop-blur-xl border border-foreground/8 rounded-sm hover:bg-black/60 transition-colors cursor-default">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white">{t.hero.statAgencyLabel}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
            <div className="font-display text-3xl sm:text-4xl font-light italic text-white">{t.hero.statAgencyValue}</div>
            <div className="text-[11px] text-white mt-1">{t.hero.statAgencySub}</div>
          </div>

          <div className="hero-stat-card flex-shrink-0 w-[200px] sm:w-[220px] lg:w-full max-w-[260px] p-4 sm:p-5 bg-black/40 backdrop-blur-xl border border-foreground/8 rounded-sm hover:bg-black/60 transition-colors cursor-default">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white">{t.hero.statServicesLabel}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white"><path d="M9 18V5l12-2v13M6 21c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM18 19c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" /></svg>
            </div>
            <div className="font-display text-3xl sm:text-4xl font-light italic text-white">4<span className="text-xl text-white not-italic ml-1 font-sans">piliers</span></div>
            <div className="text-[11px] text-white mt-1">{t.hero.statServicesSub}</div>
          </div>

          <div className="hero-stat-card flex-shrink-0 w-[200px] sm:w-[220px] lg:w-full max-w-[260px] p-4 sm:p-5 bg-black/40 backdrop-blur-xl border border-foreground/8 rounded-sm hover:bg-black/60 transition-colors cursor-default">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white">{t.hero.statBasedLabel}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <div className="font-display text-xl sm:text-2xl font-light italic text-white">Mauritius</div>
            <div className="text-[11px] text-white mt-1">{t.hero.statBasedSub}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {slideshowImages.slice(0, 5).map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${i === currentSlide % 5 ? "bg-white w-4" : "bg-white/40"}`} />
          ))}
        </div>
        <span className="text-[9px] tracking-[0.3em] uppercase text-white">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
