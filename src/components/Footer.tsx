"use client";
import React from "react";
import { toCloudUrl } from "@/lib/imageUrl";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { useSettings } from "@/lib/useLiveData";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
  facebook:   <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  youtube:    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#060606"/></svg>,
  tiktok:     <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/></svg>,
  spotify:    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>,
  twitter:    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  linkedin:   <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  soundcloud: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.017.128-.026.257-.026.387s.009.257.026.384l.004.028-.004.035c-.017.128-.026.257-.026.384 0 1.243 1.01 2.252 2.252 2.252.208 0 .41-.029.601-.084h14.9a3.463 3.463 0 0 0 3.463-3.463 3.463 3.463 0 0 0-3.463-3.462 3.47 3.47 0 0 0-.626.057 5.324 5.324 0 0 0-5.313-5.003 5.327 5.327 0 0 0-4.7 2.836 3.233 3.233 0 0 0-1.577-.413A3.245 3.245 0 0 0 3.44 8.856c0 .16.013.317.035.472z"/></svg>,
};

export default function Footer() {
  const settings = useSettings();
  const phone       = settings.contact_phone   || settings.phone     || "+230 5 788 20 14";
  const email       = settings.contact_email   || "booking@ireyprod.com";
  const location    = settings.contact_address || settings.location  || "Mauritius Island";
  const officeHours = settings.office_hours    || "Mon – Fri · 10am – 5pm";

  // Dynamic social links from Settings → Social Media tab
  const socialLinks = Object.entries(settings)
    .filter(([k, v]) => k.startsWith("social_") && v && v !== "__DELETE__")
    .map(([k, v]) => ({ key: k.replace("social_",""), label: k.replace("social_","").replace(/_/g," "), href: v }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <footer className="relative border-t border-white/5 bg-background overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px footer-line"/>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">

          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4 items-start">
            <Link href="/"><AppImage src="https://res.cloudinary.com/dvmhbtiz4/image/upload/ireyprod/IREY-PROD-WHITE.png" alt="IREY PROD" width={120} height={44} className="h-9 w-auto object-contain opacity-90" unoptimized/></Link>
            <p className="text-[12px] text-white/80 leading-relaxed font-light">Booking agency & production for music and performing arts. Based in Mauritius Island.</p>
            <div className="space-y-1">
              <a href={`tel:${phone.replace(/[^+0-9]/g,"")}`} className="block text-[13px] text-white/90 hover:text-accent transition-colors">{phone}</a>
              <a href={`mailto:${email}`} className="block text-[12px] text-white/80 hover:text-accent transition-colors">{email}</a>
              <p className="text-[11px] text-white/60">{officeHours}</p>
              <p className="text-[11px] text-white/60">{location}</p>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/70">Company</h4>
            {[{l:"Home",h:"/"},{l:"About",h:"/about"},{l:"Contact",h:"/contact"}].map(x=>(
              <Link key={x.h} href={x.h} className="text-[13px] text-white/80 hover:text-white transition-colors">{x.l}</Link>
            ))}
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/70">Services</h4>
            {[{l:"Artists",h:"/bookings"},{l:"Events",h:"/events"},{l:"Productions",h:"/services"}].map(x=>(
              <Link key={x.l} href={x.h} className="text-[13px] text-white/80 hover:text-white transition-colors">{x.l}</Link>
            ))}
          </div>

          {/* Social — fully dynamic from Settings */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/70">Follow Us</h4>
            {socialLinks.length === 0 ? (
              <p className="text-[12px] text-white/50 italic">Add links in Settings → Social Media</p>
            ) : socialLinks.map(s => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[13px] text-white/80 hover:text-foreground transition-colors capitalize">
                {SOCIAL_ICONS[s.key] && <span className="text-white/50">{SOCIAL_ICONS[s.key]}</span>}
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/60 tracking-widest uppercase">© 2026 IREY PROD. All Rights Reserved.</p>
          <p className="text-[10px] text-white/50">Designed & Developed by <a href="https://www.wesleyhelene.com" target="_blank" rel="noopener noreferrer" className="font-bold text-accent hover:text-accent/80 transition-colors">Wesley Helene</a></p>
        </div>
      </div>
    </footer>
  );
}
