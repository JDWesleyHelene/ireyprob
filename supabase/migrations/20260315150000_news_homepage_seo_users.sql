-- Migration: News, Homepage Content, SEO Settings, User Roles
-- Timestamp: 20260315150000

-- ============================================================
-- 1. TYPES
-- ============================================================
DROP TYPE IF EXISTS public.news_status CASCADE;
CREATE TYPE public.news_status AS ENUM ('draft', 'published');

DROP TYPE IF EXISTS public.user_role_type CASCADE;
CREATE TYPE public.user_role_type AS ENUM ('admin', 'editor', 'viewer');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- News / Blog articles
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  cover_image_alt TEXT,
  author TEXT DEFAULT 'IREY PROD',
  status public.news_status DEFAULT 'draft'::public.news_status,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Homepage content (single row, key-value style)
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- SEO settings per page
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  og_title TEXT,
  og_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Event detail extra content (extends existing events table)
CREATE TABLE IF NOT EXISTS public.event_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE,
  full_description TEXT,
  lineup JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  ticket_link TEXT,
  ticket_price TEXT,
  doors_open TEXT,
  age_restriction TEXT,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User roles / invitations
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role public.user_role_type DEFAULT 'viewer'::public.user_role_type,
  is_active BOOLEAN DEFAULT true,
  invited_by UUID,
  invited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMPTZ,
  auth_user_id UUID UNIQUE
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
CREATE INDEX IF NOT EXISTS idx_homepage_content_key ON public.homepage_content(key);
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_slug ON public.seo_settings(page_slug);
CREATE INDEX IF NOT EXISTS idx_event_details_event_id ON public.event_details(event_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- ============================================================
-- 4. FUNCTIONS (before RLS)
-- ============================================================

-- Reuse existing is_admin() function if it exists, otherwise create it
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (
      raw_user_meta_data->>'role' = 'admin'
      OR raw_app_meta_data->>'role' = 'admin'
    )
  )
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- news: public read, admin write
DROP POLICY IF EXISTS "news_public_read" ON public.news;
CREATE POLICY "news_public_read" ON public.news
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "news_admin_all" ON public.news;
CREATE POLICY "news_admin_all" ON public.news
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- homepage_content: public read, admin write
DROP POLICY IF EXISTS "homepage_content_public_read" ON public.homepage_content;
CREATE POLICY "homepage_content_public_read" ON public.homepage_content
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "homepage_content_admin_all" ON public.homepage_content;
CREATE POLICY "homepage_content_admin_all" ON public.homepage_content
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- seo_settings: public read, admin write
DROP POLICY IF EXISTS "seo_settings_public_read" ON public.seo_settings;
CREATE POLICY "seo_settings_public_read" ON public.seo_settings
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "seo_settings_admin_all" ON public.seo_settings;
CREATE POLICY "seo_settings_admin_all" ON public.seo_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- event_details: public read, admin write
DROP POLICY IF EXISTS "event_details_public_read" ON public.event_details;
CREATE POLICY "event_details_public_read" ON public.event_details
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "event_details_admin_all" ON public.event_details;
CREATE POLICY "event_details_admin_all" ON public.event_details
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- admin_users: admin only
DROP POLICY IF EXISTS "admin_users_admin_all" ON public.admin_users;
CREATE POLICY "admin_users_admin_all" ON public.admin_users
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 7. TRIGGERS
-- ============================================================
DROP TRIGGER IF EXISTS news_updated_at ON public.news;
CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS homepage_content_updated_at ON public.homepage_content;
CREATE TRIGGER homepage_content_updated_at
  BEFORE UPDATE ON public.homepage_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS seo_settings_updated_at ON public.seo_settings;
CREATE TRIGGER seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS event_details_updated_at ON public.event_details;
CREATE TRIGGER event_details_updated_at
  BEFORE UPDATE ON public.event_details
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 8. SEED DATA
-- ============================================================

-- Homepage content defaults
INSERT INTO public.homepage_content (key, value) VALUES
  ('hero_headline_line1', 'Your Gateway to'),
  ('hero_headline_line2', 'Unforgettable Experiences.'),
  ('hero_subtext', 'IREY PROD — A dynamic agency specialising in Digital Marketing, Stage & Artist Management, and Event Coordination. Based in Mauritius Island.'),
  ('stat_1_value', 'One Stop'),
  ('stat_1_label', 'The only agency you''ll ever need'),
  ('stat_2_value', '4'),
  ('stat_2_label', 'Bookings · Tours · Events · Productions'),
  ('stat_3_value', 'Mauritius'),
  ('stat_3_label', 'Island · Indian Ocean')
