import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const courseId = new URL(req.url).searchParams.get('course_id');
  if (!courseId) return NextResponse.json({ error: 'course_id is required' }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ enrolled: false });

  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  return NextResponse.json({ enrolled: !!data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { course_id } = await req.json();
  if (!course_id) return NextResponse.json({ error: 'course_id is required' }, { status: 400 });

  const { error } = await supabase
    .from('enrollments')
    .upsert({ course_id, user_id: user.id, status: 'active' }, { onConflict: 'course_id,user_id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
