"use client";
import React, { useState, useEffect, useRef } from "react";

interface NavItem { id: string; label: string; href: string; active: boolean; }

const DEFAULT_NAV: NavItem[] = [
  { id:"n1", label:"Artists",  href:"/bookings", active:true },
  { id:"n2", label:"About",    href:"/about",    active:true },
  { id:"n3", label:"Services", href:"/services", active:true },
  { id:"n4", label:"Contact",  href:"/contact",  active:true },
  { id:"n5", label:"Events",   href:"/events",   active:true },
];

export default function AdminNavigationPage() {
  const [items, setItems]   = useState<NavItem[]>(DEFAULT_NAV);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [toast, setToast]   = useState<{msg:string;ok:boolean}|null>(null);
  const dragIdx = useRef<number|null>(null);

  const toast$ = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then(d=>{
      if (d.nav_items) {
        try { const n=JSON.parse(d.nav_items); if(Array.isArray(n)&&n.length>0) setItems(n); } catch {}
      }
    }).catch(()=>{});
  }, []);

  const save = async (nav: NavItem[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ nav_items: JSON.stringify(nav) }),
      });
      if(res.ok){ setSaved(true); setTimeout(()=>setSaved(false),3000); toast$("Navigation saved"); }
      else toast$("Failed",false);
    } catch { toast$("Error",false); }
    setSaving(false);
  };

  const updateLabel = (id:string, label:string) => setItems(p=>p.map(i=>i.id===id?{...i,label}:i));
  const toggleActive = (id:string) => { const updated=items.map(i=>i.id===id?{...i,active:!i.active}:i); setItems(updated); save(updated); };
  const deleteItem = (id:string) => { if(items.length<=1){toast$("Must keep at least 1",false);return;} const updated=items.filter(i=>i.id!==id); setItems(updated); save(updated); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      {toast&&<div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${toast.ok?"bg-foreground/10 border-foreground/20 text-foreground":"bg-red-500/10 border-red-500/20 text-red-400"}`}>{toast.msg}</div>}

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">Navigation</h1>
          <p className="text-[12px] text-foreground/40 mt-1">Drag to reorder. Click label to rename. Toggle to hide/show.</p>
        </div>
        <button onClick={()=>save(items)} disabled={saving}
          className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"} disabled:opacity-50`}>
          {saving?"Saving...":saved?"✓ Saved":"Save Order"}
        </button>
      </div>

      <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm mb-6">
        <p className="text-[11px] text-foreground/60">Note: After saving, changes will apply on next deploy or page refresh. The navigation order reflects what visitors see.</p>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} draggable
            onDragStart={()=>{dragIdx.current=i;}}
            onDragOver={e=>{
              e.preventDefault();
              const from=dragIdx.current;
              if(from===null||from===i) return;
              const a=[...items];
              const[m]=a.splice(from,1);
              a.splice(i,0,m);
              dragIdx.current=i;
              setItems(a);
            }}
            onDragEnd={()=>{dragIdx.current=null; save(items);}}
            className={`flex items-center gap-3 p-4 border rounded-sm cursor-grab active:cursor-grabbing group transition-all ${item.active?"bg-foreground/[0.02] border-foreground/8 hover:border-foreground/20":"bg-foreground/[0.01] border-foreground/5 opacity-50"}`}>

            {/* Drag handle */}
            <div className="text-foreground/20 flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
              </svg>
            </div>

            <span className="text-[10px] text-foreground/25 w-5 flex-shrink-0">#{i+1}</span>

            {/* Editable label */}
            <input
              value={item.label}
              onChange={e=>updateLabel(item.id,e.target.value)}
              onBlur={()=>save(items)}
              className="flex-1 bg-transparent text-[14px] font-semibold text-foreground focus:outline-none border-b border-transparent focus:border-foreground/20 pb-0.5 transition-colors"
            />

            {/* Href */}
            <span className="text-[11px] text-foreground/25 font-mono hidden sm:block">{item.href}</span>

            {/* Toggle active */}
            <button onClick={()=>toggleActive(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-semibold tracking-widest uppercase border transition-all flex-shrink-0 ${item.active?"text-green-400 border-green-400/20 bg-green-400/5":"text-foreground/20 border-foreground/10"}`}>
              {item.active?"Visible":"Hidden"}
            </button>

            {/* Delete */}
            <button onClick={()=>deleteItem(item.id)}
              className="p-1.5 text-foreground/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] text-foreground/25">
        Changes are saved to the database. The Header will reflect the saved order on next page load.
      </p>
    </div>
  );
}
