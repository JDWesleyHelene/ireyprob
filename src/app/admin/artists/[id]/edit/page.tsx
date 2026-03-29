"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { ArtistSocialEditor } from "@/components/ui/ArtistSocialLinks";

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";
const sl = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function EditArtistPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [f, setF]   = useState({ name:"", genre:"", origin:"", bio:"", image:"", image_alt:"", slug:"", tags:"", featured:false });
  const [slugEditing, setSlugEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<{platform:string;url:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState<string|null>(null);

  useEffect(() => {
    fetch(`/api/admin/artists/${id}`).then(r=>r.ok?r.json():null).then(a => {
      if (a) { setF({ name:a.name||"", genre:a.genre||"", origin:a.origin||"", bio:a.bio||"", image:a.image||"", image_alt:a.imageAlt||"", slug: sl(a.slug||a.name||""), tags: Array.isArray(a.tags)?a.tags.join(", "):(a.tags||""), featured:Boolean(a.featured) }); setSocialLinks(Array.isArray(a.socialLinks)?a.socialLinks:[]); }
      else setError("Artist not found");
      setLoading(false);
    }).catch(() => { setError("Failed to load"); setLoading(false); });
  }, [id]);

  const set = (k: string, v: string|boolean) => {
    setF(p => {
      const updated = { ...p, [k]: v };
      if (k === "slug") updated.slug = sl(v as string);
      return updated;
    });
  };

  const save = async () => {
    if (!f.name.trim()) { setError("Name is required"); return; }
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, tags: f.tags.split(",").map(t=>t.trim()).filter(Boolean), slug: f.slug || sl(f.name), socialLinks }),,
      });
      if (!res.ok) throw new Error();
      setSaved(true); setTimeout(()=>setSaved(false), 3000);
    } catch { setError("Failed to save."); }
    setSaving(false);
  };

  if (loading) return <div className="p-8"><p className="text-foreground/40 text-[13px]">Loading...</p></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      {saved && <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-sm text-[12px] text-emerald-400 font-medium">✓ Saved!</div>}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Artists</span>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Edit Artist</h1>
        </div>
        <Link href="/admin/artists" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">← Back</Link>
      </div>

      {error && <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-sm"><p className="text-[12px] text-red-400">{error}</p></div>}

      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">

        {/* Name */}
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Artist Name *</label>
          <input type="text" value={f.name} onChange={e=>set("name",e.target.value)} className={IC}/>
        </div>

        {/* Slug — read-only with edit toggle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">URL Slug</label>
            <button type="button" onClick={()=>setSlugEditing(p=>!p)}
              className="text-[10px] font-semibold tracking-[0.15em] uppercase text-accent/60 hover:text-accent transition-colors">
              {slugEditing ? "✓ Done" : "✎ Edit"}
            </button>
          </div>
          <div className="flex items-center gap-2 bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3">
            <span className="text-[12px] text-foreground/25 font-mono flex-shrink-0">/bookings/</span>
            {slugEditing ? (
              <input
                type="text"
                value={f.slug}
                onChange={e=>set("slug", e.target.value)}
                className="flex-1 bg-transparent text-[13px] text-foreground font-mono focus:outline-none min-w-0"
                autoFocus
              />
            ) : (
              <span className="flex-1 text-[13px] text-foreground font-mono">{f.slug}</span>
            )}
          </div>
          <p className="text-[10px] text-foreground/25 mt-1">
            {slugEditing ? "Editing — only lowercase letters, numbers and hyphens." : "Read-only. Click Edit to change the URL."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Genre</label>
            <input type="text" value={f.genre} onChange={e=>set("genre",e.target.value)} className={IC}/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Origin</label>
            <input type="text" value={f.origin} onChange={e=>set("origin",e.target.value)} className={IC}/>
          </div>
        </div>

        <div>
          <RichTextEditor label="Biography" value={f.bio} onChange={v=>set("bio",v)} rows={6}/>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Tags (comma separated)</label>
          <input type="text" value={f.tags} onChange={e=>set("tags",e.target.value)} placeholder="Reggae, World, Afrobeats" className={IC}/>
          <p className="text-[10px] text-foreground/25 mt-1">Appear as filters on Artists page</p>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Artist Photo</label>
          <ImageUpload value={f.image} onChange={url=>set("image",url)} folder="artists"/>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Image Alt Text</label>
          <input type="text" value={f.image_alt} onChange={e=>set("image_alt",e.target.value)} placeholder="Artist performing on stage" className={IC}/>
        </div>

        <ArtistSocialEditor value={socialLinks} onChange={setSocialLinks}/>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="feat" checked={f.featured} onChange={e=>set("featured",e.target.checked)} className="w-4 h-4 border border-foreground/20 bg-foreground/5 rounded-sm cursor-pointer"/>
          <label htmlFor="feat" className="text-[13px] text-foreground/60 cursor-pointer">Featured artist (shown on homepage)</label>
        </div>

        <div className="pt-3 border-t border-foreground/8 flex gap-3">
          <button onClick={save} disabled={saving}
            className={`flex-1 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved!":"Save Changes"}
          </button>
          <Link href="/admin/artists" className="px-6 py-3 border border-foreground/10 text-foreground/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/20 transition-all">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
