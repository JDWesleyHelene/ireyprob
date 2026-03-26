"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Service { id:string; service_number:string; title:string; tagline:string; description:string; image:string; features:string[]; }
interface WhyItem { title:string; desc:string; }

const DEFAULT_SERVICES: Service[] = [
  { id:"1", service_number:"01", title:"Bookings",    tagline:"Connecting Artists & Audiences",             description:"We connect world-class artists with venues, festivals, and private events across the Indian Ocean and beyond.",                                                                         image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",         features:["Artist sourcing & negotiation","Contract management","Rider coordination","Travel & logistics"] },
  { id:"2", service_number:"02", title:"Tours",       tagline:"Regional & International Tour Management",   description:"Comprehensive tour management for regional and international tours, handling everything from routing and scheduling to on-the-road support.",                                          image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",         features:["Tour routing & scheduling","Venue partnerships","Promotion & marketing","On-tour support"] },
  { id:"3", service_number:"03", title:"Events",      tagline:"End-to-End Event Production",                description:"End-to-end event production from concept to curtain call — we handle every detail so you can focus on the experience.",                                                               image:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", features:["Concept development","Venue sourcing","Artist curation","Technical production"] },
  { id:"4", service_number:"04", title:"Productions", tagline:"Stage & Digital Production",                 description:"Full-scale stage and digital production services — from sound and lighting design to video production and digital marketing campaigns.",                                               image:"https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", features:["Stage design & build","Sound & lighting","Video production","Digital marketing"] },
];
const DEFAULT_WHY: WhyItem[] = [
  { title:"Creativity",      desc:"We think outside the box to deliver unique, memorable experiences for every client and artist." },
  { title:"Professionalism", desc:"Punctuality, reliability, and a commitment to quality in every aspect of our work." },
  { title:"Passion",         desc:"A genuine passion for music and events drives everything we do — from the first call to the final bow." },
  { title:"Innovation",      desc:"We stay ahead of industry trends and embrace new technologies to deliver cutting-edge results." },
  { title:"Client-Centric",  desc:"Your needs come first. We tailor every service to meet and exceed your expectations." },
  { title:"Integrity",       desc:"Honest, transparent, and ethical in all our dealings — with clients, artists, and partners alike." },
];

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
const TA = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors resize-none";

type Tab = "hero"|"services"|"why"|"cta";

export default function AdminServicesPageEditor() {
  const [tab, setTab]           = useState<Tab>("hero");
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [whyItems, setWhyItems] = useState<WhyItem[]>(DEFAULT_WHY);
  const [heroHeading, setHeroHeading]   = useState("What We Do");
  const [heroSub,     setHeroSub]       = useState("IREY PROD is a multi-faceted agency operating in the entertainment and events industry.");
  const [whyHeading,  setWhyHeading]    = useState("Why Work With Us?");
  const [ctaHeading,  setCtaHeading]    = useState("We're Looking Forward to Starting Something New");
  const [ctaSub,      setCtaSub]        = useState("Whether it's a booking, a tour, an event, or a full production — we're ready to make it happen.");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [toast,  setToast]  = useState<string|null>(null);

  const toast$ = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then(d=>{
      if (d.services_hero_heading) setHeroHeading(d.services_hero_heading);
      if (d.services_hero_sub)     setHeroSub(d.services_hero_sub);
      if (d.services_why_heading)  setWhyHeading(d.services_why_heading);
      if (d.services_cta_heading)  setCtaHeading(d.services_cta_heading);
      if (d.services_cta_sub)      setCtaSub(d.services_cta_sub);
      try { if (d.services_cards)  setServices(JSON.parse(d.services_cards)); } catch {}
      try { if (d.services_why)    setWhyItems(JSON.parse(d.services_why)); } catch {}
    }).catch(()=>{});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        services_hero_heading: heroHeading, services_hero_sub: heroSub,
        services_why_heading: whyHeading,  services_cta_heading: ctaHeading, services_cta_sub: ctaSub,
        services_cards: JSON.stringify(services), services_why: JSON.stringify(whyItems),
      })});
      if (res.ok) { setSaved(true); setTimeout(()=>setSaved(false),3000); toast$("✓ Saved"); }
    } catch {}
    setSaving(false);
  };

  const updateService  = (i:number, f:keyof Service, v:string) => setServices(p=>p.map((s,j)=>j===i?{...s,[f]:v}:s));
  const updateFeature  = (si:number, fi:number, v:string) => setServices(p=>p.map((s,j)=>j===si?{...s,features:s.features.map((f,k)=>k===fi?v:f)}:s));
  const updateWhy      = (i:number, f:"title"|"desc", v:string) => setWhyItems(p=>p.map((w,j)=>j===i?{...w,[f]:v}:w));

  const TABS:{id:Tab;label:string}[] = [{id:"hero",label:"Page Header"},{id:"services",label:"4 Services"},{id:"why",label:"Why Us (6 cards)"},{id:"cta",label:"CTA Section"}];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">{toast}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← Page Content</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Services Page</h1>
        </div>
        <div className="flex gap-3">
          <a href="/services" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={save} disabled={saving} className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save All"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border border-foreground/10 rounded-sm w-fit mb-8 overflow-hidden">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all whitespace-nowrap ${tab===t.id?"bg-foreground text-background":"text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==="hero" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Page Header</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Main Heading</label>
            <input value={heroHeading} onChange={e=>setHeroHeading(e.target.value)} placeholder="What We Do" className={IC}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Subtext</label>
            <textarea value={heroSub} onChange={e=>setHeroSub(e.target.value)} rows={3} className={TA}/></div>
        </div>
      )}

      {tab==="services" && (
        <div className="space-y-6">
          <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm">
            <p className="text-[11px] text-foreground/60">Edit each service card. Paste any image URL to change the photo.</p>
          </div>
          {services.map((s,i)=>(
            <div key={s.id} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-[0.2em] text-accent">{s.service_number}</span>
                <span className="text-[13px] font-semibold text-foreground">{s.title}</span>
              </div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Title</label>
                <input value={s.title} onChange={e=>updateService(i,"title",e.target.value)} className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Tagline</label>
                <input value={s.tagline} onChange={e=>updateService(i,"tagline",e.target.value)} className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Description</label>
                <textarea value={s.description} onChange={e=>updateService(i,"description",e.target.value)} rows={3} className={TA}/></div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Image</label>
                <div className="flex gap-3 items-start">
                  {s.image && (
                    <div className="w-20 h-14 flex-shrink-0 rounded-sm overflow-hidden bg-foreground/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                    </div>
                  )}
                  <input value={s.image} onChange={e=>updateService(i,"image",e.target.value)} placeholder="https://example.com/image.jpg" className={IC}/>
                </div>
              </div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Features (4)</label>
                <div className="grid grid-cols-2 gap-2">
                  {s.features.map((f,fi)=>(
                    <input key={fi} value={f} onChange={e=>updateFeature(i,fi,e.target.value)} className={IC}/>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="why" && (
        <div className="space-y-4">
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5">
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Section Heading</label>
            <input value={whyHeading} onChange={e=>setWhyHeading(e.target.value)} className={IC}/>
          </div>
          {whyItems.map((w,i)=>(
            <div key={i} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-3">
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Title</label>
                <input value={w.title} onChange={e=>updateWhy(i,"title",e.target.value)} className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Description</label>
                <textarea value={w.desc} onChange={e=>updateWhy(i,"desc",e.target.value)} rows={2} className={TA}/></div>
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
            <textarea value={ctaSub} onChange={e=>setCtaSub(e.target.value)} rows={3} className={TA}/></div>
        </div>
      )}
    </div>
  );
}
