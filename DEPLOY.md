# IREY PROD — Deployment Guide
# ==============================

## Prerequisites
- cPanel hosting with:
  - Node.js App support (Phusion Passenger) — Node 18+
  - MySQL 5.7+ or MariaDB 10.3+
  - PHP 8.0+
  - SSL certificate (HTTPS)

---

## STEP 1 — Create MySQL Database in cPanel

1. Login to cPanel → **MySQL Databases**
2. Create database: `yourusername_ireyprod`
3. Create user: `yourusername_dbuser` with a strong password
4. Add user to database → grant **ALL PRIVILEGES**
5. Open **phpMyAdmin**
6. Select your database → click **Import**
7. Upload and run `database/setup.sql`
8. You should see: `Setup complete!`

---

## STEP 2 — Create .env.php on server

In cPanel **File Manager**, create `/home/yourusername/.env.php`:

```php
<?php
putenv('DB_HOST=localhost');
putenv('DB_NAME=yourusername_ireyprod');
putenv('DB_USER=yourusername_dbuser');
putenv('DB_PASS=your_password_here');
```

⚠️ Place this in your HOME directory, NOT in public_html

---

## STEP 3 — Upload the project

Via cPanel **File Manager** or **FTP**:

1. Create folder: `/home/yourusername/ireyprod/`
2. Upload and extract `irey-prod-v11.zip` into that folder
3. Your structure should be:
```
/home/yourusername/
  .env.php                    ← your DB credentials
  ireyprod/
    src/
    public/
    package.json
    server.js
    database/
      setup.sql
    ...
```

---

## STEP 4 — Setup Node.js App in cPanel

1. cPanel → **Setup Node.js App**
2. Click **Create Application**:
   - **Node.js version**: 18 or 20
   - **Application mode**: Production
   - **Application root**: `/home/yourusername/ireyprod`
   - **Application URL**: `new.ireyprod.com` (or your domain)
   - **Application startup file**: `server.js`
3. Click **Create**

---

## STEP 5 — Install & Build

In cPanel → **Terminal** (or SSH):

```bash
cd ~/ireyprod

# Install dependencies
npm install

# Build Next.js
npm run build

# The build output goes to .next/
```

If no Terminal access, use the Node.js App interface:
- Click **Run NPM Install**
- Then in the command field run: `npm run build`

---

## STEP 6 — Set Environment Variables

In the Node.js App interface, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://new.ireyprod.com` |

---

## STEP 7 — Copy PHP files to public_html

The PHP API files need to be accessible from the web. 
In cPanel **File Manager**, copy these:

```
FROM: /home/yourusername/ireyprod/public/api/
  TO: /home/yourusername/public_html/api/
```

Copy the entire `api/` folder including `db/` subfolder.

Also copy the data directory (for JSON fallback):
```
CREATE: /home/yourusername/public_html/data/
SET permissions: 755
```

---

## STEP 8 — Start the app

Back in **Setup Node.js App**:
1. Click **Start App** (or Restart if already running)
2. Visit your domain → site should load!

---

## STEP 9 — Verify everything works

✅ Visit `https://new.ireyprod.com` — site loads  
✅ Visit `https://new.ireyprod.com/admin` — login with `IreyProd2026!`  
✅ Go to Admin → Homepage Settings → change something → Save → check frontend  
✅ Submit a contact form → check Admin → Contact  
✅ Add a test artist → check that it appears on /bookings  

---

## File Structure After Deploy

```
/home/yourusername/
├── .env.php                         ← DB credentials (NEVER in public)
├── ireyprod/                        ← Next.js app (Node.js runs this)
│   ├── .next/                       ← built files
│   ├── src/
│   ├── server.js
│   └── package.json
└── public_html/
    ├── api/                         ← PHP files (web accessible)
    │   ├── contact.php
    │   ├── bookings.php
    │   ├── data.php
    │   ├── admin/
    │   │   ├── get-settings.php
    │   │   ├── save-settings.php
    │   │   ├── save-artist.php
    │   │   ├── save-event.php
    │   │   ├── save-news.php
    │   │   ├── get-news.php
    │   │   ├── get-bookings.php
    │   │   ├── get-contacts.php
    │   │   └── get-audit.php
    │   └── db/
    │       └── connect.php
    └── data/                        ← JSON fallback storage (writable)
```

---

## Troubleshooting

**Site doesn't load:**
- Check Node.js app is running in cPanel
- Check build completed: `ls ~/ireyprod/.next/`

**PHP API errors (admin can't save):**
- Check `.env.php` credentials are correct
- Run `database/setup.sql` again in phpMyAdmin
- Check `public_html/api/db/connect.php` path to `.env.php` is correct

**Emails not sending:**
- cPanel → Email → Email Routing → set to "Local Mail Exchanger"
- Or configure SMTP in contact.php with PHPMailer

**Admin password change:**
- Edit `ADMIN_PASSWORD` in `src/app/admin/page.tsx`
- Run `npm run build` again
- Restart Node.js app

---

## Updating the site

To push changes:
1. Upload new files via FTP
2. SSH/Terminal: `cd ~/ireyprod && npm run build`
3. Restart Node.js app in cPanel

