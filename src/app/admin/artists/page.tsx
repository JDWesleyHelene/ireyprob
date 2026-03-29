"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { useArtists } from "@/lib/useLiveData";

interface Artist { id:string; name:string; genre:string; origin:string; image:string; imageAlt?:string; slug:string; featured:boolean; _source?:string; sort_order?:number; sortOrder?:number; }

export default function AdminArtistsPage() {
  const { artists: dbArtists, loading } = useArtists();
  const [list,    setList]    = useState<Artist[]>([]);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState<string|null>(null);
  const [toast,   setToast]   = useState<{msg:string;ok:boolean}|null>(null);
  const [synced,  setSynced]  = useState(false);
  const dragIdx = useRef<number|null>(null);
  const dragOver = useRef<number|null>(null);

  const toast$ = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  // Sync from hook once
  React.useEffect(() => {
    if (dbArtists.length > 0 && !synced) {
      setList([...dbArtists].sort((a,b)=>(a.sortOrder??a.sort_order??0)-(b.sortOrder??b.sort_order??0)));
      setSynced(true);
    }
  }, [dbArtists, synced]);

  const handleDelete = async (id:string, name:string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setSaving(true);
    await fetch("/api/admin/artists",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    setList(p=>p.filter(a=>a.id!==id));
    setSaving(false);
    toast$("Artist deleted", false);
  };

  // Drag handlers
  const onDragStart = (i:number) => { dragIdx.current = i; };
  const onDragEnter = (i:number) => { dragOver.current = i; };
  const onDragEnd   = async () => {
    const from = dragIdx.current;
    const to   = dragOver.current;
    if (from===null || to===null || from===to) { dragIdx.current=null; dragOver.current=null; return; }
    const newList = [...list];
    const [moved] = newList.splice(from, 1);
    newList.splice(to, 0, moved);
    const updated = newList.map((a,i) => ({...a, sort_order:i, sortOrder:i}));
    setList(updated);
    dragIdx.current = null; dragOver.current = null;
    // Save to DB
    setSaving(true);
    await Promise.all(updated.map(a =>
      fetch(`/api/admin/artists/${a.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({sort_order:a.sort_order})})
    ));
    setSaving(false);
    toast$("✓ Order saved");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast && <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${toast.ok?"bg-foreground/10 border-foreground/20 text-foreground":"bg-red-500/10 border-red-500/20 text-red-400"}`}>{toast.msg}</div>}
      {saving && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-foreground/10 border border-foreground/20 rounded-sm text-[11px] text-foreground/60">Saving order...</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Artists <span className="text-foreground/30 text-2xl">({list.length})</span></h1>
          <p className="text-[11px] text-foreground/30 mt-1">Drag rows to reorder</p>
        </div>
        <Link href="/admin/artists/new" className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Add Artist
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-16 bg-foreground/5 rounded-sm animate-pulse"/>)}</div>
      ) : (
        <div className="border border-foreground/8 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-foreground/8 bg-foreground/[0.02]">
              <th className="w-8 px-3 py-3"/>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Artist</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Genre</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden lg:table-cell">Type</th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Actions</th>
            </tr></thead>
            <tbody>
              {list.map((a, i) => (
                <tr key={a.id}
                  draggable
                  onDragStart={()=>onDragStart(i)}
                  onDragEnter={()=>onDragEnter(i)}
                  onDragEnd={onDragEnd}
                  onDragOver={e=>e.preventDefault()}
                  className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-grab active:cursor-grabbing active:bg-foreground/5">

                  {/* Drag handle */}
                  <td className="px-3 py-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/20">
                      <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
                      <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
                      <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
                    </svg>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 bg-foreground/5">
                        {a.image && <AppImage src={a.image} alt={a.name} width={40} height={40} className="object-cover w-full h-full grayscale"/>}
                      </div>
                      <div>
                        <span className="text-[13px] text-foreground/80 font-medium block">{a.name}</span>
                        {a.featured && <span className="text-[9px] text-accent/60 uppercase tracking-widest">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="text-[12px] text-foreground/40">{a.genre}</span></td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`px-2 py-0.5 text-[9px] tracking-widest uppercase rounded-sm border ${a._source==="static"?"bg-foreground/5 text-foreground/30 border-foreground/10":"bg-blue-400/5 text-blue-400/60 border-blue-400/15"}`}>
                      {a._source==="static"?"Default":"Custom"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/bookings/${(a.slug||a.name).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}`} target="_blank"
                        className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-foreground/10 rounded-sm text-foreground/30 hover:text-foreground/60 hover:border-foreground/20 transition-all">View</Link>
                      {a._source!=="static" && <>
                        <Link href={`/admin/artists/${a.id}/edit`}
                          className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-blue-400/20 rounded-sm text-blue-400/60 hover:text-blue-400 hover:border-blue-400/40 transition-all">Edit</Link>
                        <button onClick={()=>handleDelete(a.id,a.name)} disabled={deleting===a.id}
                          className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-red-500/20 rounded-sm text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-40">
                          {deleting===a.id?"...":"Delete"}
                        </button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
