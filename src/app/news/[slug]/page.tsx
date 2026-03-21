import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import Link from "next/link";
import { news } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find(n => n.slug === slug && n.status === "published");
  if (!article) return { title: "Article Not Found — IREY PROD" };
  return { title: `${article.title} — IREY PROD News`, description: article.excerpt, openGraph: { title: article.title, description: article.excerpt, images: article.cover_image ? [{ url: article.cover_image, width: 1200, height: 630, alt: article.cover_image_alt }] : [] } };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = news.find(n => n.slug === slug && n.status === "published");
  if (!article) notFound();
  const publishDate = new Date(article.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
          <AppImage src={article.cover_image || "/assets/images/no_image.png"} alt={article.cover_image_alt || article.title} fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/50 to-black/20" />
          <div className="absolute inset-0 noise pointer-events-none opacity-30" />
          <div className="absolute top-24 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
            <Link href="/news" className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              All News
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pb-10">
            <p className="text-[11px] text-foreground/40 mb-3">{publishDate} · {article.author}</p>
            <h1 className="font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-foreground leading-[0.95] tracking-tight max-w-3xl">{article.title}</h1>
          </div>
        </section>
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16">
          <div className="max-w-3xl">
            <p className="text-[16px] text-foreground/60 leading-relaxed border-l-2 border-foreground/15 pl-5 mb-10 font-light italic">{article.excerpt}</p>
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-foreground/60 leading-relaxed prose-headings:font-display prose-headings:font-light prose-headings:italic prose-headings:text-foreground prose-p:text-foreground/60 prose-a:text-accent prose-strong:text-foreground/80" dangerouslySetInnerHTML={{ __html: article.content || "" }} />
            <div className="mt-16 pt-8 border-t border-foreground/8">
              <Link href="/news" className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to News
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
