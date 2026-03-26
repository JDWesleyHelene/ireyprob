"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => timerRef.current.forEach(clearTimeout);

  useEffect(() => {
    // Skip on first load (splash handles that) and admin
    if (pathname === prevPath.current) return;
    if (pathname?.startsWith("/admin")) { prevPath.current = pathname; return; }

    prevPath.current = pathname;
    clear();

    // Start loader
    setProgress(0);
    setVisible(true);
    setLoading(true);

    // Animate progress bar quickly to 85%, then finish
    const t1 = setTimeout(() => setProgress(40),  80);
    const t2 = setTimeout(() => setProgress(70),  300);
    const t3 = setTimeout(() => setProgress(85),  600);
    const t4 = setTimeout(() => {
      setProgress(100);
      const t5 = setTimeout(() => {
        setVisible(false);
        setLoading(false);
        setProgress(0);
      }, 400);
      timerRef.current.push(t5);
    }, 900);

    timerRef.current = [t1, t2, t3, t4];
    return clear;
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 z-[9998] h-[2px] bg-accent transition-all"
        style={{
          width: `${progress}%`,
          transition: progress === 100
            ? "width 0.3s ease-out"
            : "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Subtle overlay with logo — only shows if taking > 300ms */}
      {loading && (
        <div
          className="fixed inset-0 z-[9990] bg-[#060606]/80 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          style={{ animation: "fadeInLoader 0.3s ease 0.3s both" }}
        >
          <div style={{ animation: "pulseLoader 1.2s ease-in-out infinite" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png"
              alt="IREY PROD"
              style={{ height: "48px", width: "auto", opacity: 0.6 }}
            />
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInLoader {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseLoader {
          0%, 100% { opacity: 0.4; transform: scale(0.97); }
          50%       { opacity: 0.8; transform: scale(1); }
        }
      `}} />
    </>
  );
}
