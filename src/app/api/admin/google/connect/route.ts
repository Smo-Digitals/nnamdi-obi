import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUrl } from '@/lib/google/calendar';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const returnTo = new URL(req.url).searchParams.get('returnTo') ?? '/admin';
  const state = Buffer.from(JSON.stringify({ returnTo })).toString('base64url');

  return NextResponse.redirect(getAuthUrl(state));
}
