import React from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/app/home-page/components/HeroSection";

const MasonryGallery = dynamic(() => import("@/app/home-page/components/MasonryGallery"), {
  loading: () => <div className="h-[400px] bg-foreground/5 animate-pulse" />,
});
const ArtistRosterSection = dynamic(() => import("@/app/home-page/components/ArtistRosterSection"), {
  loading: () => <div className="h-[400px] bg-foreground/5 animate-pulse" />,
});
const LegacyStatsSection = dynamic(() => import("@/app/home-page/components/LegacyStatsSection"), {
  loading: () => <div className="h-[200px] bg-foreground/5 animate-pulse" />,
});
const LatestNewsSection = dynamic(() => import("@/app/home-page/components/LatestNewsSection"), {
  loading: () => <div className="h-[300px] bg-foreground/5 animate-pulse" />,
});
const SpotlightCardsInit = dynamic(() => import("@/app/home-page/components/SpotlightCardsInit"));

export const metadata: Metadata = {
  title: "IREY PROD — Booking Agency & Event Production | Mauritius Island",
  description: "IREY PROD is a dynamic booking agency and event production company based in Mauritius Island, specialising in Bookings, Tours, Events, and Productions.",
  openGraph: {
    title: "IREY PROD — Your Gateway to Unforgettable Experiences",
    description: "Booking agency & event production based in Mauritius Island.",
    images: [{ url: "/assets/images/IREY-PROD-BLACK-1773496673088.png", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <SpotlightCardsInit />
      <Header />
      <main>
        <HeroSection />
        <MasonryGallery />
        <ArtistRosterSection />
        <LegacyStatsSection />
        <LatestNewsSection />
      </main>
      <Footer />
    </>
  );
}
