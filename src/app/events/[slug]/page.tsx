import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

function formatDateFull(dateStr: string | Date | null) {
  if (!dateStr) return 'Date TBC';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateShort(dateStr: string | Date | null) {
  if (!dateStr) return { day: '--', month: '---', year: '----' };
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return { day, month: months[d.getUTCMonth()], year: String(d.getUTCFullYear()) };
}

function formatTime(timeStr: string | null | undefined) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    return { title: 'Event Not Found — IREY PROD' };
  }

  return {
    title: `${event.title} — IREY PROD`,
    description:
      event.description || `${event.title} at ${event.venue || 'TBC'}, ${event.city || 'TBC'}.`,
    openGraph: event.image
      ? {
          title: event.title,
          images: [
            {
              url: event.image,
              width: 1200,
              height: 630,
              alt: event.imageAlt || event.title,
            },
          ],
        }
      : undefined,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Use raw SQL to ensure eventTime is always fetched regardless of Prisma client version
  const rows = await prisma.$queryRaw<any[]>`
    SELECT *, "eventTime" as "eventTimeRaw" FROM "Event" WHERE slug = ${slug} LIMIT 1
  `;

  if (!rows || rows.length === 0) notFound();

  const event = rows[0] as any;

  const dateFormatted = formatDateShort(event.eventDate);
  const eventTime = formatTime(event.eventTime || event.eventTimeRaw || event.event_time || null);
  const contactSubject = encodeURIComponent(`Enquiry — ${event.title}`);
  const artists = Array.isArray(event.artists) ? (event.artists as string[]) : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {event.image ? (
            <AppImage
              src={event.image}
              alt={event.imageAlt || event.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-foreground/5" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute inset-0 noise pointer-events-none opacity-30" />



          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-10 sm:pb-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6">
              <div>
                {event.soldOut && (
                  <span className="inline-block mb-3 px-3 py-1 bg-foreground/10 border border-foreground/20 text-[9px] font-semibold tracking-[0.25em] uppercase text-foreground/50 rounded-sm">
                    Sold Out
                  </span>
                )}

                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-display text-[4rem] font-light italic text-foreground leading-none">
                    {dateFormatted.day}
                  </span>
                  <div>
                    <span className="text-[14px] font-semibold tracking-widest uppercase text-accent block">
                      {dateFormatted.month}
                    </span>
                    <span className="text-[12px] text-foreground/40">{dateFormatted.year}</span>
                  </div>
                </div>

                <h1 className="font-display text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-light italic text-foreground leading-[0.95] tracking-tight mb-2">
                  {event.title}
                </h1>

                <p className="text-[14px] text-foreground/50">
                  {[event.venue, event.city, event.country].filter(Boolean).join(' · ')}
                </p>
                {eventTime && (
                  <div className="flex items-center gap-2 mt-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    <span className="text-[13px] font-medium text-accent">{eventTime}</span>
                  </div>
                )}
              </div>

              {!event.soldOut && (
                <Link
                  href="/contact"
                  className="w-full md:w-auto flex-shrink-0 inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-accent transition-all duration-300"
                >
                  Book / Enquire
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              {eventTime && (
                <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-accent/10 border border-accent/20 rounded-sm w-fit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent flex-shrink-0">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  <div>
                    <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-accent/60 block">Event Time</span>
                    <span className="text-[16px] font-semibold text-accent">{eventTime}</span>
                  </div>
                </div>
              )}
              {event.description && (
                <div className="mb-12">
                  <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-4">
                    — About
                  </span>
                  <p className="text-foreground/60 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}

              {artists.length > 0 && (
                <div className="mb-12">
                  <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-4">
                    — Artists
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {artists.map((a) => (
                      <span
                        key={a}
                        className="px-4 py-2 border border-foreground/10 text-[12px] text-foreground/50 rounded-sm hover:border-foreground/30 hover:text-foreground/70 transition-all"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
                  <h3 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground/30 mb-5">
                    Event Details
                  </h3>

                  <div className="space-y-4">
                    {eventTime && (
                      <div className="flex items-start gap-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent/60 mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <div><p className="text-[10px] text-foreground/30 mb-0.5">Time</p><p className="text-[13px] text-accent font-medium">{eventTime}</p></div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-foreground/30 mt-0.5 flex-shrink-0"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <div>
                        <p className="text-[10px] text-foreground/30 mb-0.5">Date</p>
                        <p className="text-[13px] text-foreground/70">
                          {formatDateFull(event.eventDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-foreground/30 mt-0.5 flex-shrink-0"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <p className="text-[10px] text-foreground/30 mb-0.5">Venue</p>
                        <p className="text-[13px] text-foreground/70">{event.venue || 'TBC'}</p>
                        <p className="text-[12px] text-foreground/40">
                          {[event.city, event.country].filter(Boolean).join(', ') || 'Location TBC'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-foreground/30 mt-0.5 flex-shrink-0"
                      >
                        <path d="M9 18V5l12-2v13M6 21c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM18 18c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" />
                      </svg>
                      <div>
                        <p className="text-[10px] text-foreground/30 mb-0.5">Genre</p>
                        <p className="text-[13px] text-foreground/70">{event.genre || 'Event'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-foreground/8">
                    <Link
                      href={`/contact?subject=${contactSubject}`}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-foreground/20 text-foreground text-[11px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-foreground/5 transition-all duration-300"
                    >
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      {/* Back to all events */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-10 border-t border-foreground/5">
        <Link href="/events" className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to All Events
        </Link>
      </div>
      </main>
      <Footer />
    </>
  );
}
