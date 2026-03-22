"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface EventRow { id:string;slug:string;title:string;venue:string;city:string;genre:string;event_date:string;featured:boolean;sold_out:boolean;_source?:string; }

export default function AdminEventsPage() {
  const [dbEvents, setDbEvents] = useState<EventRow[]>([]);
  const [deleting, setDeleting] = useState<string|null>(null);
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);
  const toast$=(msg:string,ok=true)=>{setToast({msg,ok});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    fetch("/api/admin/events").then(r=>r.ok?r.json():[])
      .then((d:any[])=>setDbEvents(Array.isArray(d)?d.map(e=>({
        id:e.id,slug:e.slug??"",title:e.title??"",venue:e.venue??"",city:e.city??"",genre:e.genre??"",
        event_date:e.eventDate??e.event_date??"",featured:Boolean(e.featured),
        sold_out:Boolean(e.soldOut??e.sold_out),_source:"db"
      })):[])).catch(()=>{});
  },[]);

  const handleDelete=async(id:string,title:string)=>{
    if(!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      const res=await fetch("/api/admin/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,_action:"delete"})});
      if(!res.ok) throw new Error();
      setDbEvents(p=>p.filter(e=>e.id!==id));toast$("Event deleted");
    } catch {toast$("Failed",false);}
    setDeleting(null);
  };

  const all=[...dbEvents];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast&&<div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${toast.ok?"bg-foreground/10 border-foreground/20 text-foreground":"bg-red-500/10 border-red-500/20 text-red-400"}`}>{toast.msg}</div>}
      <div className="flex items-center justify-between mb-8">
        <div><span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
          <h1 className="font-display text-4xl font-light italic text-foreground">Events <span className="text-foreground/30 text-2xl">({all.length})</span></h1></div>
        <div className="flex items-center gap-3">
          <a href="/events" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <Link href="/admin/events/new" className="px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">+ Add Event</Link>
        </div>
      </div>
      <div className="border border-foreground/8 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-foreground/8 bg-foreground/[0.02]">
            <th className="px-5 py-3 text-left text-[10px] uppercase text-foreground/30">Event</th>
            <th className="px-5 py-3 hidden md:table-cell text-left text-[10px] uppercase text-foreground/30">Date</th>
            <th className="px-5 py-3 hidden lg:table-cell text-left text-[10px] uppercase text-foreground/30">Venue</th>
            <th className="px-5 py-3 hidden lg:table-cell text-left text-[10px] uppercase text-foreground/30">Status</th>
            <th className="px-5 py-3 text-right text-[10px] uppercase text-foreground/30">Actions</th>
          </tr></thead>
          <tbody>
            {all.length===0?<tr><td colSpan={5} className="text-center py-10 text-foreground/40 text-[13px]">No events yet.</td></tr>
            :all.map(e=>(
              <tr key={e.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                <td className="px-5 py-4"><p className="text-[13px] text-foreground/80 font-medium">{e.title}</p><p className="text-[11px] text-foreground/30">{e.genre}</p></td>
                <td className="px-5 py-4 hidden md:table-cell text-[12px] text-foreground/40">{e.event_date?new Date(e.event_date).toLocaleDateString("en-GB"):"—"}</td>
                <td className="px-5 py-4 hidden lg:table-cell text-[12px] text-foreground/40">{e.venue}{e.city?`, ${e.city}`:""}</td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex gap-1.5 flex-wrap">
                    {e.featured&&<span className="px-2 py-0.5 text-[9px] bg-foreground/10 text-foreground/50 rounded-sm">Featured</span>}
                    {e.sold_out&&<span className="px-2 py-0.5 text-[9px] bg-red-500/10 text-red-400 rounded-sm">Sold Out</span>}
                    <span className={`px-2 py-0.5 text-[9px] rounded-sm ${e._source==="static"?"bg-foreground/5 text-foreground/30":"bg-blue-400/10 text-blue-400"}`}>{e._source==="static"?"Default":"Custom"}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/events/${e.slug}`} target="_blank" className="px-3 py-1.5 text-[10px] border border-foreground/10 text-foreground/40 rounded-sm hover:text-foreground/60 hover:border-foreground/20 transition-all">View</Link>
                    {e._source!=="static"&&<>
                      <Link href={`/admin/events/${e.id}/edit`} className="px-3 py-1.5 text-[10px] border border-blue-400/20 text-blue-400/70 rounded-sm hover:border-blue-400/40 hover:text-blue-400 transition-all">Edit</Link>
                      <button onClick={()=>handleDelete(e.id,e.title)} disabled={deleting===e.id} className="px-3 py-1.5 text-[10px] border border-red-500/20 text-red-400/60 rounded-sm hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-40">{deleting===e.id?"...":"Delete"}</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
