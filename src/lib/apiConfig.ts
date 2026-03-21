/**
 * API URL Configuration
 * 
 * On Vercel: PHP files are on cPanel (new.ireyprod.com)
 * On cPanel: PHP files are local (/api/...)
 * 
 * Set NEXT_PUBLIC_API_URL in Vercel environment variables to:
 * https://new.ireyprod.com
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Helper to build full PHP API URLs
export function apiUrl(path: string): string {
  // path should start with /api/...
  return `${API_BASE}${path}`;
}
