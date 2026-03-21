import React from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";

const footerColumns = [
  { title: "Company", links: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "News", href: "/news" }, { label: "Contact", href: "/contact" }] },
  { title: "Services", links: [{ label: "Bookings", href: "/bookings" }, { label: "Events", href: "/events" }, { label: "Artists", href: "/bookings" }, { label: "Productions", href: "/services" }] },
  { title: "Connect", links: [
    { label: "Instagram", href: "https://www.instagram.com/ireyprod/", external: true },
    { label: "Facebook", href: "https://www.facebook.com/IreyProd", external: true },
    { label: "YouTube", href: "https://www.youtube.com/@IreyProd", external: true },
    { label: "TikTok", href: "https://www.tiktok.com/@ireyprod", external: true },
  ]},
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/ireyprod/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/IreyProd", icon: "facebook" },
  { label: "YouTube", href: "https://www.youtube.com/@IreyProd", icon: "youtube" },
  { label: "TikTok", href: "https://www.tiktok.com/@ireyprod", icon: "tiktok" },
];

const SocialIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = {
    instagram: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" /></svg>),
    facebook: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>),
    youtube: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#060606" /></svg>),
    tiktok: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" /></svg>),
  };
  return <>{icons[icon]}</>;
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-background overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px footer-line" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
          {/* Brand — left aligned */}
          <div className="lg:col-span-1 flex flex-col gap-4 items-start">
            <Link href="/">
              <AppImage src="/assets/images/IREY-PROD-BLACK-1773496673088.png" alt="IREY PROD logo"
                width={120} height={44}
                className="h-9 w-auto object-contain brightness-0 invert opacity-80"
                unoptimized />
            </Link>
            <p className="text-[12px] text-white tracking-wide leading-relaxed font-light">
              IREY PROD — Booking agency & production for music and performing arts. Based in Mauritius Island.
            </p>
            <p className="text-[11px] text-white tracking-wide">Mauritius Island · Indian Ocean</p>
            <div className="mt-2">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white mb-1">Questions? Reach Us</p>
              <a href="tel:+23057882014" className="text-[13px] text-white hover:text-accent transition-colors duration-300">+230 5 788 20 14</a>
              <p className="text-[11px] text-white mt-0.5">Mon – Fri · 10am – 5pm</p>
            </div>
          </div>

          {/* Columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3 sm:gap-4">
              <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white">{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  "external" in link && link.external ? (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="text-[13px] font-medium text-white/60 hover:text-foreground transition-colors duration-300 tracking-wide">{link.label}</a>
                  ) : (
                    <Link key={link.label} href={link.href}
                      className="text-[13px] font-medium text-white/60 hover:text-foreground transition-colors duration-300 tracking-wide">{link.label}</Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4">
          {socialLinks.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-white/10 bg-white/5 text-white/60 hover:text-foreground hover:border-white/30 transition-all duration-300">
              <SocialIcon icon={s.icon} />
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-[11px] text-white/40 tracking-widest uppercase">© 2026 IREY PROD. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-[11px] text-white/40 hover:text-foreground/70 transition-colors tracking-wide">Privacy Policy</Link>
            <Link href="/contact" className="text-[11px] text-white/40 hover:text-foreground/70 transition-colors tracking-wide">Terms of Use</Link>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-[10px] text-white/20 tracking-wide">
            Designed & Developed by{" "}
            <a href="https://www.wesleyhelene.com" target="_blank" rel="noopener noreferrer"
              className="text-white/35 hover:text-white/60 transition-colors underline underline-offset-2">
              Wesley Helene
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
