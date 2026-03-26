"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppImage from "@/components/ui/AppImage";
import { useSettings } from "@/lib/useLiveData";

const stats = [
{ value: "4", label: "Core Services" },
{ value: "360°", label: "Full Agency Coverage" },
{ value: "100%", label: "Client-Centric Approach" },
{ value: "1", label: "One-Stop Agency" }];


const DEFAULT_VALUES = [
{
  number: "01",
  title: "Creativity",
  description: "Embracing creativity is fundamental in event planning and artist management. The ability to think outside the box, generate innovative ideas, and deliver unique experiences is highly valued."
},
{
  number: "02",
  title: "Integrity",
  description: "Trust is essential in any business relationship. We emphasise honesty, transparency, and ethical behaviour in all dealings with clients, artists, and other stakeholders."
},
{
  number: "03",
  title: "Client-Centric Approach",
  description: "Placing the client\'s needs and satisfaction at the forefront is a key value. Understanding and meeting or exceeding client expectations contribute to long-term success and positive relationships."
},
{
  number: "04",
  title: "Collaboration",
  description: "Effective collaboration is essential for success in the event and entertainment industry. We work closely with clients, artists, vendors, and other stakeholders to create seamless and successful events."
},
{
  number: "05",
  title: "Professionalism",
  description: "Maintaining a high level of professionalism in all aspects of business — from communication to event execution — is crucial. This includes punctuality, reliability, and a commitment to delivering quality services."
},
{
  number: "06",
  title: "Innovation",
  description: "Constantly seeking new and better ways to execute events and manage artists is a core value. Embracing technological advancements and staying ahead of industry trends contribute to sustained success."
},
{
  number: "07",
  title: "Passion",
  description: "A passion for creating memorable events and supporting artists in their careers is our driving force. This passion inspires dedication and a strong work ethic among our team members."
},
{
  number: "08",
  title: "Attention to Detail",
  description: "The success of an event often depends on meticulous planning and execution. Having an eye for detail ensures that nothing is overlooked and that events run smoothly."
}];


const team = [
{
  name: "Creative Director",
  role: "Bookings & Artist Management",
  image: "https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d024-qetpkvnnuor9fqhufseegetdgswcuflrz3eovw9x60.jpg",
  imageAlt: "IREY PROD creative director in professional portrait"
},
{
  name: "Production Manager",
  role: "Events & Logistics",
  image: "https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d029-qetpkzf0m0weq6cdtu0wqdv7ucdtp80pbm0mt04ch4.jpg",
  imageAlt: "IREY PROD production manager in professional portrait"
},
{
  name: "Digital Marketing Lead",
  role: "Press & Digital Strategy",
  image: "https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d005-qetpkgm8tc6o9z3ovlwdcilzymyhf9y2l0yx7gw7xk.jpg",
  imageAlt: "IREY PROD digital marketing lead in professional portrait"
}];


