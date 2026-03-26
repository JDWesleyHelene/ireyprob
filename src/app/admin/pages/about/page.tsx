"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
const TA = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors resize-none";

type Tab = "hero"|"story"|"values"|"cta";

interface ValueItem { title:string; desc:string; }

const DEFAULT_VALUES: ValueItem[] = [
  { title:"Creativity",          desc:"We think outside the box to deliver unique, memorable experiences for every client and artist." },
  { title:"Integrity",           desc:"Trust is essential in any business relationship. We emphasise honesty, transparency, and ethical behaviour." },
  { title:"Client-Centric",      desc:"Placing the client's needs and satisfaction at the forefront is a key value." },
  { title:"Collaboration",       desc:"Effective collaboration is essential for success in the event and entertainment industry." },
  { title:"Professionalism",     desc:"Maintaining a high level of professionalism in all aspects of business." },
  { title:"Innovation",          desc:"Constantly seeking new and better ways to execute events and manage artists." },
  { title:"Passion",             desc:"A passion for creating memorable events and supporting artists is our driving force." },
  { title:"Attention to Detail", desc:"The success of an event often depends on meticulous planning and execution." },
];

export default function AdminAboutPage() {
  const [tab, setTab]         = useState<Tab>("hero");
  const [heroHeading, setHeroHeading] = useState("The One-Stop Agency You'll Ever Need");
  const [heroSub, setHeroSub] = useState("Relax & Take It Easy! IREY PROD is a dynamic and forward-thinking organisation based in Mauritius Island.");
  const [storyText1, setStoryText1] = useState("Our agency is a dynamic and forward-thinking organisation specialising in Digital Marketing, Stage and Artist Management, as well as Event Coordination.");
  const [storyText2, setStoryText2] = useState("Our mission is to create successful and fulfilling experiences — whether for clients hosting events or artists pursuing their careers.");
  const [storyHeading, setStoryHeading] = useState("About the Agency");
  const [valuesHeading, setValuesHeading] = useState("Our Values");
  const [values, setValues]   = useState<ValueItem[]>(DEFAULT_VALUES);
  const [ctaHeading, setCtaHeading] = useState("Ready to Work Together?");
  const [ctaSub, setCtaSub]   = useState("Let's create something extraordinary. Reach out today.");
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then(d=>{
      if (d.about_hero_heading)  setHeroHeading(d.about_hero_heading);
      if (d.about_hero_sub)      setHeroSub(d.about_hero_sub);
      if (d.about_story_heading) setStoryHeading(d.about_story_heading);
      if (d.about_story_text1)   setStoryText1(d.about_story_text1);
      if (d.about_story_text2)   setStoryText2(d.about_story_text2);
      if (d.about_values_heading)setValuesHeading(d.about_values_heading);
      if (d.about_cta_heading)   setCtaHeading(d.about_cta_heading);
      if (d.about_cta_sub)       setCtaSub(d.about_cta_sub);
      try { if (d.about_values)  setValues(JSON.parse(d.about_values)); } catch {}
    }).catch(()=>{});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        about_hero_heading: heroHeading, about_hero_sub: heroSub,
        about_story_heading: storyHeading, about_story_text1: storyText1, about_story_text2: storyText2,
        about_values_heading: valuesHeading, about_values: JSON.stringify(values),
        about_cta_heading: ctaHeading, about_cta_sub: ctaSub,
      })});
      if (res.ok) { setSaved(true); setTimeout(()=>setSaved(false),3000); }
    } catch {}
    setSaving(false);
  };

  const updateValue = (i:number, f:"title"|"desc", v:string) =>
    setValues(p=>p.map((x,j)=>j===i?{...x,[f]:v}:x));

  const TABS: {id:Tab;label:string}[] = [
    {id:"hero",   label:"Page Header"},
    {id:"story",  label:"Our Story"},
    {id:"values", label:"Values"},
    {id:"cta",    label:"CTA Section"},
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← All Pages</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">About Page</h1>
        </div>
        <div className="flex gap-3">
          <a href="/about" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={save} disabled={saving}
            className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save All"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border border-foreground/10 rounded-sm w-fit mb-8 overflow-hidden">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all ${tab===t.id?"bg-foreground text-background":"text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==="hero" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Page Header</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Main Heading</label>
            <input value={heroHeading} onChange={e=>setHeroHeading(e.target.value)} className={IC}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Subtext</label>
            <textarea value={heroSub} onChange={e=>setHeroSub(e.target.value)} rows={3} className={TA}/></div>
        </div>
      )}

      {tab==="story" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Our Story Section</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Section Heading</label>
            <input value={storyHeading} onChange={e=>setStoryHeading(e.target.value)} className={IC}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Paragraph 1</label>
            <textarea value={storyText1} onChange={e=>setStoryText1(e.target.value)} rows={4} className={TA}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Paragraph 2 (Mission)</label>
            <textarea value={storyText2} onChange={e=>setStoryText2(e.target.value)} rows={4} className={TA}/></div>
        </div>
      )}

      {tab==="values" && (
        <div className="space-y-4">
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5">
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Section Heading</label>
            <input value={valuesHeading} onChange={e=>setValuesHeading(e.target.value)} className={IC}/>
          </div>
          {values.map((v,i)=>(
            <div key={i} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-3">
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Title</label>
                <input value={v.title} onChange={e=>updateValue(i,"title",e.target.value)} className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Description</label>
                <textarea value={v.desc} onChange={e=>updateValue(i,"desc",e.target.value)} rows={2} className={TA}/></div>
            </div>
          ))}
        </div>
      )}

      {tab==="cta" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">CTA Section</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Heading</label>
            <input value={ctaHeading} onChange={e=>setCtaHeading(e.target.value)} className={IC}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Subtext</label>
            <textarea value={ctaSub} onChange={e=>setCtaSub(e.target.value)} rows={2} className={TA}/></div>
        </div>
      )}
    </div>
  );
}
