"use client";
import React, { useState, useEffect, Suspense } from "react";
import { toCloudUrl } from "@/lib/imageUrl";
import { useRouter, useSearchParams } from "next/navigation";

function AcceptInviteForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const token       = params.get("token") || "";
  const email       = params.get("email") || "";

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid or expired invite link."); setLoading(false); return; }
      setDone(true);
      setTimeout(() => router.push("/admin"), 2500);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  if (!token || !email) return (
    <div className="text-center">
      <p className="text-red-400 text-[14px]">Invalid invite link.</p>
    </div>
  );

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src=toCloudUrl("https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png") alt="IREY PROD"
          style={{ height: "56px", width: "auto", margin: "0 auto 20px" }}/>
        <h1 className="font-display text-3xl font-extrabold italic text-foreground mb-1">Set Your Password</h1>
        <p className="text-[13px] text-foreground/50">You've been invited to <strong className="text-foreground">IREY PROD</strong> Dashboard</p>
        <p className="text-[12px] text-accent mt-1">{email}</p>
      </div>

      {done ? (
        <div className="text-center p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-sm">
          <div className="w-12 h-12 rounded-full border border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p className="text-emerald-400 font-semibold mb-1">Password set!</p>
          <p className="text-foreground/40 text-[12px]">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-sm">
              <p className="text-[12px] text-red-400">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">New Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}
              placeholder="Minimum 8 characters"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-foreground/30"/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Confirm Password</label>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required
              placeholder="Repeat your password"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-foreground/30"/>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Setting password...</>
            ) : "Set Password & Login"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none"/>
      <Suspense fallback={<div className="text-foreground/30 text-[13px]">Loading...</div>}>
        <AcceptInviteForm />
      </Suspense>
    </div>
  );
}
