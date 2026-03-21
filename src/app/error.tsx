"use client";

import React from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#040404] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 mb-4">— Error</p>
          <h1 className="font-display text-[3rem] font-light italic text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-[14px] text-foreground/50 font-light leading-relaxed mb-8">
            An unexpected error occurred. Please try again or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground/20 text-foreground text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-foreground/5 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
