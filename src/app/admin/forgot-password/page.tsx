"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show success — don't reveal if email exists
      setDone(true);
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none"/>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png" alt="IREY PROD"
            style={{ height:"52px", width:"auto", margin:"0 auto 20px" }}/>
          <h1 className="font-display text-3xl font-extrabold italic text-foreground mb-1">Forgot Password</h1>
          <p className="text-[12px] text-foreground/40 tracking-[0.15em]">Enter your email to receive a reset link</p>
        </div>

        {done ? (
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-emerald-400/30 flex items-center justify-center mx-auto">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground mb-1">Check your inbox</p>
              <p className="text-[12px] text-foreground/40">
                If <span className="text-accent">{email}</span> is registered, you'll receive a reset link shortly.
              </p>
            </div>
            <p className="text-[11px] text-foreground/25">The link expires in 1 hour.</p>
            <Link href="/admin" className="block text-[11px] text-foreground/40 hover:text-foreground transition-colors mt-4">
              ← Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-8 space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-sm">
                <p className="text-[12px] text-red-400">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                placeholder="your@email.com"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
              ) : "Send Reset Link"}
            </button>
            <Link href="/admin" className="block text-center text-[11px] text-foreground/30 hover:text-foreground transition-colors">
              ← Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
