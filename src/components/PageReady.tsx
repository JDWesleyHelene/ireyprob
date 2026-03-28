"use client";
import { useEffect } from "react";
export default function PageReady({ delay = 800 }: { delay?: number }) {
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event("page-ready")), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return null;
}
