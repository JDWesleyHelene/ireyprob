"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Stat {
  value: number;
  suffix: string;
  labelKey: string;
  subKey: string;
  color: string;
}

const statDefs: Stat[] = [
  { value: 4, suffix: "", labelKey: "Core Services", subKey: "Bookings · Tours · Events · Productions", color: "text-foreground" },
  { value: 360, suffix: "°", labelKey: "Full Service Agency", subKey: "End-to-end artist & event management", color: "text-accent" },
  { value: 100, suffix: "%", labelKey: "Client-Centric", subKey: "Dedicated to your success", color: "text-foreground" },
  { value: 1, suffix: "", labelKey: "One-Stop Agency", subKey: "The only agency you'll ever need", color: "text-foreground" },
];

const frStatLabels = [
  { label: "Services Principaux", sub: "Bookings · Tournées · Événements · Productions" },
  { label: "Agence Complète", sub: "Gestion artiste & événement de bout en bout" },
  { label: "Centré Client", sub: "Dédié à votre succès" },
  { label: "Agence Tout-en-Un", sub: "La seule agence dont vous aurez besoin" },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const startVal = target > 100 ? Math.floor(target * 0.6) : 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ stat, animate, label, sub }: { stat: Stat; animate: boolean; label: string; sub: string }) {
  const count = useCountUp(stat.value, 1600, animate);
  return (
    <div className="spotlight-card group p-8 lg:p-10 rounded-sm border border-foreground/[0.06] hover:border-foreground/[0.12] transition-colors duration-500 cursor-default">
      <div className="relative z-10">
        <div className={`font-display text-[3.5rem] lg:text-[5rem] font-light italic leading-none mb-2 ${stat.color}`}>
          {count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-[13px] font-semibold tracking-[0.12em] uppercase text-white mb-1">{label}</div>
        <div className="text-[11px] text-white font-light tracking-wide">{sub}</div>
        <div className="flex gap-0.5 mt-6 h-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="seg-bar-fill flex-1" style={{ backgroundColor: i < 6 ? `rgba(240,237,232,${0.15 + i * 0.04})` : 'rgba(240,237,232,0.04)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LegacyStatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ctx: any;
    const initGsap = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".stats-heading", {
          y: 40, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".stats-heading", start: "top 85%", once: true }
        });
        gsap.from(".stat-card-item", {
          y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".stats-grid", start: "top 80%", once: true }
        });
        gsap.from(".stats-quote", {
          y: 30, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".stats-quote", start: "top 85%", once: true }
        });
      }, sectionRef);
    };
    initGsap();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="legacy" className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-foreground/[0.02] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none flex justify-between px-8 sm:px-12 md:px-32">
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d2" /></div>
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden hidden md:block"><div className="beam beam-d3" /></div>
        <div className="relative w-px h-full bg-white/[0.02] overflow-hidden"><div className="beam beam-d1" /></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        <div className="stats-heading mb-12 sm:mb-16 max-w-2xl">
          <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white block mb-3">{t.stats.sectionLabel}</span>
          <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-foreground leading-[0.95] tracking-tight mb-5">
            {t.stats.heading1}<br />
            <span className="text-foreground/40">{t.stats.heading2}</span>
          </h2>
          <p className="reveal text-[14px] sm:text-[15px] text-white font-light leading-relaxed max-w-lg">
            {t.stats.subtext}
          </p>
        </div>

        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statDefs.map((stat, i) => {
            const label = language === "fr" ? frStatLabels[i].label : stat.labelKey;
            const sub = language === "fr" ? frStatLabels[i].sub : stat.subKey;
            return (
              <div key={stat.labelKey} className={`stat-card-item reveal delay-${i * 100}`}>
                <StatCounter stat={stat} animate={animate} label={label} sub={sub} />
              </div>
            );
          })}
        </div>

        <div className="stats-quote reveal mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-foreground/[0.06]">
          <blockquote className="max-w-3xl">
            <p className="font-display text-[1.3rem] sm:text-[1.8rem] md:text-[2rem] font-light italic text-white leading-snug tracking-tight">
              {t.stats.quote}
            </p>
            <footer className="mt-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-white">
              {t.stats.quoteFooter}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}