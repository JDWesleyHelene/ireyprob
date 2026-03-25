"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppImage from "@/components/ui/AppImage";

// Super admin credentials — stored here for simplicity (Neon-less auth)
// In production these would be bcrypt-hashed in DB
const SUPER_ADMIN = { email: "info@wesleyhelene.com", password: "Wesley101291", name: "Wesley" };

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState<string|null>(null);
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = sessionStorage.getItem("irey_admin");
      if (session) { router.replace("/admin/dashboard"); return; }
    }
    setChecking(false);
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    if (email.trim().toLowerCase() === SUPER_ADMIN.email.toLowerCase() && password === SUPER_ADMIN.password) {
      const sessionData = JSON.stringify({ email: SUPER_ADMIN.email, name: SUPER_ADMIN.name, role: "super_admin" });
      sessionStorage.setItem("irey_admin", sessionData);
      if (remember) localStorage.setItem("irey_admin_remember", sessionData);
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    }
  };

  if (checking) return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center">
      <svg className="animate-spin w-5 h-5 text-foreground/30" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none"/>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-foreground/10 rounded-sm mb-6 bg-foreground/[0.02]">
            <AppImage src="https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png" alt="IREY PROD" width={40} height={40} className="object-contain"/>
          </div>
          <h1 className="font-display text-3xl font-light italic text-foreground mb-1">Admin Panel</h1>
          <p className="text-[12px] text-foreground/30 tracking-[0.2em] uppercase">IREY PROD · Content Management</p>
        </div>
        <form onSubmit={handleLogin} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-8 space-y-5">
          {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-sm"><p className="text-[12px] text-red-400">{error}</p></div>}
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors"/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors"/>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="remember" checked={remember} onChange={e=>setRemember(e.target.checked)}
              className="w-4 h-4 bg-foreground/5 border border-foreground/20 rounded-sm cursor-pointer accent-foreground"/>
            <label htmlFor="remember" className="text-[12px] text-foreground/40 cursor-pointer select-none">Remember me</label>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>) : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-6 text-[11px] text-foreground/20">Restricted access — authorised personnel only</p>
      </div>
    </div>
  );
}
