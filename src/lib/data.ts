// ─── Static dummy data — replaces Supabase ───────────────────────────────────
// When the PHP backend is ready, swap these imports for fetch() calls to /api/*.php

export interface Artist {
  id: string;
  name: string;
  genre: string;
  origin: string;
  image: string;
  image_alt: string;
  bio: string;
  tags: string[];
  featured: boolean;
  slug: string;
  sort_order: number;
  style?: string;
}

export interface EventData {
  id: string;
  slug: string;
  event_date: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  genre: string;
  image: string;
  image_alt: string;
  featured: boolean;
  sold_out: boolean;
  artists: string[];
  description?: string;
  ticket_price?: number;
  tickets_available?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_image_alt: string;
  author: string;
  published_at: string;
  status: string;
}

export interface Service {
  id: string;
  service_number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  image_alt: string;
  features: string[];
  sort_order: number;
}

export interface HomepageContent {
  hero_headline_line1: string;
  hero_headline_line2: string;
  hero_subtext: string;
}

// ─── ARTISTS ──────────────────────────────────────────────────────────────────
export const artists: Artist[] = [
  {
    id: "1",
    slug: "jaydee",
    name: "JayDee",
    genre: "Afrobeats / R&B",
    origin: "Mauritius Island",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    image_alt: "JayDee performing on stage",
    bio: "JayDee is one of Mauritius's most exciting emerging talents, blending Afrobeats rhythms with soulful R&B vocals. With multiple chart-topping singles and sold-out performances across the Indian Ocean islands, he has established himself as a force to be reckoned with in the regional music scene.",
    tags: ["Afrobeats", "R&B", "World"],
    featured: true,
    sort_order: 1,
  },
  {
    id: "2",
    slug: "nova-sound",
    name: "Nova Sound",
    genre: "Electronic / House",
    origin: "Réunion Island",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    image_alt: "Nova Sound DJ set",
    bio: "Nova Sound is a pioneering electronic music collective from Réunion Island, known for their immersive live sets that fuse tropical house with deep electronic textures. Their performances are legendary across the Indian Ocean club circuit.",
    tags: ["Electronic", "House", "World"],
    featured: true,
    sort_order: 2,
  },
  {
    id: "3",
    slug: "layla-moris",
    name: "Layla Moris",
    genre: "Sega / Pop",
    origin: "Mauritius Island",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
    image_alt: "Layla Moris performing",
    bio: "Layla Moris brings the authentic sounds of Mauritian Séga to modern audiences, blending traditional rhythms with contemporary pop production. Her debut album received critical acclaim across the African continent.",
    tags: ["Sega", "World", "Pop"],
    featured: true,
    sort_order: 3,
  },
  {
    id: "4",
    slug: "dj-kenzo",
    name: "DJ Kenzo",
    genre: "Hip-Hop / Trap",
    origin: "Mauritius Island",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    image_alt: "DJ Kenzo at the decks",
    bio: "DJ Kenzo is the island's most in-demand DJ, with residencies at top venues across Mauritius and international bookings in Paris, London, and Dubai. His sets blend global hip-hop with island vibes.",
    tags: ["Hip-Hop", "Trap"],
    featured: false,
    sort_order: 4,
  },
  {
    id: "5",
    slug: "the-coral-band",
    name: "The Coral Band",
    genre: "Reggae / Roots",
    origin: "Mauritius Island",
    image: "https://images.unsplash.com/photo-1501386761578-eaa54b915e8f?w=800&q=80",
    image_alt: "The Coral Band on stage",
    bio: "The Coral Band carries the torch of authentic roots reggae in the Indian Ocean region. With deep Rastafarian influences and powerful live performances, they have toured across Africa and Europe.",
    tags: ["Reggae", "World"],
    featured: false,
    sort_order: 5,
  },
  {
    id: "6",
    slug: "maya-k",
    name: "Maya K",
    genre: "Jazz / Soul",
    origin: "Madagascar",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
    image_alt: "Maya K jazz performance",
    bio: "Maya K is a celebrated jazz vocalist from Madagascar whose smoky voice and sophisticated stage presence have captivated audiences from Antananarivo to Paris. A true ambassador of African jazz.",
    tags: ["Jazz", "World"],
    featured: false,
    sort_order: 6,
  },
];

