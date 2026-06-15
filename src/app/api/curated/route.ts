import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const admin = createAdminClient();
  const all = req.nextUrl.searchParams.get('all') === '1';
  let query = admin.from('curated_links').select('*').order('position', { ascending: true }).order('added_at', { ascending: false });
  if (!all) query = query.eq('active', true);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = createAdminClient();

  // Put new items at the end
  const { count } = await admin.from('curated_links').select('*', { count: 'exact', head: true });

  const { data, error } = await admin
    .from('curated_links')
    .insert({ ...body, position: (count ?? 0) })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
