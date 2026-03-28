"use client";
import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import Link from "next/link";

interface FormErrors { fullName?: string; email?: string; address?: string; dateTime?: string; }

function BookingModal({ artistName, artistImage, onClose }: { artistName: string; artistImage: string; onClose: () => void }) {
  const [formData, setFormData] = useState({ fullName: "", email: "", address: "", dateTime: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const validate = () => {
    const e: FormErrors = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Valid email required";
    if (!formData.address.trim()) e.address = "Venue address is required";
    if (!formData.dateTime) e.dateTime = "Date and time is required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch("/api/admin/bookings", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ artist_name: artistName, ...formData }) });
      setSubmitted(true);
    } catch { setSubmitted(true); }
    setLoading(false);
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('page-ready'));
  };

  const fieldCls = (name: string) => `w-full bg-foreground/[0.03] border rounded-sm px-4 py-3 text-[13px] text-white placeholder-foreground/25 focus:outline-none transition-colors duration-300 ${errors[name as keyof FormErrors] ? "border-red-500/60" : "border-foreground/10 focus:border-foreground/30"}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"/>
      <div className="relative z-10 w-full max-w-lg bg-[#0a0a0a] border border-foreground/10 rounded-sm overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="relative h-36 overflow-hidden flex-shrink-0">
          <AppImage src={artistImage||"/assets/images/no_image.png"} alt={artistName} fill className="object-cover grayscale brightness-40" sizes="512px"/>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"/>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-foreground/20 rounded-sm text-foreground/50 hover:text-foreground transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="mb-6">
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-accent block mb-1">Booking Request</span>
            <h3 className="font-display text-2xl font-light italic text-foreground">Book {artistName}</h3>
          </div>
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="w-14 h-14 rounded-full border border-accent/40 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h4 className="font-display text-xl font-light italic text-foreground mb-2">Request Sent!</h4>
              <p className="text-[13px] text-foreground/40 font-light">We&apos;ll be in touch within 48 hours.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Artist</label>
                <input type="text" value={`Booking: ${artistName}`} readOnly className="w-full bg-foreground/[0.05] border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground/50 cursor-not-allowed"/></div>
              {[{name:"fullName",label:"Full Name *",placeholder:"Your full name",type:"text"},{name:"email",label:"Email *",placeholder:"your@email.com",type:"email"},{name:"address",label:"Venue / Address *",placeholder:"Event venue address",type:"text"}].map(f=>(
                <div key={f.name}><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">{f.label}</label>
                  <input type={f.type} name={f.name} value={formData[f.name as keyof typeof formData]} onChange={handleChange} placeholder={f.placeholder} className={fieldCls(f.name)}/>
                  {errors[f.name as keyof FormErrors] && <p className="text-[11px] text-red-400 mt-1">{errors[f.name as keyof FormErrors]}</p>}</div>
              ))}
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Date & Time *</label>
                <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className={fieldCls("dateTime")+" [color-scheme:dark]"}/>
                {errors.dateTime && <p className="text-[11px] text-red-400 mt-1">{errors.dateTime}</p>}</div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Additional Details</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Tell us more about your event..." className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-white placeholder-foreground/25 focus:outline-none focus:border-foreground/30 transition-colors resize-none"/></div>
              <button type="submit" disabled={loading} className="w-full py-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</> : "Send Booking Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArtistProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [artist, setArtist] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/admin/artists").then(r => r.ok ? r.json() : []).then((all: any[]) => {
// Normalize slug for comparison — handle spaces, capitals, etc.
      const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const found = all.find((a: any) => normalize(a.slug) === normalize(slug) || normalize(a.name) === normalize(slug));
      if (found) {
        setArtist(found);
        setRelated(all.filter((a: any) => a.id !== found.id).slice(0, 3));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <><Header/><main className="min-h-screen bg-background flex items-center justify-center">
      <svg className="animate-spin w-6 h-6 text-foreground/20" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
    </main><Footer/></>
  );

  if (!artist) return notFound();

  const tags = Array.isArray(artist.tags) ? artist.tags : [];

  return (
    <>
      <Header/>
      <main className="min-h-screen bg-background">
        <section className="relative h-[75vh] min-h-[540px] overflow-hidden">
          {artist.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={artist.image} alt={artist.imageAlt||artist.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/50 to-black/10"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"/>
          <div className="absolute inset-0 noise pointer-events-none opacity-30"/>

          <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-10 sm:pb-14">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-accent mb-3">{artist.genre}</p>
                <h1 className="font-display text-[2.8rem] sm:text-[4rem] md:text-[7rem] font-light italic text-white leading-[0.92] tracking-tight">{artist.name}</h1>
                <div className="flex items-center gap-2 mt-3 text-white/50 text-[13px]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {artist.origin}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((tag: string) => <span key={tag} className="px-2.5 py-1 bg-white/10 backdrop-blur-sm border border-white/15 rounded-sm text-[9px] font-semibold tracking-[0.2em] uppercase text-white/80">{tag}</span>)}
                </div>
              </div>
              <button onClick={()=>setShowModal(true)} className="w-full md:w-auto flex-shrink-0 inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
                Book {artist.name}
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Left — bio + photo */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-5">— Biography</span>
                <p className="text-[15px] sm:text-[16px] text-foreground/70 leading-relaxed font-light">{artist.bio}</p>
              </div>

              {/* Artist photo — always visible below bio */}
              {artist.image && (
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-4">— Photo</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={artist.image}
                    alt={artist.imageAlt || artist.name}
                    className="w-full rounded-sm object-cover object-top"
                    style={{ maxHeight: "600px", objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              )}
            </div>

            {/* Right — details + CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6">
                <h3 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-foreground/30 mb-5">Artist Details</h3>
                <div className="space-y-4 mb-6">
                  <div><p className="text-[10px] text-foreground/30 mb-0.5">Genre</p><p className="text-[13px] text-foreground/70">{artist.genre}</p></div>
                  <div><p className="text-[10px] text-foreground/30 mb-0.5">Origin</p><p className="text-[13px] text-foreground/70">{artist.origin}</p></div>
                  <div><p className="text-[10px] text-foreground/30 mb-0.5">Status</p>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot"/><p className="text-[13px] text-foreground/70">Available for Booking</p></div>
                  </div>
                </div>
                <div className="pt-5 border-t border-foreground/8 space-y-2">
                  <button onClick={()=>setShowModal(true)} className="w-full flex items-center justify-center gap-2 py-3.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all">
                    Book {artist.name}
                  </button>
                  <Link href={`/contact?subject=${encodeURIComponent(`${artist.name} — Enquiry`)}`}
                    className="w-full flex items-center justify-center py-3 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">
                    General Enquiry
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-[#040404] py-16 sm:py-20">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
              <h2 className="font-display text-[2rem] sm:text-[2.5rem] font-light italic text-foreground mb-10">More Artists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((a:any) => (
                  <Link key={a.id} href={`/bookings/${a.slug}`} className="group relative overflow-hidden rounded-sm h-[240px] img-zoom-wrap">
                    <AppImage src={a.image||""} alt={a.imageAlt||a.name} fill className="img-zoom object-cover grayscale group-hover:grayscale-0 transition-all duration-700" sizes="33vw"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-accent mb-1">{a.genre}</p>
                      <h3 className="font-display text-xl font-light italic text-white group-hover:text-accent transition-colors">{a.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      {/* Back to all artists */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-10 border-t border-foreground/5">
        <Link href="/bookings" className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to All Artists
        </Link>
      </div>
      </main>
      <Footer/>
      {showModal && <BookingModal artistName={artist.name} artistImage={artist.image||""} onClose={()=>setShowModal(false)}/>}
    </>
  );
}
