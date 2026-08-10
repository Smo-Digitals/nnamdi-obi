import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { exchangeCodeForTokens, getConnectedEmail, saveConnection } from '@/lib/google/calendar';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const stateRaw = url.searchParams.get('state');
  let returnTo = '/admin';
  try {
    if (stateRaw) returnTo = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf8')).returnTo ?? '/admin';
  } catch {}

  if (!code) return NextResponse.redirect(new URL(`${returnTo}?google_error=missing_code`, req.url));

  try {
    const tokens = await exchangeCodeForTokens(code);
    const email = tokens.access_token ? await getConnectedEmail(tokens.access_token) : null;
    await saveConnection(user.id, tokens, email);
    return NextResponse.redirect(new URL(`${returnTo}?google_connected=1`, req.url));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.redirect(new URL(`${returnTo}?google_error=${encodeURIComponent(message)}`, req.url));
  }
}
