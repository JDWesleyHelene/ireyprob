"use client";
import React, { useState } from "react";

export default function AdminSettingsPage() {
  const [newPass, setNewPass] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!newPass || newPass.length < 8) { alert("Password must be at least 8 characters"); return; }
    // In production, update the constant in admin/page.tsx and redeploy
    alert(`New password set: "${newPass}"\n\nIMPORTANT: Update ADMIN_PASSWORD in src/app/admin/page.tsx and rebuild the project.`);
    setSaved(true);
    setNewPass("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Configuration</span>
        <h1 className="font-display text-4xl font-light italic text-foreground">Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-5">Admin Password</h2>
          <div className="mb-4">
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-2">New Password</label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
              className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              placeholder="Min. 8 characters" />
          </div>
          <button onClick={handleSave}
            className="px-6 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
            Update Password
          </button>
          {saved && <p className="text-[11px] text-accent/70 mt-3">✓ Update the ADMIN_PASSWORD constant in <code className="bg-foreground/10 px-1 rounded">src/app/admin/page.tsx</code> then rebuild.</p>}
        </div>

        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">Site Info</h2>
          <dl className="space-y-3">
            {[["Version", "Phase 1 — Static + PHP"],["Database", "File-based (JSON)"],["Auth", "Session password"],["Next Step", "Phase 2 — MySQL + full CMS"]].map(([k,v]) => (
              <div key={k} className="flex gap-4"><dt className="text-[11px] text-foreground/30 w-28 flex-shrink-0">{k}</dt><dd className="text-[12px] text-foreground/60">{v}</dd></div>
            ))}
          </dl>
        </div>

        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">Quick Links</h2>
          <div className="space-y-2">
            {[["View Website", "/"],["View Bookings Page", "/bookings"],["View Events", "/events"],["View News", "/news"]].map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer"
                className="flex items-center justify-between px-4 py-3 border border-foreground/8 rounded-sm hover:border-foreground/20 hover:bg-foreground/5 transition-all duration-200 group">
                <span className="text-[12px] text-foreground/60 group-hover:text-foreground transition-colors">{label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/20"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
