"use client";
import React from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder-foreground/25 focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]"
      />
      {value && (
        <div className="relative w-full h-32 overflow-hidden rounded-sm border border-foreground/10 bg-foreground/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      )}
      <p className="text-[10px] text-foreground/25">Enter an image URL. In Phase 2, this will support direct file uploads.</p>
    </div>
  );
}
