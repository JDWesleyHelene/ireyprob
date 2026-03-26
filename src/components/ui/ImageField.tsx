"use client";
import React, { useRef, useState } from "react";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export default function ImageField({ label, value, onChange, hint }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const IC = "flex-1 bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    try {
      // Convert to base64 data URL for preview, then upload via API
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;

        // Upload via our API route
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataUrl, filename: file.name, type: file.type }),
        });

        if (res.ok) {
          const { url } = await res.json();
          onChange(url);
        } else {
          const err = await res.json().catch(()=>({}));
          if (err.tooLarge) {
            setUploadError(err.error || "Image too large. Compress it or paste a URL instead.");
          } else {
            setUploadError("Upload failed. Please paste an image URL instead.");
          }
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadError("Upload failed. You can paste a URL instead.");
      setUploading(false);
    }

    // Reset file input
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-32 rounded-sm overflow-hidden bg-foreground/5 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>
          <button onClick={() => onChange("")}
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      {/* URL input + Upload button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={IC}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all disabled:opacity-40 whitespace-nowrap">
          {uploading ? (
            <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>Upload</>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
      </div>

      {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
      <p className="text-[10px] text-foreground/25">Upload a file, paste a URL, or pick from <a href="/admin/media" target="_blank" className="text-accent/70 hover:text-accent underline">Media Library</a></p>
      {hint && <p className="text-[10px] text-foreground/25">{hint}</p>}
    </div>
  );
}
