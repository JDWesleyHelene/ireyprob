"use client";
import React, { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiConfig";

interface Contact { id?: number; name: string; email: string; budget?: string; timeframe?: string; project: string; created_at: string; }

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    fetch(apiUrl("/api/admin/get-contacts.php"))
      .then(r => r.ok ? r.json() : [])
      .then(data => { setContacts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[#0a0a0a] border border-foreground/10 rounded-sm w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-light italic text-foreground">Enquiry Detail</h2>
              <button onClick={() => setSelected(null)} className="text-foreground/30 hover:text-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
            </div>
            <dl className="space-y-4">
              {[["Name", selected.name], ["Email", selected.email], ["Budget", selected.budget || "Not specified"], ["Timeframe", selected.timeframe || "Not specified"], ["Received", new Date(selected.created_at).toLocaleDateString("en-GB")]].map(([k, v]) => (
                <div key={k}><dt className="text-[10px] text-foreground/30 uppercase tracking-widest mb-0.5">{k}</dt><dd className="text-[13px] text-foreground/70">{v}</dd></div>
              ))}
              <div><dt className="text-[10px] text-foreground/30 uppercase tracking-widest mb-1">Project</dt><dd className="text-[13px] text-foreground/70 leading-relaxed whitespace-pre-wrap">{selected.project}</dd></div>
            </dl>
            <a href={`mailto:${selected.email}`}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
              Reply by Email
            </a>
          </div>
        </div>
      )}

      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Inbox</span>
        <h1 className="font-display text-4xl font-light italic text-foreground">Contact Enquiries</h1>
      </div>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-foreground/5 rounded-sm animate-pulse" />)}</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 border border-foreground/8 rounded-sm">
          <p className="text-foreground/30 text-[13px] mb-2">No contact enquiries yet.</p>
          <p className="text-foreground/20 text-[11px]">Submissions from the <a href="/contact" className="underline hover:text-foreground/40">/contact</a> page will appear here.</p>
        </div>
      ) : (
        <div className="border border-foreground/8 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-foreground/[0.02]">
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">From</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Budget</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Received</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={i} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                  <td className="px-5 py-4">
                    <p className="text-[13px] text-foreground/80 font-medium">{c.name}</p>
                    <p className="text-[11px] text-foreground/30">{c.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[12px] text-foreground/40">{c.budget || "—"}</span></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><span className="text-[11px] text-foreground/25">{new Date(c.created_at).toLocaleDateString("en-GB")}</span></td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-foreground/15 rounded-sm text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all duration-200">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
