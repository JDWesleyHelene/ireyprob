// Static data — all empty arrays. Live data comes from Neon DB via /api/admin/* routes.

export interface Artist {
  id: string; name: string; genre: string; origin: string;
  image: string; image_alt: string; bio: string; tags: string[];
  featured: boolean; slug: string; sort_order: number; style?: string;
}
export interface EventData {
  id: string; slug: string; event_date: string; title: string;
  venue: string; city: string; country: string; genre: string;
  image: string; image_alt: string; featured: boolean; sold_out: boolean;
  artists: string[]; description?: string; ticket_price?: number; tickets_available?: number;
}
export interface NewsArticle {
  id: string; title: string; slug: string; excerpt: string; content: string;
  cover_image: string; cover_image_alt: string; author: string;
  published_at: string; status: string;
}
export interface Service {
  id: string; service_number: string; title: string; tagline: string;
  description: string; image: string; image_alt: string; features: string[]; sort_order: number;
}
export interface HomepageContent {
  hero_headline_line1: string; hero_headline_line2: string; hero_subtext: string;
}

export const artists: Artist[]   = [];
export const events: EventData[] = [];
export const news: NewsArticle[] = [];
export const services: Service[] = [
  { id:"1", service_number:"01", title:"Bookings", tagline:"Connecting Artists & Audiences", description:"We connect world-class artists with venues, festivals, and private events across the Indian Ocean and beyond.", image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg", image_alt:"IREY PROD booking artists", features:["Artist sourcing & negotiation","Contract management","Rider coordination","Travel & logistics"], sort_order:1 },
  { id:"2", service_number:"02", title:"Tours", tagline:"Regional & International Tour Management", description:"Comprehensive tour management for regional and international tours, handling everything from routing and scheduling to on-the-road support.", image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg", image_alt:"IREY PROD tour management", features:["Tour routing & scheduling","Venue partnerships","Promotion & marketing","On-tour support"], sort_order:2 },
  { id:"3", service_number:"03", title:"Events", tagline:"End-to-End Event Production", description:"End-to-end event production from concept to curtain call — we handle every detail so you can focus on the experience.", image:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg", image_alt:"IREY PROD event production", features:["Concept development","Venue sourcing","Artist curation","Technical production"], sort_order:3 },
  { id:"4", service_number:"04", title:"Productions", tagline:"Stage & Digital Production", description:"Full-scale stage and digital production services — from sound and lighting design to video production and digital marketing campaigns.", image:"https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg", image_alt:"IREY PROD stage production", features:["Stage design & build","Sound & lighting","Video production","Digital marketing"], sort_order:4 },
];
export const homepageContent: HomepageContent = {
  hero_headline_line1: "Your Gateway to",
  hero_headline_line2: "Unforgettable Experiences.",
  hero_subtext: "IREY PROD — A dynamic agency specialising in Digital Marketing, Stage & Artist Management, and Event Coordination. Based in Mauritius Island.",
};
