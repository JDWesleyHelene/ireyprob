'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewEventPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    venue: '',
    city: '',
    country: 'Mauritius',
    genre: '',
    event_date: '',
    eventTime: '',
    image: '',
    imageAlt: '',
    description: '',
    featured: false,
    sold_out: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);

  const previewSlug = useMemo(() => {
    return form.slug || slugify(form.title);
  }, [form.slug, form.title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (name === 'title') {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: slugEdited ? prev.slug : slugify(value),
      }));
      return;
    }

    if (name === 'slug') {
      setSlugEdited(true);
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!previewSlug.trim()) {
      setError('Slug is required.');
      return;
    }

    if (!form.event_date) {
      setError('Event date is required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        slug: previewSlug.trim(),
        venue: form.venue.trim(),
        city: form.city.trim(),
        country: form.country.trim() || 'Mauritius',
        genre: form.genre.trim(),
        event_date: new Date(form.event_date).toISOString(),
        eventTime: form.eventTime || null,
        image: form.image.trim(),
        imageAlt: form.imageAlt.trim(),
        description: form.description.trim(),
        featured: form.featured,
        sold_out: form.sold_out,
        artists: [],
      };

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch {
      setError('Failed to create event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">
            — Content
          </span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Add Event</h1>
          <p className="mt-2 text-[13px] text-foreground/45 max-w-2xl">
            Create a full event entry with image, venue details, and description. This will be saved
            directly to your Neon database.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border border-red-500/20 bg-red-500/10 text-red-400 text-[12px] px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="border border-foreground/8 rounded-sm bg-foreground/[0.02]">
              <div className="px-5 py-4 border-b border-foreground/8">
                <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40">
                  Event Details
                </h2>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Event title"
                    className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                    Slug *
                  </label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="event-slug"
                    className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-mono focus:outline-none focus:border-foreground/30"
                  />
                  <p className="mt-1 text-[11px] text-foreground/30">
                    Preview: /events/{previewSlug || 'your-event-slug'}
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Write a short event description..."
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 resize-y focus:outline-none focus:border-foreground/30"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                    Event Image
                  </label>
                  <ImageUpload
                    value={form.image}
                    onChange={(url) =>
                      setForm((prev) => ({
                        ...prev,
                        image: url,
                      }))
                    }
                    folder="events"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                    Image Alt Text
                  </label>
                  <input
                    name="imageAlt"
                    value={form.imageAlt}
                    onChange={handleChange}
                    placeholder="Describe the event image"
                    className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-foreground/8 rounded-sm bg-foreground/[0.02]">
                <div className="px-5 py-4 border-b border-foreground/8">
                  <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40">
                    Event Meta
                  </h2>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                      Venue
                    </label>
                    <input
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="Venue name"
                      className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                      City
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                      Country
                    </label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                      Genre
                    </label>
                    <input
                      name="genre"
                      value={form.genre}
                      onChange={handleChange}
                      placeholder="Seggae, Kreol"
                      className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30"
                    />
                    <p className="mt-1 text-[11px] text-foreground/30">
                      Use comma-separated genres for public filters.
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                      Event Date *
                    </label>
                    <input
                      name="event_date"
                      type="datetime-local"
                      value={form.event_date}
                      onChange={handleChange}
                      className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">
                      Event Time
                    </label>
                    <input
                      name="eventTime"
                      type="time"
                      value={form.eventTime || ""}
                      onChange={handleChange}
                      className="w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30"
                    />
                    <p className="mt-1 text-[11px] text-foreground/30">Shown on event detail page</p>
                  </div>
                </div>
              </div>

              <div className="border border-foreground/8 rounded-sm bg-foreground/[0.02]">
                <div className="px-5 py-4 border-b border-foreground/8">
                  <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40">
                    Publishing
                  </h2>
                </div>

                <div className="p-5 space-y-3">
                  <label className="flex items-center justify-between gap-4 min-h-[48px] border border-foreground/10 rounded-sm px-3 py-3 cursor-pointer">
                    <div>
                      <p className="text-[12px] font-medium text-foreground/75">Featured Event</p>
                      <p className="text-[11px] text-foreground/35">
                        Highlight this event in key sections.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-4 min-h-[48px] border border-foreground/10 rounded-sm px-3 py-3 cursor-pointer">
                    <div>
                      <p className="text-[12px] font-medium text-foreground/75">Sold Out</p>
                      <p className="text-[11px] text-foreground/35">
                        Show this event as unavailable.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="sold_out"
                      checked={form.sold_out}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/admin/events')}
              className="sm:min-w-[160px] min-h-[48px] px-5 py-2.5 border border-foreground/10 text-foreground/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/20 hover:text-foreground/70 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="sm:min-w-[180px] min-h-[48px] px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
