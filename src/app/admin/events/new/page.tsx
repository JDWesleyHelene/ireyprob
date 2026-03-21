"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { apiUrl } from "@/lib/apiConfig";

interface EventForm {
  title: string; slug: string; event_date: string; venue: string;
  city: string; country: string; genre: string; image: string;
  image_alt: string; description: string; artists: string;
  featured: boolean; sold_out: boolean;
}

const empty: EventForm = {
  title: "", slug: "", event_date: "", venue: "", city: "", country: "Mauritius",
  genre: "", image: "", image_alt: "", description: "", artists: "",
  featured: false, sold_out: false,
};

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function AdminEventNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<EventForm>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof EventForm, v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v, ...(k === "title" && !p.slug ? { slug: slugify(v as string) } : {}) }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.event_date) { setError("Title and date are required"); return; }
    setSaving(true); setError(null);
    try {
      const res = await fetch(apiUrl("/api/admin/save-event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, artists: form.artists.split(",").map(a => a.trim()).filter(Boolean), slug: form.slug || slugify(form.title) }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/events");
    } catch { setError("Failed to save. Please try again."); }
    setSaving(false);
  };

  const inputCls = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Events</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Add New Event</h1>
        </div>
        <Link href="/admin/events" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">← Back</Link>
      </div>

      {error && <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-sm"><p className="text-[12px] text-red-400">{error}</p></div>}

      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Event Title *</label>
            <input type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="IREY FEST 2026" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">URL Slug</label>
            <input type="text" value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="irey-fest-2026" className={inputCls + " font-mono"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Date & Time *</label>
            <input type="datetime-local" value={form.event_date} onChange={e => set("event_date", e.target.value)} className={inputCls + " [color-scheme:dark]"} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Venue</label>
            <input type="text" value={form.venue} onChange={e => set("venue", e.target.value)} placeholder="Domaine Les Pailles" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">City</label>
            <input type="text" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Port Louis" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Country</label>
            <input type="text" value={form.country} onChange={e => set("country", e.target.value)} placeholder="Mauritius" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Genre</label>
            <input type="text" value={form.genre} onChange={e => set("genre", e.target.value)} placeholder="Festival / Reggae" className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Artists (comma separated)</label>
          <input type="text" value={form.artists} onChange={e => set("artists", e.target.value)} placeholder="JayDee, Nova Sound, Layla Moris" className={inputCls} />
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Description</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Event description..."
            className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Event Image</label>
          <ImageUpload value={form.image} onChange={url => set("image", url)} folder="events" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Image Alt Text</label>
          <input type="text" value={form.image_alt} onChange={e => set("image_alt", e.target.value)} placeholder="Describe the image" className={inputCls} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 border border-foreground/20 bg-foreground/5 rounded-sm" />
            <span className="text-[13px] text-foreground/60">Featured event</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.sold_out} onChange={e => set("sold_out", e.target.checked)} className="w-4 h-4 border border-foreground/20 bg-foreground/5 rounded-sm" />
            <span className="text-[13px] text-foreground/60">Sold out</span>
          </label>
        </div>

        <div className="pt-3 border-t border-foreground/8 flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50">
            {saving ? "Saving..." : "Add Event"}
          </button>
          <Link href="/admin/events" className="px-6 py-3 border border-foreground/10 text-foreground/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/20 transition-all">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
