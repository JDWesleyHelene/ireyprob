"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminLayoutProps { children: React.ReactNode; }

const navItems = [
  { href:"/admin/dashboard", label:"Dashboard",  section:"content",    icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href:"/admin/artists",   label:"Artists",    section:"content",    icon:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { href:"/admin/events",    label:"Events",     section:"content",    icon:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href:"/admin/news",      label:"News",       section:"content",    icon:"M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { href:"/admin/bookings",  label:"Bookings",   section:"content",    icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href:"/admin/contact",   label:"Contact",    section:"content",    icon:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { href:"/admin/homepage",  label:"Homepage",   section:"content",    icon:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { href:"/admin/gallery",    label:"Gallery",    section:"content",    icon:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href:"/admin/pages",      label:"Page Content",section:"content",    icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href:"/admin/navigation", label:"Navigation",  section:"management", icon:"M4 6h16M4 12h8m-8 6h16" },
  { href:"/admin/seo",       label:"SEO",        section:"management", icon:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { href:"/admin/audit",     label:"Audit Log",  section:"management", icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href:"/admin/users",     label:"Users",      section:"management", icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href:"/admin/settings",  label:"Settings",   section:"management", icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const contentItems    = navItems.filter(n => n.section === "content");
const managementItems = navItems.filter(n => n.section === "management");
const mobileNavItems  = navItems.slice(0, 5);

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const [checking, setChecking]     = useState(true);
  const [isAuthed, setIsAuthed]     = useState(false);
  const [adminName, setAdminName]   = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin";

  useEffect(() => {
    if (isLoginPage) { setChecking(false); return; }
    try {
      // Check sessionStorage first (session login)
      const session = sessionStorage.getItem("irey_admin");
      if (session) {
        try { const d = JSON.parse(session); setAdminName(d.name || "Admin"); } catch {}
        setIsAuthed(true); setChecking(false); return;
      }
      // Check localStorage (remember me)
      const remembered = localStorage.getItem("irey_admin_remember");
      if (remembered) {
        try { const d = JSON.parse(remembered); setAdminName(d.name || "Admin"); } catch {}
        // Re-hydrate sessionStorage so layout stays consistent
        sessionStorage.setItem("irey_admin", remembered);
        setIsAuthed(true); setChecking(false); return;
      }
    } catch {}
    // Not authenticated — redirect to login
    router.replace("/admin");
    setChecking(false);
  }, [router, isLoginPage, pathname]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleSignOut = () => {
    sessionStorage.removeItem("irey_admin");
    localStorage.removeItem("irey_admin_remember");
    router.push("/admin");
  };

  if (isLoginPage) return <>{children}</>;

  if (checking) return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center">
      <svg className="animate-spin w-5 h-5 text-foreground/40" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href + "/"));
    return (
      <Link href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group ${isActive ? "bg-foreground/8 text-foreground" : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
        </svg>
        <span className="text-[12px] font-medium tracking-wide">{item.label}</span>
        {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-foreground/40"/>}
      </Link>
    );
  };

  const currentPage = navItems.find(n => pathname === n.href || pathname.startsWith(n.href + "/"))?.label || "Admin";

  return (
    <div className="min-h-screen bg-[#040404] flex">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}/>}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-64 border-r border-foreground/8 flex flex-col flex-shrink-0 h-screen bg-[#040404] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-5 py-5 border-b border-foreground/8 flex items-center justify-between">
          <Link href="/" target="_blank" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-background text-[10px] font-bold tracking-wider">IP</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-foreground">IREY PROD</p>
              <p className="text-[9px] text-foreground/30 tracking-widest uppercase">Admin Panel</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-foreground/30 hover:text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          <p className="px-3 pb-2 text-[9px] font-semibold tracking-[0.25em] uppercase text-foreground/20">Content</p>
          {contentItems.map(item => <NavItem key={item.href} item={item}/>)}
          <div className="pt-3">
            <p className="px-3 pb-2 text-[9px] font-semibold tracking-[0.25em] uppercase text-foreground/20">Management</p>
            {managementItems.map(item => <NavItem key={item.href} item={item}/>)}
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-foreground/8">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-7 h-7 rounded-sm bg-foreground/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-foreground/60 uppercase">{adminName.charAt(0)}</span>
            </div>
            <p className="text-[12px] text-foreground/60 font-medium truncate">{adminName}</p>
          </div>
          <div className="space-y-0.5">
            <button onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-sm text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5 transition-all text-[12px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sign Out
            </button>
            <Link href="/" target="_blank"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-sm text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5 transition-all text-[12px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              View Site ↗
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-shrink-0 h-14 border-b border-foreground/8 flex items-center gap-4 px-4 sm:px-6 bg-[#040404] sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center justify-center w-10 h-10 text-foreground/40 hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden sm:block">{currentPage}</p>
          <div className="ml-auto">
            <Link href="/" target="_blank" className="text-[10px] text-foreground/30 hover:text-foreground/60 font-mono uppercase tracking-widest transition-colors">View Site ↗</Link>
          </div>
        </div>
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#040404] border-t border-foreground/8 flex items-center justify-around px-2 py-2">
        {mobileNavItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-sm min-h-[48px] min-w-[48px] justify-center ${isActive ? "text-foreground" : "text-foreground/30"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2" : "1.5"} className="flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
              </svg>
              <span className="text-[9px] font-semibold tracking-wide truncate">{item.label}</span>
            </Link>
          );
        })}
        <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-1 px-2 py-1.5 text-foreground/30 min-h-[48px] min-w-[48px] justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span className="text-[9px] font-semibold tracking-wide">More</span>
        </button>
      </nav>
    </div>
  );
}
