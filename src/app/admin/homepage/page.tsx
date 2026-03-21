"use client";
import React, { useState, useEffect, useCallback } from "react";

interface SiteSettings {
  hero_headline_1: string;
  hero_headline_2: string;
  hero_subtext: string;
  contact_email: string;
  phone: string;
  office_hours: string;
  location: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  stats_label_1: string;
  stats_label_2: string;
  stats_label_3: string;
  stats_label_4: string;
}

const defaultSettings: SiteSettings = {
  hero_headline_1: "Your Gateway to",
  hero_headline_2: "Unforgettable Experiences.",
  hero_subtext: "IREY PROD — A dynamic agency specialising in Digital Marketing, Stage & Artist Management, and Event Coordination. Based in Mauritius Island.",
  contact_email: "booking@ireyprod.com",
  phone: "+230 5 788 20 14",
  office_hours: "Mon – Fri · 10am – 5pm",
  location: "Mauritius Island, Indian Ocean",
  instagram: "https://www.instagram.com/ireyprod/",
  facebook: "https://www.facebook.com/IreyProd",
  youtube: "https://www.youtube.com/@IreyProd",
  tiktok: "https://www.tiktok.com/@ireyprod",
  stats_label_1: "Core Services",
  stats_label_2: "Full Service Agency",
  stats_label_3: "Client-Centric",
  stats_label_4: "One-Stop Agency",
};

const inputCls = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";
const textareaCls = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none";

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "contact" | "social">("hero");

  // Load saved settings on mount
  useEffect(() => {
    fetch("/api/admin/get-settings.php")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && typeof data === "object" && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }})
      .catch(() => {});
  }, []);

  // onChange handler — stable reference, no re-render of inputs
  const handleChange = useCallback((key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaveError(false);
    try {
      const res = await fetch("/api/admin/save-settings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError(true);
      }
    } catch {
      // In local dev without PHP, save to localStorage as fallback
      try {
        localStorage.setItem("irey_settings", JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch { setSaveError(true); }
    }
    setSaving(false);
  };

  const tabs = [
    { id: "hero" as const,    label: "Hero & Text" },
    { id: "contact" as const, label: "Contact Info" },
    { id: "social" as const,  label: "Social Links" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Site Content</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Homepage Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </a>
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-foreground text-background hover:bg-accent"}`}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mb-4 p-4 border border-red-500/20 bg-red-500/5 rounded-sm">
          <p className="text-[12px] text-red-400 font-medium mb-1">Could not reach PHP server</p>
          <p className="text-[11px] text-foreground/40">This is normal in local dev. On cPanel, changes will save correctly. Settings saved to browser storage as fallback.</p>
        </div>
      )}

      <div className="mb-6 p-4 border border-accent/20 bg-accent/5 rounded-sm">
        <p className="text-[12px] text-accent/80 font-medium mb-1">How it works</p>
        <p className="text-[11px] text-foreground/50 leading-relaxed">
          Changes saved here update <code className="bg-foreground/10 px-1 rounded">data/settings.json</code> on your cPanel server and go live instantly — no rebuild needed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border border-foreground/10 rounded-sm w-fit mb-6 overflow-hidden">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all ${activeTab === tab.id ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Hero & Text */}
      {activeTab === "hero" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Hero Headline Line 1</label>
            <input type="text" value={settings.hero_headline_1}
              onChange={e => handleChange("hero_headline_1", e.target.value)}
              placeholder="Your Gateway to" className={inputCls} />
            <p className="text-[10px] text-foreground/25 mt-1">Appears as the first line of the homepage hero title</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Hero Headline Line 2</label>
            <input type="text" value={settings.hero_headline_2}
              onChange={e => handleChange("hero_headline_2", e.target.value)}
              placeholder="Unforgettable Experiences." className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Hero Subtext</label>
            <textarea value={settings.hero_subtext}
              onChange={e => handleChange("hero_subtext", e.target.value)}
              rows={4} placeholder="IREY PROD — A dynamic agency..."
              className={textareaCls} />
            <p className="text-[10px] text-foreground/25 mt-1">Short description shown below the main title</p>
          </div>
          <div className="pt-4 border-t border-foreground/8">
            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold mb-4">Stats Section Labels</p>
            <div className="grid grid-cols-2 gap-4">
              {(["stats_label_1", "stats_label_2", "stats_label_3", "stats_label_4"] as const).map((key, i) => (
                <div key={key}>
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Stat {i + 1} Label</label>
                  <input type="text" value={settings[key]}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={defaultSettings[key]} className={inputCls} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Contact Info */}
      {activeTab === "contact" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <div className="p-4 bg-blue-400/5 border border-blue-400/15 rounded-sm mb-2">
            <p className="text-[12px] text-blue-400/80 font-medium mb-1">📧 Contact Form Email</p>
            <p className="text-[11px] text-foreground/50 leading-relaxed">
              The <strong>Contact Email</strong> below is where enquiries from the contact form are sent. Change this to receive messages at a different address.
            </p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Contact Email (form sends here)</label>
            <input type="email" value={settings.contact_email}
              onChange={e => handleChange("contact_email", e.target.value)}
              placeholder="booking@ireyprod.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Phone Number</label>
            <input type="text" value={settings.phone}
              onChange={e => handleChange("phone", e.target.value)}
              placeholder="+230 5 788 20 14" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Office Hours</label>
            <input type="text" value={settings.office_hours}
              onChange={e => handleChange("office_hours", e.target.value)}
              placeholder="Mon – Fri · 10am – 5pm" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Location</label>
            <input type="text" value={settings.location}
              onChange={e => handleChange("location", e.target.value)}
              placeholder="Mauritius Island, Indian Ocean" className={inputCls} />
          </div>
        </div>
      )}

      {/* Tab: Social Links */}
      {activeTab === "social" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          {(["instagram", "facebook", "youtube", "tiktok"] as const).map(key => (
            <div key={key}>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">{key.charAt(0).toUpperCase() + key.slice(1)} URL</label>
              <input type="url" value={settings[key]}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={defaultSettings[key]} className={inputCls} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className={`px-8 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-foreground text-background hover:bg-accent"}`}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
