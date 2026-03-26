"use client";
import React, { useState, useEffect, useRef } from "react";
import ImageField from "@/components/ui/ImageField";

interface GImg { id: string; src: string; alt: string; }

const DEFAULTS: GImg[] = [
  { id:"g1",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",         alt:"IREY PROD live event" },
  { id:"g2",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",         alt:"IREY PROD concert" },
  { id:"g3",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg",         alt:"IREY PROD artist on stage" },
  { id:"g4",  src:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",         alt:"IREY PROD event production" },
  { id:"g5",  src:"https://ireyprod.com/wp-content/uploads/2023/12/319291225_674505520974726_3683712000139163132_n.jpg", alt:"IREY PROD live music" },
  { id:"g6",  src:"https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg", alt:"IREY PROD outdoor concert" },
  { id:"g7",  src:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", alt:"IREY PROD festival" },
  { id:"g8",  src:"https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", alt:"IREY PROD artist" },
  { id:"g9",  src:"https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg", alt:"IREY PROD production" },
  { id:"g10", src:"https://ireyprod.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-21-at-12.32.07_43897a31.jpg",  alt:"IREY PROD backstage" },
];

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";

export default function AdminGalleryPage() {
  const [images, setImages]   = useState<GImg[]>(DEFAULTS);
  const [newUrl, setNewUrl]   = useState("");
  const [newAlt, setNewAlt]   = useState("");
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [toast,  setToast]    = useState<{msg:string;ok:boolean}|null>(null);
  const dragIdx = useRef<number|null>(null);

  const toast$ = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then(d=>{
      try {
        if (d.gallery_page_images) {
          const imgs = JSON.parse(d.gallery_page_images);
          if (Array.isArray(imgs) && imgs.length > 0) setImages(imgs);
        }
      } catch {}
    }).catch(()=>{});
  }, []);

  const saveImgs = async (imgs: GImg[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ gallery_page_images: JSON.stringify(imgs) }),
      });
      if (res.ok) { setSaved(true); setTimeout(()=>setSaved(false),3000); toast$("Gallery saved"); }
      else toast$("Failed to save", false);
    } catch { toast$("Error saving", false); }
    setSaving(false);
  };

  const addImage = () => {
    if (!newUrl.trim()) return;
    const updated = [...images, { id: Date.now().toString(), src: newUrl.trim(), alt: newAlt.trim() || "IREY PROD" }];
    setImages(updated); setNewUrl(""); setNewAlt("");
    saveImgs(updated);
  };

  const deleteImage = (id: string) => {
    if (images.length <= 1) { toast$("Must keep at least 1 image", false); return; }
    const updated = images.filter(i => i.id !== id);
    setImages(updated); saveImgs(updated);
  };

  const updateAlt = (id: string, alt: string) => setImages(p => p.map(i => i.id===id ? {...i,alt} : i));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${toast.ok?"bg-foreground/10 border-foreground/20 text-foreground":"bg-red-500/10 border-red-500/20 text-red-400"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Gallery</h1>
          <p className="text-[12px] text-foreground/40 mt-1">Images shown on the <a href="/gallery" target="_blank" rel="noreferrer" className="text-accent underline">/gallery page</a>. Drag to reorder.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/gallery" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={() => saveImgs(images)} disabled={saving}
            className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save Order"}
          </button>
        </div>
      </div>

      <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm mb-6">
        <p className="text-[11px] text-foreground/60">{images.length} images · Drag to reorder · Click × to delete · Edit alt text inline</p>
      </div>

      {/* Image list */}
      <div className="space-y-2 mb-8">
        {images.map((img, i) => (
          <div key={img.id} draggable
            onDragStart={() => { dragIdx.current = i; }}
            onDragOver={e => {
              e.preventDefault();
              const from = dragIdx.current;
              if (from === null || from === i) return;
              const a = [...images];
              const [m] = a.splice(from, 1);
              a.splice(i, 0, m);
              dragIdx.current = i;
              setImages(a);
            }}
            onDragEnd={() => { dragIdx.current = null; saveImgs(images); }}
            className="flex items-center gap-3 p-3 bg-foreground/[0.02] border border-foreground/8 rounded-sm cursor-grab active:cursor-grabbing group hover:border-foreground/20 transition-all">

            <div className="text-foreground/20 flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
              </svg>
            </div>

            <div className="w-16 h-12 flex-shrink-0 rounded-sm overflow-hidden bg-foreground/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-foreground/30 truncate mb-1">#{i+1} · {img.src}</p>
              <input value={img.alt} onChange={e => updateAlt(img.id, e.target.value)}
                onBlur={() => saveImgs(images)}
                placeholder="Alt text" className="w-full bg-transparent border-b border-foreground/10 text-[11px] text-foreground/60 focus:outline-none focus:border-foreground/30 pb-0.5 transition-colors"/>
            </div>

            <button onClick={() => deleteImage(img.id)} disabled={images.length <= 1}
              className="p-1.5 text-foreground/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 disabled:opacity-10">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Add New Image</p>
        <ImageField label="Image" value={newUrl} onChange={setNewUrl} hint="Upload a file or paste a URL"/>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-1.5">Alt Text</label>
          <input type="text" value={newAlt} onChange={e=>setNewAlt(e.target.value)}
            onKeyDown={e => e.key==="Enter" && addImage()}
            placeholder="Describe the image" className={IC}/>
        </div>
        <button onClick={addImage} disabled={!newUrl.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-40">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add to Gallery
        </button>
      </div>
    </div>
  );
}
