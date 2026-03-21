"use client";
import React, { useState } from "react";
import Link from "next/link";
import { services as staticServices } from "@/lib/data";

export default function AdminServicesPage() {
  const [services] = useState(staticServices);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Services</h1>
        </div>
        <Link href="/services" target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Preview
        </Link>
      </div>
      <div className="mb-4 p-4 border border-accent/20 bg-accent/5 rounded-sm">
        <p className="text-[12px] text-accent/80 font-medium mb-1">Phase 1 — Static Data</p>
        <p className="text-[11px] text-foreground/40">Edit services in <code className="bg-foreground/10 px-1 rounded text-foreground/60">src/lib/data.ts</code>. Full CMS editing available in Phase 2.</p>
      </div>
      <div className="border border-foreground/8 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-foreground/8 bg-foreground/[0.02]">
            <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">#</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Service</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Tagline</th>
          </tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                <td className="px-5 py-4"><span className="font-display text-2xl font-light italic text-foreground/20">{s.service_number}</span></td>
                <td className="px-5 py-4"><p className="text-[13px] text-foreground/80 font-medium">{s.title}</p></td>
                <td className="px-5 py-4 hidden md:table-cell"><p className="text-[12px] text-foreground/40">{s.tagline}</p></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
