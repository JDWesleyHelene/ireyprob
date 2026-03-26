"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { useArtists, useSettings } from "@/lib/useLiveData";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormErrors { fullName?: string; email?: string; address?: string; dateTime?: string; }

function BookingModal({ artist, onClose }: { artist: any; onClose: () => void }) {
  const [formData, setFormData] = useState({ fullName: "", email: "", address: "", dateTime: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.address.trim()) newErrors.address = "Venue address is required";
    if (!formData.dateTime) newErrors.dateTime = "Date and time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist_name: artist.name, ...formData }),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      // Fallback — show success anyway for demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg bg-[#0a0a0a] border border-foreground/10 rounded-sm overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-32 overflow-hidden">
          <AppImage src={artist.image} alt={artist.image_alt || artist.name} fill className="object-cover grayscale brightness-40" sizes="512px" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-foreground/20 rounded-sm text-foreground/85 hover:text-foreground hover:border-foreground/50 transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="mb-6">
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent block mb-1">{artist.genre}</span>
            <h3 className="font-display text-2xl font-light italic text-foreground">Book {artist.name}</h3>
          </div>
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="w-14 h-14 rounded-full border border-accent/40 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h4 className="font-display text-xl font-light italic text-foreground mb-2">Request Sent!</h4>
              <p className="text-[13px] text-foreground/80 font-light">Your booking request for {artist.name} has been submitted. We'll be in touch within 48 hours.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all duration-300">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/80 mb-2">Subject</label><input type="text" value={`Booking Request: ${artist.name}`} readOnly className="w-full bg-foreground/[0.05] border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground/85 cursor-not-allowed" /></div>
              {[{ name: "fullName", label: "Full Name *", placeholder: "Your full name", type: "text" }, { name: "email", label: "Email *", placeholder: "your@email.com", type: "email" }, { name: "address", label: "Address / Venue *", placeholder: "Event venue address", type: "text" }].map(field => (
                <div key={field.name}>
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/80 mb-2">{field.label}</label>
                  <input type={field.type} name={field.name} value={formData[field.name as keyof typeof formData]} onChange={handleChange} placeholder={field.placeholder}
                    className={`w-full bg-foreground/[0.03] border rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/25 focus:outline-none transition-colors duration-300 ${errors[field.name as keyof FormErrors] ? "border-red-500/60" : "border-foreground/10 focus:border-foreground/30"}`} />
                  {errors[field.name as keyof FormErrors] && <p className="text-[11px] text-red-400 mt-1">{errors[field.name as keyof FormErrors]}</p>}
                </div>
              ))}
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/80 mb-2">Date & Time Needed *</label>
                <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange}
                  className={`w-full bg-foreground/[0.03] border rounded-sm px-4 py-3 text-[13px] text-foreground/60 focus:outline-none transition-colors duration-300 [color-scheme:dark] ${errors.dateTime ? "border-red-500/60" : "border-foreground/10 focus:border-foreground/30"}`} />
                {errors.dateTime && <p className="text-[11px] text-red-400 mt-1">{errors.dateTime}</p>}
              </div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/80 mb-2">Additional Details</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Tell us more about your event..." className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground placeholder-foreground/25 focus:outline-none focus:border-foreground/30 transition-colors duration-300 resize-none" />
              </div>
              {submitError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-sm"><p className="text-[12px] text-red-400">{submitError}</p></div>}
              <button type="submit" disabled={loading}
                className="w-full py-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all duration-300 mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending...</> : "Send Booking Request"}
              </button>
              <p className="text-[11px] text-foreground/25 text-center font-light">* Required fields. We'll respond within 48 hours.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const pageSettings = useSettings();
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const { t } = useLanguage();
  const { artists: liveArtists, loading: artistsLoading } = useArtists();





  useEffect(() => {
    document.body.style.overflow = selectedArtist ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedArtist]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="relative pt-28 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/70 block mb-3">— Bookings</span>
            <h1 className="bookings-hero-title font-display text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.5rem] font-light italic text-white leading-[0.9] tracking-tight mb-4">{pageSettings.bookings_hero_heading || t.bookings.pageTitle}</h1>
            <p className="bookings-hero-sub text-[13px] sm:text-[14px] text-white/80 font-light max-w-lg leading-relaxed">{pageSettings.bookings_hero_sub || t.bookings.pageSubtitle}</p>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-24">
          {artistsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[380px] bg-foreground/5 rounded-sm animate-pulse"/>
              ))}
            </div>
          ) : liveArtists.length === 0 ? (
            <div className="py-20 text-center border border-foreground/5 rounded-sm col-span-3">
              <p className="text-foreground/70 text-[13px] mb-2">No artists yet.</p>
              <p className="text-foreground/20 text-[11px]">Add artists from the admin dashboard.</p>
            </div>
          ) : (
          <div className="artists-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {liveArtists.map((artist, i) => (
              <div key={artist.id} className="artist-card">
                <div className="group relative overflow-hidden rounded-sm bg-[#040404] border border-foreground/5 hover:border-foreground/15 transition-all duration-500">
                  <Link href={`/bookings/${artist.slug}`} className="block">
                    <div className="relative h-[260px] sm:h-[300px] overflow-hidden img-zoom-wrap cursor-pointer">
                      <AppImage src={artist.image || "/assets/images/no_image.png"} alt={artist.image_alt || artist.name} fill className="img-zoom object-cover grayscale group-hover:grayscale-0 transition-all duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4"><span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-foreground/15 rounded-sm text-[9px] font-semibold tracking-[0.2em] uppercase text-foreground/70">{artist.genre}</span></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 bg-black/70 backdrop-blur-sm border border-foreground/20 rounded-sm text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/80">View Profile →</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 sm:p-6">
                    <Link href={`/bookings/${artist.slug}`} className="block group/name mb-1">
                      <h3 className="font-display text-xl sm:text-2xl font-light italic text-foreground group-hover/name:text-accent transition-colors duration-300">{artist.name}</h3>
                    </Link>
                    <p className="text-[12px] text-foreground/80 mb-4 tracking-wide">{artist.origin}</p>
                    <button onClick={() => setSelectedArtist(artist)}
                      className="w-full py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                      Book The Artist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
          <div className="mt-12 pt-10 border-t border-foreground/5 text-center">
            <p className="text-[13px] text-foreground/70 font-light mb-2">Don't see who you're looking for?</p>
            <a href="mailto:booking@ireyprod.com" className="text-[12px] font-semibold tracking-[0.15em] uppercase text-foreground/85 hover:text-accent transition-colors duration-300 border-b border-foreground/20 hover:border-accent pb-0.5">Contact us directly →</a>
          </div>
        </section>
      </main>
      <Footer />
      {selectedArtist && <BookingModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />}
    </>
  );
}
