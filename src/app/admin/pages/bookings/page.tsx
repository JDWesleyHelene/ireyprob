"use client";
import RichTextEditor from "@/components/ui/RichTextEditor";
import React,{useState,useEffect} from "react";
import Link from "next/link";
const IC="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
const TA="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors resize-none";
export default function AdminPageEditor(){
  const PAGE="bookings";
  const [heading,setHeading]=useState(PAGE==="bookings"?"Our Artists":"Live Events");
  const [sub,setSub]=useState(PAGE==="bookings"?"Discover our roster of talented artists available for bookings.":"Discover our latest events, shows, and experiences.");
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then(d=>{
      if(d[PAGE+"_hero_heading"])setHeading(d[PAGE+"_hero_heading"]);
      if(d[PAGE+"_hero_sub"])setSub(d[PAGE+"_hero_sub"]);
    }).catch(()=>{});
  },[]);
  const save=async()=>{
    setSaving(true);
    try{const res=await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({[PAGE+"_hero_heading"]:heading,[PAGE+"_hero_sub"]:sub})});
    if(res.ok){setSaved(true);setTimeout(()=>setSaved(false),3000);}}catch{}setSaving(false);
  };
  return(
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← Page Content</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Artists Page</h1>
        </div>
        <div className="flex gap-3">
          <a href="/bookings" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={save} disabled={saving} className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save"}
          </button>
        </div>
      </div>
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
        <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Page Header</h2>
        <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Main Heading</label><input value={heading} onChange={e=>setHeading(e.target.value)} className={IC}/></div>
        <RichTextEditor label="Subtext" value={sub} onChange={setSub} rows={3}/>
      </div>
    </div>
  );
}
