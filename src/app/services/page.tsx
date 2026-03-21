"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { services as allServices } from "@/lib/data";

const whyUs = [
  { title: "Creativity", desc: "We think outside the box to deliver unique, memorable experiences for every client and artist." },
  { title: "Professionalism", desc: "Punctuality, reliability, and a commitment to quality in every aspect of our work." },
  { title: "Passion", desc: "A genuine passion for music and events drives everything we do — from the first call to the final bow." },
  { title: "Innovation", desc: "We stay ahead of industry trends and embrace new technologies to deliver cutting-edge results." },
  { title: "Client-Centric", desc: "Your needs come first. We tailor every service to meet and exceed your expectations." },
  { title: "Integrity", desc: "Honest, transparent, and ethical in all our dealings — with clients, artists, and partners alike." },
];

export default function ServicesPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.06, rootMargin: "0px 0px -5% 0px" }
    );
    sectionRef?.current?.querySelectorAll(".reveal")?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    let ctx: any;
    const initGsap = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".services-hero-title", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
        allServices.forEach((_, i) => {
          gsap.from(`.service-block-${i}`, {
            y: 50, opacity: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: `.service-block-${i}`, start: "top 80%", once: true },
          });
        });
        gsap.from(".why-us-item", {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".why-us-grid", start: "top 80%", once: true },
        });
      }, sectionRef);
    };
    initGsap();
    return () => ctx?.revert();
  }, []);

  return (
    <>
      <Header />
      <main ref={sectionRef} className="min-h-screen bg-background">
        {/* Page Hero */}
        <section className="relative pt-24 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">— Services</span>
            <h1 className="services-hero-title font-display text-[2.8rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-light italic text-white leading-[0.9] tracking-tight mb-6 max-w-4xl">Our Expertise</h1>
            <p className="reveal text-[14px] sm:text-[15px] text-white/70 font-light max-w-xl leading-relaxed">
              IREY PROD is a multi-faceted agency operating in the entertainment and events industry, with a focus on music and performing arts. Four core service pillars — Bookings, Tours, Events, and Productions.
            </p>
          </div>
        </section>

        {/* Services — alternating layout */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-16 sm:pb-24">
          <div className="flex flex-col gap-0">
            {allServices.map((service, i) => (
              <div key={service.id} className={`service-block-${i} reveal grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-white/5 py-12 sm:py-20`}>
                {/* Image */}
                <div className={`relative overflow-hidden rounded-sm h-[260px] sm:h-[340px] lg:h-[400px] img-zoom-wrap ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <AppImage src={service.image} alt={service.image_alt} fill
                    className="img-zoom object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="font-display text-[3rem] sm:text-[4rem] font-light italic text-white/10">{service.service_number}</span>
                  </div>
                </div>
                {/* Content */}
                <div className={`flex flex-col justify-center mt-6 lg:mt-0 ${i % 2 === 1 ? "lg:order-1 lg:pr-16" : "lg:pl-16"}`}>
                  <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-accent block mb-3">— {service.service_number}</span>
                  <h2 className="font-display text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-light italic text-white leading-[0.95] mb-4">{service.title}</h2>
                  <p className="text-[13px] font-semibold tracking-wide text-white/60 mb-4 uppercase">{service.tagline}</p>
                  <p className="text-[14px] text-white/70 font-light leading-relaxed mb-6 sm:mb-8">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features?.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-[12px] text-white/60 font-light">{feature}</span>
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
              <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">— Why Choose Us</span>
              <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-white leading-[0.95]">Why Work With Us?</h2>
            </div>
            <div className="why-us-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/5">
              {whyUs.map((item, i) => (
                <div key={i} className={`why-us-item reveal bg-[#040404] p-7 sm:p-10 hover:bg-background transition-colors duration-300`}>
                  <div className="w-8 h-px bg-accent mb-5 sm:mb-6" />
                  <h3 className="text-[15px] font-semibold tracking-wide text-white mb-3">{item.title}</h3>
                  <p className="text-[13px] text-white/60 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-24">
          <div className="reveal relative overflow-hidden rounded-sm border border-foreground/8 p-8 sm:p-12 md:p-20 bg-foreground/[0.02] text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(240,237,232,0.02),transparent_70%)]" />
            <div className="relative z-10">
              <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white block mb-4">— New Project</span>
              <h2 className="font-display text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] font-light italic text-white leading-[0.95] mb-4">
                We're Looking Forward to<br /><span className="text-white">Starting Something New</span>
              </h2>
              <p className="text-[14px] text-white font-light max-w-lg mx-auto mb-8 sm:mb-10">
                Let's take your business to the next level! Whether it's a booking, a tour, an event, or a full production — we're ready to make it happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all duration-300">
                  Get In Touch<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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
