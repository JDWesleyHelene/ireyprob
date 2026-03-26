"use client";
import React,{useState,useEffect} from "react";
import Link from "next/link";
const IC="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
const TA="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors resize-none";
export default function AdminContactPage(){
  const [heroHeading,setHeroHeading]=useState("Let's Start Right Now!");
  const [heroSub,setHeroSub]=useState("Got a project in mind? Fill out the form and we'll get back within 48 hours.");
  const [heroBg,setHeroBg]=useState("https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg");
  const [formHeading,setFormHeading]=useState("Make an Online Enquiry");
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then(d=>{
      if(d.contact_hero_heading)setHeroHeading(d.contact_hero_heading);
      if(d.contact_hero_sub)setHeroSub(d.contact_hero_sub);
      if(d.contact_hero_bg)setHeroBg(d.contact_hero_bg);
      if(d.contact_form_heading)setFormHeading(d.contact_form_heading);
    }).catch(()=>{});
  },[]);
  const save=async()=>{
    setSaving(true);
    try{const res=await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contact_hero_heading:heroHeading,contact_hero_sub:heroSub,contact_hero_bg:heroBg,contact_form_heading:formHeading})});
    if(res.ok){setSaved(true);setTimeout(()=>setSaved(false),3000);}}catch{}setSaving(false);
  };
  return(
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← Page Content</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Contact Page</h1>
        </div>
        <div className="flex gap-3">
          <a href="/contact" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={save} disabled={saving} className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save"}
          </button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Hero Section</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Heading</label><input value={heroHeading} onChange={e=>setHeroHeading(e.target.value)} className={IC}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Subtext</label><textarea value={heroSub} onChange={e=>setHeroSub(e.target.value)} rows={3} className={TA}/></div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Background Image</label>
            <div className="flex gap-3 items-start">
              {heroBg&&<div className="w-20 h-14 flex-shrink-0 rounded-sm overflow-hidden bg-foreground/5">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={heroBg} alt="bg" className="w-full h-full object-cover"/></div>}
              <input value={heroBg} onChange={e=>setHeroBg(e.target.value)} placeholder="https://example.com/image.jpg" className={IC}/>
            </div>
          </div>
        </div>
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Form Section</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Form Heading</label><input value={formHeading} onChange={e=>setFormHeading(e.target.value)} className={IC}/></div>
        </div>
      </div>
    </div>
  );
}