ON CONFLICT (key) DO NOTHING;

-- SEO defaults
INSERT INTO public.seo_settings (page_slug, meta_title, meta_description, og_title, og_description) VALUES
  ('home', 'IREY PROD — Booking Agency & Event Production | Mauritius Island', 'IREY PROD is a dynamic booking agency and event production company based in Mauritius Island.', 'IREY PROD — Your Gateway to Unforgettable Experiences', 'Booking agency & event production based in Mauritius Island.'),
  ('events', 'Events — IREY PROD | Concerts, Festivals & Live Shows', 'Discover upcoming concerts, festivals, and live events produced by IREY PROD in Mauritius and beyond.', 'IREY PROD Events', 'Upcoming concerts, festivals, and live shows.'),
  ('artists', 'Artists — IREY PROD | Reggae, Dub & World Music Roster', 'Explore the IREY PROD artist roster featuring reggae, dub, hip-hop and world music artists.', 'IREY PROD Artists', 'Reggae, dub, hip-hop and world music artists.'),
  ('news', 'News & Blog — IREY PROD | Music Industry Updates', 'Latest news, articles and updates from IREY PROD — Mauritius music industry insights.', 'IREY PROD News', 'Latest news and updates from IREY PROD.')
ON CONFLICT (page_slug) DO NOTHING;

-- Sample news articles
INSERT INTO public.news (title, slug, excerpt, content, cover_image, cover_image_alt, author, status, published_at) VALUES
  (
    'IREY PROD Announces Summer 2026 Season',
    'irey-prod-summer-2026-season',
    'We are thrilled to announce our most ambitious summer season yet, featuring headline acts from across the reggae and world music spectrum.',
    '<p>We are thrilled to announce our most ambitious summer season yet, featuring headline acts from across the reggae and world music spectrum. This summer, IREY PROD brings the finest sounds of the Indian Ocean to stages across Mauritius and beyond.</p><p>Our lineup includes artists from Jamaica, France, and local Mauritian talent, all united by a shared love of roots music and positive vibrations. Stay tuned for individual event announcements coming throughout March and April.</p><h2>What to Expect</h2><p>From intimate sunset sessions to large-scale festival productions, the 2026 season promises something for every music lover. We have invested heavily in production quality this year, ensuring world-class sound and lighting at every event.</p>',
    'https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg',
    'IREY PROD summer season announcement with stage lighting and crowd',
    'IREY PROD',
    'published'::public.news_status,
    NOW() - INTERVAL '5 days'
  ),
  (
    'New Artist Signing: Welcome to the Roster',
    'new-artist-signing-2026',
    'IREY PROD is proud to welcome a new generation of artists to our growing roster, expanding our reach into new musical territories.',
    '<p>IREY PROD is proud to welcome a new generation of artists to our growing roster, expanding our reach into new musical territories. This signing represents our commitment to nurturing emerging talent alongside our established headliners.</p><p>The new additions bring fresh perspectives to the reggae and world music scene, blending traditional roots with contemporary production techniques. We look forward to introducing them to audiences across the island and internationally.</p>',
    'https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg',
    'IREY PROD artist signing announcement with performer on stage',
    'IREY PROD',
    'published'::public.news_status,
    NOW() - INTERVAL '12 days'
  ),
  (
    'Behind the Scenes: Event Production at IREY PROD',
    'behind-the-scenes-event-production',
    'A look inside the meticulous planning and execution that goes into every IREY PROD event, from concept to curtain call.',
    '<p>A look inside the meticulous planning and execution that goes into every IREY PROD event, from concept to curtain call. Our production team works tirelessly to ensure every detail is perfect.</p><p>From venue scouting and artist logistics to sound engineering and crowd management, producing a world-class event requires months of preparation. In this article, we take you behind the scenes of our most recent production.</p>',
    'https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg',
    'IREY PROD behind the scenes event production setup',
    'IREY PROD',
    'published'::public.news_status,
    NOW() - INTERVAL '20 days'
  )
ON CONFLICT (slug) DO NOTHING;
