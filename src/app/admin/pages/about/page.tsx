"use client";
import React, { useState, useEffect } from "react";
import { toCloudUrl } from "@/lib/imageUrl";
import Link from "next/link";
import ImageField from "@/components/ui/ImageField";
import RichTextEditor from "@/components/ui/RichTextEditor";

const IC = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors";
const TA = "w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors resize-none";

type Tab = "hero"|"story"|"mission"|"values"|"team"|"cta";

interface ValueItem  { number:string; title:string; description:string; }
interface StatItem   { value:string; label:string; }
interface TeamMember { name:string; role:string; image:string; imageAlt:string; }

const DEF_VALUES: ValueItem[] = [
  { number:"01", title:"Creativity",          description:"Embracing creativity is fundamental in event planning and artist management. The ability to think outside the box, generate innovative ideas, and deliver unique experiences is highly valued." },
  { number:"02", title:"Integrity",           description:"Trust is essential in any business relationship. We emphasise honesty, transparency, and ethical behaviour in all dealings with clients, artists, and other stakeholders." },
  { number:"03", title:"Client-Centric",      description:"Placing the client's needs and satisfaction at the forefront is a key value. Understanding and meeting or exceeding client expectations contribute to long-term success." },
  { number:"04", title:"Collaboration",       description:"Effective collaboration is essential for success in the event and entertainment industry. We work closely with clients, artists, vendors, and other stakeholders." },
  { number:"05", title:"Professionalism",     description:"Maintaining a high level of professionalism in all aspects of business — from communication to event execution — is crucial." },
  { number:"06", title:"Innovation",          description:"Constantly seeking new and better ways to execute events and manage artists is a core value. Embracing technological advancements and staying ahead of industry trends." },
  { number:"07", title:"Passion",             description:"A passion for creating memorable events and supporting artists in their careers is our driving force." },
  { number:"08", title:"Attention to Detail", description:"The success of an event often depends on meticulous planning and execution. Having an eye for detail ensures nothing is overlooked." },
];

const DEF_STATS: StatItem[] = [
  { value:"4",    label:"Core Services" },
  { value:"360°", label:"Full Agency Coverage" },
  { value:"100%", label:"Client-Centric Approach" },
  { value:"1",    label:"One-Stop Agency" },
];

const DEF_TEAM: TeamMember[] = [
  { name:"Creative Director",      role:"Bookings & Artist Management", image:toCloudUrl("https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d024-qetpkvnnuor9fqhufseegetdgswcuflrz3eovw9x60.jpg"), imageAlt:"Creative Director" },
  { name:"Production Manager",     role:"Events & Logistics",           image:toCloudUrl("https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d029-qetpkzf0m0weq6cdtu0wqdv7ucdtp80pbm0mt04ch4.jpg"), imageAlt:"Production Manager" },
  { name:"Digital Marketing Lead", role:"Press & Digital Strategy",     image:toCloudUrl("https://ireyprod.com/wp-content/uploads/elementor/thumbs/3d005-qetpkgm8tc6o9z3ovlwdcilzymyhf9y2l0yx7gw7xk.jpg"), imageAlt:"Digital Marketing Lead" },
];

