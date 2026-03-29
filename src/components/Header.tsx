"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toCloudUrl } from "@/lib/imageUrl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppImage from "@/components/ui/AppImage";
import { useSettings } from "@/lib/useLiveData";

const DEFAULT_NAV = [
  { label: "Artists",  href: "/bookings", active: true },
  { label: "About",    href: "/about",    active: true },
  { label: "Services", href: "/services", active: true },
  { label: "Gallery",  href: "/gallery",  active: true },
  { label: "Contact",  href: "/contact",  active: true },
  { label: "Events",   href: "/events",   active: true },
];

export default function Header() {
  const settings = useSettings();
  const navLinks = useMemo(() => {
    try {
      if (settings.nav_items) {
        const items = JSON.parse(settings.nav_items);
        if (Array.isArray(items) && items.length > 0) {
          // Ensure Gallery is always present even in old saved navs
          const hasGallery = items.some((i: any) => i.href === "/gallery");
          const merged = hasGallery ? items : [
            ...items.slice(0, 3),
            { id:"gallery", label:"Gallery", href:"/gallery", active:true },
            ...items.slice(3),
          ];
          return merged.filter((i: any) => i.active !== false);
        }
      }
    } catch {}
    return DEFAULT_NAV;
  }, [settings.nav_items]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-blur border-b border-white/5" : "bg-transparent"}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 relative z-[60]">
            <AppImage src="https://res.cloudinary.com/dvmhbtiz4/image/upload/ireyprod/IREY-PROD-WHITE.png" alt="IREY PROD logo"
              width={120} height={44} priority
              className="h-10 sm:h-12 w-auto object-contain"
              unoptimized />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`text-[12px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${pathname === link.href ? "text-foreground" : "text-white/80 hover:text-white"}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/bookings" prefetch={true}
              className="px-5 lg:px-6 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all duration-300">
              Book Now
            </Link>
          </div>

          {/* Mobile burger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2 -mr-2 relative z-[60]"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-4 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0 w-6" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-[55] md:hidden transition-all duration-700 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(6,6,6,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="absolute inset-0 noise pointer-events-none opacity-40" />
        <div className="absolute inset-0 pointer-events-none flex justify-between px-8">
          <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d1" /></div>
          <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d3" /></div>
        </div>
        <div className="relative z-10 flex flex-col h-full px-8 pt-28 pb-10">
          {/* Explicit close button inside overlay */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close menu">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">Close</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <nav className="flex-1 flex flex-col justify-center gap-1">
            {navLinks.map((link, i) => (
              <Link key={link.href} href={link.href}
                className={`group flex items-center gap-4 py-4 border-b border-foreground/5 transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : "0ms" }}
                onClick={() => setMenuOpen(false)}>
                <span className="font-display text-[1.2rem] font-light italic text-accent/50 w-8 group-hover:text-accent transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`font-display text-[1.8rem] font-extrabold italic leading-none transition-colors duration-300 ${pathname === link.href ? "text-foreground" : "text-white group-hover:text-accent"}`}>
                  {link.label}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="ml-auto text-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>
          <div className={`transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: menuOpen ? "500ms" : "0ms" }}>
            <Link href="/bookings" prefetch={true}
              className="w-full flex items-center justify-center gap-3 py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300"
              onClick={() => setMenuOpen(false)}>
              Book Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <div className="flex items-center gap-4 mt-6 justify-center">
              {[{ label: "Instagram", href: "https://www.instagram.com/ireyprod/" },
                { label: "Facebook", href: "https://www.facebook.com/IreyProd" },
                { label: "YouTube", href: "https://www.youtube.com/@IreyProd" }].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
