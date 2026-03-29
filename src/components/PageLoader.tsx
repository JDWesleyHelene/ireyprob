"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname  = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const prevPath  = useRef(pathname);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    clear();

    setProgress(0);
    setVisible(true);

    const t1 = setTimeout(() => setProgress(40),  80);
    const t2 = setTimeout(() => setProgress(70),  300);
    const t3 = setTimeout(() => setProgress(85),  600);

    const finish = () => {
      clear();
      setProgress(100);
      const t = setTimeout(() => { setVisible(false); setProgress(0); }, 400);
      timers.current = [t];
    };

    // Finish quickly — 1.2s max, or when page-ready fires
    const t4 = setTimeout(finish, 1200);
    timers.current = [t1, t2, t3, t4];

    const onReady = () => finish();
    window.addEventListener("page-ready", onReady, { once: true });
    return () => { clear(); window.removeEventListener("page-ready", onReady); };
  }, [pathname]);

  if (!visible) return null;

  // Only show top progress bar — NO full overlay that blocks the page
  return (
    <div className="fixed top-0 left-0 z-[9999] h-[3px] bg-accent transition-none"
      style={{
        width: `${progress}%`,
        transition: progress === 0 ? "none" : progress === 100
          ? "width 0.3s ease-out"
          : "width 0.8s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  );
}
