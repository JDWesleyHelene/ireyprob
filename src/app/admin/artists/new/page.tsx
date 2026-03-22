"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
const IC="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors min-h-[48px]";
const sl=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export default function NewArtistPage() {
  const router = useRouter();
  const [f,setF] = useState({name:"",genre:"",origin:"",bio:"",image:"",image_alt:"",slug:"",tags:"",featured:false});
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const set=(k:string,v:string|boolean)=>setF(p=>({...p,[k]:v,...(k==="name"&&!p.slug?{slug:sl(v as string)}:{})}));

  const save = async () => {
    if(!f.name.trim()){setError("Name is required");return;}
    setSaving(true);setError(null);
    try {
      const res=await fetch("/api/admin/artists",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...f,tags:f.tags.split(",").map(t=>t.trim()).filter(Boolean),slug:f.slug||sl(f.name)})});
      if(!res.ok) throw new Error();
      router.push("/admin/artists");
    } catch {setError("Failed to save.");}
    setSaving(false);
  };
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div><span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Artists</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Add New Artist</h1></div>
        <Link href="/admin/artists" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">← Back</Link>
      </div>
      {error&&<div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-sm"><p className="text-[12px] text-red-400">{error}</p></div>}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["name","Artist Name *","Artist Name"],["slug","URL Slug","artist-name"],["genre","Genre","Reggae / Afrobeats"],["origin","Origin","Mauritius Island"]].map(([k,l,p])=>(
            <div key={k}><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">{l}</label>
              <input type="text" value={f[k as keyof typeof f] as string} onChange={e=>set(k,e.target.value)} placeholder={p} className={IC+(k==="slug"?" font-mono":"")}/></div>
          ))}
        </div>
        <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Biography</label>
          <textarea value={f.bio} onChange={e=>set("bio",e.target.value)} rows={5} placeholder="Artist biography..." className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none"/></div>
        <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Tags (comma separated)</label>
          <input type="text" value={f.tags} onChange={e=>set("tags",e.target.value)} placeholder="Reggae, World, Afrobeats" className={IC}/>
          <p className="text-[10px] text-foreground/25 mt-1">Appear as filters on Artists page</p></div>
        <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Artist Photo</label>
          <ImageUpload value={f.image} onChange={url=>set("image",url)} folder="artists"/></div>
        <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Image Alt Text</label>
          <input type="text" value={f.image_alt} onChange={e=>set("image_alt",e.target.value)} placeholder="Artist performing on stage" className={IC}/></div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="feat" checked={f.featured} onChange={e=>set("featured",e.target.checked)} className="w-4 h-4 border border-foreground/20 bg-foreground/5 rounded-sm cursor-pointer"/>
          <label htmlFor="feat" className="text-[13px] text-foreground/60 cursor-pointer">Featured artist (shown on homepage)</label>
        </div>
        <div className="pt-3 border-t border-foreground/8 flex gap-3">
          <button onClick={save} disabled={saving} className="flex-1 py-3 bg-foreground text-background text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50">{saving?"Saving...":"Add Artist"}</button>
          <Link href="/admin/artists" className="px-6 py-3 border border-foreground/10 text-foreground/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/20 transition-all">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
