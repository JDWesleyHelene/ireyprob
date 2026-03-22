-- Migration: Admin content management tables (artists, events, services)
-- Timestamp: 20260315120000 (higher than existing 20260315103345)

-- ============================================================
-- 1. ADMIN ROLE FUNCTION (using auth metadata - no recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
        au.raw_user_meta_data->>'role' = 'admin'
        OR au.raw_app_meta_data->>'role' = 'admin'
    )
)
$$;

-- ============================================================
-- 2. ARTISTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    genre TEXT NOT NULL DEFAULT '',
    origin TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL UNIQUE,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    style TEXT NOT NULL DEFAULT '',
    featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_artists_slug ON public.artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_sort_order ON public.artists(sort_order);

-- ============================================================
-- 3. EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    venue TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'France',
    genre TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',
    event_date DATE NOT NULL,
    event_time TIME,
    artists TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    featured BOOLEAN NOT NULL DEFAULT false,
    sold_out BOOLEAN NOT NULL DEFAULT false,
    ticket_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_sort_order ON public.events(sort_order);

-- ============================================================
-- 4. SERVICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_number TEXT NOT NULL DEFAULT '01',
    title TEXT NOT NULL,
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',
    features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_sort_order ON public.services(sort_order);

-- ============================================================
-- 5. UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_artists_updated_at ON public.artists;
CREATE TRIGGER set_artists_updated_at
    BEFORE UPDATE ON public.artists
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 6. ENABLE RLS
-- ============================================================
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. RLS POLICIES
-- ============================================================

