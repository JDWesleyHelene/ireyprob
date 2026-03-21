import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import Link from "next/link";
import { events } from "@/lib/data";

function formatDateFull(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatDateShort(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return { day, month: months[d.getUTCMonth()], year: String(d.getUTCFullYear()) };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find(e => e.slug === slug);
  if (!event) return { title: "Event Not Found — IREY PROD" };
  return {
    title: `${event.title} — IREY PROD`,
    description: event.description || `${event.title} at ${event.venue}, ${event.city}.`,
    openGraph: { title: event.title, images: [{ url: event.image, width: 1200, height: 630, alt: event.image_alt }] },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = events.find(e => e.slug === slug);
  if (!event) notFound();

  const dateFormatted = formatDateShort(event.event_date);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <AppImage src={event.image} alt={event.image_alt || event.title} fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute inset-0 noise pointer-events-none opacity-30" />

          <div className="absolute top-24 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
            <Link href="/events" className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              All Events
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                {event.sold_out && <span className="inline-block mb-3 px-3 py-1 bg-foreground/10 border border-foreground/20 text-[9px] font-semibold tracking-[0.25em] uppercase text-foreground/50 rounded-sm">Sold Out</span>}
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-display text-[4rem] font-light italic text-foreground leading-none">{dateFormatted.day}</span>
                  <div><span className="text-[14px] font-semibold tracking-widest uppercase text-accent block">{dateFormatted.month}</span><span className="text-[12px] text-foreground/40">{dateFormatted.year}</span></div>
                </div>
                <h1 className="font-display text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-light italic text-foreground leading-[0.95] tracking-tight mb-2">{event.title}</h1>
                <p className="text-[14px] text-foreground/50">{event.venue} · {event.city}, {event.country}</p>
              </div>
              {!event.sold_out && (
                <Link href="/contact" className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
                  Book / Enquire<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              {event.description && (
                <div className="mb-12">
                  <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-4">— About</span>
                  <p className="text-foreground/60 leading-relaxed">{event.description}</p>
                </div>
              )}
              {event.artists && event.artists.length > 0 && (
                <div className="mb-12">
                  <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-4">— Artists</span>
                  <div className="flex flex-wrap gap-2">
                    {event.artists.map((a) => (
                      <span key={a} className="px-4 py-2 border border-foreground/10 text-[12px] text-foreground/50 rounded-sm hover:border-foreground/30 hover:text-foreground/70 transition-all">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
                  <h3 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground/30 mb-5">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30 mt-0.5 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <div><p className="text-[10px] text-foreground/30 mb-0.5">Date</p><p className="text-[13px] text-foreground/70">{formatDateFull(event.event_date)}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30 mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <div><p className="text-[10px] text-foreground/30 mb-0.5">Venue</p><p className="text-[13px] text-foreground/70">{event.venue}</p><p className="text-[12px] text-foreground/40">{event.city}, {event.country}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30 mt-0.5 flex-shrink-0"><path d="M9 18V5l12-2v13M6 21c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM18 18c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" /></svg>
                      <div><p className="text-[10px] text-foreground/30 mb-0.5">Genre</p><p className="text-[13px] text-foreground/70">{event.genre}</p></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-foreground/8">
                    <Link href="/contact" className="w-full flex items-center justify-center gap-2 py-3 border border-foreground/20 text-foreground text-[11px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-foreground/5 transition-all duration-300">
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
