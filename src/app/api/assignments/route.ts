import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('course_id');
  const admin = createAdminClient();
  let query = admin
    .from('assignments')
    .select('id, course_id, title, description, due_date, rubric, reviews_required, status, created_at, courses(title)')
    .order('created_at', { ascending: false });
  if (courseId) query = query.eq('course_id', courseId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { course_id, title, description, due_date, rubric, reviews_required, status } = await req.json();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('assignments')
    .insert({ course_id, title, description, due_date, rubric, reviews_required, status })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
