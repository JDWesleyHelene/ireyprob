# IREY PROD — Complete Setup Guide

## Stack
- **Next.js 15** (React 19, TypeScript)
- **Supabase** (Database, Auth, Storage, Edge Functions)
- **Tailwind CSS** (custom dark theme)
- **GSAP** (scroll animations)
- **Resend** (transactional email)
- **Stripe** (ticket payments)
- **Fraunces + DM Sans** fonts (Google Fonts via next/font)

---

## 1. Clone & Install

```bash
npm install
```

---

## 2. Configure Environment Variables

Copy `.env` and fill in your real values:

```bash
cp .env .env.local
```

### Required Variables

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `NEXT_PUBLIC_SITE_URL` | Your domain e.g. `https://new.ireyprod.com` |

### Optional Variables
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Ticket payments |
| `STRIPE_SECRET_KEY` | Ticket payments (server-side) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |

---

## 3. Set Up Supabase Database

Run the migrations in order from `supabase/migrations/`:

In your Supabase Dashboard → SQL Editor, run each file:
1. `20260315103345_irey_prod_forms.sql`
2. `20260315120000_admin_content_tables.sql`
3. `20260315130000_storage_buckets.sql`
4. `20260315140000_notifications_and_settings.sql`
5. `20260315150000_news_homepage_seo_users.sql`
6. `20260315160000_audit_logs.sql`
7. `20260316170000_ticket_orders.sql`

---

## 4. Run Locally

```bash
npm run dev
# Opens at http://localhost:4028
```

---

## 5. Deploy to a Node.js VPS (Recommended for Next.js)

Next.js requires Node.js — it **cannot be deployed directly to cPanel shared hosting**.

### Option A: VPS (DigitalOcean / Hetzner / Vultr)

```bash
# On your server
git clone <your-repo>
cd irey-prod
npm install
npm run build
npm run serve   # runs next start
```

Use **PM2** to keep it running:
```bash
npm install -g pm2
pm2 start "npm run serve" --name ireyprod
pm2 save
pm2 startup
```

Use **Nginx** as a reverse proxy to your domain.

### Option B: Vercel (Easiest — free tier available)

```bash
npm install -g vercel
vercel
```

Set environment variables in the Vercel dashboard.

### Option C: cPanel with Node.js Support

Some cPanel hosts support Node.js via **Phusion Passenger**:
1. Login to cPanel → Software → Setup Node.js App
2. Set Node.js version to 18+
3. Set Application root to your project folder
4. Set Application startup file to `server.js`
5. Set environment variables in the cPanel UI
6. Upload files via FTP / File Manager
7. Run `npm install` and `npm run build` via cPanel Terminal

---

## 6. Admin Dashboard

Access at `/admin` — requires Supabase Auth login.

Features:
- **Dashboard** — overview stats
- **Artists** — add/edit/delete artists
- **Events** — manage events with tickets
- **News** — publish articles
- **Bookings** — view booking inquiries
- **Contact** — view contact messages
- **Homepage** — edit hero text live
- **SEO** — manage meta tags
- **Settings** — site configuration
- **Users** — manage admin users
- **Audit Log** — track all changes

---

## 7. Pages

| Route | Description |
|-------|-------------|
| `/home-page` | Homepage (redirected from `/`) |
| `/events` | Events listing |
| `/events/[slug]` | Event detail |
| `/artists` | Artist roster |
| `/bookings` | Booking inquiry |
| `/bookings/[slug]` | Book specific artist |
| `/news` | News listing |
| `/news/[slug]` | Article detail |
| `/services` | Services page |
| `/about` | About page |
| `/contact` | Contact form |
| `/admin/*` | Admin dashboard (protected) |

