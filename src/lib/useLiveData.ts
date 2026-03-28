"use client";
import { useState, useEffect } from "react";

export function useArtists(initial: any[] = []) {
  const [artists, setArtists] = useState<any[]>(initial);
  const [loading, setLoading] = useState(initial.length === 0);
  useEffect(() => {
    fetch("/api/admin/artists").then(r => r.ok ? r.json() : []).then(d => {
      if (Array.isArray(d)) setArtists(d.map((a: any) => ({
        ...a, image_alt: a.imageAlt || "", tags: Array.isArray(a.tags) ? a.tags : [],
        sort_order: a.sortOrder || 0, slug: a.slug || "",
      })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { artists, loading };
}

export function useEvents() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/events").then(r => r.ok ? r.json() : []).then(d => {
      if (Array.isArray(d)) setEvents(d.map((e: any) => ({
        ...e, event_date: e.eventDate || e.event_date || "",
        image_alt: e.imageAlt || "", sold_out: e.soldOut || e.sold_out || false,
        artists: Array.isArray(e.artists) ? e.artists : [],
      })));
    }).catch(() => {});
  }, []);
  return { events };
}

export function useNews() {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/news").then(r => r.ok ? r.json() : []).then(d => {
      if (Array.isArray(d)) setNews(d.filter((n: any) => n.status === "published").map((n: any) => ({
        ...n, cover_image: n.coverImage || n.cover_image || "",
        cover_image_alt: n.coverAlt || n.cover_image_alt || "",
      })));
    }).catch(() => {});
  }, []);
  return { news };
}

export function useSettings(initial: Record<string,string> = {}) {
  const [settings, setSettings] = useState<Record<string, string>>(initial);
  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.ok ? r.json() : {}).then(d => {
      if (d && typeof d === "object") setSettings(d);
    }).catch(() => {});
  }, []);
  return settings;
}
