"use client";
import React from "react";
import Link from "next/link";

export default function AdminTicketsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
        <h1 className="font-display text-4xl font-light italic text-foreground">Tickets</h1>
      </div>
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 border border-foreground/10 rounded-sm flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/30">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-2xl font-light italic text-foreground mb-2">Ticket Sales — Phase 2</h2>
            <p className="text-[13px] text-foreground/50 leading-relaxed mb-4">
              Online ticket sales with Stripe payments will be available in Phase 2 when the MySQL database is connected.
              For now, event enquiries go through the contact form.
            </p>
            <p className="text-[13px] text-foreground/50 leading-relaxed">
              Phase 2 ticket features will include: ticket tiers, quantity limits, sales dashboard, PDF ticket generation, and check-in scanning.
            </p>
          </div>
        </div>
        <div className="border-t border-foreground/8 pt-5 flex gap-3">
          <Link href="/admin/events" className="px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
            Manage Events
          </Link>
          <Link href="/admin/bookings" className="px-5 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
