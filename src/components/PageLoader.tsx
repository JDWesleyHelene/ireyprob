"use client";
import React, { useEffect, useState, useRef } from "react";
import { toCloudUrl } from "@/lib/imageUrl";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname   = usePathname();
  const [visible,  setVisible]  = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPath   = useRef(pathname);
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear      = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    if (pathname === prevPath.current) return;
    if (pathname?.startsWith("/admin")) { prevPath.current = pathname; return; }
    prevPath.current = pathname;
    clear();

    // Show immediately on route change
    setProgress(0);
    setVisible(true);

    // Animate progress to 80% over 400ms — hold there until data loads
    const t1 = setTimeout(() => setProgress(30),  80);
    const t2 = setTimeout(() => setProgress(60),  250);
    const t3 = setTimeout(() => setProgress(80),  500);

    // Hold at 80% — we wait for window "page-ready" event fired by pages
    // If no event fires in 6s, finish anyway
    const t4 = setTimeout(() => finish(), 6000);

    timers.current = [t1, t2, t3, t4];

    const finish = () => {
      clear();
      setProgress(100);
      const t = setTimeout(() => { setVisible(false); setProgress(0); }, 500);
      timers.current = [t];
    };

    const onReady = () => finish();
    window.addEventListener("page-ready", onReady, { once: true });

    return () => {
      clear();
      window.removeEventListener("page-ready", onReady);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {/* Gold top progress bar */}
      <div className="fixed top-0 left-0 z-[9998] h-[3px] bg-accent"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? "width 0.3s ease-out" : "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* Full overlay with logo — shown while waiting for data */}
      <div className="fixed inset-0 z-[9990] bg-[#060606] flex flex-col items-center justify-center"
        style={{ animation: "fadeInLoader 0.15s ease both" }}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none"/>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={toCloudUrl("https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png")}
          alt="IREY PROD"
          style={{ height: "165px", width: "auto", animation: "pulseLoader 1.2s ease-in-out infinite" }}
        />
        {/* Progress bar under logo */}
        <div className="w-32 h-px bg-white/10 overflow-hidden rounded-full mt-8">
          <div className="h-full bg-accent rounded-full"
            style={{ width: `${progress}%`, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }}/>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInLoader { from { opacity:0; } to { opacity:1; } }
        @keyframes pulseLoader { 0%,100% { opacity:0.5; transform:scale(0.97); } 50% { opacity:1; transform:scale(1); } }
      `}}/>
    </>
  );
}
