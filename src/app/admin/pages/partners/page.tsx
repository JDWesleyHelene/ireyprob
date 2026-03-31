"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Partner { id: string; name: string; logo: string; }

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [heading,  setHeading]  = useState("Our Partners");
  const [subtext,  setSubtext]  = useState("Trusted by the best in the industry");
  const [newName,  setNewName]  = useState("");
  const [newLogo,  setNewLogo]  = useState("");
  const [uploading,setUploading]= useState(false);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState<{msg:string;ok:boolean}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIdx  = useRef<number|null>(null);
  const dragOver = useRef<number|null>(null);

  const toast$ = (msg: string, ok = true) => { setToast({msg,ok}); setTimeout(() => setToast(null), 3500); };

  // Load on mount
  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.ok ? r.json() : {})
      .then((d: Record<string,string>) => {
        if (d.partners_heading) setHeading(d.partners_heading);
        if (d.partners_subtext) setSubtext(d.partners_subtext);
        if (d.partners_speed)  setSpeed(Math.max(5, Math.min(60, Number(d.partners_speed))));
        if (d.partners_logo_w)  setLogoW(Math.max(40, Math.min(300, Number(d.partners_logo_w))));
        if (d.partners_logo_h)  setLogoH(Math.max(20, Math.min(200, Number(d.partners_logo_h))));
        if (d.partners_list) {
          try {
            const parsed = JSON.parse(d.partners_list);
            if (Array.isArray(parsed)) setPartners(parsed);
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Upload logo to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast$("Not an image", false); return; }
    if (file.size > 2 * 1024 * 1024) { toast$("Max 2MB", false); return; }

    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch("/api/admin/upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataUrl, filename: file.name }),
      });
      const result = await resp.json();
      if (!resp.ok) { toast$(result.error || "Upload failed", false); }
      else { setNewLogo(result.url); toast$("✓ Logo uploaded"); }
    } catch { toast$("Upload failed", false); }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addPartner = () => {
    if (!newName.trim()) { toast$("Enter a partner name", false); return; }
    if (!newLogo.trim()) { toast$("Upload or paste a logo URL", false); return; }
    const partner: Partner = { id: `p_${Date.now()}`, name: newName.trim(), logo: newLogo.trim() };
    setPartners(prev => [...prev, partner]);
    setNewName("");
    setNewLogo("");
    toast$("✓ Partner added — remember to Save");
  };

  const removePartner = (id: string) => setPartners(prev => prev.filter(p => p.id !== id));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partners_heading: heading,
          partners_subtext: subtext,
          partners_speed:   String(speed),
          partners_logo_w:  String(logoW),
          partners_logo_h:  String(logoH),
          partners_list:    JSON.stringify(partners),
        }),
      });
      if (res.ok) toast$("✓ Saved successfully");
      else toast$("Failed to save", false);
    } catch { toast$("Failed to save", false); }
    setSaving(false);
  };

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
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${toast.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← Page Content</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Partners</h1>
          <p className="text-[12px] text-foreground/40 mt-1">Logos marquee shown on the homepage</p>
        </div>
        <div className="flex gap-2 items-center">
          <a href="/" target="_blank" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={save} disabled={saving}
            className="px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50">
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Section text */}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-4 mb-6">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Section Text</p>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Heading</label>
          <input value={heading} onChange={e => setHeading(e.target.value)} placeholder="Our Partners" className={IC}/>
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Subtext</label>
          <input value={subtext} onChange={e => setSubtext(e.target.value)} placeholder="Trusted by the best in the industry" className={IC}/>
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">
            Scroll Speed — {speed}s per loop <span className="text-foreground/25 normal-case font-normal">(lower = faster)</span>
          </label>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-foreground/30">Fast</span>
            <input type="range" min="5" max="60" step="1" value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="flex-1 accent-accent"/>
            <span className="text-[11px] text-foreground/30">Slow</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">
            Logo Size <span className="text-foreground/25 normal-case font-normal">(width × height in px)</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[10px] text-foreground/30 mb-1">Width</label>
              <div className="flex items-center gap-2">
                <input type="number" min="40" max="300" value={logoW}
                  onChange={e => setLogoW(Math.max(40, Math.min(300, Number(e.target.value))))}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-foreground/30"/>
                <span className="text-[11px] text-foreground/30">px</span>
              </div>
            </div>
            <span className="text-foreground/30 text-lg mt-4">×</span>
            <div className="flex-1">
              <label className="block text-[10px] text-foreground/30 mb-1">Height</label>
              <div className="flex items-center gap-2">
                <input type="number" min="20" max="200" value={logoH}
                  onChange={e => setLogoH(Math.max(20, Math.min(200, Number(e.target.value))))}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-foreground/30"/>
                <span className="text-[11px] text-foreground/30">px</span>
              </div>
            </div>
            {/* Live preview */}
            <div className="flex-shrink-0 mt-4">
              <div className="bg-foreground/5 border border-foreground/10 rounded-sm flex items-center justify-center"
                style={{ width: `${Math.min(logoW, 120)}px`, height: `${Math.min(logoH, 60)}px` }}>
                <span className="text-[9px] text-foreground/25">{logoW}×{logoH}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current partners */}
      {partners.length > 0 && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-foreground/8 flex justify-between">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">{partners.length} Partner{partners.length !== 1 ? "s" : ""}</p>
            <p className="text-[10px] text-foreground/25">Drag to reorder</p>
          </div>
          {partners.map((p, i) => (
            <div key={p.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              className="flex items-center gap-4 px-5 py-3 border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] cursor-grab active:cursor-grabbing">
              {/* Handle */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-foreground/20 flex-shrink-0">
                <circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/>
                <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
                <circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>
              </svg>
              {/* Logo preview */}
              <div className="w-16 h-10 bg-foreground/5 rounded-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" style={{maxWidth:"56px",maxHeight:"36px"}}/>
              </div>
              <span className="text-[13px] text-foreground/70 flex-1 truncate">{p.name}</span>
              <button onClick={() => removePartner(p.id)} className="text-red-400/40 hover:text-red-400 transition-colors p-1 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {partners.length === 0 && (
        <div className="border border-dashed border-foreground/10 rounded-sm py-10 text-center mb-6">
          <p className="text-[13px] text-foreground/30">No partners yet. Add your first one below.</p>
        </div>
      )}

      {/* Add new */}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Add New Partner</p>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Partner Name *</label>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Radio Plus, MBC, Top FM..."
            className={IC}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newName && newLogo) addPartner(); } }}/>
        </div>

        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Logo *</label>

          {/* Upload button */}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/>
          <div className="flex gap-2 mb-2">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all disabled:opacity-40">
              {uploading
                ? <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading...</>
                : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>Upload Logo</>
              }
            </button>
            <span className="text-[11px] text-foreground/30 self-center">or paste URL below</span>
          </div>

          <input value={newLogo} onChange={e => setNewLogo(e.target.value)}
            placeholder="https://res.cloudinary.com/... or paste URL"
            className={IC}/>

          {/* Preview */}
          {newLogo && (
            <div className="mt-2 w-24 h-14 bg-foreground/5 border border-foreground/10 rounded-sm flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={newLogo} alt="Preview" className="max-w-full max-h-full object-contain" style={{maxWidth:"80px",maxHeight:"48px"}}/>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={addPartner}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Partner
        </button>

        <p className="text-[10px] text-foreground/25">All logos are shown at the same size (120×56px) in the marquee. Use PNG with transparent background for best results.</p>
      </div>
    </div>
  );
}
