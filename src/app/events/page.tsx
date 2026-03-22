import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import { prisma } from '@/lib/prisma';

function formatDate(dateStr: string | Date | null) {
  if (!dateStr) {
    return { day: '--', month: '---', year: '----' };
  }

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

  return {
    day,
    month: months[d.getUTCMonth()],
    year: String(d.getUTCFullYear()),
  };
}

function extractGenres(input: string | null | undefined) {
  if (!input) return [];
  return input
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean);
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ genre?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = params?.genre || 'All';

  const dbEvents = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
  });

  const liveEvents = dbEvents.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    venue: e.venue || '',
    city: e.city || '',
    country: e.country || '',
    genre: e.genre || '',
    image: e.image || '',
    image_alt: e.imageAlt || '',
    description: e.description || '',
    event_date: e.eventDate ? e.eventDate.toISOString() : '',
    featured: e.featured,
    sold_out: e.soldOut,
    artists: Array.isArray(e.artists) ? (e.artists as string[]) : [],
  }));

  const genreSet = new Set<string>();
  liveEvents.forEach((event) => {
    extractGenres(event.genre).forEach((g) => genreSet.add(g));
  });

  const filters = ['All', ...Array.from(genreSet).sort((a, b) => a.localeCompare(b))];

  const useCarouselFilters = filters.length > 7;

  const filtered =
    activeFilter === 'All'
      ? liveEvents
      : liveEvents.filter((e) =>
          extractGenres(e.genre).some((g) => g.toLowerCase() === activeFilter.toLowerCase())
        );

  const featured = filtered.find((e) => e.featured) || filtered[0] || null;

  const rest = featured ? filtered.filter((e) => e.id !== featured.id) : [];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <section className="relative pt-28 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">
              Events
            </span>

            <h1 className="font-display text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-light italic text-white leading-[0.9] tracking-tight mb-4">
              Live Events
            </h1>

            <p className="text-[14px] text-white/70 font-light max-w-lg leading-relaxed">
              Discover our latest events, shows, and experiences.
            </p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-6">
          {useCarouselFilters ? (
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

              <div className="flex gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar snap-x snap-mandatory">
                {filters.map((f) => {
                  const href = f === 'All' ? '/events' : `/events?genre=${encodeURIComponent(f)}`;

                  return (
                    <Link
                      key={f}
                      href={href}
                      className={`snap-start shrink-0 px-4 sm:px-5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase rounded-sm border transition-all duration-300 ${
                        activeFilter === f
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white'
                      }`}
                    >
                      {f}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {filters.map((f) => {
                const href = f === 'All' ? '/events' : `/events?genre=${encodeURIComponent(f)}`;

                return (
                  <Link
                    key={f}
                    href={href}
                    className={`px-4 sm:px-5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase rounded-sm border transition-all duration-300 ${
                      activeFilter === f
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {f}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-24">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/50 text-[13px]">No events found.</p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-6">
                  <div className="group relative overflow-hidden rounded-sm img-zoom-wrap h-[380px] sm:h-[460px] md:h-[520px]">
                    {featured.image ? (
                      <AppImage
                        src={featured.image}
                        alt={featured.image_alt || featured.title}
                        fill
                        className="img-zoom object-cover"
                        sizes="100vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-foreground/5" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                    <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 bg-foreground/10 backdrop-blur-md border border-foreground/15 rounded-sm">
                      <span className="w-1 h-1 rounded-full bg-accent pulse-dot" />
                      <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/80">
                        Next Event
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row justify-between items-end gap-4 sm:gap-6">
                      <div>
                        {(() => {
                          const d = formatDate(featured.event_date);
                          return (
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="font-display text-[2.5rem] sm:text-[3rem] font-light italic text-white leading-none">
                                {d.day}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-[12px] font-semibold tracking-widest uppercase text-accent">
                                  {d.month}
                                </span>
                                <span className="text-[11px] text-white/60">{d.year}</span>
                              </div>
                            </div>
                          );
                        })()}

                        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-light italic text-white mb-1">
                          {featured.title}
                        </h3>

                        <p className="text-[13px] text-white/70">
                          {[featured.venue, featured.city, featured.country]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {extractGenres(featured.genre).map((g) => (
                            <span
                              key={g}
                              className="text-[10px] text-white/60 border border-white/20 px-2 py-0.5 rounded-sm"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3">
                        <span className="px-3 py-1 border border-white/30 rounded-sm text-[10px] font-medium tracking-widest uppercase text-white/70">
                          {featured.genre || 'Event'}
                        </span>

                        <Link
                          href={`/events/${featured.slug}`}
                          className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase text-white hover:text-accent transition-colors duration-300"
                        >
                          View Details
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {rest.length > 0 && (
                <div className="space-y-px">
                  {rest.map((event) => {
                    const d = formatDate(event.event_date);

                    return (
                      <div
                        key={event.id}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-b border-white/5 hover:border-white/15 transition-all duration-300"
                      >
                        <div className="flex items-center gap-5 sm:gap-8 flex-1 min-w-0">
                          <div className="flex-shrink-0 text-center w-12">
                            <span className="font-display text-[1.8rem] font-light italic text-white leading-none block">
                              {d.day}
                            </span>
                            <span className="text-[9px] font-semibold tracking-widest uppercase text-accent">
                              {d.month}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-display text-[1.1rem] sm:text-[1.3rem] font-light italic text-white group-hover:text-accent transition-colors duration-300 truncate">
                              {event.title}
                            </h3>
                            <p className="text-[12px] text-white/50 mt-0.5">
                              {[event.venue, event.city].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="hidden sm:block px-3 py-1 border border-white/15 rounded-sm text-[10px] font-medium tracking-widest uppercase text-white/50">
                            {event.genre || 'Event'}
                          </span>

                          <Link
                            href={`/events/${event.slug}`}
                            className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-1.5"
                          >
                            View Details
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
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
