import React from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "./components/HeroSection";

const FeaturedEventsSection = dynamic(() => import("./components/FeaturedEventsSection"), {
  loading: () => <div className="h-[400px] bg-foreground/5 animate-pulse" />,
});
const ArtistRosterSection = dynamic(() => import("./components/ArtistRosterSection"), {
  loading: () => <div className="h-[400px] bg-foreground/5 animate-pulse" />,
});
const LegacyStatsSection = dynamic(() => import("./components/LegacyStatsSection"), {
  loading: () => <div className="h-[200px] bg-foreground/5 animate-pulse" />,
});
const LatestNewsSection = dynamic(() => import("./components/LatestNewsSection"), {
  loading: () => <div className="h-[300px] bg-foreground/5 animate-pulse" />,
});
const SpotlightCardsInit = dynamic(() => import("./components/SpotlightCardsInit"));

export const metadata: Metadata = {
  title: "IREY PROD — Booking Agency & Event Production | Mauritius Island",
  description:
    "IREY PROD is a dynamic booking agency and event production company based in Mauritius Island, specialising in Bookings, Tours, Events, and Productions for emerging and established artists.",
  openGraph: {
    title: "IREY PROD — Your Gateway to Unforgettable Experiences",
    description: "Booking agency & event production based in Mauritius Island. Bookings, Tours, Events, Productions.",
    images: [{ url: "/assets/images/IREY-PROD-BLACK-1773496673088.png", width: 1200, height: 630 }],
  },
};

export default function HomePageRoute() {
  return (
    <>
      <SpotlightCardsInit />
      <Header />
      <main>
        <HeroSection />
        <FeaturedEventsSection />
        <ArtistRosterSection />
        <LegacyStatsSection />
        <LatestNewsSection />
      </main>
      <Footer />
    </>
  );
}