-- ARTISTS: public read, admin write
DROP POLICY IF EXISTS "public_read_artists" ON public.artists;
CREATE POLICY "public_read_artists"
ON public.artists FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_artists" ON public.artists;
CREATE POLICY "admin_manage_artists"
ON public.artists FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- EVENTS: public read, admin write
DROP POLICY IF EXISTS "public_read_events" ON public.events;
CREATE POLICY "public_read_events"
ON public.events FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_events" ON public.events;
CREATE POLICY "admin_manage_events"
ON public.events FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- SERVICES: public read, admin write
DROP POLICY IF EXISTS "public_read_services" ON public.services;
CREATE POLICY "public_read_services"
ON public.services FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_services" ON public.services;
CREATE POLICY "admin_manage_services"
ON public.services FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- BOOKING SUBMISSIONS: admin read/update/delete (public insert already exists)
DROP POLICY IF EXISTS "admin_manage_booking_submissions" ON public.booking_submissions;
CREATE POLICY "admin_manage_booking_submissions"
ON public.booking_submissions FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================
-- 8. SEED DATA — ARTISTS
-- ============================================================
DO $$
BEGIN
    INSERT INTO public.artists (name, genre, origin, bio, image, image_alt, slug, tags, style, sort_order) VALUES
    ('Artist One', 'Reggae · Roots', 'Mauritius', 'A powerful roots reggae performer known for electrifying live shows and deep, soulful rhythms rooted in the Mauritian island spirit.', 'https://ireyprod.com/wp-content/uploads/2024/02/KDC_2394-scaled.jpg', 'IREY PROD artist performing on stage with dramatic lighting and crowd energy', 'artist-one', ARRAY['Reggae','Roots','Live'], 'Live Performance', 1),
    ('Artist Two', 'World · Afrobeat', 'Mauritius', 'Blending world music and Afrobeat influences, this artist brings infectious energy to festivals and large-scale events across the Indian Ocean.', 'https://ireyprod.com/wp-content/uploads/2024/02/KDC_1597-scaled.jpg', 'IREY PROD world music artist performing at outdoor festival', 'artist-two', ARRAY['World','Afrobeat','Festival'], 'Festival & Events', 2),
    ('Artist Three', 'Reggae · Dancehall', 'Mauritius', 'A dancehall powerhouse whose high-energy performances have made them a staple in clubs and venues throughout Mauritius and beyond.', 'https://ireyprod.com/wp-content/uploads/2024/02/KDC_1696-scaled.jpg', 'IREY PROD reggae dancehall artist performing at club venue', 'artist-three', ARRAY['Reggae','Dancehall','Club'], 'Club & Venue', 3),
    ('Artist Four', 'Hip-Hop · Urban', 'Mauritius', 'Urban storyteller with a sharp lyrical style, delivering compelling performances for corporate events and private functions.', 'https://ireyprod.com/wp-content/uploads/2024/02/KDC_1951-scaled.jpg', 'IREY PROD hip-hop urban artist in powerful stage performance', 'artist-four', ARRAY['Hip-Hop','Urban','Corporate'], 'Corporate & Private', 4),
    ('Artist Five', 'R&B · Soul', 'Mauritius', 'A soulful vocalist whose intimate showcases leave audiences moved, combining classic R&B sensibility with a contemporary island sound.', 'https://ireyprod.com/wp-content/uploads/2023/12/319291225_674505520974726_3683712000139163132_n.jpg', 'IREY PROD R&B soul artist performing under intimate spotlight', 'artist-five', ARRAY['R&B','Soul','Showcase'], 'Intimate Showcase', 5),
    ('Artist Six', 'Electronic · Dub', 'Mauritius', 'A pioneering electronic and dub artist who commands sound systems with precision, creating immersive sonic landscapes for any event.', 'https://ireyprod.com/wp-content/uploads/2024/02/278388810_500716275105749_2200913393930678727_n.jpg', 'IREY PROD electronic dub artist at mixing desk with atmospheric stage fog', 'artist-six', ARRAY['Electronic','Dub','DJ'], 'DJ & Sound System', 6),
    ('Artist Seven', 'Acoustic · Folk', 'Mauritius', 'An acoustic storyteller whose unplugged performances create an intimate connection with audiences, weaving folk traditions with island melodies.', 'https://ireyprod.com/wp-content/uploads/2024/02/413834455_10229244000198578_5400677520275640617_n.jpg', 'IREY PROD acoustic folk artist performing unplugged session', 'artist-seven', ARRAY['Acoustic','Folk','Unplugged'], 'Acoustic & Unplugged', 7),
    ('Artist Eight', 'Jazz · Blues', 'Mauritius', 'A jazz and blues virtuoso who brings sophistication and depth to lounge settings, with a repertoire spanning classic standards to original compositions.', 'https://ireyprod.com/wp-content/uploads/2023/11/311725226_1304185260318364_1025836846759200407_n.jpg', 'IREY PROD jazz blues artist performing at lounge venue', 'artist-eight', ARRAY['Jazz','Blues','Lounge'], 'Jazz & Lounge', 8),
    ('Artist Nine', 'Pop · Contemporary', 'Mauritius', 'A contemporary pop artist with a polished stage presence and broad appeal, perfect for concerts, tours, and high-profile events.', 'https://ireyprod.com/wp-content/uploads/2023/11/136994801_10222394642048905_677808425090284716_n.jpg', 'IREY PROD pop contemporary artist performing at concert', 'artist-nine', ARRAY['Pop','Contemporary','Concert'], 'Concert & Tour', 9)
    ON CONFLICT (slug) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Artist seed data failed: %', SQLERRM;
END $$;

