import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('course_topics')
    .select('*')
    .eq('course_id', id)
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = createAdminClient();

  const { count } = await admin
    .from('course_topics')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', id);

  const { data, error } = await admin
    .from('course_topics')
    .insert({
      course_id: id,
      title: body.title,
      description: body.description ?? null,
      lessons: body.lessons ?? [],
      resources: body.resources ?? [],
      sort_order: count ?? 0,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
