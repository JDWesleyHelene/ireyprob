'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

function slugify(t: string) { return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const [slugEdited, setSlugEdited] = useState(false);

  const [form, setForm] = useState({
    title:'', slug:'', venue:'', city:'', country:'Mauritius',
    genre:'', event_date:'', image:'', imageAlt:'',
    description:'', featured:false, sold_out:false, eventTime:'',
  });

  const previewSlug = useMemo(() => form.slug || slugify(form.title), [form.slug, form.title]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/events/${id}`);
        if (!res.ok) throw new Error();
        const d = await res.json();
        setForm({
          title:       d.title       || '',
          slug:        d.slug        || '',
          venue:       d.venue       || '',
          city:        d.city        || '',
          country:     d.country     || 'Mauritius',
          genre:       d.genre       || '',
          event_date:  d.eventDate   ? new Date(d.eventDate).toISOString().slice(0,16) : '',
          image:       d.image       || '',
          imageAlt:    d.imageAlt    || '',
          description: d.description || '',
          eventTime:   d.eventTime || '',
          featured:    Boolean(d.featured),
          sold_out:    Boolean(d.soldOut),
        });
        setSlugEdited(true);
      } catch { setError('Failed to load event.'); }
      finally   { setLoading(false); }
    }
    if (id) load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') { setForm(p => ({ ...p, [name]: (e.target as HTMLInputElement).checked })); return; }
    if (name === 'slug') setSlugEdited(true);
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.event_date)   { setError('Event date is required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(), slug: previewSlug.trim(),
          venue: form.venue.trim(), city: form.city.trim(),
          country: form.country.trim() || 'Mauritius',
          genre: form.genre.trim(), description: form.description.trim(),
          image: form.image.trim(), imageAlt: form.imageAlt.trim(),
          event_date: new Date(form.event_date).toISOString(),
          eventTime: form.eventTime || null,
          featured: form.featured, sold_out: form.sold_out, artists: [],
        }),
      });
      if (!res.ok) throw new Error();
      // ✅ Stay on page — show green confirmation
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError('Failed to update event. Please try again.'); }
    finally  { setSaving(false); }
  };

  const IC = 'w-full min-h-[48px] bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30';

  if (loading) return <div className="p-8"><p className="text-foreground/40 text-[13px]">Loading event...</p></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* ✅ Green toast stays on page */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-sm text-[12px] text-emerald-400 font-medium">
          ✓ Event updated successfully!
        </div>
      )}

      <div className="max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
            <h1 className="font-display text-4xl font-light italic text-foreground">Edit Event</h1>
          </div>
          <Link href="/admin/events" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">← Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="border border-red-500/20 bg-red-500/10 text-red-400 text-[12px] px-4 py-3 rounded-sm">{error}</div>}

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            {/* Left */}
            <div className="border border-foreground/8 rounded-sm bg-foreground/[0.02] p-5 space-y-4">
              <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40 pb-3 border-b border-foreground/8">Event Details</h2>
              <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Event title" className={IC}/></div>
              <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="event-slug" className={IC+' font-mono'}/>
                <p className="mt-1 text-[11px] text-foreground/30">Preview: /events/{previewSlug||'your-slug'}</p></div>
              <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground placeholder:text-foreground/20 resize-y focus:outline-none focus:border-foreground/30"/></div>
              <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Event Image</label>
                <ImageUpload value={form.image} onChange={url=>setForm(p=>({...p,image:url}))} folder="events"/></div>
              <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Image Alt Text</label>
                <input name="imageAlt" value={form.imageAlt} onChange={handleChange} placeholder="Describe the image" className={IC}/></div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="border border-foreground/8 rounded-sm bg-foreground/[0.02] p-5 space-y-4">
                <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40 pb-3 border-b border-foreground/8">Event Meta</h2>
                {(['venue','city','country','genre'] as const).map(f=>(
                  <div key={f}><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                    <input name={f} value={form[f]} onChange={handleChange} className={IC}/></div>
                ))}
                <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Event Date *</label>
                  <input name="event_date" type="datetime-local" value={form.event_date} onChange={handleChange} className={IC}/></div>
                <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Event Time</label>
                  <input name="eventTime" type="time" value={form.eventTime} onChange={handleChange} className={IC}/>
                  <p className="mt-1 text-[11px] text-foreground/30">Displayed on event detail page (e.g. 19:30)</p></div>
              </div>
              <div className="border border-foreground/8 rounded-sm bg-foreground/[0.02] p-5 space-y-3">
                <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40 pb-3 border-b border-foreground/8">Publishing</h2>
                {[{name:'featured',label:'Featured Event',sub:'Highlight in key sections'},{name:'sold_out',label:'Sold Out',sub:'Show as unavailable'}].map(f=>(
                  <label key={f.name} className="flex items-center justify-between gap-4 min-h-[48px] border border-foreground/10 rounded-sm px-3 py-3 cursor-pointer hover:bg-foreground/[0.02]">
                    <div><p className="text-[12px] font-medium text-foreground/75">{f.label}</p><p className="text-[11px] text-foreground/35">{f.sub}</p></div>
                    <input type="checkbox" name={f.name} checked={form[f.name as 'featured'|'sold_out']} onChange={handleChange} className="h-4 w-4"/>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={()=>router.push('/admin/events')} className="sm:min-w-[160px] min-h-[48px] px-5 py-2.5 border border-foreground/10 text-foreground/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/20 hover:text-foreground/70 transition-all">← Back to List</button>
            <button type="submit" disabled={saving} className={`sm:min-w-[180px] min-h-[48px] px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30':'bg-foreground text-background hover:bg-accent'}`}>
              {saving?'Saving...':saved?'✓ Updated!':'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
