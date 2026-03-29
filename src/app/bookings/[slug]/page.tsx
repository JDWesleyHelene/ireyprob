import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArtistDetailClient from "./client";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

function norm(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const all = await prisma.artist.findMany({ orderBy: { sortOrder: "asc" } });

  const artist = all.find(a =>
    norm(a.slug || a.name) === norm(slug) || norm(a.name) === norm(slug)
  );
  if (!artist) return notFound();

  const related = all.filter(a => a.id !== artist.id).slice(0, 3);

  // Serialize (Prisma returns Date objects etc.)
  const safe = (a: any) => ({
    id: a.id, name: a.name, slug: norm(a.slug||a.name),
    genre: a.genre, origin: a.origin, bio: a.bio||"",
    image: a.image||"", imageAlt: a.imageAlt||"",
    tags: Array.isArray(a.tags) ? a.tags : [],
    featured: a.featured, sortOrder: a.sortOrder,
  });

  return <ArtistDetailClient artist={safe(artist)} related={related.map(safe)}/>;
}
