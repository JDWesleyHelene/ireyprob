"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppImage from "@/components/ui/AppImage";

const ADMIN_PASSWORD = "IreyProd2026!"; // Change this after deploy

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = sessionStorage.getItem("irey_admin");
      if (session === "authenticated") {
        router.replace("/admin/dashboard");
        return;
      }
    }
    setChecking(false);
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // small delay for UX
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("irey_admin", "authenticated");
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center">
        <svg className="animate-spin w-5 h-5 text-foreground/40" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none flex justify-between px-8 md:px-24">
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d1" /></div>
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden hidden md:block"><div className="beam beam-d2" /></div>
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d3" /></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-foreground/10 rounded-sm mb-6 bg-foreground/[0.02]">
            <AppImage src="/assets/images/IREY-PROD-BLACK-1773496673088.png" alt="IREY PROD logo" width={40} height={40} className="object-contain invert" />
          </div>
          <h1 className="font-display text-3xl font-light italic text-foreground mb-1">Admin Panel</h1>
          <p className="text-[12px] text-foreground/30 tracking-[0.2em] uppercase">IREY PROD · Content Management</p>
        </div>

        <form onSubmit={handleLogin} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-8">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-sm">
              <p className="text-[12px] text-red-400">{error}</p>
            </div>
          )}
          <div className="mb-8">
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required autoFocus
              className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors"
              placeholder="••••••••••"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</>
            ) : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-6 text-[11px] text-foreground/20">Restricted access — authorised personnel only</p>
      </div>
    </div>
  );
}
