import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ireyprob.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const artists = await prisma.artist.findMany();
    const norm = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const artist = artists.find(a =>
      norm(a.slug || a.name) === norm(slug) || norm(a.name) === norm(slug)
    );
    if (!artist) return { title: "Artist — IREY PROD" };

    // Strip HTML from bio → first 25 words
    const bioText = (artist.bio || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    const words   = bioText.split(" ").filter(Boolean);
    const excerpt = words.slice(0, 25).join(" ") + (words.length > 25 ? "..." : "");

    const title = `${artist.name} — IREY PROD`;
    const desc  = excerpt || `${artist.name} · ${artist.genre || "Artist"} · Book via IREY PROD, Mauritius.`;

    // Use artist image for OG — must be absolute URL and NOT a logo file
    const LOGO_PATTERNS = ["LOGO-PNG", "IREY-PROD-WHITE", "IREY-PROD-BLACK"];
    const isLogo = (url: string) => LOGO_PATTERNS.some(p => url.includes(p));
    const rawImage = artist.image?.startsWith("http") ? artist.image : undefined;
    const image = rawImage && !isLogo(rawImage) ? rawImage : undefined;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `${BASE_URL}/bookings/${norm(artist.slug || artist.name)}`,
        siteName: "IREY PROD",
        type: "profile",
        ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: artist.name }] } : {}),
      },
      twitter: {
        card:        "summary_large_image",
        title,
        description: desc,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: "Artist — IREY PROD" };
  }
}

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
