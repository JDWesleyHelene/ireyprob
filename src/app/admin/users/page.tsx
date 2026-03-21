"use client";
import React, { useState } from "react";

export default function AdminUsersPage() {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!newPass || newPass.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (newPass !== confirmPass) { setError("Passwords do not match"); return; }
    setError("");
    setSaved(true);
    setNewPass(""); setConfirmPass("");
    alert(`New password: "${newPass}"\n\nTo apply: update ADMIN_PASSWORD in src/app/admin/page.tsx then rebuild.`);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
        <h1 className="font-display text-4xl font-light italic text-foreground">Users & Access</h1>
      </div>

      <div className="space-y-5">
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-5">Current Admin Account</h2>
          <div className="flex items-center gap-4 p-4 border border-foreground/8 rounded-sm">
            <div className="w-10 h-10 rounded-sm bg-foreground/10 flex items-center justify-center">
              <span className="text-foreground/60 font-semibold text-[12px]">A</span>
            </div>
            <div>
              <p className="text-[13px] text-foreground/70 font-medium">Administrator</p>
              <p className="text-[11px] text-foreground/30">booking@ireyprod.com · Admin role</p>
            </div>
            <span className="ml-auto px-2 py-0.5 text-[9px] tracking-widest uppercase bg-accent/10 text-accent/70 border border-accent/20 rounded-sm">Active</span>
          </div>
        </div>

        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-5">Change Admin Password</h2>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-sm"><p className="text-[12px] text-red-400">{error}</p></div>}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">New Password</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min. 8 characters"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Confirm Password</label>
              <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Repeat password"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors" />
            </div>
            <button onClick={handleSave}
              className="px-6 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all">
              {saved ? "✓ Password Updated" : "Update Password"}
            </button>
            {saved && <p className="text-[11px] text-accent/70">Update <code className="bg-foreground/10 px-1 rounded">ADMIN_PASSWORD</code> in <code className="bg-foreground/10 px-1 rounded">src/app/admin/page.tsx</code> and rebuild.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
