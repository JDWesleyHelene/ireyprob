"use client";
import React, { useEffect, useState } from "react";

const SUPER_ADMIN_EMAIL = "info@wesleyhelene.com";
const ROLES = ["admin", "editor"] as const;
type Role = typeof ROLES[number];

interface User { id:string; email:string; full_name:string; role:string; is_active:boolean; invited_at:string; is_super_admin?:boolean; }

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [currentUser, setCurrentUser] = useState<{email:string; role:string}|null>(null);
  const [form, setForm] = useState({ email:"", name:"", role:"editor" as Role });
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);

  const toast$ = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),4000); };
  const isSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;
  const isAdmin = isSuperAdmin || currentUser?.role === "admin";

  const load = async () => {
    try {
      // Load current logged-in admin from Neon settings
      const [usersRes, selfRes] = await Promise.all([
        fetch("/api/admin/audit"), // We use audit just to detect session — users come from a custom table
        fetch("/api/admin/settings"),
      ]);
      // For now load users from a local state seeded with super admin
      // In production these come from an admin_users table in Neon
      setCurrentUser({ email: SUPER_ADMIN_EMAIL, role: "admin" });
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    // Load users from Neon admin_users table via API
    fetch("/api/admin/users").then(r=>r.ok?r.json():[]).then(d=>{
      setUsers(Array.isArray(d)?d:[]);
    }).catch(()=>{});
    setCurrentUser({ email: SUPER_ADMIN_EMAIL, role: "admin" });
    setLoading(false);
  }, []);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email:form.email, full_name:form.name, role:form.role, is_active:true }),
      });
      if (!res.ok) throw new Error();
      const newUser = await res.json();
      setUsers(p=>[newUser,...p]);
      toast$("User invited successfully");
      setForm({email:"",name:"",role:"editor"}); setShowInvite(false);
    } catch { toast$("Failed to invite user",false); }
    setSaving(false);
  };

  const updateRole = async (id:string, role:string, email:string) => {
    if (email===SUPER_ADMIN_EMAIL) { toast$("Cannot modify the Super Admin",false); return; }
    if (!isAdmin) { toast$("Insufficient permissions",false); return; }
    await fetch("/api/admin/users", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id,role}) });
    setUsers(p=>p.map(u=>u.id===id?{...u,role}:u));
    toast$("Role updated");
  };

  const toggleActive = async (id:string, current:boolean, email:string) => {
    if (email===SUPER_ADMIN_EMAIL) { toast$("Cannot deactivate the Super Admin",false); return; }
    if (!isAdmin) { toast$("Insufficient permissions",false); return; }
    await fetch("/api/admin/users", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id, is_active:!current}) });
    setUsers(p=>p.map(u=>u.id===id?{...u,is_active:!current}:u));
    toast$(!current?"User activated":"User deactivated");
  };

  const deleteUser = async (id:string, email:string) => {
    if (email===SUPER_ADMIN_EMAIL) { toast$("The Super Admin cannot be deleted",false); return; }
    if (!isAdmin) { toast$("Insufficient permissions",false); return; }
    if (!confirm("Remove this user?")) return;
    await fetch("/api/admin/users", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id}) });
    setUsers(p=>p.filter(u=>u.id!==id));
    toast$("User removed");
  };

  const roleColor = (role:string, email:string) => {
    if (email===SUPER_ADMIN_EMAIL) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    if (role==="admin")  return "text-foreground bg-foreground/10 border-foreground/20";
    return "text-accent bg-accent/10 border-accent/20";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast&&<div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${toast.ok?"bg-foreground/10 border-foreground/20 text-foreground":"bg-red-500/10 border-red-500/20 text-red-400"}`}>{toast.msg}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div><span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Management</span>
          <h1 className="font-display text-3xl font-light italic text-foreground">Users & Roles</h1></div>
        {isAdmin&&<button onClick={()=>setShowInvite(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>Invite User
        </button>}
      </div>

      {/* Role legend */}
      <div className="mb-6 p-4 bg-foreground/[0.02] border border-foreground/8 rounded-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {color:"text-yellow-400 bg-yellow-400/10 border-yellow-400/30",label:"Super Admin",desc:"Full access. Protected — cannot be edited or deleted."},
          {color:"text-foreground bg-foreground/10 border-foreground/20",label:"Admin",desc:"Full access to all content and settings. Can manage users."},
          {color:"text-accent bg-accent/10 border-accent/20",label:"Editor",desc:"Content only — events, artists, news. No users or settings."},
        ].map(r=>(
          <div key={r.label} className="flex items-start gap-3">
            <span className={`px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase rounded-sm border flex-shrink-0 mt-0.5 ${r.color}`}>{r.label}</span>
            <p className="text-[11px] text-foreground/40">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Invite modal */}
      {showInvite&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-foreground/10 rounded-sm p-6 w-full max-w-md">
            <h2 className="font-display text-xl font-light italic text-foreground mb-5">Invite New User</h2>
            <form onSubmit={invite} className="space-y-4">
              {[{label:"Email *",type:"email",val:form.email,key:"email",placeholder:"user@example.com"},
                {label:"Full Name",type:"text",val:form.name,key:"name",placeholder:"John Doe"}].map(f=>(
                <div key={f.key}><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 block mb-1.5">{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} required={f.label.includes("*")} placeholder={f.placeholder}
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-foreground/30"/></div>
              ))}
              <div><label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 block mb-1.5">Role</label>
                <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value as Role}))}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground focus:outline-none focus:border-foreground/30">
                  <option value="editor" className="bg-[#0a0a0a]">Editor — Content only</option>
                  <option value="admin"  className="bg-[#0a0a0a]">Admin — Full access</option>
                </select>
                <p className="text-[11px] text-foreground/30 mt-1">{form.role==="admin"?"Full access to all features":"Content only — no users or settings"}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setShowInvite(false)} className="flex-1 py-2.5 border border-foreground/10 text-foreground/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/20 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50">{saving?"Inviting...":"Invite"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="border-b border-foreground/8">
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">User</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Role</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden sm:table-cell">Status</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Invited</th>
              <th className="text-right px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? Array.from({length:3}).map((_,i)=>(
                <tr key={i} className="border-b border-foreground/5">
                  {[40,16,16,24,20].map((w,j)=><td key={j} className="px-5 py-4"><div className={`h-4 bg-foreground/5 rounded animate-pulse w-${w}`}/></td>)}
                </tr>
              )) : users.length===0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-[13px] text-foreground/30">No users yet. Invite your first team member above.</td></tr>
              ) : users.map(user=>(
                <tr key={user.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-foreground/8 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-semibold text-foreground/50 uppercase">{(user.full_name||user.email).charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{user.full_name||"—"}</p>
                        <p className="text-[11px] text-foreground/40">{user.email}</p>
                        {user.email===SUPER_ADMIN_EMAIL&&<p className="text-[9px] text-yellow-400/60 uppercase tracking-widest">Super Admin</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {user.email===SUPER_ADMIN_EMAIL ? (
                      <span className={`px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase rounded-sm border ${roleColor(user.role,user.email)}`}>Super Admin</span>
                    ) : isAdmin ? (
                      <select value={user.role} onChange={e=>updateRole(user.id,e.target.value,user.email)}
                        className={`text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm border bg-transparent focus:outline-none cursor-pointer ${roleColor(user.role,user.email)}`}>
                        {ROLES.map(r=><option key={r} value={r} className="bg-[#0a0a0a] text-foreground">{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase rounded-sm border ${roleColor(user.role,user.email)}`}>{user.role}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase ${user.is_active?"text-green-400":"text-foreground/30"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.is_active?"bg-green-400":"bg-foreground/20"}`}/>{user.is_active?"Active":"Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-[12px] text-foreground/40">{user.invited_at?new Date(user.invited_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"-"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.email!==SUPER_ADMIN_EMAIL&&isAdmin&&<>
                        <button onClick={()=>toggleActive(user.id,user.is_active,user.email)} className="text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/30 hover:text-foreground transition-colors px-2 py-1 rounded-sm hover:bg-foreground/5">
                          {user.is_active?"Deactivate":"Activate"}
                        </button>
                        <button onClick={()=>deleteUser(user.id,user.email)} className="p-1.5 text-foreground/20 hover:text-red-400 transition-colors rounded-sm hover:bg-red-400/5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </>}
                      {user.email===SUPER_ADMIN_EMAIL&&<span className="text-[10px] text-foreground/20 px-2">Protected</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
