"use client";
import React, { useState, useEffect } from "react";
import { toCloudUrl } from "@/lib/imageUrl";
import Link from "next/link";
import ImageField from "@/components/ui/ImageField";
import RichTextEditor from "@/components/ui/RichTextEditor";

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";

type Tab = "hero"|"contact"|"form";

export default function AdminContactPageEditor() {
  const [tab, setTab]                   = useState<Tab>("hero");
  const [heroHeading, setHeroHeading]   = useState("Let's Start Right Now!");
  const [heroSub,     setHeroSub]       = useState("Got a project in mind? Fill out the form and we'll get back within 48 hours.");
  const [heroBg,      setHeroBg]        = useState(toCloudUrl("https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg"));
  const [formHeading, setFormHeading]   = useState("Make an Online Enquiry");
  // Contact info
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [toast,  setToast]  = useState<string|null>(null);

  const toast$ = (msg: string) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then((d:Record<string,string>) => {
      if (d.contact_hero_heading) setHeroHeading(d.contact_hero_heading);
      if (d.contact_hero_sub)     setHeroSub(d.contact_hero_sub);
      if (d.contact_hero_bg)      setHeroBg(d.contact_hero_bg);
      if (d.contact_form_heading) setFormHeading(d.contact_form_heading);
    }).catch(()=>{});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          contact_hero_heading: heroHeading,
          contact_hero_sub:     heroSub,
          contact_hero_bg:      heroBg,
          contact_form_heading: formHeading,
        }),
      });
      if (res.ok) { setSaved(true); setTimeout(()=>setSaved(false),3000); toast$("✓ Saved"); }
    } catch {}
    setSaving(false);
  };

  const TABS: {id:Tab;label:string}[] = [
    {id:"hero",    label:"Hero Section"},
    {id:"contact", label:"Contact Info"},
    {id:"form",    label:"Form Section"},
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">{toast}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← Page Content</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Contact Page</h1>
        </div>
        <div className="flex gap-3">
          <a href="/contact" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={save} disabled={saving}
            className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save All"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border border-foreground/10 rounded-sm w-fit mb-8 overflow-hidden">
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all whitespace-nowrap ${tab===t.id?"bg-foreground text-background":"text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Hero ── */}
      {tab==="hero" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Hero Section</h2>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Main Heading</label>
            <input value={heroHeading} onChange={e=>setHeroHeading(e.target.value)} className={IC}/>
          </div>
          <RichTextEditor label="Subtext" value={heroSub} onChange={setHeroSub} rows={3}/>
          <ImageField label="Background Image" value={heroBg} onChange={setHeroBg}/>
        </div>
      )}

      {/* ── Contact Info ── */}
      {tab==="contact" && (
        <div className="space-y-5">
          <div className="p-6 border border-foreground/8 bg-foreground/[0.02] rounded-sm flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1">Managed in Settings</p>
                <p className="text-[12px] text-foreground/50 leading-relaxed">Phone, email, office hours, address and social media links are all managed centrally in <strong className="text-foreground/80">Settings → Contact Info</strong>. Changes there update the contact page and footer automatically.</p>
              </div>
            </div>
            <Link href="/admin/settings?tab=contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all w-fit">
              Go to Settings → Contact Info
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      )}

      {/* ── Form ── */}
      {tab==="form" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Enquiry Form Section</h2>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Form Heading</label>
            <input value={formHeading} onChange={e=>setFormHeading(e.target.value)} placeholder="Make an Online Enquiry" className={IC}/>
          </div>
        </div>
      )}
    </div>
  );
}
