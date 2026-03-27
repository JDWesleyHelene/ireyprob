"use client";
import RichTextEditor from "@/components/ui/RichTextEditor";
import React, { useEffect, useState, useCallback } from "react";

interface SM { [k: string]: string; }
type Tab = "branding"|"email"|"social"|"contact"|"typography";

const tabs: { id: Tab; label: string }[] = [
  { id:"branding",    label:"Site Branding" },
  { id:"typography",  label:"Typography" },
  { id:"email",    label:"Email Settings" },
  { id:"social",   label:"Social Media" },
  { id:"contact",  label:"Contact Info" },
];

function SocialTab({ settings, set }: { settings: SM; set: (k:string,v:string)=>void }) {
  const [newName, setNewName] = React.useState("");
  const [newUrl,  setNewUrl]  = React.useState("");
  const entries = Object.entries(settings)
    .filter(([k,v]) => k.startsWith("social_") && v && v !== "__DELETE__")
    .map(([k,v]) => ({ key:k, label:k.replace("social_","").replace(/_/g," "), url:v }))
    .sort((a,b) => a.label.localeCompare(b.label));

  const add = () => {
    if (!newName.trim()||!newUrl.trim()) return;
    const key = "social_"+newName.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_");
    set(key, newUrl.trim()); setNewName(""); setNewUrl("");
  };
  const IC = "bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
  return (
    <div className="space-y-8">
      <div><h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-foreground mb-1">Social Media Links</h2>
        <p className="text-[12px] text-foreground/40">Add any platform — it appears automatically on the website. Leave blank or delete to hide.</p></div>
      <div className="space-y-2">
        {entries.length === 0 && <p className="text-[13px] text-foreground/25 py-4 text-center border border-foreground/5 rounded-sm">No social links yet.</p>}
        {entries.map(e=>(
          <div key={e.key} className="flex items-center gap-3 p-3 bg-foreground/[0.02] border border-foreground/8 rounded-sm group">
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"/>
            <span className="w-28 text-[12px] font-semibold text-foreground/70 capitalize flex-shrink-0">{e.label}</span>
            <input type="url" value={e.url} onChange={ev=>set(e.key,ev.target.value)} className={IC+" flex-1 text-[12px]"} placeholder="https://..."/>
            <button onClick={()=>set(e.key,"__DELETE__")} className="p-1.5 text-foreground/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ))}
      </div>
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Add New Platform</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-1.5">Platform Name *</label>
            <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. LinkedIn, Spotify, TikTok" className={IC+" w-full"}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-1.5">URL *</label>
            <input type="url" value={newUrl} onChange={e=>setNewUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="https://..." className={IC+" w-full"}/></div>
        </div>
        <button onClick={add} disabled={!newName.trim()||!newUrl.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-40">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Platform
        </button>
      </div>
      <p className="text-[11px] text-foreground/30">Click <strong className="text-foreground/50">Save Changes</strong> above to apply.</p>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SM>({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams?.get("tab");
    return (["branding","email","social","contact","typography"].includes(t||"") ? t : "branding") as Tab;
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) { const d = await res.json(); setSettings(d); }
    } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (key: string, value: string) => setSettings(p => ({ ...p, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const toDelete = Object.entries(settings).filter(([,v])=>v==="__DELETE__").map(([k])=>k);
      const toUpsert = Object.entries(settings).filter(([,v])=>v!=="__DELETE__").map(([key,value])=>({ key, value }));
      await fetch("/api/admin/settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(toUpsert.map(({key,value})=>[key,value]))),
      });
      // Delete removed social links
      for (const key of toDelete) {
        await fetch("/api/admin/settings", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: "" }),
        });
      }
      setSaved(true); setTimeout(()=>setSaved(false),3000);
      setSettings(p => { const n={...p}; toDelete.forEach(k=>delete n[k]); return n; });
    } catch {}
    setSaving(false);
  };

  const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";

  if (loading) return <div className="min-h-screen bg-[#040404] flex items-center justify-center"><p className="text-foreground/30 text-[12px] tracking-widest uppercase">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#040404]">
      <div className="border-b border-foreground/8 px-8 py-6 flex items-center justify-between">
        <div><h1 className="text-[18px] font-light text-foreground tracking-wide">Settings</h1>
          <p className="text-[11px] text-foreground/30 mt-0.5">Site configuration</p></div>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-[11px] font-semibold tracking-[0.15em] uppercase transition-all ${saved?"bg-green-500/20 text-green-400 border border-green-500/30":"bg-foreground text-background hover:bg-foreground/90"} disabled:opacity-50`}>
          {saving?"Saving...":saved?"✓ Saved":"Save Changes"}
        </button>
      </div>
      <div className="flex">
        <div className="w-48 border-r border-foreground/8 min-h-[calc(100vh-73px)] p-3">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-sm text-left transition-all mb-0.5 ${tab===t.id?"bg-foreground/8 text-foreground":"text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}>
              <span className="text-[11px] font-medium tracking-wide">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 p-8 max-w-3xl">

          {tab==="branding"&&(
            <div className="space-y-6">
              <div><h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-foreground mb-1">Site Branding</h2></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Site Tagline</label>
                <input type="text" value={settings.site_tagline||""} onChange={e=>set("site_tagline",e.target.value)} placeholder="Booking Agency & Event Production" className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Site Description</label>
                <RichTextEditor label="" value={settings.site_description||""} onChange={v=>set("site_description",v)} rows={4}/></div>
            </div>
          )}

          {tab==="email"&&(
            <div className="space-y-6">
              <div><h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-foreground mb-1">Email Settings</h2>
                <p className="text-[12px] text-foreground/40">Form recipients — separate from your public email address</p></div>
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm">
                <p className="text-[11px] text-foreground/50 leading-relaxed">These emails receive form submissions. Completely independent from the public <strong className="text-foreground/70">booking@ireyprod.com</strong> shown on the website.</p>
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-4">
                <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/50 pb-3 border-b border-foreground/8">Contact Form</h3>
                {[["contact_form_to","To: (primary recipient)","internal@ireyprod.com"],["contact_form_cc","CC:","manager@ireyprod.com, assistant@ireyprod.com"],["contact_form_bcc","BCC:","archive@ireyprod.com"]].map(([k,l,p])=>(
                  <div key={k}><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">{l}</label>
                    <input type="text" value={settings[k]||""} onChange={e=>set(k,e.target.value)} placeholder={p} className={IC}/>
                    {k==="contact_form_cc"&&<p className="text-[11px] text-foreground/25 mt-1">Comma-separated for multiple</p>}
                  </div>
                ))}
              </div>
              <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-4">
                <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/50 pb-3 border-b border-foreground/8">Booking Form</h3>
                {[["booking_form_to","To: (primary recipient)","bookings@ireyprod.com"],["booking_form_cc","CC:","manager@ireyprod.com"],["booking_form_bcc","BCC:","archive@ireyprod.com"]].map(([k,l,p])=>(
                  <div key={k}><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">{l}</label>
                    <input type="text" value={settings[k]||""} onChange={e=>set(k,e.target.value)} placeholder={p} className={IC}/></div>
                ))}
              </div>
            </div>
          )}

          {tab==="social"&&<SocialTab settings={settings} set={set}/>}

          {tab==="typography"&&(
            <div className="space-y-8">
              <div><h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-foreground mb-1">Typography</h2>
                <p className="text-[12px] text-foreground/40">Control font sizes across the website. Values in rem (1rem = 16px).</p></div>
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm">
                <p className="text-[11px] text-foreground/50">Changes apply site-wide after saving. Reload the page to see updates.</p>
              </div>
              <div className="space-y-6">
                {[
                  {key:"font_h1",label:"H1 — Hero Headings",default:"5rem",hint:"Main page titles"},
                  {key:"font_h2",label:"H2 — Section Headings",default:"3rem",hint:"Section titles"},
                  {key:"font_h3",label:"H3 — Card Titles",default:"1.5rem",hint:"Card and sub-section titles"},
                  {key:"font_body",label:"Body Text",default:"0.9375rem",hint:"Paragraphs and descriptions"},
                  {key:"font_small",label:"Small / Labels",default:"0.75rem",hint:"Tags, labels, captions"},
                ].map(({key,label,default:def,hint})=>(
                  <div key={key} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-1">{label}</label>
                      <p className="text-[10px] text-foreground/25">{hint}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <input type="text" value={settings[key]||def} onChange={e=>set(key,e.target.value)}
                        className="w-24 bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2 text-[13px] text-foreground text-center font-mono focus:outline-none focus:border-foreground/30"/>
                      <span className="text-[10px] text-foreground/30 w-8">
                        {settings[key]||def}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==="contact"&&(
            <div className="space-y-6">
              <div><h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-foreground mb-1">Contact Information</h2>
                <p className="text-[12px] text-foreground/40">Public-facing details shown on the website</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Public Phone</label>
                  <input type="text" value={settings.contact_phone||""} onChange={e=>set("contact_phone",e.target.value)} placeholder="+230 000 0000" className={IC}/></div>
                <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Public Email (shown on site)</label>
                  <input type="email" value={settings.contact_email||""} onChange={e=>set("contact_email",e.target.value)} placeholder="booking@ireyprod.com" className={IC}/></div>
              </div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Office Hours</label>
                <input type="text" value={settings.office_hours||""} onChange={e=>set("office_hours",e.target.value)} placeholder="Mon – Fri, 10am – 5pm" className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Location</label>
                <input type="text" value={settings.contact_address||""} onChange={e=>set("contact_address",e.target.value)} placeholder="Mauritius Island" className={IC}/></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
