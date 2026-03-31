"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

interface Partner { id: string; name: string; logo: string; }

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";

export default function AdminPartnersPage() {
  const [partners,  setPartners]  = useState<Partner[]>([]);
  const [heading,   setHeading]   = useState("Our Partners");
  const [subtext,   setSubtext]   = useState("Trusted by the best in the industry");
  const [newName,   setNewName]   = useState("");
  const [newLogo,   setNewLogo]   = useState("");
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [toast,     setToast]     = useState<string | null>(null);
  const dragIdx  = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const toast$ = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.ok ? r.json() : {}).then((d: Record<string, string>) => {
      if (d.partners_list)    { try { const p = JSON.parse(d.partners_list); if (Array.isArray(p)) setPartners(p); } catch {} }
      if (d.partners_heading) setHeading(d.partners_heading);
      if (d.partners_subtext) setSubtext(d.partners_subtext);
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partners_list:    JSON.stringify(partners),
          partners_heading: heading,
          partners_subtext: subtext,
        }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); toast$("✓ Saved"); }
    } catch {}
    setSaving(false);
  };

  const addPartner = () => {
    if (!newName.trim() || !newLogo.trim()) return;
    setPartners(p => [...p, { id: Date.now().toString(), name: newName.trim(), logo: newLogo.trim() }]);
    setNewName(""); setNewLogo("");
  };

  const removePartner = (id: string) => setPartners(p => p.filter(x => x.id !== id));

  // Drag to reorder
  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragEnter = (i: number) => { dragOver.current = i; };
  const onDragEnd   = () => {
    const from = dragIdx.current; const to = dragOver.current;
    if (from === null || to === null || from === to) { dragIdx.current = null; dragOver.current = null; return; }
    const list = [...partners];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setPartners(list);
    dragIdx.current = null; dragOver.current = null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">{toast}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← Page Content</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Our Partners</h1>
          <p className="text-[12px] text-foreground/40 mt-1">Logos shown in the marquee on the homepage</p>
        </div>
        <button onClick={save} disabled={saving}
          className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-foreground text-background hover:bg-accent"}`}>
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save"}
        </button>
      </div>

      {/* Section text */}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-4 mb-6">
        <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Section Text</h2>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Heading</label>
          <input value={heading} onChange={e => setHeading(e.target.value)} placeholder="Our Partners" className={IC}/>
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Subtext</label>
          <input value={subtext} onChange={e => setSubtext(e.target.value)} placeholder="Trusted by the best in the industry" className={IC}/>
        </div>
      </div>

      {/* Partner list */}
      {partners.length > 0 && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-foreground/8 flex justify-between items-center">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Partners ({partners.length})</p>
            <p className="text-[10px] text-foreground/25">Drag to reorder</p>
          </div>
          <div className="divide-y divide-foreground/5">
            {partners.map((p, i) => (
              <div key={p.id}
                draggable onDragStart={() => onDragStart(i)} onDragEnter={() => onDragEnter(i)}
                onDragEnd={onDragEnd} onDragOver={e => e.preventDefault()}
                className="flex items-center gap-4 px-5 py-3 hover:bg-foreground/[0.02] cursor-grab active:cursor-grabbing">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/20 flex-shrink-0">
                  <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
                  <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
                  <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
                </svg>
                {/* Logo preview */}
                <div className="w-16 h-10 flex items-center justify-center bg-foreground/5 rounded-sm flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain grayscale" style={{ maxWidth: "56px", maxHeight: "36px" }}/>
                </div>
                <span className="text-[13px] text-foreground/70 flex-1 truncate">{p.name}</span>
                <button onClick={() => removePartner(p.id)}
                  className="text-red-400/40 hover:text-red-400 transition-colors flex-shrink-0 p-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new partner */}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-4">
        <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Add Partner</h2>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Partner Name</label>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Radio Plus" className={IC}
            onKeyDown={e => e.key === "Enter" && addPartner()}/>
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Logo</label>
          <ImageUpload value={newLogo} onChange={setNewLogo}/>
        </div>
        <button onClick={addPartner} disabled={!newName.trim() || !newLogo.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-40">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Partner
        </button>
        <p className="text-[10px] text-foreground/25">Upload logo to Cloudinary first via the image uploader above — all logos are shown at the same size (120×56px) in the marquee.</p>
      </div>
    </div>
  );
}
