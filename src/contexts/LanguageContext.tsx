"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Language = "en" | "fr";

interface Translations {
  // Navigation
  nav: {
    events: string;
    artists: string;
    news: string;
    services: string;
    about: string;
    contact: string;
    bookings: string;
    bookNow: string;
  };
  // Hero Section
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    subtext: string;
    ctaArtists: string;
    ctaServices: string;
    statAgencyLabel: string;
    statAgencyValue: string;
    statAgencySub: string;
    statServicesLabel: string;
    statServicesSub: string;
    statBasedLabel: string;
    statBasedSub: string;
  };
  // Events
  events: {
    pageTitle: string;
    pageSubtitle: string;
    sectionLabel: string;
    sectionHeading: string;
    viewAll: string;
    nextEvent: string;
    viewDetails: string;
    viewEvent: string;
    noEvents: string;
    allEvents: string;
    soldOut: string;
    getTickets: string;
    buyTicket: string;
    bookEnquire: string;
    enquireNow: string;
    about: string;
    lineup: string;
    artists: string;
    gallery: string;
    eventDetails: string;
    date: string;
    doorsOpen: string;
    venue: string;
    genre: string;
    tickets: string;
    age: string;
    filters: {
      all: string;
      reggae: string;
      dub: string;
      hiphop: string;
      world: string;
      festival: string;
    };
  };
  // Artists
  artists: {
    pageTitle: string;
    pageSubtitle: string;
    sectionLabel: string;
    sectionHeading: string;
    viewAll: string;
    viewProfile: string;
    bookArtist: string;
    noArtists: string;
    allArtists: string;
    filters: {
      all: string;
      reggae: string;
      dub: string;
      hiphop: string;
      world: string;
    };
  };
  // News
  news: {
    pageTitle: string;
    pageSubtitle: string;
    sectionLabel: string;
    sectionHeading: string;
    viewAll: string;
    readMore: string;
    noNews: string;
    by: string;
    backToNews: string;
  };
  // Services
  services: {
    pageTitle: string;
    pageSubtitle: string;
    sectionLabel: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
  };
  // About
  about: {
    pageTitle: string;
    pageSubtitle: string;
    sectionLabel: string;
    missionLabel: string;
    missionHeading: string;
    missionText: string;
    valuesLabel: string;
    valuesHeading: string;
    teamLabel: string;
    teamHeading: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
  };
  // Contact
  contact: {
    pageTitle: string;
    pageSubtitle: string;
    sectionLabel: string;
    formName: string;
    formEmail: string;
    formBudget: string;
    formTimeframe: string;
    formProject: string;
    formSubmit: string;
    formSubmitting: string;
    formSuccess: string;
    formSuccessMsg: string;
    formError: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    budgetPlaceholder: string;
    timeframePlaceholder: string;
    projectPlaceholder: string;
    errorName: string;
    errorEmail: string;
    errorProject: string;
  };
  // Bookings
  bookings: {
    pageTitle: string;
    pageSubtitle: string;
    sectionLabel: string;
    selectArtist: string;
    formName: string;
    formEmail: string;
    formAddress: string;
    formDate: string;
    formMessage: string;
    formSubmit: string;
    formSubmitting: string;
    formSuccess: string;
    formSuccessMsg: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    addressPlaceholder: string;
    messagePlaceholder: string;
    errorName: string;
    errorEmail: string;
    errorAddress: string;
    errorDate: string;
    errorArtist: string;
    backToBookings: string;
    bookThisArtist: string;
    bookingFor: string;
    origin: string;
    genre: string;
    available: string;
  };
  // Stats Section
  stats: {
    sectionLabel: string;
    heading1: string;
    heading2: string;
    subtext: string;
    quote: string;
    quoteFooter: string;
  };
  // 404
  notFound: {
    heading: string;
    subtext: string;
    backHome: string;
    contactUs: string;
    brokenLink: string;
  };
  // Footer
  footer: {
    tagline: string;
    quickLinks: string;
    followUs: string;
    rights: string;
    madeWith: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    back: string;
    next: string;
    previous: string;
    seeAll: string;
    learnMore: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      events: "Events",
      artists: "Artists",
      news: "News",
      services: "Services",
      about: "About",
      contact: "Contact",
      bookings: "Bookings",
      bookNow: "Book Now",
    },
    hero: {
      badge: "Booking Agency · Mauritius Island",
      headline1: "Your Gateway to",
      headline2: "Unforgettable Experiences.",
      subtext: "IREY PROD — A dynamic agency specialising in Digital Marketing, Stage & Artist Management, and Event Coordination. Based in Mauritius Island.",
      ctaArtists: "Our Artists",
      ctaServices: "Our Services",
      statAgencyLabel: "Agency",
      statAgencyValue: "One Stop",
      statAgencySub: "The only agency you'll ever need",
      statServicesLabel: "Services",
      statServicesSub: "Bookings · Tours · Events · Productions",
      statBasedLabel: "Based In",
      statBasedSub: "Island · Indian Ocean",
    },
    events: {
      pageTitle: "Our Events",
      pageSubtitle: "Concerts, festivals, dub sessions and sound systems. All events produced and organised by IREY PROD.",
      sectionLabel: "— Events",
      sectionHeading: "Upcoming Events",
      viewAll: "View All Events →",
      nextEvent: "Next Event",
      viewDetails: "View Details",
      viewEvent: "View Event",
      noEvents: "No events found for this filter.",
      allEvents: "All Events",
      soldOut: "Sold Out",
      getTickets: "Get Tickets",
      buyTicket: "Buy Ticket",
      bookEnquire: "Book / Enquire",
      enquireNow: "Enquire Now",
      about: "About",
      lineup: "Lineup",
      artists: "Artists",
      gallery: "Gallery",
      eventDetails: "Event Details",
      date: "Date",
      doorsOpen: "Doors Open",
      venue: "Venue",
      genre: "Genre",
      tickets: "Tickets",
      age: "Age",
      filters: {
        all: "All",
        reggae: "Reggae",
        dub: "Dub",
        hiphop: "Hip-Hop",
        world: "World",
        festival: "Festival",
      },
    },
    artists: {
      pageTitle: "Our Artists",
      pageSubtitle: "Discover the talented artists represented by IREY PROD — from reggae legends to emerging voices.",
      sectionLabel: "— Artists",
      sectionHeading: "Artist Roster",
      viewAll: "View All Artists →",
      viewProfile: "View Profile",
      bookArtist: "Book Artist",
      noArtists: "No artists found.",
      allArtists: "All Artists",
      filters: {
        all: "All",
        reggae: "Reggae",
        dub: "Dub",
        hiphop: "Hip-Hop",
        world: "World",
      },
    },
    news: {
      pageTitle: "Latest News",
      pageSubtitle: "Stay up to date with the latest news, releases, and announcements from IREY PROD.",
      sectionLabel: "— News",
      sectionHeading: "Latest News",
      viewAll: "View All News →",
      readMore: "Read More",
      noNews: "No news articles published yet.",
      by: "By",
      backToNews: "Back to News",
    },
    services: {
      pageTitle: "Our Services",
      pageSubtitle: "Four pillars of excellence — everything you need from a world-class booking and production agency.",
      sectionLabel: "— Services",
      ctaTitle: "Ready to Work Together?",
      ctaSubtitle: "Let's create something extraordinary. Reach out to discuss your project.",
      ctaButton: "Get in Touch",
    },
    about: {
      pageTitle: "About IREY PROD",
      pageSubtitle: "A dynamic booking agency and event production company based in Mauritius Island.",
      sectionLabel: "— About",
      missionLabel: "— Our Mission",
      missionHeading: "Driven by Passion, Defined by Excellence",
      missionText: "IREY PROD is a dynamic and forward-thinking organisation specialising in digital marketing, stage and artist management, as well as event coordination. We are dedicated to delivering exceptional experiences for artists and audiences alike.",
      valuesLabel: "— Our Values",
      valuesHeading: "What We Stand For",
      teamLabel: "— Our Team",
      teamHeading: "The People Behind IREY PROD",
      ctaTitle: "Work With Us",
      ctaSubtitle: "Ready to take your project to the next level? Let's talk.",
      ctaButton: "Contact Us",
    },
    contact: {
      pageTitle: "Get in Touch",
      pageSubtitle: "Have a project in mind? We'd love to hear from you.",
      sectionLabel: "— Contact",
      formName: "Full Name",
      formEmail: "Email Address",
      formBudget: "Budget Range",
      formTimeframe: "Timeframe",
      formProject: "Tell us about your project",
      formSubmit: "Send Message",
      formSubmitting: "Sending...",
      formSuccess: "Message Sent",
      formSuccessMsg: "Thank you for reaching out. We'll get back to you within 24 hours.",
      formError: "Something went wrong. Please try again.",
      namePlaceholder: "Your full name",
      emailPlaceholder: "your@email.com",
      budgetPlaceholder: "e.g. €1,000 – €5,000",
      timeframePlaceholder: "e.g. 3 months",
      projectPlaceholder: "Describe your project, event, or enquiry...",
      errorName: "Name is required",
      errorEmail: "Valid email is required",
      errorProject: "Please describe your project",
    },
    bookings: {
      pageTitle: "Book an Artist",
      pageSubtitle: "Ready to book one of our artists for your event? Fill in the form below and we'll get back to you.",
      sectionLabel: "— Bookings",
      selectArtist: "Select an Artist",
      formName: "Full Name",
      formEmail: "Email Address",
      formAddress: "Event Address / Venue",
      formDate: "Event Date & Time",
      formMessage: "Additional Information",
      formSubmit: "Submit Booking Request",
      formSubmitting: "Submitting...",
      formSuccess: "Booking Request Sent",
      formSuccessMsg: "Thank you! We'll review your request and get back to you within 24 hours.",
      namePlaceholder: "Your full name",
      emailPlaceholder: "your@email.com",
      addressPlaceholder: "Venue name and address",
      messagePlaceholder: "Tell us more about your event...",
      errorName: "Name is required",
      errorEmail: "Valid email is required",
      errorAddress: "Venue address is required",
      errorDate: "Event date is required",
      errorArtist: "Please select an artist",
      backToBookings: "Back to Bookings",
      bookThisArtist: "Book This Artist",
      bookingFor: "Booking for",
      origin: "Origin",
      genre: "Genre",
      available: "Available for Booking",
    },
    stats: {
      sectionLabel: "— Our Expertise",
      heading1: "Multi-Faceted Agency,",
      heading2: "Singular Vision",
      subtext: "IREY PROD is a dynamic and forward-thinking organisation specialising in digital marketing, stage and artist management, as well as event coordination.",
      quote: '"Likkle but Irey Prod.!"',
      quoteFooter: "— IREY PROD Motto · Jamaican Patois for \"Small but Mighty\"",
    },
    notFound: {
      heading: "Page Not Found",
      subtext: "The page you're looking for doesn't exist or has been moved.",
      backHome: "Back to Home",
      contactUs: "Contact Us",
      brokenLink: "Found a broken link? Let us know →",
    },
    footer: {
      tagline: "A dynamic booking agency and event production company based in Mauritius Island.",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      rights: "All rights reserved.",
      madeWith: "Made with passion in Mauritius",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong.",
      retry: "Try Again",
      close: "Close",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      back: "Back",
      next: "Next",
      previous: "Previous",
      seeAll: "See All",
      learnMore: "Learn More",
    },
  },
  fr: {
    nav: {
      events: "Événements",
      artists: "Artistes",
      news: "Actualités",
      services: "Services",
      about: "À Propos",
      contact: "Contact",
      bookings: "Réservations",
      bookNow: "Réserver",
    },
    hero: {
      badge: "Agence de Booking · Île Maurice",
      headline1: "Votre Passerelle vers des",
      headline2: "Expériences Inoubliables.",
      subtext: "IREY PROD — Une agence dynamique spécialisée dans le Marketing Digital, la Gestion de Scène & d'Artistes, et la Coordination d'Événements. Basée à l'Île Maurice.",
      ctaArtists: "Nos Artistes",
      ctaServices: "Nos Services",
      statAgencyLabel: "Agence",
      statAgencyValue: "Tout-en-Un",
      statAgencySub: "La seule agence dont vous aurez besoin",
      statServicesLabel: "Services",
      statServicesSub: "Bookings · Tournées · Événements · Productions",
      statBasedLabel: "Basé à",
      statBasedSub: "Île · Océan Indien",
    },
    events: {
      pageTitle: "Nos Événements",
      pageSubtitle: "Concerts, festivals, sessions dub et sound systems. Tous les événements produits et organisés par IREY PROD.",
      sectionLabel: "— Événements",
      sectionHeading: "Événements à Venir",
      viewAll: "Voir Tous les Événements →",
      nextEvent: "Prochain Événement",
      viewDetails: "Voir les Détails",
      viewEvent: "Voir l'Événement",
      noEvents: "Aucun événement trouvé pour ce filtre.",
      allEvents: "Tous les Événements",
      soldOut: "Complet",
      getTickets: "Obtenir des Billets",
      buyTicket: "Acheter un Billet",
      bookEnquire: "Réserver / Renseigner",
      enquireNow: "Se Renseigner",
      about: "À Propos",
      lineup: "Programme",
      artists: "Artistes",
      gallery: "Galerie",
      eventDetails: "Détails de l'Événement",
      date: "Date",
      doorsOpen: "Ouverture des Portes",
      venue: "Lieu",
      genre: "Genre",
      tickets: "Billets",
      age: "Âge",
      filters: {
        all: "Tous",
        reggae: "Reggae",
        dub: "Dub",
        hiphop: "Hip-Hop",
        world: "Monde",
        festival: "Festival",
      },
    },
    artists: {
      pageTitle: "Nos Artistes",
      pageSubtitle: "Découvrez les artistes talentueux représentés par IREY PROD — des légendes du reggae aux nouvelles voix émergentes.",
      sectionLabel: "— Artistes",
      sectionHeading: "Notre Roster",
      viewAll: "Voir Tous les Artistes →",
      viewProfile: "Voir le Profil",
      bookArtist: "Réserver l'Artiste",
      noArtists: "Aucun artiste trouvé.",
      allArtists: "Tous les Artistes",
      filters: {
        all: "Tous",
        reggae: "Reggae",
        dub: "Dub",
        hiphop: "Hip-Hop",
        world: "Monde",
      },
    },
    news: {
      pageTitle: "Dernières Actualités",
      pageSubtitle: "Restez informé des dernières nouvelles, sorties et annonces d'IREY PROD.",
      sectionLabel: "— Actualités",
      sectionHeading: "Dernières Actualités",
      viewAll: "Voir Toutes les Actualités →",
      readMore: "Lire la Suite",
      noNews: "Aucun article publié pour le moment.",
      by: "Par",
      backToNews: "Retour aux Actualités",
    },
    services: {
      pageTitle: "Nos Services",
      pageSubtitle: "Quatre piliers d'excellence — tout ce dont vous avez besoin d'une agence de booking et de production de classe mondiale.",
      sectionLabel: "— Services",
      ctaTitle: "Prêt à Travailler Ensemble ?",
      ctaSubtitle: "Créons quelque chose d'extraordinaire. Contactez-nous pour discuter de votre projet.",
      ctaButton: "Nous Contacter",
    },
    about: {
      pageTitle: "À Propos d'IREY PROD",
      pageSubtitle: "Une agence de booking dynamique et une société de production événementielle basée à l'Île Maurice.",
      sectionLabel: "— À Propos",
      missionLabel: "— Notre Mission",
      missionHeading: "Animés par la Passion, Définis par l'Excellence",
      missionText: "IREY PROD est une organisation dynamique et avant-gardiste spécialisée dans le marketing digital, la gestion de scène et d'artistes, ainsi que la coordination d'événements. Nous nous consacrons à offrir des expériences exceptionnelles aux artistes et au public.",
      valuesLabel: "— Nos Valeurs",
      valuesHeading: "Ce en Quoi Nous Croyons",
      teamLabel: "— Notre Équipe",
      teamHeading: "Les Personnes Derrière IREY PROD",
      ctaTitle: "Travaillez Avec Nous",
      ctaSubtitle: "Prêt à faire passer votre projet au niveau supérieur ? Parlons-en.",
      ctaButton: "Nous Contacter",
    },
    contact: {
      pageTitle: "Contactez-Nous",
      pageSubtitle: "Vous avez un projet en tête ? Nous serions ravis de vous entendre.",
      sectionLabel: "— Contact",
      formName: "Nom Complet",
      formEmail: "Adresse Email",
      formBudget: "Budget",
      formTimeframe: "Délai",
      formProject: "Parlez-nous de votre projet",
      formSubmit: "Envoyer le Message",
      formSubmitting: "Envoi en cours...",
      formSuccess: "Message Envoyé",
      formSuccessMsg: "Merci de nous avoir contactés. Nous vous répondrons dans les 24 heures.",
      formError: "Une erreur s'est produite. Veuillez réessayer.",
      namePlaceholder: "Votre nom complet",
      emailPlaceholder: "votre@email.com",
      budgetPlaceholder: "ex. 1 000 € – 5 000 €",
      timeframePlaceholder: "ex. 3 mois",
      projectPlaceholder: "Décrivez votre projet, événement ou demande...",
      errorName: "Le nom est requis",
      errorEmail: "Un email valide est requis",
      errorProject: "Veuillez décrire votre projet",
    },
    bookings: {
      pageTitle: "Réserver un Artiste",
      pageSubtitle: "Prêt à réserver l'un de nos artistes pour votre événement ? Remplissez le formulaire ci-dessous et nous vous répondrons.",
      sectionLabel: "— Réservations",
      selectArtist: "Sélectionner un Artiste",
      formName: "Nom Complet",
      formEmail: "Adresse Email",
      formAddress: "Adresse / Lieu de l'Événement",
      formDate: "Date et Heure de l'Événement",
      formMessage: "Informations Complémentaires",
      formSubmit: "Envoyer la Demande de Réservation",
      formSubmitting: "Envoi en cours...",
      formSuccess: "Demande de Réservation Envoyée",
      formSuccessMsg: "Merci ! Nous examinerons votre demande et vous répondrons dans les 24 heures.",
      namePlaceholder: "Votre nom complet",
      emailPlaceholder: "votre@email.com",
      addressPlaceholder: "Nom et adresse du lieu",
      messagePlaceholder: "Dites-nous en plus sur votre événement...",
      errorName: "Le nom est requis",
      errorEmail: "Un email valide est requis",
      errorAddress: "L'adresse du lieu est requise",
      errorDate: "La date de l'événement est requise",
      errorArtist: "Veuillez sélectionner un artiste",
      backToBookings: "Retour aux Réservations",
      bookThisArtist: "Réserver cet Artiste",
      bookingFor: "Réservation pour",
      origin: "Origine",
      genre: "Genre",
      available: "Disponible pour Réservation",
    },
    stats: {
      sectionLabel: "— Notre Expertise",
      heading1: "Agence Multifacette,",
      heading2: "Vision Singulière",
      subtext: "IREY PROD est une organisation dynamique et avant-gardiste spécialisée dans le marketing digital, la gestion de scène et d'artistes, ainsi que la coordination d'événements.",
      quote: '"Likkle but Irey Prod.!"',
      quoteFooter: "— Devise d'IREY PROD · Patois Jamaïcain pour « Petit mais Puissant »",
    },
    notFound: {
      heading: "Page Introuvable",
      subtext: "La page que vous recherchez n'existe pas ou a été déplacée.",
      backHome: "Retour à l'Accueil",
      contactUs: "Nous Contacter",
      brokenLink: "Lien cassé trouvé ? Dites-le nous →",
    },
    footer: {
      tagline: "Une agence de booking dynamique et une société de production événementielle basée à l'Île Maurice.",
      quickLinks: "Liens Rapides",
      followUs: "Suivez-Nous",
      rights: "Tous droits réservés.",
      madeWith: "Fait avec passion à l'Île Maurice",
    },
    common: {
      loading: "Chargement...",
      error: "Une erreur s'est produite.",
      retry: "Réessayer",
      close: "Fermer",
      save: "Enregistrer",
      cancel: "Annuler",
      edit: "Modifier",
      delete: "Supprimer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      seeAll: "Voir Tout",
      learnMore: "En Savoir Plus",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language: Language = "en";

  const setLanguage = (_lang: Language) => {};

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