-- ============================================================
-- 9. SEED DATA — EVENTS
-- ============================================================
DO $$
BEGIN
    INSERT INTO public.events (title, venue, city, country, genre, image, image_alt, event_date, artists, featured, sort_order) VALUES
    ('Toulouse Dub Club #47', 'Le Bikini', 'Toulouse', 'France', 'Dub · Sound System', 'https://img.rocket.new/generatedImages/rocket_gen_img_1bf7516e7-1773496527872.png', 'Sound system event with dramatic low lighting and bass frequencies at Le Bikini', '2026-03-22', ARRAY['Mad Professor','L''Entourloop'], true, 1),
    ('Chronixx · European Tour', 'Zénith de Toulouse', 'Toulouse', 'France', 'Reggae', 'https://img.rocket.new/generatedImages/rocket_gen_img_1f5546bab-1773182474422.png', 'Reggae artist performing on stage with vibrant concert lighting', '2026-04-05', ARRAY['Chronixx'], false, 2),
    ('Koffee · Spring Session', 'La Cigale', 'Paris', 'France', 'Reggae · Dancehall', 'https://img.rocket.new/generatedImages/rocket_gen_img_167fa4835-1773497463559.png', 'Female artist performing under spotlight at intimate concert venue', '2026-04-18', ARRAY['Koffee'], false, 3),
    ('Mad Professor Live', 'Le Trabendo', 'Paris', 'France', 'Dub · Electronic', 'https://img.rocket.new/generatedImages/rocket_gen_img_18bb0da06-1772381493729.png', 'Electronic dub music producer at mixing desk with atmospheric stage fog', '2026-05-02', ARRAY['Mad Professor'], false, 4),
    ('El Gran Pequeño Festival', 'Parc des Expositions', 'Toulouse', 'France', 'World · Reggae · Hip-Hop', 'https://img.rocket.new/generatedImages/rocket_gen_img_1687cf3a3-1772581301585.png', 'Outdoor festival stage at sunset with large crowd and colorful lights', '2026-05-14', ARRAY['Koffee','Neg'' Marrons','L''Entourloop'], false, 5),
    ('Horace Andy · Dub Night', 'Stereolux', 'Nantes', 'France', 'Reggae · Dub', 'https://img.rocket.new/generatedImages/rocket_gen_img_1e91e7744-1773497463943.png', 'Horace Andy performing at intimate dub night with atmospheric lighting', '2026-05-28', ARRAY['Horace Andy'], false, 6),
    ('Alborosie · Summer Tour', 'Olympia', 'Paris', 'France', 'Reggae', 'https://img.rocket.new/generatedImages/rocket_gen_img_1653f9d39-1773497472315.png', 'Alborosie performing on stage at iconic Paris venue Olympia', '2026-06-12', ARRAY['Alborosie'], false, 7),
    ('Groundation · Jazz Reggae Night', 'Cité de la Musique', 'Paris', 'France', 'Reggae · Jazz', 'https://img.rocket.new/generatedImages/rocket_gen_img_16d808b58-1772286198607.png', 'Groundation performing jazz reggae fusion at prestigious Paris music venue', '2026-07-04', ARRAY['Groundation'], false, 8)
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Event seed data failed: %', SQLERRM;
END $$;

-- ============================================================
-- 10. SEED DATA — SERVICES
-- ============================================================
DO $$
BEGIN
    INSERT INTO public.services (service_number, title, tagline, description, image, image_alt, features, sort_order) VALUES
    ('01', 'Bookings', 'Connecting Artists With The Right Stages', 'We connect artists with the right stages and audiences. Whether it''s a one-off performance or a full season of shows, we handle all booking logistics, negotiations, and contracts to ensure every engagement is seamless and professionally managed.', 'https://img.rocket.new/generatedImages/rocket_gen_img_10f501376-1772489659928.png', 'IREY PROD artist booking event with stage lighting and energetic crowd', ARRAY['Artist Representation','Contract Negotiation','Logistics Management','Performance Scheduling','Venue Coordination','Fee Management'], 1),
    ('02', 'Tours', 'From Regional Circuits to International Touring', 'From regional circuits to international touring, IREY PROD plans and executes full tour packages. We manage routing, logistics, accommodation, promotion, and on-the-ground coordination so artists can focus entirely on their performance.', 'https://img.rocket.new/generatedImages/rocket_gen_img_1f4eb7026-1773571430867.png', 'IREY PROD tour production with artist performing at multiple venues', ARRAY['Tour Planning & Routing','Logistics & Transport','Accommodation Management','Tour Promotion','On-Ground Coordination','International Touring'], 2),
    ('03', 'Events', 'From Concept to Curtain — Every Scale', 'We conceptualise, plan, and produce events of all scales — from intimate showcases to large-scale concerts and corporate entertainment. Our team handles everything from venue sourcing and staging to production and post-event wrap-up.', 'https://img.rocket.new/generatedImages/rocket_gen_img_19414721a-1772255042376.png', 'IREY PROD large-scale event production with stage setup and audience', ARRAY['Event Conceptualisation','Venue Sourcing','Stage & Production Design','Corporate Entertainment','Festival Management','Post-Event Reporting'], 3),
    ('04', 'Productions', 'Bringing Creative Visions to Life', 'Our production arm supports artists and brands with studio sessions, live production, digital content creation, and stage production. We bring creative visions to life with technical precision and artistic excellence.', 'https://img.rocket.new/generatedImages/rocket_gen_img_1c38b49ef-1773176757500.png', 'IREY PROD production setup with technical equipment and creative team', ARRAY['Studio Sessions','Live Production','Digital Content Creation','Stage Production','Technical Direction','Creative Direction'], 4)
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Service seed data failed: %', SQLERRM;
END $$;
