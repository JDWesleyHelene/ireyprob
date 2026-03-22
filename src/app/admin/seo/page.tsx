"use client";
import React, { useState, useEffect, useCallback } from "react";

interface SEO { site_title:string;site_description:string;og_title:string;og_description:string;google_analytics_id:string;meta_keywords:string;site_url:string; }
const DEF:SEO={ site_title:"IREY PROD — Booking Agency & Event Production | Mauritius Island", site_description:"IREY PROD is a dynamic booking agency and event production company based in Mauritius Island, specialising in Bookings, Tours, Events, and Productions.", og_title:"IREY PROD — Your Gateway to Unforgettable Experiences", og_description:"Booking agency & event production based in Mauritius Island.", google_analytics_id:"", meta_keywords:"IREY PROD, booking agency, Mauritius, events, concerts, artist management", site_url:"https://ireyprob.vercel.app" };
const IC="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";
const TA="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none";

export default function AdminSEOPage() {
  const [seo,setSeo]=useState<SEO>(DEF);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [err,setErr]=useState(false);

  useEffect(()=>{
    fetch("/api/admin/settings").then(r=>r.ok?r.json():null)
      .then(d=>{ if(d?.site_title) setSeo(p=>({...p,...d})); }).catch(()=>{});
  },[]);

  const set=useCallback((k:keyof SEO,v:string)=>setSeo(p=>({...p,[k]:v})),[]);

  const save=async()=>{
    setSaving(true);setErr(false);
    try {
      const res=await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(seo)});
      if(res.ok){setSaved(true);setTimeout(()=>setSaved(false),3000);}else setErr(true);
    }catch{setErr(true);}
    setSaving(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div><span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">SEO Settings</h1></div>
        <button onClick={save} disabled={saving} className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
          {saving?"Saving...":saved?"✓ Saved!":"Save Changes"}
        </button>
      </div>
      {err&&<div className="mb-4 p-4 border border-red-500/20 bg-red-500/5 rounded-sm"><p className="text-[12px] text-red-400">Failed to save. Check DB connection.</p></div>}
      <div className="space-y-5">
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">Meta Tags</p>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Site Title</label>
            <input type="text" value={seo.site_title} onChange={e=>set("site_title",e.target.value)} className={IC}/>
            <p className="text-[10px] text-foreground/25 mt-1">Appears in browser tab and search results</p></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Meta Description</label>
            <textarea value={seo.site_description} onChange={e=>set("site_description",e.target.value)} rows={3} className={TA}/>
            <p className="text-[10px] text-foreground/25 mt-1">150–160 characters recommended</p></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Meta Keywords</label>
            <input type="text" value={seo.meta_keywords} onChange={e=>set("meta_keywords",e.target.value)} className={IC}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Site URL</label>
            <input type="text" value={seo.site_url} onChange={e=>set("site_url",e.target.value)} className={IC}/></div>
        </div>
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">Social (Open Graph)</p>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">OG Title</label>
            <input type="text" value={seo.og_title} onChange={e=>set("og_title",e.target.value)} className={IC}/>
            <p className="text-[10px] text-foreground/25 mt-1">Title shown when shared on social media</p></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">OG Description</label>
            <textarea value={seo.og_description} onChange={e=>set("og_description",e.target.value)} rows={2} className={TA}/></div>
        </div>
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">Analytics</p>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Google Analytics ID</label>
            <input type="text" value={seo.google_analytics_id} onChange={e=>set("google_analytics_id",e.target.value)} placeholder="G-XXXXXXXXXX" className={IC}/>
            <p className="text-[10px] text-foreground/25 mt-1">Leave blank to disable</p></div>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button onClick={save} disabled={saving} className={`px-8 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
          {saving?"Saving...":saved?"✓ Saved!":"Save Changes"}
        </button>
      </div>
    </div>
  );
}
