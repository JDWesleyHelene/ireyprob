# IREY PROD — Data Architecture

## How Data is Saved and Read

### The Flow

```
Admin Dashboard (browser)
         │
         │ HTTP POST (JSON)
         ▼
PHP API (/public/api/admin/save-*.php)
         │
         │ writes to file
         ▼
JSON File (/data/*.json on cPanel server)
         │
         │ HTTP GET (JSON)
         ▼
useLiveData hooks (React, browser)
         │
         │ merges with static defaults
         ▼
Website pages show live content
```

### Data Files on Server

All saved in `/data/` folder on your cPanel server:

| File | What it contains |
|------|-----------------|
| `settings.json` | Homepage text, phone, email, social links, SEO |
| `artists.json` | Artists added via admin dashboard |
| `events.json` | Events added via admin dashboard |
| `news.json` | All news articles (draft + published) |
| `bookings.json` | Booking form submissions |
| `contacts.json` | Contact form submissions |
| `audit.json` | Log of every admin action |

### How Static vs Dynamic Works

The site ships with **default content** hardcoded in `src/lib/data.ts`.
This is the fallback — it works even with no server, no PHP, no JSON files.

When the site loads:
1. Pages render instantly with static data (fast, no loading spinner)
2. `useLiveData` hooks fire in background, fetch `/api/data.php?type=X`
3. If JSON files exist with new content, pages update to show it
4. Dynamic artists/events/news REPLACE or EXTEND the static defaults

### Password

The admin password is stored in:
`src/app/admin/page.tsx` → `const ADMIN_PASSWORD = "IreyProd2026!"`

To change it:
1. Edit that line
2. Run `npm run build` 
3. Re-upload the built files

**OR** in Phase 2 with MySQL, passwords will be stored in the database with bcrypt hashing.

### What needs a rebuild vs what is instant

| Change | Needs rebuild? |
|--------|---------------|
| Add/edit news article | ❌ No — saves to JSON, shows instantly |
| Add/edit artist | ❌ No — saves to JSON, shows instantly |
| Add/edit event | ❌ No — saves to JSON, shows instantly |
| Change homepage text/email/phone | ❌ No — saves to JSON, shows instantly |
| Change SEO title/description | ❌ No — saves to JSON, shows instantly |
| Change admin password | ✅ Yes — hardcoded in source, needs rebuild |
| Change site design/layout | ✅ Yes — requires code change + rebuild |

### Phase 2 — MySQL upgrade

In Phase 2, the JSON files get replaced by MySQL tables:
- `artists` table → replaces `data/artists.json`
- `events` table → replaces `data/events.json`  
- `news` table → replaces `data/news.json`
- `settings` table → replaces `data/settings.json`
- `users` table → replaces hardcoded password

The PHP API files (`/api/data.php`, `/api/admin/save-*.php`) get updated
to query MySQL instead of reading/writing JSON files.
The React hooks (`useLiveData.ts`) don't change at all.