// ─── EVENTS ───────────────────────────────────────────────────────────────────
export const events: EventData[] = [
  {
    id: "1",
    slug: "irey-fest-2026",
    title: "IREY FEST 2026",
    event_date: "2026-04-19T18:00:00",
    venue: "Domaine Les Pailles",
    city: "Port Louis",
    country: "Mauritius",
    genre: "Festival",
    image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",
    image_alt: "IREY FEST 2026 main stage",
    featured: true,
    sold_out: false,
    artists: ["JayDee", "Nova Sound", "Layla Moris", "The Coral Band"],
    description: "The biggest music festival in the Indian Ocean returns for its 3rd edition. Featuring 12 artists across 2 stages, food village, and art installations.",
    ticket_price: 0,
    tickets_available: 500,
  },
  {
    id: "2",
    slug: "jaydee-album-launch",
    title: "JayDee — Album Launch Night",
    event_date: "2026-03-28T20:00:00",
    venue: "Le Caudan Waterfront",
    city: "Port Louis",
    country: "Mauritius",
    genre: "R&B",
    image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",
    image_alt: "JayDee album launch",
    featured: false,
    sold_out: false,
    artists: ["JayDee"],
    description: "JayDee celebrates the release of his debut album 'Horizon' with an intimate live performance at the iconic Caudan Waterfront.",
    ticket_price: 0,
  },
  {
    id: "3",
    slug: "nova-sound-sunset-sessions",
    title: "Nova Sound — Sunset Sessions",
    event_date: "2026-05-10T17:00:00",
    venue: "Blue Bay Beach",
    city: "Mahébourg",
    country: "Mauritius",
    genre: "Electronic",
    image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",
    image_alt: "Nova Sound sunset session",
    featured: false,
    sold_out: false,
    artists: ["Nova Sound", "DJ Kenzo"],
    description: "An open-air electronic music experience on the shores of Blue Bay Marine Park.",
  },
  {
    id: "4",
    slug: "sega-night-roots-culture",
    title: "Sega Night — Roots & Culture",
    event_date: "2025-12-14T19:00:00",
    venue: "SVICC",
    city: "Pailles",
    country: "Mauritius",
    genre: "Sega",
    image: "https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg",
    image_alt: "Sega Night event",
    featured: false,
    sold_out: true,
    artists: ["Layla Moris"],
    description: "A sold-out celebration of Mauritian cultural heritage through Séga music.",
  },
];

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export const news: NewsArticle[] = [
  {
    id: "1",
    slug: "ireyfest-2026-lineup-announced",
    title: "IREY FEST 2026 — Full Lineup Revealed",
    excerpt: "We are thrilled to announce the complete lineup for IREY FEST 2026, the Indian Ocean's premier music festival returning to Domaine Les Pailles this April.",
    content: `<p>We are thrilled to announce the complete lineup for IREY FEST 2026, the Indian Ocean's premier music festival returning to Domaine Les Pailles this April 19th.</p>
<p>This year's festival brings together 12 extraordinary artists across two stages, celebrating the diversity and richness of music from Mauritius and the wider Indian Ocean region.</p>
<h2>Headliners</h2>
<p>JayDee will close the main stage with a career-defining set following the release of his debut album "Horizon." Nova Sound will deliver a breathtaking electronic experience on the second stage.</p>
<h2>Supporting Acts</h2>
<p>Layla Moris, The Coral Band, DJ Kenzo, and Maya K join an impressive supporting lineup that spans reggae, jazz, Séga, and hip-hop.</p>
<h2>Beyond the Music</h2>
<p>This year's festival expands with a curated food village featuring 20 local vendors, contemporary art installations throughout the grounds, and a dedicated artisan market showcasing Mauritian craftsmanship.</p>
<p>Tickets go on sale Monday, March 18th. Early bird pricing available for the first 500 tickets sold.</p>`,
    cover_image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",
    cover_image_alt: "IREY FEST 2026 stage",
    author: "IREY PROD Team",
    published_at: "2026-03-10T09:00:00",
    status: "published",
  },
  {
    id: "2",
    slug: "jaydee-horizon-album",
    title: "JayDee Announces Debut Album 'Horizon'",
    excerpt: "After two years of creative development, JayDee is set to release his long-awaited debut album 'Horizon' — a deeply personal exploration of identity and belonging.",
    content: `<p>After two years of creative development and over 30 recording sessions, JayDee is set to release his long-awaited debut album "Horizon" on March 28th, 2026.</p>
<p>The 12-track album represents a significant artistic milestone for one of Mauritius's most gifted young musicians. Blending Afrobeats, R&B, and the sounds of the Indian Ocean, "Horizon" is a deeply personal exploration of identity, belonging, and aspiration.</p>
<p>The album features collaborations with artists from across the African continent and was partly recorded in studios in Johannesburg, Lagos, and Port Louis.</p>
<p>The album launch will be celebrated with a live performance at Le Caudan Waterfront on March 28th.</p>`,
    cover_image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",
    cover_image_alt: "JayDee in the studio",
    author: "IREY PROD Team",
    published_at: "2026-03-01T10:00:00",
    status: "published",
  },
  {
    id: "3",
    slug: "irey-prod-expands-regional",
    title: "IREY PROD Expands Across the Indian Ocean",
    excerpt: "Following a record-breaking 2025, IREY PROD announces the expansion of its booking and production services to Réunion Island, Madagascar, and the Maldives.",
    content: `<p>Following a record-breaking 2025 in which we produced over 40 events and facilitated more than 150 artist bookings, IREY PROD is proud to announce the expansion of our operations across the Indian Ocean region.</p>
<p>Starting April 2026, our booking and production services will be available in Réunion Island, Madagascar, and the Maldives, with dedicated local contacts in each territory.</p>
<p>This expansion reflects our commitment to elevating the regional entertainment industry and connecting artists with audiences across the Indian Ocean.</p>`,
    cover_image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",
    cover_image_alt: "IREY PROD regional expansion",
    author: "IREY PROD Team",
    published_at: "2026-02-15T11:00:00",
    status: "published",
  },
  {
    id: "4",
    slug: "new-year-2025-recap",
    title: "New Year Countdown 2025 — Event Recap",
    excerpt: "Over 4,000 people gathered at Mont Choisy Beach for what became the island's most talked-about New Year's Eve celebration.",
    content: `<p>Over 4,000 people gathered at Mont Choisy Beach on December 31st for what became the island's most talked-about New Year's Eve celebration.</p>
<p>The evening opened with DJ Kenzo's masterful warm-up set as the sun dipped below the horizon. Nova Sound took the crowd on a sonic journey through the night, before JayDee closed out 2024 with an emotional, career-best performance.</p>
<p>At midnight, a 10-minute fireworks display synchronized to a custom musical composition lit up the Mauritian sky, sending 2025 in with a spectacular welcome.</p>
<p>Thank you to every single person who was there. You made it unforgettable.</p>`,
    cover_image: "https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg",
    cover_image_alt: "New Year Countdown 2025",
    author: "IREY PROD Team",
    published_at: "2026-01-05T09:00:00",
    status: "published",
  },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────
export const services: Service[] = [
  {
    id: "1",
    service_number: "01",
    title: "Bookings",
    tagline: "Connecting Artists & Audiences",
    description: "We connect world-class artists with venues, festivals, and private events across the Indian Ocean and beyond. From intimate performances to headline slots, we handle every aspect of the booking process.",
    image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",
    image_alt: "Artist booking performance",
    features: ["Artist sourcing & negotiation", "Contract management", "Rider coordination", "Travel & logistics", "Technical requirements", "Post-event reporting"],
    sort_order: 1,
  },
  {
    id: "2",
    service_number: "02",
    title: "Tours",
    tagline: "Regional & International Tour Management",
    description: "Comprehensive tour management for regional and international tours. We handle routing, venue selection, promotion, and on-the-ground logistics so artists can focus on performing.",
    image: "https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg",
    image_alt: "Tour management",
    features: ["Tour routing & scheduling", "Regional & international touring", "Venue partnerships", "Promotion & marketing", "On-tour support", "Settlement & accounting"],
    sort_order: 2,
  },
  {
    id: "3",
    service_number: "03",
    title: "Events",
    tagline: "End-to-End Event Production",
    description: "End-to-end event production from concept to curtain call. Whether it's a corporate function, a beach festival, or a private celebration, we create unforgettable experiences.",
    image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",
    image_alt: "Event production",
    features: ["Concept development", "Venue sourcing & setup", "Artist curation", "Technical production", "Event marketing & ticketing", "On-site management"],
    sort_order: 3,
  },
  {
    id: "4",
    service_number: "04",
    title: "Productions",
    tagline: "Stage & Digital Production",
    description: "Full-scale stage and digital production services. We bring the technical expertise and creative vision to make every performance visually and sonically spectacular.",
    image: "https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",
    image_alt: "Stage production",
    features: ["Stage design & build", "Sound & lighting", "Video production", "Digital marketing", "Brand & artist development", "Content creation"],
    sort_order: 4,
  },
];

// ─── HOMEPAGE CONTENT ─────────────────────────────────────────────────────────
export const homepageContent: HomepageContent = {
  hero_headline_line1: "Your Gateway to",
  hero_headline_line2: "Unforgettable Experiences.",
  hero_subtext: "IREY PROD — A dynamic agency specialising in Digital Marketing, Stage & Artist Management, and Event Coordination. Based in Mauritius Island.",
};
