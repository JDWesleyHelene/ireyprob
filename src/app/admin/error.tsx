"use client";

import React from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 mb-4">— Admin Error</p>
        <h1 className="font-display text-[2.5rem] font-light italic text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-[13px] text-foreground/40 font-light leading-relaxed mb-8">
          {error?.message || "An unexpected error occurred in the admin panel."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300"
          >
            Try Again
          </button>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground/20 text-foreground text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-foreground/5 transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
