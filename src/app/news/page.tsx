"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { news as allNews } from "@/lib/data";
import { useNews } from "@/lib/useLiveData";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { news: liveNews } = useNews();
  const articles = liveNews;
  const [featured, ...rest] = articles;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")), { threshold: 0.06 });
    sectionRef.current?.querySelectorAll(".reveal")?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative pt-28 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">— News & Updates</span>
            <h1 className="reveal font-display text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-light italic text-white leading-[0.9] tracking-tight mb-4">Latest News</h1>
            <p className="reveal text-[14px] text-white/70 font-light max-w-lg leading-relaxed">Stories, announcements, and insights from IREY PROD — the pulse of the Mauritius music scene.</p>
          </div>
        </section>
        <section ref={sectionRef} className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-24">
          {articles.length === 0 ? (
            <div className="text-center py-20"><p className="text-white/50 text-[13px]">No articles published yet.</p></div>
          ) : (
            <>
              {featured && (
                <div className="reveal mb-8 sm:mb-10">
                  <Link href={`/news/${featured.slug}`} className="group block relative overflow-hidden rounded-sm h-[360px] sm:h-[460px] md:h-[520px] img-zoom-wrap">
                    <AppImage src={featured.cover_image || "/assets/images/no_image.png"} alt={featured.cover_image_alt || featured.title} fill priority className="img-zoom object-cover" sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/20 to-transparent" />
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1.5 bg-foreground/10 backdrop-blur-md border border-white/15 text-[9px] font-semibold tracking-[0.25em] uppercase text-white/80 rounded-sm">Latest</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                      <p className="text-[11px] text-white/60 mb-2">{formatDate(featured.published_at)} · {featured.author}</p>
                      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light italic text-white mb-3 group-hover:text-accent transition-colors duration-300">{featured.title}</h2>
                      <p className="text-[13px] text-white/70 max-w-2xl leading-relaxed">{featured.excerpt}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-white/60 group-hover:text-white transition-colors">
                        Read Article<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {rest.map((article, i) => (
                    <div key={article.id} className={`reveal delay-${Math.min(i * 100, 300)}`}>
                      <Link href={`/news/${article.slug}`} className="group block">
                        <div className="relative overflow-hidden rounded-sm h-48 sm:h-52 img-zoom-wrap mb-4">
                          <AppImage src={article.cover_image || "/assets/images/no_image.png"} alt={article.cover_image_alt || article.title} fill className="img-zoom object-cover grayscale group-hover:grayscale-0 transition-all duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <p className="text-[10px] text-white/50 mb-2">{formatDate(article.published_at)} · {article.author}</p>
                        <h3 className="text-[15px] sm:text-[16px] font-semibold text-white group-hover:text-accent transition-colors duration-300 mb-2 leading-snug">{article.title}</h3>
                        <p className="text-[12px] text-white/60 leading-relaxed line-clamp-2">{article.excerpt}</p>
                        <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40 group-hover:text-white/70 transition-colors">
                          Read More<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
