"use client";
import React, { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange }: Props) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string|null>(null);
  const [urlMode, setUrlMode]     = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { setError("Max 2MB. Please compress the image first."); return; }

    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });

      // Upload to Cloudinary via API — same as gallery/media library
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataUrl, filename: file.name }),
      });

      const result = await response.json();
      if (!response.ok) { setError(result.error || "Upload failed"); setUploading(false); return; }

      onChange(result.url);
    } catch { setError("Upload failed. Please try again."); }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-1">
        <button type="button" onClick={()=>setUrlMode(false)}
          className={`px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm border transition-all ${!urlMode?"border-foreground/30 text-foreground bg-foreground/10":"border-foreground/10 text-foreground/40 hover:border-foreground/20"}`}>
          Upload
        </button>
        <button type="button" onClick={()=>setUrlMode(true)}
          className={`px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm border transition-all ${urlMode?"border-foreground/30 text-foreground bg-foreground/10":"border-foreground/10 text-foreground/40 hover:border-foreground/20"}`}>
          Image URL
        </button>
      </div>

      {!urlMode ? (
        <div className="border border-dashed border-foreground/15 rounded-sm p-4 bg-foreground/[0.02]">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          <div className="flex items-center gap-3">
            <button type="button" onClick={()=>fileRef.current?.click()} disabled={uploading}
              className="min-h-[48px] px-4 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50 flex items-center gap-2">
              {uploading ? (
                <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading...</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>Choose Image</>
              )}
            </button>
            {value && (
              <button type="button" onClick={()=>onChange("")}
                className="min-h-[48px] px-4 py-2.5 border border-red-500/20 text-red-400/70 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-red-500/40 hover:text-red-400 transition-all">
                Remove
              </button>
            )}
          </div>
          {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
          <p className="mt-2 text-[10px] text-foreground/30">PNG, JPG, WEBP · Max 2MB · Saved to Cloudinary</p>
        </div>
      ) : (
        <div>
          <input type="url" value={value.startsWith("data:") ? "" : value} onChange={e=>onChange(e.target.value)}
            placeholder="https://example.com/image.jpg" className={IC}/>
          <p className="mt-1 text-[10px] text-foreground/25">Paste an image URL if already hosted online.</p>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative overflow-hidden rounded-sm border border-foreground/10 bg-foreground/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-48 object-cover"
            onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
        </div>
      )}
    </div>
  );
}
