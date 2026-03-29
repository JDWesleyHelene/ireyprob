import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    // Find artist by slug
    const artists = await prisma.artist.findMany();
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const artist = artists.find(a => normalize(a.slug || a.name) === normalize(slug) || normalize(a.name) === normalize(slug));

    if (!artist) return { title: "Artist — IREY PROD" };

    // Strip HTML from bio and get first 30 words
    const bioText = (artist.bio || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const bioExcerpt = bioText.split(" ").slice(0, 25).join(" ") + (bioText.split(" ").length > 25 ? "..." : "");

    const title = `${artist.name} — IREY PROD`;
    const description = bioExcerpt || `${artist.name} · ${artist.genre} · Available for bookings via IREY PROD, Mauritius Island.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: artist.image ? [{ url: artist.image, width: 1200, height: 630, alt: artist.name }] : [],
        type: "profile",
        siteName: "IREY PROD",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: artist.image ? [artist.image] : [],
      },
    };
  } catch {
    return { title: "Artist — IREY PROD" };
  }
}

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
