"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface MigrateResult {
  wpUrl: string;
  cloudUrl: string;
  status: string;
}

export default function AdminMigratePage() {
  const [preview,  setPreview]  = useState<{total:number;urls:string[]}|null>(null);
  const [running,  setRunning]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [results,  setResults]  = useState<MigrateResult[]>([]);
  const [summary,  setSummary]  = useState<any>(null);
  const [error,    setError]    = useState<string|null>(null);

  useEffect(() => {
    fetch("/api/admin/migrate-images")
      .then(r => r.ok ? r.json() : {})
      .then(d => setPreview(d))
      .catch(() => {});
  }, []);

  const run = async () => {
    if (!confirm(`This will upload ${preview?.total} images to Cloudinary and update all DB settings. Continue?`)) return;
    setRunning(true); setError(null);
    try {
      const res  = await fetch("/api/admin/migrate-images", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setRunning(false); return; }
      setResults(data.results || []);
      setSummary(data);
      setDone(true);
    } catch (e: any) { setError(e.message); }
    setRunning(false);
  };

  const statusColor = (s: string) =>
    s === "uploaded"       ? "text-emerald-400" :
    s === "already_exists" ? "text-foreground/40" :
    s.startsWith("error")  ? "text-red-400" : "text-foreground/50";

  const statusIcon = (s: string) =>
    s === "uploaded"       ? "✓ Uploaded" :
    s === "already_exists" ? "↩ Already exists" :
    s.startsWith("error")  ? "✗ " + s.replace("error: ","") : s;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Tools</span>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Image Migration</h1>
          <p className="text-[12px] text-foreground/40 mt-1">Move all WordPress images to Cloudinary CDN</p>
        </div>
        <Link href="/admin/media" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
          Media Library
        </Link>
      </div>

      {/* Why this matters */}
      <div className="p-5 border border-accent/20 bg-accent/5 rounded-sm mb-6 space-y-2">
        <p className="text-[13px] font-semibold text-foreground/80">⚠️ Required before going live</p>
        <p className="text-[12px] text-foreground/60 leading-relaxed">
          Many images on this website are loaded from <strong className="text-foreground/80">ireyprod.com/wp-content/uploads/</strong> (the WordPress server).
          Once this site goes live on <strong className="text-foreground/80">ireyprod.com</strong>, those URLs will conflict or break.
        </p>
        <p className="text-[12px] text-foreground/60">
          This tool uploads all those images to <strong className="text-foreground/80">Cloudinary CDN</strong> and automatically updates all settings in the database to use the new URLs.
        </p>
      </div>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-sm mb-5">
          <p className="text-[12px] text-red-400">{error}</p>
        </div>
      )}

      {/* Preview */}
      {!done && preview && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 mb-6">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">Images to migrate</h2>
          <div className="flex gap-6 mb-5">
            <div className="text-center">
              <p className="text-[2rem] font-display font-light italic text-foreground">{preview.total}</p>
              <p className="text-[10px] text-foreground/30 uppercase tracking-widest">Total Images</p>
            </div>
          </div>
          <div className="space-y-1 mb-5 max-h-48 overflow-y-auto">
            {preview.urls?.map((url, i) => (
              <p key={i} className="text-[11px] text-foreground/40 font-mono truncate">{url.replace("https://ireyprod.com/wp-content/uploads/","…/")}</p>
            ))}
          </div>
          <button onClick={run} disabled={running}
            className="flex items-center gap-2 px-6 py-3 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50">
            {running ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Migrating — this may take a minute...</>
            ) : "Run Migration →"}
          </button>
        </div>
      )}

      {/* Results */}
      {done && summary && (
        <div className="space-y-5">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-sm p-6">
            <h2 className="text-[13px] font-semibold text-emerald-400 mb-3">✓ Migration Complete</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-[1.8rem] font-display font-light italic text-emerald-400">{summary.uploaded}</p>
                <p className="text-[10px] text-foreground/30 uppercase tracking-widest">Uploaded</p>
              </div>
              <div className="text-center">
                <p className="text-[1.8rem] font-display font-light italic text-foreground/40">{summary.already}</p>
                <p className="text-[10px] text-foreground/30 uppercase tracking-widest">Already on CDN</p>
              </div>
              <div className="text-center">
                <p className="text-[1.8rem] font-display font-light italic text-foreground/40">{summary.settingsUpdated}</p>
                <p className="text-[10px] text-foreground/30 uppercase tracking-widest">DB Settings Updated</p>
              </div>
            </div>
            {summary.errors > 0 && (
              <p className="text-[11px] text-red-400">{summary.errors} images failed — see list below.</p>
            )}
            <div className="mt-3 space-y-2 text-[11px] text-foreground/50 leading-relaxed">
              <p>✓ <strong className="text-foreground/70">DB settings updated</strong> — all images saved via the admin dashboard now use Cloudinary URLs. These work immediately.</p>
              <p>⚠️ <strong className="text-foreground/70">Code defaults still reference WordPress</strong> — these are fallback images shown before DB data loads. To fix them permanently: copy the Cloudinary URLs above and paste into <strong>Settings</strong> / <strong>Page Content</strong> for each section, then Save. This overwrites the hardcoded fallbacks.</p>
              <p>💡 Alternatively, the code defaults will be patched automatically on the next deploy if you push the updated code to GitHub.</p>
            </div>
          </div>

          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-foreground/8">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Details</p>
            </div>
            <div className="divide-y divide-foreground/5 max-h-96 overflow-y-auto">
              {results.map((r, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-3">
                  <span className={`text-[11px] font-mono flex-shrink-0 mt-0.5 ${statusColor(r.status)}`}>{statusIcon(r.status)}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-foreground/30 font-mono truncate">{r.wpUrl.replace("https://ireyprod.com/wp-content/uploads/","…/")}</p>
                    {r.cloudUrl !== r.wpUrl && <p className="text-[10px] text-foreground/20 font-mono truncate">{r.cloudUrl}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/admin/media" className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
            View in Media Library →
          </Link>
        </div>
      )}
    </div>
  );
}
