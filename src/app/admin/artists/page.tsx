"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { artists as staticArtists } from "@/lib/data";

interface Artist { id: string; name: string; genre: string; origin: string; image: string; slug: string; featured: boolean; _source?: string; }

export default function AdminArtistsPage() {
  const [dynamicArtists, setDynamicArtists] = useState<Artist[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/get-artists.php")
      .then(r => r.ok ? r.json() : [])
      .then(data => setDynamicArtists(Array.isArray(data) ? data.map((a: Artist) => ({ ...a, _source: "db" })) : []))
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/save-artist.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, _action: "delete" }),
      });
      setDynamicArtists(prev => prev.filter(a => a.id !== id));
      showToast("Artist deleted");
    } catch { showToast("Failed to delete"); }
    setDeleting(null);
  };

  const allArtists = [
    ...staticArtists.map(a => ({ ...a, _source: "static" as const })),
    ...dynamicArtists,
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-foreground/10 border border-foreground/20 rounded-sm text-[12px] text-foreground">{toast}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Artists <span className="text-foreground/30 text-2xl">({allArtists.length})</span></h1>
        </div>
        <Link href="/admin/artists/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          Add Artist
        </Link>
      </div>

      <div className="border border-foreground/8 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/8 bg-foreground/[0.02]">
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Artist</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Genre</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Origin</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Source</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allArtists.map((artist) => (
              <tr key={artist.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 bg-foreground/5">
                      {artist.image && <AppImage src={artist.image} alt={artist.name} width={40} height={40} className="object-cover w-full h-full grayscale" />}
                    </div>
                    <div>
                      <span className="text-[13px] text-foreground/80 font-medium block">{artist.name}</span>
                      {artist.featured && <span className="text-[9px] text-accent/60 uppercase tracking-widest">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-[12px] text-foreground/40">{artist.genre}</span></td>
                <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[12px] text-foreground/40">{artist.origin}</span></td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className={`px-2 py-0.5 text-[9px] tracking-widest uppercase rounded-sm border ${artist._source === "static" ? "bg-foreground/5 text-foreground/30 border-foreground/10" : "bg-blue-400/5 text-blue-400/60 border-blue-400/15"}`}>
                    {artist._source === "static" ? "Default" : "Custom"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/bookings/${artist.slug}`} target="_blank"
                      className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-foreground/10 rounded-sm text-foreground/30 hover:text-foreground/60 hover:border-foreground/20 transition-all inline-flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      View
                    </Link>
                    {artist._source !== "static" && (
                      <button onClick={() => handleDelete(artist.id, artist.name)} disabled={deleting === artist.id}
                        className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-red-500/20 rounded-sm text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-40">
                        {deleting === artist.id ? "..." : "Delete"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dynamicArtists.length === 0 && (
        <p className="text-[11px] text-foreground/25 text-center mt-4">
          Artists added via "Add Artist" will appear above the default ones and can be deleted.
        </p>
      )}
    </div>
  );
}
