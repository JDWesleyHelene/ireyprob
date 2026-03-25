"use client";
import React,{useState,useEffect,useCallback} from "react";
import Link from "next/link";
const IC="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
const TA="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors resize-none";
export default function AdminPage(){
  const PAGE="events";
  const FIELDS:Array<{key:string;label:string;type?:string;placeholder?:string}> = PAGE==="services"?[
    {key:"services_hero_label",label:"Page Label",placeholder:"Services"},
    {key:"services_hero_heading",label:"Page Heading",placeholder:"What We Do"},
    {key:"services_hero_sub",label:"Page Subtext",type:"textarea",placeholder:"IREY PROD operates across four core service pillars..."},
    {key:"services_why_heading",label:"'Why Work With Us' Heading",placeholder:"Why Work With Us?"},
    {key:"services_cta_heading",label:"CTA Heading",placeholder:"We're Looking Forward to Starting Something New"},
    {key:"services_cta_sub",label:"CTA Subtext",type:"textarea",placeholder:"Whether it's a booking, a tour, an event, or a full production..."},
  ]:PAGE==="contact"?[
    {key:"contact_hero_label",label:"Page Label",placeholder:"Contact"},
    {key:"contact_hero_heading",label:"Page Heading",placeholder:"Get In Touch"},
    {key:"contact_hero_sub",label:"Page Subtext",type:"textarea",placeholder:"Whether it's a booking enquiry, a collaboration proposal..."},
    {key:"contact_form_heading",label:"Form Section Heading",placeholder:"Make an Online Enquiry"},
    {key:"contact_info_heading",label:"Info Section Heading",placeholder:"Other Ways to Reach Us"},
  ]:PAGE==="bookings"?[
    {key:"bookings_hero_label",label:"Page Label",placeholder:"Bookings"},
    {key:"bookings_hero_heading",label:"Page Heading",placeholder:"Our Artists"},
    {key:"bookings_hero_sub",label:"Page Subtext",type:"textarea",placeholder:"Discover our roster of talented artists available for bookings..."},
  ]:[
    {key:"events_hero_label",label:"Page Label",placeholder:"Events"},
    {key:"events_hero_heading",label:"Page Heading",placeholder:"Upcoming Events"},
    {key:"events_hero_sub",label:"Page Subtext",type:"textarea",placeholder:"Discover the latest events produced and managed by IREY PROD..."},
  ];
  const [s,setS]=useState<Record<string,string>>({});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then(d=>{
      if(d&&Object.keys(d).length>0)setS(p=>({...p,...d}));
    }).catch(()=>{});
  },[]);
  const set=useCallback((k:string,v:string)=>setS(p=>({...p,[k]:v})),[]);
  const save=async()=>{
    setSaving(true);
    try{const res=await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});
    if(res.ok){setSaved(true);setTimeout(()=>setSaved(false),3000);}}catch{}
    setSaving(false);
  };
  const pageLabel=PAGE.charAt(0).toUpperCase()+PAGE.slice(1);
  const previewHref="/"+PAGE;
  return(
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← All Pages</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">{pageLabel} Page</h1>
        </div>
        <div className="flex gap-3">
          <a href={previewHref} target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 transition-all">Preview</a>
          <button onClick={save} disabled={saving} className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save"}
          </button>
        </div>
      </div>
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
        <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Page Content</h2>
        {FIELDS.map(f=>(
          <div key={f.key}>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">{f.label}</label>
            {f.type==="textarea"?
              <textarea value={s[f.key]||""} onChange={e=>set(f.key,e.target.value)} rows={3} placeholder={f.placeholder} className={TA}/>:
              <input type="text" value={s[f.key]||""} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder} className={IC}/>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
