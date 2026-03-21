"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { news as staticNews } from "@/lib/data";
import { useNews } from "@/lib/useLiveData";
import { useLanguage } from "@/contexts/LanguageContext";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function LatestNewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { news } = useNews();
  const latestNews = news.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal")?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ctx: any;
    const initGsap = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".news-heading", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".news-heading", start: "top 85%", once: true } });
        gsap.from(".news-card", { y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".news-grid", start: "top 80%", once: true } });
      }, sectionRef);
    };
    initGsap();
    return () => ctx?.revert();
  }, []);

  if (latestNews.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-background relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        <div className="news-heading flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-3">{t.news.sectionLabel}</span>
            <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-foreground leading-[0.95] tracking-tight">{t.news.sectionHeading}</h2>
          </div>
          <Link href="/news" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300 group">
            {t.news.viewAll}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="news-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {latestNews.map((article, i) => (
            <div key={article.id} className={`news-card reveal delay-${i * 100}`}>
              <Link href={`/news/${article.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-sm h-48 sm:h-52 img-zoom-wrap mb-4">
                  <AppImage src={article.cover_image || "/assets/images/no_image.png"} alt={article.cover_image_alt || article.title} fill className="img-zoom object-cover grayscale group-hover:grayscale-0 transition-all duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="text-[10px] text-white/50 mb-2">{formatDate(article.published_at)} · {article.author}</p>
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-white group-hover:text-accent transition-colors duration-300 mb-2 leading-snug">{article.title}</h3>
                <p className="text-[12px] text-white/60 leading-relaxed line-clamp-2">{article.excerpt}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40 group-hover:text-white/70 transition-colors">
                  {t.news.readMore}<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
