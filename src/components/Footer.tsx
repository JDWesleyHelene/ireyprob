"use client";
import React from "react";
import { toCloudUrl } from "@/lib/imageUrl";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { useSettings } from "@/lib/useLiveData";

// Default icon for unknown social platforms
const DefaultSocialIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
  facebook:     <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  youtube:      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#060606"/></svg>,
  tiktok:       <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/></svg>,
  spotify:      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>,
  twitter:      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  linkedin:     <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  soundcloud:   <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.017.128-.026.257-.026.387s.009.257.026.384l.004.028-.004.035c-.017.128-.026.257-.026.384 0 1.243 1.01 2.252 2.252 2.252.208 0 .41-.029.601-.084h14.9a3.463 3.463 0 0 0 3.463-3.463 3.463 3.463 0 0 0-3.463-3.462 3.47 3.47 0 0 0-.626.057 5.324 5.324 0 0 0-5.313-5.003 5.327 5.327 0 0 0-4.7 2.836 3.233 3.233 0 0 0-1.577-.413A3.245 3.245 0 0 0 3.44 8.856c0 .16.013.317.035.472z"/></svg>,
  threads:      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068v-.088c.024-3.378.993-6.14 2.881-8.215C6.284 1.621 9.018.5 12.415.5c2.721 0 5.043.758 6.9 2.252 1.773 1.432 2.998 3.467 3.64 6.049l-2.627.623c-.48-1.99-1.381-3.57-2.682-4.698-1.261-1.095-2.929-1.65-4.961-1.65-2.647 0-4.74.902-6.218 2.682-1.417 1.706-2.138 4.136-2.162 7.22v.088c0 3.181.762 5.658 2.265 7.362 1.468 1.665 3.574 2.513 6.258 2.531h.007c1.881 0 3.441-.421 4.637-1.251.886-.609 1.535-1.435 1.929-2.455.22-.573.345-1.222.371-1.931a8.38 8.38 0 0 1-2.124.768c-.944.198-1.956.271-3.01.218-2.03-.103-3.633-.795-4.764-2.057-1.016-1.134-1.524-2.638-1.47-4.358.055-1.755.645-3.198 1.754-4.289 1.149-1.131 2.72-1.724 4.539-1.724.325 0 .655.018.984.053 1.374.149 2.544.623 3.478 1.41.48.409.887.889 1.212 1.432.149-1.244-.014-2.306-.484-3.154-.57-1.034-1.549-1.659-2.911-1.857-.348-.051-.71-.077-1.079-.077-1.376 0-2.456.377-3.208 1.12-.635.626-.983 1.474-1.037 2.52-.04.776.11 1.41.445 1.884.299.424.741.7 1.313.822.469.1.994.081 1.561-.054-.198-.283-.308-.634-.308-1.037 0-.891.569-1.613 1.27-1.613.699 0 1.268.722 1.268 1.613 0 .485-.153.912-.408 1.211.583-.096 1.14-.256 1.66-.476l.638 2.509c-.892.35-1.858.571-2.875.657-.479.04-.97.055-1.467.044-1.484-.034-2.717-.501-3.665-1.388-.966-.905-1.478-2.131-1.523-3.645-.044-1.5.389-2.759 1.285-3.738.933-1.021 2.265-1.582 3.863-1.66z"/></svg>,
  music:        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  music_prod:   <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  apple_music:  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  deezer:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M8 6v12M4 9v6M16 6v12M20 9v6"/></svg>,
  twitch:       <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>,
  pinterest:    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>,
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
                <span className="text-white/50">{SOCIAL_ICONS[s.key] ?? <DefaultSocialIcon/>}</span>
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
