"use client";
import React from "react";
import Link from "next/link";

export default function AdminEditPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light italic text-foreground">Edit — Phase 2</h1>
      </div>
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-8 text-center">
        <h2 className="font-display text-2xl font-light italic text-foreground mb-3">Full CMS in Phase 2</h2>
        <p className="text-[13px] text-foreground/40 font-light max-w-md mx-auto leading-relaxed mb-6">
          Individual record editing will be available when the MySQL database is connected. For now, edit content in <code className="bg-foreground/10 px-1 rounded text-foreground/50">src/lib/data.ts</code>.
        </p>
        <Link href="/admin/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}
