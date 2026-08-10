import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data } = await admin
    .from('google_oauth_connections')
    .select('google_email')
    .eq('admin_id', user.id)
    .maybeSingle();

  return NextResponse.json({ connected: !!data, email: data?.google_email ?? null });
}
