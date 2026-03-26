"use client";
import React from "react";
import Link from "next/link";

const PAGES = [
  { id:"homepage", label:"Homepage",  href:"/admin/homepage",       desc:"Hero text, slider images",                     accent:true },
  { id:"about",    label:"About",     href:"/admin/pages/about",    desc:"Hero, our story, values, CTA" },
  { id:"services", label:"Services",  href:"/admin/pages/services", desc:"Hero, 4 service cards, why us, CTA" },
  { id:"contact",  label:"Contact",   href:"/admin/pages/contact",  desc:"Hero, form section, contact info" },
  { id:"bookings", label:"Artists",   href:"/admin/pages/bookings", desc:"Hero heading and subtitle" },
  { id:"events",   label:"Events",    href:"/admin/pages/events",   desc:"Hero heading and subtitle" },
  { id:"gallery",  label:"Gallery",   href:"/admin/gallery",        desc:"Add, remove, reorder gallery images" },
];

export default function AdminPagesIndex() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— CMS</span>
        <h1 className="font-display text-4xl font-extrabold italic text-foreground">Page Content</h1>
        <p className="text-[13px] text-foreground/40 mt-2">Edit every text and image on every page of your website.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        {PAGES.map(p => (
          <Link key={p.id} href={p.href}
            className={`group p-6 border rounded-sm transition-all ${p.accent ? "bg-accent/5 border-accent/20 hover:border-accent/40" : "bg-foreground/[0.02] border-foreground/8 hover:border-foreground/20 hover:bg-foreground/[0.04]"}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-[14px] font-semibold transition-colors ${p.accent ? "text-accent" : "text-foreground group-hover:text-accent"}`}>{p.label}</h3>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20 group-hover:text-foreground/40 mt-0.5 flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <p className="text-[12px] text-foreground/30">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
