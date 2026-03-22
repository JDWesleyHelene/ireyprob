"use client";
import React, { useEffect, useState } from "react";

interface Booking { id?: number; artist_name: string; full_name: string; email: string; address: string; date_time: string; message?: string; created_at: string; }

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Inbox</span>
        <h1 className="font-display text-4xl font-light italic text-foreground">Booking Requests</h1>
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-foreground/5 rounded-sm animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 border border-foreground/8 rounded-sm">
          <p className="text-foreground/30 text-[13px] mb-2">No booking requests yet.</p>
          <p className="text-foreground/20 text-[11px]">Submissions from the <a href="/bookings" className="underline hover:text-foreground/40">/bookings</a> page will appear here.</p>
        </div>
      ) : (
        <div className="border border-foreground/8 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-foreground/[0.02]">
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Client</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Artist</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Event Date</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Received</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-[13px] text-foreground/80 font-medium">{b.full_name}</p>
                    <p className="text-[11px] text-foreground/30">{b.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="text-[12px] text-foreground/50">{b.artist_name}</span></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[12px] text-foreground/40">{b.date_time ? new Date(b.date_time).toLocaleDateString("en-GB") : "—"}</span></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[11px] text-foreground/25">{new Date(b.created_at).toLocaleDateString("en-GB")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
