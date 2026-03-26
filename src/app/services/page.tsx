"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { useSettings } from "@/lib/useLiveData";

const DEFAULT_SERVICES = [
  { id:"1", service_number:"01", title:"Bookings", tagline:"Connecting Artists & Audiences", description:"We connect world-class artists with venues, festivals, and private events across the Indian Ocean and beyond.", image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg", image_alt:"IREY PROD bookings", features:["Artist sourcing & negotiation","Contract management","Rider coordination","Travel & logistics"] },
  { id:"2", service_number:"02", title:"Tours", tagline:"Regional & International Tour Management", description:"Comprehensive tour management for regional and international tours, handling everything from routing and scheduling to on-the-road support.", image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg", image_alt:"IREY PROD tours", features:["Tour routing & scheduling","Venue partnerships","Promotion & marketing","On-tour support"] },
  { id:"3", service_number:"03", title:"Events", tagline:"End-to-End Event Production", description:"End-to-end event production from concept to curtain call — we handle every detail so you can focus on the experience.", image:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", image_alt:"IREY PROD events", features:["Concept development","Venue sourcing","Artist curation","Technical production"] },
  { id:"4", service_number:"04", title:"Productions", tagline:"Stage & Digital Production", description:"Full-scale stage and digital production services — from sound and lighting design to video production and digital marketing.", image:"https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", image_alt:"IREY PROD productions", features:["Stage design & build","Sound & lighting","Video production","Digital marketing"] },
];

const DEFAULT_WHY = [
  { title:"Creativity",      desc:"We think outside the box to deliver unique, memorable experiences for every client and artist." },
  { title:"Professionalism", desc:"Punctuality, reliability, and a commitment to quality in every aspect of our work." },
  { title:"Passion",         desc:"A genuine passion for music and events drives everything we do — from the first call to the final bow." },
  { title:"Innovation",      desc:"We stay ahead of industry trends and embrace new technologies to deliver cutting-edge results." },
  { title:"Client-Centric",  desc:"Your needs come first. We tailor every service to meet and exceed your expectations." },
  { title:"Integrity",       desc:"Honest, transparent, and ethical in all our dealings — with clients, artists, and partners alike." },
];

export default function ServicesPage() {
  const settings  = useSettings();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Read live data from settings — fall back to defaults
  const services = (() => { try { if (settings.services_cards) return JSON.parse(settings.services_cards); } catch {} return DEFAULT_SERVICES; })();
  const whyItems = (() => { try { if (settings.services_why) return JSON.parse(settings.services_why); } catch {} return DEFAULT_WHY; })();

  const heroHeading = settings.services_hero_heading || "What We Do";
  const heroSub     = settings.services_hero_sub     || "IREY PROD is a multi-faceted agency operating in the entertainment and events industry.";
  const whyHeading  = settings.services_why_heading  || "Why Work With Us?";
  const ctaHeading  = settings.services_cta_heading  || "We're Looking Forward to Starting Something New";
  const ctaSub      = settings.services_cta_sub      || "Whether it's a booking, a tour, an event, or a full production — we're ready to make it happen.";

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.06, rootMargin: "0px 0px -5% 0px" }
    );
    sectionRef?.current?.querySelectorAll(".reveal")?.forEach(el => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main ref={sectionRef} className="min-h-screen bg-background">

        {/* Hero */}
        <section className="relative pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none"/>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent"/>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/85 block mb-4">— Services</span>
            <h1 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.5rem] font-extrabold italic text-white leading-[0.9] tracking-tight mb-6 max-w-4xl">{heroHeading}</h1>
            <p className="reveal text-[14px] sm:text-[15px] text-white/70 font-light max-w-xl leading-relaxed">{heroSub}</p>
          </div>
        </section>

        {/* 4 Service blocks */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-16 sm:pb-24">
          <div className="flex flex-col gap-0">
            {services.map((service: any, i: number) => (
              <div key={service.id} className={`reveal grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-white/5 py-12 sm:py-20`}>
                <div className={`relative overflow-hidden rounded-sm h-[260px] sm:h-[340px] lg:h-[400px] img-zoom-wrap bg-foreground/5 ${i%2===1?"lg:order-2":""}`}>
                  {service.image ? (
                    <AppImage src={service.image} alt={service.image_alt||service.title} fill
                      className="img-zoom object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"/>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent"/>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                  <div className="absolute top-6 left-6">
                    <span className="font-display text-[3rem] sm:text-[4rem] font-light italic text-white/10">{service.service_number}</span>
                  </div>
                </div>
                <div className={`flex flex-col justify-center mt-6 lg:mt-0 ${i%2===1?"lg:order-1 lg:pr-16":"lg:pl-16"}`}>
                  <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-accent block mb-3">— {service.service_number}</span>
                  <h2 className="font-display text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-extrabold italic text-white leading-[0.95] mb-4">{service.title}</h2>
                  <p className="text-[13px] font-semibold tracking-wide text-white/90 mb-4 uppercase">{service.tagline}</p>
                  <p className="text-[14px] text-white/70 font-light leading-relaxed mb-6 sm:mb-8">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features?.map((f: string) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0"/>
                        <span className="text-[12px] text-white/90 font-light">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="bg-[#040404] py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="mb-10 sm:mb-14">
              <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/85 block mb-3">— Why Choose Us</span>
              <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-extrabold italic text-white leading-[0.95]">{whyHeading}</h2>
            </div>
            <div className="why-us-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/5">
              {whyItems.map((item: any, i: number) => (
                <div key={i} className="why-us-item reveal bg-[#040404] p-7 sm:p-10 hover:bg-background transition-colors duration-300">
                  <div className="w-8 h-px bg-accent mb-5 sm:mb-6"/>
                  <h3 className="text-[15px] font-semibold tracking-wide text-white mb-3">{item.title}</h3>
                  <p className="text-[13px] text-white/90 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-24">
          <div className="reveal relative overflow-hidden rounded-sm border border-foreground/8 p-8 sm:p-12 md:p-20 bg-foreground/[0.02] text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"/>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,237,232,0.02),transparent_70%)]"/>
            <div className="relative z-10">
              <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white block mb-4">— New Project</span>
              <h2 className="font-display text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] font-extrabold italic text-white leading-[0.95] mb-4">{ctaHeading}</h2>
              <p className="text-[14px] text-white/70 font-light max-w-lg mx-auto mb-8 sm:mb-10">{ctaSub}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
                  Get In Touch <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/bookings" className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 border border-foreground/20 text-foreground text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-foreground/5 transition-all duration-300">
                  Book An Artist
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
