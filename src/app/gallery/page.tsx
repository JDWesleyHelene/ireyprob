"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface GImg { id: string; src: string; alt: string; }

const DEFAULTS: GImg[] = [
  { id:"g1",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",         alt:"IREY PROD live event" },
  { id:"g2",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",         alt:"IREY PROD concert" },
  { id:"g3",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg",         alt:"IREY PROD artist on stage" },
  { id:"g4",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",         alt:"IREY PROD event production" },
  { id:"g5",  src:"https://ireyprod.com/wp-content/uploads/2023/12/319291225_674505520974726_3683712000139163132_n.jpg", alt:"IREY PROD live music" },
  { id:"g6",  src:"https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg", alt:"IREY PROD outdoor concert" },
  { id:"g7",  src:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", alt:"IREY PROD festival" },
  { id:"g8",  src:"https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", alt:"IREY PROD artist" },
  { id:"g9",  src:"https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg", alt:"IREY PROD production" },
  { id:"g10", src:"https://ireyprod.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-21-at-12.32.07_43897a31.jpg",  alt:"IREY PROD backstage" },
];

export default function GalleryPage() {
  const [images, setImages]   = useState<GImg[]>(DEFAULTS);
  const [lightbox, setLightbox] = useState<GImg | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.ok ? r.json() : {}).then(d => {
      try {
        if (d.gallery_page_images) {
          const imgs = JSON.parse(d.gallery_page_images);
          if (Array.isArray(imgs) && imgs.length > 0) setImages(imgs);
        }
      } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const col1 = images.filter((_, i) => i % 3 === 0);
  const col2 = images.filter((_, i) => i % 3 === 1);
  const col3 = images.filter((_, i) => i % 3 === 2);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page hero */}
        <section className="relative pt-28 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none"/>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent"/>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-4">— Gallery</span>
            <h1 className="font-display text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] font-extrabold italic text-white leading-[0.9] tracking-tight mb-4">
              Our World
            </h1>
            <p className="text-[14px] text-white/50 font-light max-w-lg">
              Behind the scenes, on stage, and everywhere in between.
            </p>
          </div>
        </section>

        {/* Full masonry */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-24">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-foreground/5 rounded-sm animate-pulse"/>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {[col1, col2, col3].map((col, ci) => (
                <div key={ci} className="flex flex-col gap-2 sm:gap-3">
                  {col.map(img => (
                    <button key={img.id} onClick={() => setLightbox(img)}
                      className="relative overflow-hidden rounded-sm group cursor-zoom-in block w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt}
                        className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        loading="lazy"/>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.src} alt={lightbox.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-sm"
            onClick={e => e.stopPropagation()}/>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-white/40 tracking-widest uppercase">{lightbox.alt}</p>
        </div>
      )}
    </>
  );
}
