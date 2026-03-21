// Audit log — stub for Phase 1 (no Supabase)
// In Phase 2, wire this to your MySQL backend
export async function logAuditAction(_opts: { action: string; resourceType: string; resourceId?: string; resourceLabel?: string }) {
  // No-op in static mode
}
