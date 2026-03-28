"use client";
import React, { useState, useEffect, useRef } from "react";

interface MediaImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  sizeKB: number;
  createdAt: string;
  format: string;
}

export default function AdminMediaPage() {
  const [images,    setImages]    = useState<MediaImage[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting,  setDeleting]  = useState<string|null>(null);
  const [selected,  setSelected]  = useState<MediaImage|null>(null);
  const [copied,    setCopied]    = useState<string|null>(null);
  const [toast,     setToast]     = useState<{msg:string;ok:boolean}|null>(null);
  const [error,     setError]     = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const toast$ = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),4000); };

  const loadImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to load media");
        setLoading(false);
        return;
      }
      const d = await res.json();
      setImages(d.images || []);
    } catch { setError("Failed to load media library"); }
    setLoading(false);
  };

  useEffect(() => { loadImages(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith("image/")) { toast$(`${file.name}: not an image`, false); continue; }
      if (file.size > 2 * 1024 * 1024) { toast$(`${file.name}: max 2MB — please compress first`, false); continue; }

      try {
        const dataUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.onerror = rej;
          r.readAsDataURL(file);
        });

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataUrl, filename: file.name }),
        });

        const result = await response.json();
        if (!response.ok) { toast$(result.error || "Upload failed", false); continue; }
        toast$(`✓ ${file.name} uploaded`);
      } catch { toast$(`Failed to upload ${file.name}`, false); }
    }

    if (fileRef.current) fileRef.current.value = "";
    await loadImages();
    setUploading(false);
  };

  const handleDelete = async (img: MediaImage) => {
    if (!confirm(`Delete "${img.publicId}"?\n\nThis cannot be undone. Any page using this image will show a broken image.`)) return;
    setDeleting(img.publicId);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.publicId }),
      });
      if (res.ok) {
        setImages(p => p.filter(i => i.publicId !== img.publicId));
        if (selected?.publicId === img.publicId) setSelected(null);
        toast$("✓ Image deleted");
      } else { toast$("Failed to delete", false); }
    } catch { toast$("Error deleting image", false); }
    setDeleting(null);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border max-w-sm ${toast.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Media Library</h1>
          <p className="text-[12px] text-foreground/40 mt-1">{images.length} image{images.length!==1?"s":""} · Stored on Cloudinary CDN</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => loadImages()} className="p-2.5 border border-foreground/15 text-foreground/40 hover:text-foreground rounded-sm transition-all" title="Refresh">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50">
            {uploading ? (
              <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading...</>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>Upload Images</>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload}/>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-sm mb-6">
          <p className="text-[13px] text-red-400 font-medium mb-1">Cloudinary not connected</p>
          <p className="text-[12px] text-foreground/40">{error}</p>
          <p className="text-[11px] text-foreground/30 mt-2">Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your environment variables.</p>
        </div>
      )}

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Grid */}
        <div className={`flex-1 overflow-y-auto ${selected ? "lg:max-w-[calc(100%-320px)]" : ""}`}>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[...Array(10)].map((_,i) => <div key={i} className="aspect-square bg-foreground/5 rounded-sm animate-pulse"/>)}
            </div>
          ) : images.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-foreground/15 rounded-sm">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/20 mb-4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              <p className="text-[13px] text-foreground/30 mb-2">No images yet</p>
              <button onClick={() => fileRef.current?.click()} className="text-[11px] text-accent hover:underline">Upload your first image</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {images.map(img => (
                <button key={img.publicId} onClick={() => setSelected(img)}
                  className={`relative aspect-square overflow-hidden rounded-sm border group transition-all ${selected?.publicId===img.publicId ? "border-accent shadow-lg shadow-accent/10" : "border-foreground/8 hover:border-foreground/25"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.publicId} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200"/>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[9px] text-white/70 truncate">{img.sizeKB}KB</p>
                  </div>
                  {selected?.publicId===img.publicId && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 overflow-y-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Image Details</p>
              <button onClick={() => setSelected(null)} className="text-foreground/30 hover:text-foreground transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Preview */}
            <div className="relative overflow-hidden rounded-sm mb-4 bg-foreground/5" style={{aspectRatio:`${selected.width}/${selected.height}`, maxHeight:"200px"}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.url} alt={selected.publicId} className="w-full h-full object-contain"/>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4 text-[12px]">
              <div className="flex justify-between">
                <span className="text-foreground/40">Size</span>
                <span className="text-foreground/70">{selected.sizeKB} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/40">Dimensions</span>
                <span className="text-foreground/70">{selected.width} × {selected.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/40">Format</span>
                <span className="text-foreground/70 uppercase">{selected.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/40">Uploaded</span>
                <span className="text-foreground/70">{new Date(selected.createdAt).toLocaleDateString("en-GB")}</span>
              </div>
            </div>

            {/* URL copy */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">URL</p>
              <div className="flex gap-2">
                <input readOnly value={selected.url}
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-sm px-2 py-2 text-[11px] text-foreground/50 focus:outline-none truncate"/>
                <button onClick={() => copyUrl(selected.url)}
                  className={`px-3 py-2 text-[10px] font-semibold tracking-widest uppercase rounded-sm border transition-all flex-shrink-0 ${copied===selected.url ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-foreground/15 text-foreground/40 hover:text-foreground hover:border-foreground/30"}`}>
                  {copied===selected.url ? "✓" : "Copy"}
                </button>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-foreground/8">
              <button onClick={() => handleDelete(selected)} disabled={deleting===selected.publicId}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 rounded-sm text-[11px] font-semibold tracking-[0.15em] uppercase transition-all disabled:opacity-40">
                {deleting===selected.publicId ? (
                  <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Deleting...</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>Delete Image</>
                )}
              </button>
              <p className="text-[10px] text-foreground/20 text-center mt-2">Deleting removes it from CDN permanently</p>
            </div>
          </div>
        )}
      </div>

      {/* Drop zone hint */}
      <p className="mt-4 text-[11px] text-foreground/20 text-center">
        Click "Upload Images" to add photos · Select an image to copy its URL · Max 2MB per file
      </p>
    </div>
  );
}
