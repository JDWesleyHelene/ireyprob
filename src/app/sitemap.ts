import type { MetadataRoute } from 'next';
const artists: any[] = [];
const events: any[] = [];
const news: any[] = [];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://new.ireyprod.com';

  const staticRoutes = ['', '/events', '/bookings', '/news', '/services', '/about', '/contact'].map(r => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.8,
  }));

  const artistRoutes = artists.map(a => ({
    url: `${base}/bookings/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const eventRoutes = events.map(e => ({
    url: `${base}/events/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const newsRoutes = news.filter(n => n.status === 'published').map(n => ({
    url: `${base}/news/${n.slug}`,
    lastModified: new Date(n.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...artistRoutes, ...eventRoutes, ...newsRoutes];
}
