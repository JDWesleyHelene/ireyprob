"use client";
import React, { useState, useEffect, useCallback } from "react";

interface SEOSettings {
  site_title: string;
  site_description: string;
  og_title: string;
  og_description: string;
  google_analytics_id: string;
  meta_keywords: string;
  site_url: string;
}

const defaults: SEOSettings = {
  site_title: "IREY PROD — Booking Agency & Event Production | Mauritius Island",
  site_description: "IREY PROD is a dynamic booking agency and event production company based in Mauritius Island, specialising in Bookings, Tours, Events, and Productions.",
  og_title: "IREY PROD — Your Gateway to Unforgettable Experiences",
  og_description: "Booking agency & event production based in Mauritius Island.",
  google_analytics_id: "",
  meta_keywords: "IREY PROD, booking agency, Mauritius, events, concerts, artist management",
  site_url: "https://new.ireyprod.com",
};

const inputCls  = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";
const textareaCls = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none";

export default function AdminSEOPage() {
  const [seo, setSeo]         = useState<SEOSettings>(defaults);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    fetch("/api/admin/get-settings.php")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.site_title) setSeo(prev => ({ ...prev, ...data }));
        else {
          try {
            const local = localStorage.getItem("irey_settings");
            if (local) { const d = JSON.parse(local); if (d.site_title) setSeo(prev => ({ ...prev, ...d })); }
          } catch {}
        }
      })
      .catch(() => {
        try {
          const local = localStorage.getItem("irey_settings");
          if (local) { const d = JSON.parse(local); if (d.site_title) setSeo(prev => ({ ...prev, ...d })); }
        } catch {}
      });
  }, []);

  const handleChange = useCallback((key: keyof SEOSettings, value: string) => {
    setSeo(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save-settings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch {
      try { localStorage.setItem("irey_settings", JSON.stringify(seo)); setSaved(true); setTimeout(() => setSaved(false), 3000); } catch {}
    }
    setSaving(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">SEO Settings</h1>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-foreground text-background hover:bg-accent"}`}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-5">
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">Meta Tags</p>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Site Title</label>
            <input type="text" value={seo.site_title} onChange={e => handleChange("site_title", e.target.value)} className={inputCls} />
            <p className="text-[10px] text-foreground/25 mt-1">Appears in browser tab and search results</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Meta Description</label>
            <textarea value={seo.site_description} onChange={e => handleChange("site_description", e.target.value)} rows={3} className={textareaCls} />
            <p className="text-[10px] text-foreground/25 mt-1">150–160 characters recommended for best SEO</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Meta Keywords</label>
            <input type="text" value={seo.meta_keywords} onChange={e => handleChange("meta_keywords", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Site URL</label>
            <input type="text" value={seo.site_url} onChange={e => handleChange("site_url", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">Social (Open Graph)</p>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">OG Title</label>
            <input type="text" value={seo.og_title} onChange={e => handleChange("og_title", e.target.value)} className={inputCls} />
            <p className="text-[10px] text-foreground/25 mt-1">Title shown when shared on Facebook, WhatsApp, etc.</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">OG Description</label>
            <textarea value={seo.og_description} onChange={e => handleChange("og_description", e.target.value)} rows={2} className={textareaCls} />
          </div>
        </div>

        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold">Analytics</p>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Google Analytics ID</label>
            <input type="text" value={seo.google_analytics_id} onChange={e => handleChange("google_analytics_id", e.target.value)} placeholder="G-XXXXXXXXXX" className={inputCls} />
            <p className="text-[10px] text-foreground/25 mt-1">Leave blank to disable Google Analytics</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className={`px-8 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-foreground text-background hover:bg-accent"}`}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
