-- IREY PROD: Form Submissions Schema
-- Tables: booking_submissions, contact_submissions
-- Access: Public can INSERT (no auth required for contact forms)

-- 1. Booking Submissions Table
CREATE TABLE IF NOT EXISTS public.booking_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  budget TEXT,
  timeframe TEXT,
  project TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_booking_submissions_email ON public.booking_submissions(email);
CREATE INDEX IF NOT EXISTS idx_booking_submissions_created_at ON public.booking_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- 4. Enable RLS
ALTER TABLE public.booking_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies — public can INSERT (no auth needed for contact forms)
DROP POLICY IF EXISTS "public_insert_booking_submissions" ON public.booking_submissions;
CREATE POLICY "public_insert_booking_submissions"
ON public.booking_submissions
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "public_insert_contact_submissions" ON public.contact_submissions;
CREATE POLICY "public_insert_contact_submissions"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Admin read access (authenticated users can read all submissions)
DROP POLICY IF EXISTS "authenticated_read_booking_submissions" ON public.booking_submissions;
CREATE POLICY "authenticated_read_booking_submissions"
ON public.booking_submissions
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "authenticated_read_contact_submissions" ON public.contact_submissions;
CREATE POLICY "authenticated_read_contact_submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);
