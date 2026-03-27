"use client";
import RichTextEditor from "@/components/ui/RichTextEditor";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ImageField from "@/components/ui/ImageField";

interface Settings { hero_headline_1:string; hero_headline_2:string; hero_subtext:string; slider_images:string; }
interface Img { src:string; alt:string; }

const DEFAULT_IMGS: Img[] = [
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",         alt:"IREY PROD live event" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",         alt:"IREY PROD concert" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg",         alt:"IREY PROD artist on stage" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",         alt:"IREY PROD event production" },
  { src:"https://ireyprod.com/wp-content/uploads/2023/12/319291225_674505520974726_3683712000139163132_n.jpg", alt:"IREY PROD live music" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg", alt:"IREY PROD outdoor concert" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", alt:"IREY PROD festival" },
  { src:"https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", alt:"IREY PROD artist" },
  { src:"https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg", alt:"IREY PROD production" },
  { src:"https://ireyprod.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-21-at-12.32.07_43897a31.jpg",  alt:"IREY PROD backstage" },
];

const DEF: Settings = {
  hero_headline_1: "Your Gateway to",
  hero_headline_2: "Unforgettable Experiences.",
  hero_subtext: "IREY PROD — A dynamic agency specialising in Digital Marketing, Stage & Artist Management, and Event Coordination. Based in Mauritius Island.",
  slider_images: JSON.stringify(DEFAULT_IMGS),
};

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";
const TA = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none";

export default function AdminHomepagePage() {
  const [s, setS]           = useState<Settings>(DEF);
  const [imgs, setImgs]     = useState<Img[]>(DEFAULT_IMGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [err, setErr]       = useState(false);
  const [tab, setTab]       = useState<"hero" | "slider">("hero");
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const dragIdxRef = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.ok ? r.json() : null).then(d => {
      if (d && Object.keys(d).length > 0) {
        setS(p => ({ ...p, ...d }));
        try {
          const i = JSON.parse(d.slider_images || "");
          if (Array.isArray(i) && i.length > 0) setImgs(i);
        } catch {}
      }
    }).catch(() => {});
  }, []);

  const set = useCallback((k: keyof Settings, v: string) => setS(p => ({ ...p, [k]: v })), []);

  const saveImgs = (i: Img[]) => {
    setImgs(i);
    setS(p => ({ ...p, slider_images: JSON.stringify(i) }));
  };

  const addImg  = () => { if (!newUrl.trim()) return; saveImgs([...imgs, { src: newUrl.trim(), alt: newAlt.trim() || "IREY PROD event" }]); setNewUrl(""); setNewAlt(""); };
  const delImg  = (i: number) => { if (imgs.length <= 1) { alert("Must keep at least 1 image."); return; } saveImgs(imgs.filter((_, j) => j !== i)); };
  const updImg  = (i: number, f: "src" | "alt", v: string) => saveImgs(imgs.map((img, j) => j === i ? { ...img, [f]: v } : img));

  const save = async () => {
    setSaving(true); setErr(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, slider_images: JSON.stringify(imgs) }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else setErr(true);
    } catch { setErr(true); }
    setSaving(false);
  };

  const TABS = [
    { id: "hero"   as const, label: "Hero & Text" },
    { id: "slider" as const, label: `Slider (${imgs.length})` },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Site Content</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Homepage Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </a>
          <button onClick={save} disabled={saving}
            className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-foreground text-background hover:bg-accent"}`}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {err && (
        <div className="mb-4 p-4 border border-red-500/20 bg-red-500/5 rounded-sm">
          <p className="text-[12px] text-red-400">Failed to save. Check Neon DB connection.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border border-foreground/10 rounded-sm w-fit mb-6 overflow-hidden">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all whitespace-nowrap ${tab === t.id ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {tab === "hero" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          {(["hero_headline_1", "hero_headline_2"] as const).map((k, i) => (
            <div key={k}>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">
                {i === 0 ? "Hero Headline — Line 1" : "Hero Headline — Line 2"}
              </label>
              <input type="text" value={s[k]} onChange={e => set(k, e.target.value)} className={IC} />
            </div>
          ))}
          <RichTextEditor label="Hero Subtext" value={s.hero_subtext} onChange={v => set("hero_subtext", v)} rows={4}/>
        </div>
      )}

      {/* Slider Tab */}
      {tab === "slider" && (
        <div className="space-y-4">
          <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm">
            <p className="text-[12px] text-accent/80 font-medium mb-1">Homepage Slideshow</p>
            <p className="text-[11px] text-foreground/50">Drag to reorder. Add, edit or delete images. Always keep at least 1. Hit Save Changes to apply.</p>
          </div>

          {/* Image list */}
          <div className="space-y-2">
            {imgs.map((img, i) => (
              <div key={i} draggable
                onDragStart={() => { dragIdxRef.current = i; }}
                onDragOver={e => {
                  e.preventDefault();
                  const from = dragIdxRef.current;
                  if (from === null || from === i) return;
                  const a = [...imgs];
                  const [m] = a.splice(from, 1);
                  a.splice(i, 0, m);
                  dragIdxRef.current = i;
                  setImgs(a);
                  setS(p => ({ ...p, slider_images: JSON.stringify(a) }));
                }}
                onDragEnd={() => { dragIdxRef.current = null; }}
                className="bg-foreground/[0.02] border border-foreground/8 rounded-sm overflow-hidden cursor-grab active:cursor-grabbing hover:border-foreground/20 transition-all">
                {editIdx === i ? (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-1.5">Image URL</label>
                      <input type="url" value={img.src} onChange={e => updImg(i, "src", e.target.value)} className={IC} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-1.5">Alt Text</label>
                      <input type="text" value={img.alt} onChange={e => updImg(i, "alt", e.target.value)} className={IC} />
                    </div>
                    <button onClick={() => setEditIdx(null)}
                      className="px-4 py-2 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-16 h-10 flex-shrink-0 rounded-sm overflow-hidden bg-foreground/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-foreground/60 truncate">{img.src}</p>
                      <p className="text-[10px] text-foreground/30 truncate mt-0.5">{img.alt}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] text-foreground/20 mr-1">#{i + 1}</span>
                      <div className="p-1.5 text-foreground/20 cursor-grab" title="Drag to reorder">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                          <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                          <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
                        </svg>
                      </div>
                      <button onClick={() => setEditIdx(i)}
                        className="px-2.5 py-1.5 border border-blue-400/20 rounded-sm text-blue-400/60 hover:text-blue-400 hover:border-blue-400/40 transition-all text-[10px] font-semibold tracking-widest uppercase">
                        Edit
                      </button>
                      <button onClick={() => delImg(i)} disabled={imgs.length <= 1}
                        className="px-2.5 py-1.5 border border-red-500/20 rounded-sm text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all text-[10px] font-semibold tracking-widest uppercase disabled:opacity-20">
                        Del
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add new */}
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Add New Image</p>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-1.5">Image URL *</label>
              <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://example.com/image.jpg" className={IC} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-1.5">Alt Text</label>
              <input type="text" value={newAlt} onChange={e => setNewAlt(e.target.value)} placeholder="Description of the image" className={IC} />
            </div>
            <button onClick={addImg} disabled={!newUrl.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
