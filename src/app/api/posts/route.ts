import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('posts')
    .select('id, title, subtitle, category, tags, access, status, views, featured, created_at')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('posts')
    .insert({
      title:            body.title,
      slug:             body.slug || body.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      subtitle:         body.subtitle,
      body:             body.body,
      cover_image_url:  body.cover_image_url,
      category:         body.category,
      categories:       body.categories ?? [],
      tags:             body.tags ?? [],
      access:           body.access ?? 'Free',
      seo_keyword:      body.seo_keyword,
      meta_title:       body.meta_title,
      meta_description: body.meta_description,
      status:           body.status ?? 'draft',
      author_id:        user.id,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
