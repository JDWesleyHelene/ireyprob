import React from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageReady from "@/components/PageReady";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "IREY PROD — Booking Agency · Mauritius Island",
  description: "IREY PROD is a dynamic booking agency specialising in Artist Management, Tours, Events and Productions. Based in Mauritius Island.",
};

// Force dynamic so Neon data is always fresh
export const dynamic = "force-dynamic";

const HeroSection         = dynamic(() => import("@/app/home-page/components/HeroSection"),         { ssr: false });
const ArtistRosterSection = dynamic(() => import("@/app/home-page/components/ArtistRosterSection"), { ssr: false });
const MasonryGallery      = dynamic(() => import("@/app/home-page/components/MasonryGallery"),      { ssr: false });
const LegacyStatsSection  = dynamic(() => import("@/app/home-page/components/LegacyStatsSection"),  { ssr: false });

export default async function HomePage() {
  // Fetch all data server-side — zero client round-trips on initial load
  const [settingsRows, dbArtists] = await Promise.all([
    prisma.setting.findMany().catch(() => []),
    prisma.artist.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);

  // Convert settings rows to key-value map
  const settings: Record<string, string> = {};
  settingsRows.forEach((r: any) => { if (r.value) settings[r.key] = r.value; });

  // Serialize artists for client
  const artists = dbArtists.map((a: any) => ({
    id: a.id, name: a.name, slug: a.slug, genre: a.genre, origin: a.origin,
    bio: a.bio, image: a.image, imageAlt: a.imageAlt, tags: a.tags,
    featured: a.featured, sortOrder: a.sortOrder,
  }));

  return (
    <>
      <Header/>
      <main className="min-h-screen bg-background">
        <HeroSection initialSettings={settings}/>
        <ArtistRosterSection initialArtists={artists}/>
        <MasonryGallery initialSettings={settings}/>
        <LegacyStatsSection/>
      </main>
      <Footer/>
      <PageReady delay={400}/>
    </>
  );
}
