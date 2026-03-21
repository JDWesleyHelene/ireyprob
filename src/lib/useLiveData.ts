/**
 * useLiveData — fetches live data from PHP JSON files on cPanel
 * Falls back to localStorage (local dev), then to static data
 */
"use client";
import { useState, useEffect } from "react";
import {
import { apiUrl } from "@/lib/apiConfig";
  artists as staticArtists,
  events as staticEvents,
  news as staticNews,
  type Artist,
  type EventData,
  type NewsArticle
} from "./data";

function mergeById<T extends { id: string }>(dynamic: T[], staticItems: T[]): T[] {
  const dynamicIds = new Set(dynamic.map(d => d.id));
  return [...dynamic, ...staticItems.filter(s => !dynamicIds.has(s.id))];
}

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>(staticArtists);

  useEffect(() => {
    fetch(apiUrl("/api/data.php?type=artists"))
      .then(r => r.ok ? r.json() : null)
      .then((dynamic: Artist[] | null) => {
        if (dynamic && dynamic.length > 0) setArtists(mergeById(dynamic, staticArtists));
      })
      .catch(() => {});
  }, []);

  return { artists };
}

export function useEvents() {
  const [events, setEvents] = useState<EventData[]>(staticEvents);

  useEffect(() => {
    fetch(apiUrl("/api/data.php?type=events"))
      .then(r => r.ok ? r.json() : null)
      .then((dynamic: EventData[] | null) => {
        if (dynamic && dynamic.length > 0) {
          const dynamicIds = new Set(dynamic.map(d => d.id));
          const merged = [...dynamic, ...staticEvents.filter(s => !dynamicIds.has(s.id))];
          merged.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
          setEvents(merged);
        }
      })
      .catch(() => {});
  }, []);

  return { events };
}

export function useNews() {
  const [news, setNews] = useState<NewsArticle[]>(
    staticNews.filter(n => n.status === "published")
  );

  useEffect(() => {
    fetch(apiUrl("/api/data.php?type=news"))
      .then(r => r.ok ? r.json() : null)
      .then((dynamic: NewsArticle[] | null) => {
        if (dynamic && dynamic.length > 0) {
          const dynamicIds = new Set(dynamic.map(d => d.id));
          const merged = [
            ...dynamic,
            ...staticNews.filter(s => !dynamicIds.has(s.id) && s.status === "published"),
          ];
          merged.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
          setNews(merged);
        }
      })
      .catch(() => {});
  }, []);

  return { news };
}

export function useSettings(): Record<string, string> {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    // 1. Try PHP (production on cPanel)
    fetch(apiUrl("/api/data.php?type=settings"))
      .then(r => r.ok ? r.json() : null)
      .then((data: Record<string, string> | null) => {
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          setSettings(data);
          return;
        }
        // 2. Fallback: localStorage (local dev)
        try {
          const local = localStorage.getItem("irey_settings");
          if (local) setSettings(JSON.parse(local));
        } catch { /* ignore */ }
      })
      .catch(() => {
        // 2. Fallback: localStorage (when PHP not available)
        try {
          const local = localStorage.getItem("irey_settings");
          if (local) setSettings(JSON.parse(local));
        } catch { /* ignore */ }
      });
  }, []);

  return settings;
}
