"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const PAGES = [
  { id:"about",    label:"About",    href:"/admin/pages/about",    desc:"Hero heading, mission, values, team" },
  { id:"services", label:"Services", href:"/admin/pages/services", desc:"Service descriptions, why us section" },
  { id:"contact",  label:"Contact",  href:"/admin/pages/contact",  desc:"Page heading, form labels, info section" },
  { id:"bookings", label:"Artists",  href:"/admin/pages/bookings", desc:"Page heading and subtitle" },
  { id:"events",   label:"Events",   href:"/admin/pages/events",   desc:"Page heading and subtitle" },
];

export default function AdminPagesIndex() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— CMS</span>
        <h1 className="font-display text-4xl font-extrabold italic text-foreground">Page Content</h1>
        <p className="text-[13px] text-foreground/40 mt-2">Edit text content on every page of your website.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {PAGES.map(p=>(
          <Link key={p.id} href={p.href}
            className="group p-6 bg-foreground/[0.02] border border-foreground/8 rounded-sm hover:border-foreground/20 hover:bg-foreground/[0.04] transition-all">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">{p.label}</h3>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20 group-hover:text-foreground/40 mt-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <p className="text-[12px] text-foreground/30">{p.desc}</p>
          </Link>
        ))}
        <Link href="/admin/homepage"
          className="group p-6 bg-accent/5 border border-accent/20 rounded-sm hover:border-accent/40 transition-all">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[14px] font-semibold text-accent">Homepage</h3>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/40 mt-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <p className="text-[12px] text-foreground/30">Hero text, slider images</p>
        </Link>
      </div>
    </div>
  );
}