export default function AboutPage() {
  const settings  = useSettings();
  const values = (() => { try { if (settings.about_values) return JSON.parse(settings.about_values); } catch {} return DEFAULT_VALUES; })();
  const storyHeading = settings.about_story_heading || "About the Agency";
  const storyText1   = settings.about_story_text1   || "Our agency is a dynamic and forward-thinking organisation specialising in Digital Marketing, Stage and Artist Management, as well as Event Coordination.";
  const storyText2   = settings.about_story_text2   || "Our mission is to create successful and fulfilling experiences — whether for clients hosting events or artists pursuing their careers.";
  const valuesHeading = settings.about_values_heading || "Our Values";
  const ctaHeading   = settings.about_cta_heading   || "Ready to Work Together?";
  const ctaSub       = settings.about_cta_sub       || "Let's create something extraordinary.";
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -5% 0px" }
    );
    const reveals = sectionRef?.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  // GSAP animations
  useEffect(() => {
    let ctx: any;
    const initGsap = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".about-hero-title", { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
        gsap.from(".about-story-img", {
          scale: 1.05, opacity: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: ".about-story-img", start: "top 80%", once: true }
        });
        gsap.from(".about-story-text > *", {
          y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".about-story-text", start: "top 80%", once: true }
        });
        gsap.from(".about-value-item", {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ".about-values-grid", start: "top 80%", once: true }
        });
        gsap.from(".about-team-card", {
          y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".about-team-grid", start: "top 80%", once: true }
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
        {/* Page Hero - reduced padding */}
        <section className="relative pt-24 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,232,0.015)_1px,transparent_1px)] bg-[size:10rem_20rem] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">{settings.about_hero_label || "— About Agency"}</span>
            <h1 className="about-hero-title font-display text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.5rem] font-light italic text-white leading-[0.9] tracking-tight mb-6 max-w-4xl">
              {settings.about_hero_heading || "The One-Stop Agency You'll Ever Need"}
            </h1>
            <p className="reveal text-[14px] sm:text-[15px] text-white/70 font-light max-w-xl leading-relaxed">
              {settings.about_hero_sub || "Relax & Take It Easy! IREY PROD is a dynamic and forward-thinking organisation based in Mauritius Island, dedicated to emerging and established talents in the entertainment industry."}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            <div>
              <div className="about-story-img reveal relative overflow-hidden rounded-sm h-[320px] sm:h-[420px] lg:h-[500px] img-zoom-wrap">
                <AppImage src="https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg" alt="IREY PROD live event production in Mauritius with crowd and stage" fill className="img-zoom object-cover grayscale brightness-75" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-accent">Mauritius Island</span>
                </div>
              </div>
            </div>
            <div className="about-story-text flex flex-col gap-6 sm:gap-8">
              <div className="reveal">
                <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-4">— Who We Are</span>
                <h2 className="font-display text-[1.8rem] sm:text-[2.2rem] md:text-[2.8rem] font-light italic text-white leading-[1.05] mb-5">
                  Bookings, Tours,<br />Events, Productions
                </h2>
                <p className="text-[14px] text-white/70 font-light leading-relaxed mb-4">
                  {storyText1}
                </p>
                <p className="text-[14px] text-white/70 font-light leading-relaxed mb-4">
                  We pride ourselves on our ability to seamlessly blend creativity, innovation, and strategic thinking to provide unparalleled support and services to both emerging and established talents in the entertainment industry.
                </p>
                <p className="text-[14px] text-white/70 font-light leading-relaxed">
                  Based in Mauritius Island, IREY PROD operates across the music and performing arts sectors — delivering Bookings, Tours, Events, and Productions with passion and precision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="border-y border-foreground/5 py-16 sm:py-20 bg-[#040404]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-4">— Our Mission</span>
                <h2 className="reveal font-display text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-light italic text-white leading-[0.95] mb-5">
                  Creating Successful &amp;<br />Fulfilling Experiences
                </h2>
                <p className="reveal text-[14px] text-white/70 font-light leading-relaxed">
                  {storyText2}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats?.map((stat, i) => (
                  <div key={i} className={`reveal delay-${i * 100} text-center p-6 sm:p-8 border border-white/10 rounded-sm bg-background/50`}>
                    <span className="font-display text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] font-light italic text-white block leading-none mb-2">{stat?.value}</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60">{stat?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-24">
          <div className="mb-10 sm:mb-14">
            <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">— Our Values</span>
            <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-white leading-[0.95]">
              What Guides Us
            </h2>
          </div>
          <div className="about-values-grid grid grid-cols-1 sm:grid-cols-2 gap-px bg-foreground/5">
            {values?.map((value, i) => (
              <div key={i} className={`about-value-item reveal delay-${i % 2 * 100} bg-background p-7 sm:p-10 hover:bg-[#040404] transition-colors duration-300`}>
                <span className="font-display text-[2.5rem] sm:text-[3rem] font-light italic text-white/15 block mb-4 leading-none">{value?.number}</span>
                <h3 className="text-[15px] font-semibold tracking-wide text-white mb-3">{value?.title}</h3>
                <p className="text-[13px] text-white/60 font-light leading-relaxed">{value?.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-[#040404] py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="mb-10 sm:mb-14">
              <span className="reveal text-[10px] font-semibold tracking-[0.28em] uppercase text-white/50 block mb-3">— The Team</span>
              <h2 className="reveal font-display text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] font-light italic text-white leading-[0.95]">
                A Small But Effective Team
              </h2>
            </div>
            <div className="about-team-grid grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {team?.map((member, i) => (
                <div key={i} className={`about-team-card reveal delay-${i * 100} group`}>
                  <div className="relative overflow-hidden rounded-sm h-[260px] sm:h-[320px] mb-4 sm:mb-5 img-zoom-wrap">
                    <AppImage src={member?.image} alt={member?.imageAlt} fill className="img-zoom object-cover grayscale group-hover:grayscale-0 transition-all duration-700" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-1">{member?.name}</h3>
                  <p className="text-[12px] text-white/60 tracking-wide">{member?.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-24">
          <div className="reveal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 sm:p-12 border border-foreground/8 rounded-sm bg-foreground/[0.02]">
            <div>
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-light italic text-white mb-2">
                Want to know how we can help your business?
              </h3>
              <p className="text-[13px] text-white/40 font-light">
                Got questions? Ideas? Leave your details and our specialist will contact you.
              </p>
            </div>
            <Link href="/contact" className="flex-shrink-0 px-8 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-background bg-foreground rounded-sm hover:bg-accent transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}