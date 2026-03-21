import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // All admin auth is handled client-side via sessionStorage in admin/layout.tsx
  // Middleware just passes through — no Supabase needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+'],
};
