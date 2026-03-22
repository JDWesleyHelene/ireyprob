-- Migration: Notifications and Site Settings
-- Timestamp: 20260315140000

-- ============================================================
-- 1. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('booking', 'contact')),
    submission_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_manage_notifications" ON public.notifications;
CREATE POLICY "admin_manage_notifications"
ON public.notifications FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================
-- 2. SITE SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings (for logo, tagline on frontend)
DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
CREATE POLICY "public_read_site_settings"
ON public.site_settings FOR SELECT TO public USING (true);

-- Only admins can write settings
DROP POLICY IF EXISTS "admin_manage_site_settings" ON public.site_settings;
CREATE POLICY "admin_manage_site_settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================
-- 3. UPDATED_AT TRIGGER FOR SITE_SETTINGS
-- ============================================================
DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. SEED DEFAULT SETTINGS
-- ============================================================
DO $$
BEGIN
    INSERT INTO public.site_settings (key, value) VALUES
        ('site_logo_url', ''),
        ('site_tagline', 'Booking Agency & Event Production'),
        ('site_description', 'IREY PROD is a multi-faceted agency operating in the entertainment and events industry, with a focus on music and performing arts.'),
        ('notification_email', 'booking@ireyprod.com'),
        ('email_alerts_bookings', 'true'),
        ('email_alerts_contacts', 'true'),
        ('contact_phone', '+230 000 0000'),
        ('contact_email', 'booking@ireyprod.com'),
        ('contact_address', 'Mauritius Island'),
        ('social_instagram', 'https://instagram.com/ireyprod'),
        ('social_facebook', 'https://facebook.com/ireyprod'),
        ('social_youtube', ''),
        ('social_spotify', ''),
        ('booking_email_template', 'Dear {name},\n\nThank you for your booking request for {artist} on {date}.\n\nWe have received your enquiry and will be in touch within 48 hours to confirm availability and discuss the details.\n\nVenue: {venue}\n\nBest regards,\nIREY PROD Team\nbooking@ireyprod.com'),
        ('contact_email_template', 'Dear {name},\n\nThank you for reaching out to IREY PROD.\n\nWe have received your enquiry regarding: {project}\n\nOur team will review your request and get back to you within 48 hours.\n\nBest regards,\nIREY PROD Team\nbooking@ireyprod.com')
    ON CONFLICT (key) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Settings seed failed: %', SQLERRM;
END $$;
