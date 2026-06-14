import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('courses')
    .select('id, title, description, cover_image_url, price, status, created_at')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, cover_image_url, price, status } = await req.json();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('courses')
    .insert({ title, description, cover_image_url, price, status })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
