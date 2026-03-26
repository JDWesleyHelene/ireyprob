"use client";
import React, { useEffect, useState } from "react";

interface Booking {
  id: number; artist_name: string; full_name: string;
  email: string; address: string; date_time: string;
  message?: string; created_at: string;
}

const PER_PAGE = 10;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast,    setToast]    = useState<{msg:string;ok:boolean}|null>(null);
  const [page,     setPage]     = useState(1);

  const toast$ = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/bookings")
      .then(r => r.ok ? r.json() : [])
      .then(d => { setBookings(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (b: Booking) => {
    if (!confirm(`Delete booking from "${b.full_name}"?`)) return;
    setDeleting(b.id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id }),
      });
      if (res.ok) {
        setBookings(p => p.filter(x => x.id !== b.id));
        if (selected?.id === b.id) setSelected(null);
        toast$("✓ Booking deleted");
        // Go back a page if current page is now empty
        const remaining = bookings.length - 1;
        if ((page - 1) * PER_PAGE >= remaining && page > 1) setPage(p => p - 1);
      } else { toast$("Failed to delete", false); }
    } catch { toast$("Error", false); }
    setDeleting(null);
  };

  const totalPages = Math.ceil(bookings.length / PER_PAGE);
  const paginated  = bookings.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${toast.ok?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":"bg-red-500/10 border-red-500/20 text-red-400"}`}>
          {toast.msg}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={()=>setSelected(null)}>
          <div className="bg-[#0a0a0a] border border-foreground/10 rounded-sm w-full max-w-lg p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-extrabold italic text-foreground">Booking Detail</h2>
              <button onClick={()=>setSelected(null)} className="text-foreground/30 hover:text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <dl className="space-y-4">
              {[["Artist", selected.artist_name], ["Name", selected.full_name], ["Email", selected.email],
                ["Venue", selected.address||"—"], ["Event Date", selected.date_time ? new Date(selected.date_time).toLocaleString("en-GB") : "—"],
                ["Received", new Date(selected.created_at).toLocaleDateString("en-GB")]
              ].map(([k,v])=>(
                <div key={k}>
                  <dt className="text-[10px] text-foreground/30 uppercase tracking-widest mb-0.5">{k}</dt>
                  <dd className="text-[13px] text-foreground/70">{v}</dd>
                </div>
              ))}
              {selected.message && (
                <div>
                  <dt className="text-[10px] text-foreground/30 uppercase tracking-widest mb-1">Message</dt>
                  <dd className="text-[13px] text-foreground/70 leading-relaxed whitespace-pre-wrap">{selected.message}</dd>
                </div>
              )}
            </dl>
            <div className="mt-6 flex gap-3">
              <a href={`mailto:${selected.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all">
                Reply by Email
              </a>
              <button onClick={()=>handleDelete(selected)} disabled={deleting===selected.id}
                className="px-4 py-3 border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-40">
                {deleting===selected.id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Inbox</span>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Booking Requests</h1>
          {bookings.length > 0 && <p className="text-[12px] text-foreground/30 mt-1">{bookings.length} total</p>}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-foreground/5 rounded-sm animate-pulse"/>)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 border border-foreground/8 rounded-sm">
          <p className="text-foreground/30 text-[13px] mb-2">No booking requests yet.</p>
          <p className="text-foreground/20 text-[11px]">Submissions from the <a href="/bookings" className="underline hover:text-foreground/40">/bookings</a> page will appear here.</p>
        </div>
      ) : (
        <>
          <div className="border border-foreground/8 rounded-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/8 bg-foreground/[0.02]">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Client</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Artist</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Event Date</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Received</th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(b => (
                  <tr key={b.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-[13px] text-foreground/80 font-medium">{b.full_name}</p>
                      <p className="text-[11px] text-foreground/30">{b.email}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell"><span className="text-[12px] text-foreground/50">{b.artist_name}</span></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[12px] text-foreground/40">{b.date_time ? new Date(b.date_time).toLocaleDateString("en-GB") : "—"}</span></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[11px] text-foreground/25">{new Date(b.created_at).toLocaleDateString("en-GB")}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={()=>setSelected(b)}
                          className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-foreground/15 rounded-sm text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all">
                          View
                        </button>
                        <button onClick={()=>handleDelete(b)} disabled={deleting===b.id}
                          className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-red-500/20 rounded-sm text-red-400/50 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-30">
                          {deleting===b.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-foreground/5">
              <p className="text-[11px] text-foreground/30">
                Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, bookings.length)} of {bookings.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  className="px-3 py-1.5 text-[11px] border border-foreground/10 rounded-sm text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-20">
                  ← Prev
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>setPage(n)}
                    className={`w-8 h-8 text-[11px] font-semibold rounded-sm transition-all ${page===n?"bg-foreground text-background":"border border-foreground/10 text-foreground/40 hover:text-foreground hover:border-foreground/30"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  className="px-3 py-1.5 text-[11px] border border-foreground/10 rounded-sm text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-20">
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
