"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { useSettings } from "@/lib/useLiveData";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/ireyprod/", handle: "@ireyprod" },
  { label: "Facebook",  href: "https://www.facebook.com/IreyProd",   handle: "IreyProd" },
  { label: "YouTube",   href: "https://www.youtube.com/@IreyProd",    handle: "@IreyProd" },
  { label: "TikTok",    href: "https://www.tiktok.com/@ireyprod",     handle: "@ireyprod" },
];

interface Errors { name?: string; email?: string; subject?: string; project?: string; }

function ContactForm() {
  const searchParams = useSearchParams();
  const prefillSubject = searchParams.get("subject") || "";

  const [formData, setFormData] = useState({
    name: "", email: "", subject: prefillSubject, project: "",
  });
  const [errors, setErrors]       = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!formData.name.trim())    e.name    = "Name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Valid email required";
    if (!formData.subject.trim()) e.subject = "Subject is required";
    if (!formData.project.trim()) e.project = "Please describe your project";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name as keyof Errors]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch { /* ignore */ }
    setLoading(false);
    setSubmitted(true);
  };

  const inputCls = (field: string) =>
    `w-full bg-foreground/[0.03] border rounded-sm px-4 py-3.5 text-[13px] text-white placeholder-foreground/25 focus:outline-none transition-all duration-300 ${
      errors[field as keyof Errors] ? "border-red-500/60" : activeField === field ? "border-foreground/40 bg-foreground/[0.05]" : "border-foreground/10"
    }`;

  return submitted ? (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full border border-accent/40 flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping" />
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h3 className="font-display text-3xl font-light italic text-white mb-3">Message Sent!</h3>
      <p className="text-[14px] text-white/80 font-light max-w-sm leading-relaxed">
        Thank you for your enquiry. Our team will review your project and get back to you within 48 hours.
      </p>
      <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", project: "" }); }}
        className="mt-8 px-8 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all duration-300">
        Send Another
      </button>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {prefillSubject && (
        <div className="px-4 py-3 bg-accent/10 border border-accent/20 rounded-sm">
          <p className="text-[11px] text-accent/80">Enquiry pre-filled: <strong>{prefillSubject}</strong></p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80 mb-2">Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            onFocus={() => setActiveField("name")} onBlur={() => setActiveField(null)}
            placeholder="Your name" className={inputCls("name")} />
          {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80 mb-2">Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            onFocus={() => setActiveField("email")} onBlur={() => setActiveField(null)}
            placeholder="your@email.com" className={inputCls("email")} />
          {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80 mb-2">Subject *</label>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange}
          onFocus={() => setActiveField("subject")} onBlur={() => setActiveField(null)}
          placeholder="What is your enquiry about?"
          className={inputCls("subject")}
          readOnly={Boolean(prefillSubject)} />
        {errors.subject && <p className="text-[11px] text-red-400 mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80 mb-2">Tell Us About Your Project *</label>
        <textarea name="project" value={formData.project} onChange={handleChange}
          onFocus={() => setActiveField("project")} onBlur={() => setActiveField(null)}
          rows={6} placeholder="Describe your project, event, or idea..."
          className={inputCls("project") + " resize-none"} />
        {errors.project && <p className="text-[11px] text-red-400 mt-1">{errors.project}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button type="submit" disabled={loading}
          className="group px-10 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all duration-300 flex items-center gap-3 disabled:opacity-60">
          {loading ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending...</>
          ) : (
            <>Submit Enquiry<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
          )}
        </button>
        <p className="text-[11px] text-white/25 font-light">* Required. We respond within 48 hours.</p>
      </div>
    </form>
  );
}

export default function ContactPage() {
  const liveSettings = useSettings();
  const phone       = liveSettings.phone         || "+230 5 788 20 14";
  const email       = liveSettings.contact_email || "booking@ireyprod.com";
  const officeHours = liveSettings.office_hours  || "Mon – Fri, 10am – 5pm";
  const location    = liveSettings.location      || "Mauritius Island, Indian Ocean";

  const contactDetails = [
    { label: "Phone",        value: phone,       href: `tel:${phone.replace(/[^+0-9]/g, "")}`,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.79-1.79a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
    { label: "Email",        value: email,       href: `mailto:${email}`,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
    { label: "Location",     value: location,    href: "#",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> },
    { label: "Office Hours", value: officeHours, href: "#",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* HERO */}
        <section className="relative h-[60vh] min-h-[480px] overflow-hidden flex items-end">
          <AppImage
            src={liveSettings.contact_hero_bg || "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg"}
            alt="IREY PROD event production"
            fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute inset-0 noise pointer-events-none opacity-30" />
          <div className="relative max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-14 pt-32">
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/85 block mb-4">{liveSettings.contact_hero_label || "— Contact"}</span>
            <h1 className="font-display text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] font-light italic text-white leading-[0.88] tracking-tight max-w-4xl">
              {liveSettings.contact_hero_heading || "Let's Start Right Now!"}
            </h1>
            <p className="mt-4 text-[14px] text-white/90 font-light max-w-md leading-relaxed">
              {liveSettings.contact_hero_sub || "Got a project in mind? Fill out the form and we'll get back within 48 hours."}
            </p>
          </div>
        </section>

        {/* CONTACT STRIP */}
        <section className="bg-[#040404] border-b border-white/5">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              {contactDetails.map((detail, i) => (
                <a key={i} href={detail.href}
                  className="group flex flex-col gap-3 p-5 sm:p-7 bg-[#040404] hover:bg-background transition-colors duration-300">
                  <div className="text-white/80 group-hover:text-accent transition-colors duration-300">{detail.icon}</div>
                  <div>
                    <p className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-1">{detail.label}</p>
                    <p className="text-[13px] text-white/80 group-hover:text-white transition-colors font-light leading-snug">{detail.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN BODY */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20">

            {/* Sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h2 className="font-display text-[1.8rem] sm:text-[2.2rem] font-light italic text-white mb-3">{liveSettings.contact_form_heading || "Make an Online Enquiry"}</h2>
                <p className="text-[13px] sm:text-[14px] text-white/90 font-light leading-relaxed">
                  Got questions? Ideas? Fill out the form and our team will get back to you with a tailored proposal.
                </p>
              </div>
              <div>
                <h3 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/80 mb-4">Connect With Us</h3>
                <div className="flex flex-col gap-1">
                  {socialLinks.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3 border-b border-white/5 hover:border-white/20 transition-colors duration-300">
                      <span className="text-[13px] font-semibold text-white/70 group-hover:text-white transition-colors">{s.label}</span>
                      <span className="text-[12px] text-white/80 group-hover:text-white/90 transition-colors flex items-center gap-1.5">
                        {s.handle}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-5 border border-white/8 rounded-sm bg-foreground/[0.02] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80">Response Time</span>
                </div>
                <p className="text-[13px] text-white/85 font-light leading-relaxed">
                  Our team responds within <strong className="text-white/70 font-medium">48 business hours</strong>. Monday – Friday, 10am to 5pm.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-96 bg-foreground/5 rounded-sm animate-pulse" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </section>

        {/* PHONE BAND */}
        <section className="border-t border-foreground/5 bg-[#040404] py-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/20 mb-2">Questions? Reach Us</p>
              <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`}
                className="font-display text-[1.8rem] sm:text-[2.5rem] font-light italic text-white hover:text-accent transition-colors duration-300">
                {phone}
              </a>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[12px] text-white/70 font-light">Monday – Friday</p>
              <p className="text-[12px] text-white/70 font-light">10 am to 5 pm</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
