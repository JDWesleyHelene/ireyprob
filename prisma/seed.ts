import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
  console.log("Loaded env from .env.local");
}

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("\nSeeding IREY PROD demo data...\n");

  // Artists
  const artists = [
    { id:"demo-artist-1", name:"JayDee", slug:"jaydee", genre:"R&B, Soul", origin:"Mauritius",
      bio:"JayDee is a soulful R&B artist from Mauritius, known for his powerful vocals and captivating stage presence.",
      image:"https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg",
      imageAlt:"JayDee performing", tags:["R&B","Soul","Live"], featured:true, sortOrder:1 },
    { id:"demo-artist-2", name:"Nova Sound", slug:"nova-sound", genre:"Electronic, Dance", origin:"Mauritius",
      bio:"Nova Sound blends electronic beats with island vibes, creating a unique sonic experience that moves audiences worldwide.",
      image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg",
      imageAlt:"Nova Sound DJ set", tags:["Electronic","Dance","DJ"], featured:false, sortOrder:2 },
    { id:"demo-artist-3", name:"Kréol Roots", slug:"kreol-roots", genre:"Seggae, Reggae", origin:"Mauritius",
      bio:"Kréol Roots carries the authentic sounds of Mauritian Seggae, fusing traditional rhythms with modern reggae influences.",
      image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg",
      imageAlt:"Kréol Roots live", tags:["Seggae","Reggae","Roots"], featured:false, sortOrder:3 },
  ];

  for (const a of artists) {
    await (prisma as any).artist.upsert({ where:{ id:a.id }, update:a, create:a });
    console.log(`  ✓ Artist: ${a.name}`);
  }

  // Events — no eventTime field (add via admin if needed)
  const events = [
    { id:"demo-event-1", title:"JayDee — Album Launch Night", slug:"jaydee-album-launch",
      eventDate:new Date("2026-03-28T19:30:00.000Z"), venue:"Le Caudan Waterfront",
      city:"Port Louis", country:"Mauritius", genre:"R&B",
      image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg",
      imageAlt:"JayDee Album Launch",
      description:"An unforgettable evening celebrating JayDee's debut album. Live performance, special guests, and exclusive merchandise on the night.",
      artists:["JayDee"], featured:true, soldOut:false },
    { id:"demo-event-2", title:"IREY FEST 2026", slug:"irey-fest-2026",
      eventDate:new Date("2026-04-19T14:00:00.000Z"), venue:"Domaine Les Pailles",
      city:"Port Louis", country:"Mauritius", genre:"Festival",
      image:"https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg",
      imageAlt:"IREY FEST 2026",
      description:"The biggest music festival in Mauritius returns! Multiple artists, multiple stages. A full day celebration of music, culture, and community.",
      artists:["JayDee","Nova Sound","Kréol Roots"], featured:false, soldOut:false },
    { id:"demo-event-3", title:"Protez nu Lagoon", slug:"protez-nu-lagoon",
      eventDate:new Date("2026-05-23T18:00:00.000Z"), venue:"Grand Gaube Beach",
      city:"Pamplemousses", country:"Mauritius", genre:"Seggae, Dancehall",
      image:"https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg",
      imageAlt:"Protez nu Lagoon",
      description:"A sunset beach concert celebrating Mauritian culture and ocean conservation. Seggae and Dancehall by the lagoon.",
      artists:["Kréol Roots"], featured:false, soldOut:false },
  ];

  for (const e of events) {
    await (prisma as any).event.upsert({ where:{ id:e.id }, update:e, create:e });
    console.log(`  ✓ Event:  ${e.title}`);
  }

  console.log("\n✅ Seed complete! Delete from Admin → Artists / Events anytime.\n");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
