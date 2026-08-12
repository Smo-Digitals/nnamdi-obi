import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { course_id, lesson_id } = await req.json();
  if (!course_id || !lesson_id) return NextResponse.json({ error: 'course_id and lesson_id are required' }, { status: 400 });

  const { error } = await supabase
    .from('lesson_completions')
    .upsert({ course_id, lesson_id, user_id: user.id }, { onConflict: 'user_id,lesson_id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { lesson_id } = await req.json();
  if (!lesson_id) return NextResponse.json({ error: 'lesson_id is required' }, { status: 400 });

  const { error } = await supabase
    .from('lesson_completions')
    .delete()
    .eq('lesson_id', lesson_id)
    .eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
