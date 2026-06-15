import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('curated_courses')
    .select('*, course:courses(id, title, description, cover_image_url, price, status)')
    .order('position', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { course_id } = await req.json();
  const admin = createAdminClient();
  const { count } = await admin.from('curated_courses').select('*', { count: 'exact', head: true });

  const { data, error } = await admin
    .from('curated_courses')
    .insert({ course_id, position: count ?? 0 })
    .select('*, course:courses(id, title, description, cover_image_url, price, status)')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
