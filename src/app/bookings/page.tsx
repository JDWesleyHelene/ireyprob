// This is the server entry — fetches data and passes to client component
import { prisma } from "@/lib/prisma";
import BookingsPageClient from "./page-client";

export const revalidate = 0;

export default async function BookingsPage() {
  const [settingsRows, dbArtists] = await Promise.all([
    prisma.setting.findMany().catch(() => []),
    prisma.artist.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);

  const settings: Record<string, string> = {};
  settingsRows.forEach((r: any) => { if (r.value) settings[r.key] = r.value; });

  const artists = dbArtists.map((a: any) => ({
    id: a.id, name: a.name, slug: a.slug?.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"") || a.name.toLowerCase().replace(/\s+/g,"-"),
    genre: a.genre, origin: a.origin, bio: a.bio, image: a.image,
    imageAlt: a.imageAlt, tags: a.tags, featured: a.featured, sortOrder: a.sortOrder,
    image_alt: a.imageAlt, sort_order: a.sortOrder,
  }));

  return <BookingsPageClient initialArtists={artists} initialSettings={settings}/>;
}
