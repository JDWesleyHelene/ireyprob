-- Migration: Storage buckets for admin image uploads
-- Timestamp: 20260315130000 (higher than existing 20260315120000)

-- ============================================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================================

-- Insert buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. STORAGE RLS POLICIES
-- ============================================================

-- Public read access for media bucket
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "public_read_media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Authenticated (admin) can upload
DROP POLICY IF EXISTS "admin_upload_media" ON storage.objects;
CREATE POLICY "admin_upload_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND public.is_admin());

-- Authenticated (admin) can update
DROP POLICY IF EXISTS "admin_update_media" ON storage.objects;
CREATE POLICY "admin_update_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin());

-- Authenticated (admin) can delete
DROP POLICY IF EXISTS "admin_delete_media" ON storage.objects;
CREATE POLICY "admin_delete_media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin());
