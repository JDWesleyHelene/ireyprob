"use client";
import React, { useState } from "react";

interface SocialLink { platform: string; url: string; }

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#000"/></svg>,
  spotify:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>,
  instagram:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
  facebook:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  tiktok:      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/></svg>,
  soundcloud:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.017.128-.026.257-.026.387s.009.257.026.384l.004.028-.004.035c-.017.128-.026.257-.026.384 0 1.243 1.01 2.252 2.252 2.252.208 0 .41-.029.601-.084h14.9a3.463 3.463 0 0 0 3.463-3.463 3.463 3.463 0 0 0-3.463-3.462 3.47 3.47 0 0 0-.626.057 5.324 5.324 0 0 0-5.313-5.003 5.327 5.327 0 0 0-4.7 2.836 3.233 3.233 0 0 0-1.577-.413A3.245 3.245 0 0 0 3.44 8.856c0 .16.013.317.035.472z"/></svg>,
  deezer:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M8 6v12M4 9v6M16 6v12M20 9v6"/></svg>,
  apple_music: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  twitter:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  threads:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068v-.088c.024-3.378.993-6.14 2.881-8.215C6.284 1.621 9.018.5 12.415.5c2.721 0 5.043.758 6.9 2.252 1.773 1.432 2.998 3.467 3.64 6.049l-2.627.623c-.48-1.99-1.381-3.57-2.682-4.698-1.261-1.095-2.929-1.65-4.961-1.65-2.647 0-4.74.902-6.218 2.682-1.417 1.706-2.138 4.136-2.162 7.22v.088c0 3.181.762 5.658 2.265 7.362 1.468 1.665 3.574 2.513 6.258 2.531h.007c1.881 0 3.441-.421 4.637-1.251.886-.609 1.535-1.435 1.929-2.455.22-.573.345-1.222.371-1.931a8.38 8.38 0 0 1-2.124.768c-.944.198-1.956.271-3.01.218-2.03-.103-3.633-.795-4.764-2.057-1.016-1.134-1.524-2.638-1.47-4.358.055-1.755.645-3.198 1.754-4.289 1.149-1.131 2.72-1.724 4.539-1.724.325 0 .655.018.984.053 1.374.149 2.544.623 3.478 1.41.48.409.887.889 1.212 1.432.149-1.244-.014-2.306-.484-3.154-.57-1.034-1.549-1.659-2.911-1.857-.348-.051-.71-.077-1.079-.077-1.376 0-2.456.377-3.208 1.12-.635.626-.983 1.474-1.037 2.52-.04.776.11 1.41.445 1.884.299.424.741.7 1.313.822.469.1.994.081 1.561-.054-.198-.283-.308-.634-.308-1.037 0-.891.569-1.613 1.27-1.613.699 0 1.268.722 1.268 1.613 0 .485-.153.912-.408 1.211.583-.096 1.14-.256 1.66-.476l.638 2.509c-.892.35-1.858.571-2.875.657-.479.04-.97.055-1.467.044-1.484-.034-2.717-.501-3.665-1.388-.966-.905-1.478-2.131-1.523-3.645-.044-1.5.389-2.759 1.285-3.738.933-1.021 2.265-1.582 3.863-1.66z"/></svg>,
  website:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

const DefaultIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85"/></svg>;

// ── Display component (public artist page) ────────────────────────────────────
export function ArtistSocialDisplay({ artistName, socialLinks }: { artistName: string; socialLinks: SocialLink[] }) {
  if (!socialLinks?.length) return null;
  return (
    <div className="mt-8 pt-6 border-t border-foreground/8">
      <p className="text-[11px] text-foreground/40 mb-3">
        You can find <span className="text-foreground/60 font-medium">{artistName}</span> also on:
      </p>
      <div className="flex flex-wrap gap-2">
        {socialLinks.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 border border-foreground/15 rounded-sm text-foreground/50 hover:text-foreground hover:border-foreground/35 transition-all text-[12px] font-medium capitalize">
            <span className="text-foreground/40">{PLATFORM_ICONS[s.platform.toLowerCase().replace(/[\s-]/g,"_")] ?? <DefaultIcon/>}</span>
            {s.platform}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Editor component (admin forms) ────────────────────────────────────────────
const PLATFORMS = ["YouTube","Spotify","Instagram","Facebook","TikTok","SoundCloud","Deezer","Apple Music","Twitter","Threads","Website"];
const IC = "bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

export function ArtistSocialEditor({ value, onChange }: { value: SocialLink[]; onChange: (v: SocialLink[]) => void }) {
  const [newPlatform, setNewPlatform] = useState(PLATFORMS[0]);
  const [newUrl,      setNewUrl]      = useState("");

  const add = () => {
    if (!newUrl.trim()) return;
    onChange([...value, { platform: newPlatform, url: newUrl.trim() }]);
    setNewUrl("");
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Artist Social Links</label>
      <p className="text-[11px] text-foreground/30">Links shown on the artist's public profile page.</p>

      {/* Existing links */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-foreground/[0.02] border border-foreground/8 rounded-sm">
              <span className="text-foreground/40">{PLATFORM_ICONS[s.platform.toLowerCase().replace(/[\s-]/g,"_")] ?? <DefaultIcon/>}</span>
              <span className="text-[12px] font-medium text-foreground/60 w-24 flex-shrink-0 capitalize">{s.platform}</span>
              <span className="text-[11px] text-foreground/30 flex-1 truncate font-mono">{s.url}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-400/50 hover:text-red-400 transition-colors flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      <div className="flex gap-2">
        <select value={newPlatform} onChange={e => setNewPlatform(e.target.value)} className={IC + " flex-shrink-0"}>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)}
          placeholder="https://..." className={IC + " flex-1"}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}/>
        <button type="button" onClick={add} disabled={!newUrl.trim()}
          className="px-4 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.1em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-40 flex-shrink-0">
          Add
        </button>
      </div>
    </div>
  );
}
