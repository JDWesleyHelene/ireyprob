"use client";
import React, { useState, useEffect } from "react";

interface ShareButtonsProps {
  url:         string;
  title:       string;
  description?: string;
  image?:      string;
}

export default function ShareButtons({ url, title, description = "" }: ShareButtonsProps) {
  const [copied,    setCopied]    = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);
  const [canShare,  setCanShare]  = useState(false);

  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(mobile);
    setCanShare(!!navigator.share);
  }, []);

  const encoded      = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc  = encodeURIComponent(description);

  // Native share sheet (mobile) — opens FB app, WhatsApp, etc. natively
  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: description || title, url });
    } catch {}
  };

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const BTN = "flex items-center justify-center gap-2 h-9 border rounded-sm transition-all text-foreground/40 hover:text-foreground hover:border-foreground/40 border-foreground/15";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mr-1">Share</span>

      {/* Mobile — native share sheet */}
      {isMobile && canShare ? (
        <button onClick={nativeShare} title="Share"
          className={`${BTN} px-3`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span className="text-[11px] font-semibold tracking-[0.1em] uppercase">Share</span>
        </button>
      ) : (
        <>
          {/* Desktop — individual platform buttons */}
          {/* Facebook */}
          <a href={`https://www.facebook.com/sharer.php?u=${encoded}`}
            target="_blank" rel="noopener noreferrer" title="Share on Facebook"
            className={`${BTN} w-9`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          {/* WhatsApp */}
          <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`}
            target="_blank" rel="noopener noreferrer" title="Share on WhatsApp"
            className={`${BTN} w-9`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          {/* X/Twitter */}
          <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
            target="_blank" rel="noopener noreferrer" title="Share on X"
            className={`${BTN} w-9`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </>
      )}

      {/* Copy link — always visible */}
      <button onClick={copy} title="Copy link"
        className={`${BTN} w-9 ${copied ? "border-emerald-500/40 text-emerald-400 hover:text-emerald-400 hover:border-emerald-500/40" : ""}`}>
        {copied
          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        }
      </button>
    </div>
  );
}