export default function AdminAboutPage() {
  const [tab, setTab] = useState<Tab>("hero");

  // Hero
  const [heroLabel,   setHeroLabel]   = useState("— About Agency");
  const [heroHeading, setHeroHeading] = useState("The One-Stop Agency You'll Ever Need");
  const [heroSub,     setHeroSub]     = useState("Relax & Take It Easy! IREY PROD is a dynamic and forward-thinking organisation based in Mauritius Island.");

  // Story
  const [storyImage,   setStoryImage]   = useState(toCloudUrl("https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg"));
  const [storyLabel,   setStoryLabel]   = useState("— Who We Are");
  const [storyHeading, setStoryHeading] = useState("Bookings, Tours,\nEvents, Productions");
  const [storyP1,      setStoryP1]      = useState("Our agency is a dynamic and forward-thinking organisation specialising in Digital Marketing, Stage and Artist Management, as well as Event Coordination.");
  const [storyP2,      setStoryP2]      = useState("We pride ourselves on our ability to seamlessly blend creativity, innovation, and strategic thinking to provide unparalleled support and services to both emerging and established talents.");
  const [storyP3,      setStoryP3]      = useState("Based in Mauritius Island, IREY PROD operates across the music and performing arts sectors — delivering Bookings, Tours, Events, and Productions with passion and precision.");

  // Mission
  const [missionLabel,   setMissionLabel]   = useState("— Our Mission");
  const [missionHeading, setMissionHeading] = useState("Creating Successful & Fulfilling Experiences");
  const [missionText,    setMissionText]    = useState("Our mission is to create successful and fulfilling experiences — whether for clients hosting events or artists pursuing their careers.");
  const [stats, setStats] = useState<StatItem[]>(DEF_STATS);

  // Values
  const [valuesLabel,   setValuesLabel]   = useState("— Our Values");
  const [valuesHeading, setValuesHeading] = useState("What Guides Us");
  const [values, setValues] = useState<ValueItem[]>(DEF_VALUES);

  // Team
  const [teamLabel,   setTeamLabel]   = useState("— The Team");
  const [teamHeading, setTeamHeading] = useState("A Small But Effective Team");
  const [team, setTeam] = useState<TeamMember[]>(DEF_TEAM);

  // CTA
  const [ctaHeading, setCtaHeading] = useState("Want to know how we can help your business?");
  const [ctaSub,     setCtaSub]     = useState("Got questions? Ideas? Leave your details and our specialist will contact you.");

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.ok?r.json():{}).then((d:Record<string,string>) => {
      if (d.about_hero_label)    setHeroLabel(d.about_hero_label);
      if (d.about_hero_heading)  setHeroHeading(d.about_hero_heading);
      if (d.about_hero_sub)      setHeroSub(d.about_hero_sub);
      if (d.about_story_image)   setStoryImage(d.about_story_image);
      if (d.about_story_label)   setStoryLabel(d.about_story_label);
      if (d.about_story_heading) setStoryHeading(d.about_story_heading);
      if (d.about_story_p1)      setStoryP1(d.about_story_p1);
      if (d.about_story_p2)      setStoryP2(d.about_story_p2);
      if (d.about_story_p3)      setStoryP3(d.about_story_p3);
      if (d.about_mission_label)   setMissionLabel(d.about_mission_label);
      if (d.about_mission_heading) setMissionHeading(d.about_mission_heading);
      if (d.about_mission_text)    setMissionText(d.about_mission_text);
      if (d.about_values_label)  setValuesLabel(d.about_values_label);
      if (d.about_values_heading)setValuesHeading(d.about_values_heading);
      if (d.about_team_label)    setTeamLabel(d.about_team_label);
      if (d.about_team_heading)  setTeamHeading(d.about_team_heading);
      if (d.about_cta_heading)   setCtaHeading(d.about_cta_heading);
      if (d.about_cta_sub)       setCtaSub(d.about_cta_sub);
      try { if (d.about_stats)  setStats(JSON.parse(d.about_stats)); } catch {}
      try { if (d.about_values) setValues(JSON.parse(d.about_values)); } catch {}
      try { if (d.about_team)   setTeam(JSON.parse(d.about_team)); } catch {}
    }).catch(()=>{});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          about_hero_label: heroLabel, about_hero_heading: heroHeading, about_hero_sub: heroSub,
          about_story_image: storyImage, about_story_label: storyLabel, about_story_heading: storyHeading,
          about_story_p1: storyP1, about_story_p2: storyP2, about_story_p3: storyP3,
          about_mission_label: missionLabel, about_mission_heading: missionHeading, about_mission_text: missionText,
          about_stats: JSON.stringify(stats),
          about_values_label: valuesLabel, about_values_heading: valuesHeading, about_values: JSON.stringify(values),
          about_team_label: teamLabel, about_team_heading: teamHeading, about_team: JSON.stringify(team),
          about_cta_heading: ctaHeading, about_cta_sub: ctaSub,
        }),
      });
      if (res.ok) { setSaved(true); setTimeout(()=>setSaved(false),3000); }
    } catch {}
    setSaving(false);
  };

  const updateStat   = (i:number, f:"value"|"label", v:string) => setStats(p=>p.map((x,j)=>j===i?{...x,[f]:v}:x));
  const updateValue  = (i:number, f:keyof ValueItem, v:string) => setValues(p=>p.map((x,j)=>j===i?{...x,[f]:v}:x));
  const updateMember = (i:number, f:keyof TeamMember, v:string) => setTeam(p=>p.map((x,j)=>j===i?{...x,[f]:v}:x));
  const addMember    = () => setTeam(p=>[...p,{name:"New Member",role:"Role",image:"",imageAlt:"Team member"}]);
  const deleteMember = (i:number) => { if(team.length<=1){alert("Keep at least 1.");return;} setTeam(p=>p.filter((_,j)=>j!==i)); };

  const TABS:{id:Tab;label:string}[] = [
    {id:"hero",    label:"Hero"},
    {id:"story",   label:"Our Story"},
    {id:"mission", label:"Mission"},
    {id:"values",  label:"Values (8)"},
    {id:"team",    label:"Team"},
    {id:"cta",     label:"CTA"},
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/pages" className="text-[11px] text-foreground/30 hover:text-foreground transition-colors mb-2 block">← Page Content</Link>
          <h1 className="font-display text-4xl font-extrabold italic text-foreground">About Page</h1>
        </div>
        <div className="flex gap-3">
          <a href="/about" target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all">Preview</a>
          <button onClick={save} disabled={saving}
            className={`px-5 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm transition-all disabled:opacity-50 ${saved?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-foreground text-background hover:bg-accent"}`}>
            {saving?"Saving...":saved?"✓ Saved":"Save All"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border border-foreground/10 rounded-sm w-fit mb-8 overflow-hidden">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all whitespace-nowrap ${tab===t.id?"bg-foreground text-background":"text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HERO ── */}
      {tab==="hero" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Hero Section</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Page Label</label>
            <input value={heroLabel} onChange={e=>setHeroLabel(e.target.value)} placeholder="— About Agency" className={IC}/></div>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Main Heading</label>
            <input value={heroHeading} onChange={e=>setHeroHeading(e.target.value)} className={IC}/></div>
          <RichTextEditor label="Subtext" value={heroSub} onChange={setHeroSub} rows={3}/>
        </div>
      )}

      {/* ── STORY ── */}
      {tab==="story" && (
        <div className="space-y-5">
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
            <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Story Section</h2>
            <ImageField label="Section Image" value={storyImage} onChange={setStoryImage}/>
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Label</label>
              <input value={storyLabel} onChange={e=>setStoryLabel(e.target.value)} placeholder="— Who We Are" className={IC}/></div>
            <RichTextEditor label="Heading" value={storyHeading} onChange={setStoryHeading} rows={2}/>
            <RichTextEditor label="Paragraph 1" value={storyP1} onChange={setStoryP1} rows={3}/>
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Paragraph 2</label>
              <textarea value={storyP2} onChange={e=>setStoryP2(e.target.value)} rows={3} className={TA}/></div>
            <RichTextEditor label="Paragraph 3" value={storyP3} onChange={setStoryP3} rows={3}/>
          </div>
        </div>
      )}

      {/* ── MISSION ── */}
      {tab==="mission" && (
        <div className="space-y-5">
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
            <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Mission Section</h2>
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Label</label>
              <input value={missionLabel} onChange={e=>setMissionLabel(e.target.value)} className={IC}/></div>
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Heading</label>
              <input value={missionHeading} onChange={e=>setMissionHeading(e.target.value)} className={IC}/></div>
            <RichTextEditor label="Text" value={missionText} onChange={setMissionText} rows={3}/>
          </div>
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-4">
            <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">Stats (4 boxes)</h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s,i)=>(
                <div key={i} className="space-y-2 p-4 border border-foreground/8 rounded-sm">
                  <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-1">Value</label>
                    <input value={s.value} onChange={e=>updateStat(i,"value",e.target.value)} className={IC}/></div>
                  <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 mb-1">Label</label>
                    <input value={s.label} onChange={e=>updateStat(i,"label",e.target.value)} className={IC}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VALUES ── */}
      {tab==="values" && (
        <div className="space-y-4">
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-4">
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Section Label</label>
              <input value={valuesLabel} onChange={e=>setValuesLabel(e.target.value)} className={IC}/></div>
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Section Heading</label>
              <input value={valuesHeading} onChange={e=>setValuesHeading(e.target.value)} className={IC}/></div>
          </div>
          {values.map((v,i)=>(
            <div key={i} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-accent">{v.number}</span>
                <span className="text-[12px] text-foreground/50">{v.title}</span>
              </div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-1">Number</label>
                <input value={v.number} onChange={e=>updateValue(i,"number",e.target.value)} className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-1">Title</label>
                <input value={v.title} onChange={e=>updateValue(i,"title",e.target.value)} className={IC}/></div>
              <RichTextEditor label="Description" value={v.description} onChange={v2=>updateValue(i,"description",v2)} rows={2}/>
            </div>
          ))}
        </div>
      )}

      {/* ── TEAM ── */}
      {tab==="team" && (
        <div className="space-y-4">
          <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-4">
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Section Label</label>
              <input value={teamLabel} onChange={e=>setTeamLabel(e.target.value)} placeholder="— The Team" className={IC}/></div>
            <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Section Heading</label>
              <input value={teamHeading} onChange={e=>setTeamHeading(e.target.value)} placeholder="A Small But Effective Team" className={IC}/></div>
          </div>

          <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm">
            <p className="text-[11px] text-foreground/60">3-column grid. Add up to any number of members. Each needs a name, title and photo.</p>
          </div>

          {team.map((m,i)=>(
            <div key={i} className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-foreground/60">{m.name || "Member "+(i+1)}</span>
                <button onClick={()=>deleteMember(i)} disabled={team.length<=1}
                  className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase border border-red-500/20 rounded-sm text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-20">
                  Delete
                </button>
              </div>
              <ImageField label="Photo" value={m.image} onChange={v=>updateMember(i,"image",v)}/>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Name / Title</label>
                <input value={m.name} onChange={e=>updateMember(i,"name",e.target.value)} placeholder="John Doe" className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Role</label>
                <input value={m.role} onChange={e=>updateMember(i,"role",e.target.value)} placeholder="Bookings & Artist Management" className={IC}/></div>
              <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Photo Alt Text</label>
                <input value={m.imageAlt} onChange={e=>updateMember(i,"imageAlt",e.target.value)} placeholder="Name - Role" className={IC}/></div>
            </div>
          ))}

          <button onClick={addMember}
            className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-foreground/20 text-foreground/40 hover:text-foreground hover:border-foreground/40 transition-all rounded-sm text-[11px] font-semibold tracking-[0.15em] uppercase">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add Team Member
          </button>
        </div>
      )}

      {/* ── CTA ── */}
      {tab==="cta" && (
        <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm p-6 space-y-5">
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">CTA Section</h2>
          <div><label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-2">Heading</label>
            <input value={ctaHeading} onChange={e=>setCtaHeading(e.target.value)} className={IC}/></div>
          <RichTextEditor label="Subtext" value={ctaSub} onChange={setCtaSub} rows={2}/>
        </div>
      )}
    </div>
  );
}
