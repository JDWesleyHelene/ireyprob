"use client";
import React,{useState,useEffect,useCallback} from "react";
import Link from "next/link";
const IC="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
const TA="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors resize-none";
const DEF:Record<string,string>={
  about_hero_label:"About IREY PROD",
  about_hero_heading:"We Are IREY PROD.",
  about_hero_sub:"A dynamic agency based in Mauritius Island, specialising in Bookings, Tours, Events, and Productions.",
  about_mission_heading:"Our Mission",
  about_mission_text:"To be the leading booking and event production agency in the Indian Ocean region, connecting world-class artists with unforgettable experiences.",
  about_vision_heading:"Our Vision",
  about_vision_text:"Building a vibrant entertainment ecosystem in Mauritius and beyond — one event at a time.",
  about_cta_heading:"Ready to Work Together?",
  about_cta_sub:"Let's create something extraordinary.",
};
export default function AdminAboutPage(){
  const [s,setS]=useState<Record<string,string>>(DEF);
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
  const fields=[
    {section:"Hero",fields:[["about_hero_label","Page Label","About IREY PROD"],["about_hero_heading","Main Heading","We Are IREY PROD."],[null,"about_hero_sub","Subtext","","textarea"]]},
    {section:"Mission & Vision",fields:[["about_mission_heading","Mission Heading","Our Mission"],[null,"about_mission_text","Mission Text","","textarea"],["about_vision_heading","Vision Heading","Our Vision"],[null,"about_vision_text","Vision Text","","textarea"]]},
    {section:"CTA Section",fields:[["about_cta_heading","CTA Heading","Ready to Work Together?"],["about_cta_sub","CTA Subtext","Let's create something extraordinary."]]},
  ];
  return(
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← All Pages</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">About Page</h1>
        </div>
        <div className="flex gap-3">
          <a href="/about" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 transition-all">Preview</a>
          <button onClick={save} disabled={saving} className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save"}
          </button>
        </div>
      </div>
      <div className="space-y-8">
        {fields.map(section=>(
          <div key={section.section} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
            <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">{section.section}</h2>
            {section.fields.map((f:any)=>{
              const [key,label,placeholder,_,type]=Array.isArray(f)?f:[f[0],f[1],f[2],null,null];
              const k=key||f[1];
              return(
                <div key={k}>
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">{label}</label>
                  {type==="textarea"?
                    <textarea value={s[k]||""} onChange={e=>set(k,e.target.value)} rows={3} placeholder={placeholder} className={TA}/>:
                    <input type="text" value={s[k]||""} onChange={e=>set(k,e.target.value)} placeholder={placeholder} className={IC}/>
                  }
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
