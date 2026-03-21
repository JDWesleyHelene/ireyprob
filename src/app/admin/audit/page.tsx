"use client";
import React, { useEffect, useState } from "react";

interface AuditEntry { id: number; action: string; resource: string; user: string; created_at: string; details?: string; }

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/get-audit.php")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const actionColor = (a: string) => {
    if (a.includes("create") || a.includes("publish")) return "text-emerald-400/70 border-emerald-400/20 bg-emerald-400/5";
    if (a.includes("delete")) return "text-red-400/70 border-red-400/20 bg-red-400/5";
    if (a.includes("update") || a.includes("edit")) return "text-blue-400/70 border-blue-400/20 bg-blue-400/5";
    return "text-foreground/40 border-foreground/10 bg-foreground/5";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
        <h1 className="font-display text-4xl font-light italic text-foreground">Audit Log</h1>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-foreground/5 rounded-sm animate-pulse" />)}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 border border-foreground/8 rounded-sm">
          <p className="text-foreground/30 text-[13px] mb-2">No activity logged yet.</p>
          <p className="text-foreground/20 text-[11px]">Actions like creating artists, publishing news, and saving settings will appear here.</p>
        </div>
      ) : (
        <div className="border border-foreground/8 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/8 bg-foreground/[0.02]">
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Action</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Resource</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Details</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase border rounded-sm ${actionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell"><span className="text-[12px] text-foreground/50">{log.resource}</span></td>
                  <td className="px-5 py-3 hidden lg:table-cell"><span className="text-[12px] text-foreground/40 font-light">{log.details || "—"}</span></td>
                  <td className="px-5 py-3"><span className="text-[11px] text-foreground/25">{new Date(log.created_at).toLocaleString("en-GB")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
