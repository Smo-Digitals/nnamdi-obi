import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();

  const [profileRes, postsRes] = await Promise.all([
    admin.from('profiles').select('*').eq('id', id).single(),
    admin
      .from('posts')
      .select('id, title, slug, status, created_at')
      .eq('author_id', id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  if (profileRes.error) return NextResponse.json({ error: profileRes.error.message }, { status: 404 });

  return NextResponse.json({
    profile: profileRes.data,
    posts: postsRes.data ?? [],
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  // demote to guest instead of deleting the account
  await admin.from('profiles').update({ role: 'guest' }).eq('id', id);
  return NextResponse.json({ ok: true });
}
