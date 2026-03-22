-- Audit Logs Migration
-- Tracks all admin actions across all content types

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  resource_label TEXT,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_full_access_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_full_access_audit_logs"
ON public.audit_logs
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  OR (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
  OR (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
);
