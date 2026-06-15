import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function genTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let p = '';
  for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p + '!7';
}

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .select('id, full_name, email, avatar_url, created_at')
    .eq('role', 'editor')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // attach post counts
  const ids = (data ?? []).map((e) => e.id);
  const counts: Record<string, number> = {};
  if (ids.length) {
    const { data: posts } = await admin
      .from('posts')
      .select('author_id')
      .in('author_id', ids);
    (posts ?? []).forEach((p) => { counts[p.author_id] = (counts[p.author_id] ?? 0) + 1; });
  }

  return NextResponse.json(
    (data ?? []).map((e) => ({ ...e, post_count: counts[e.id] ?? 0 }))
  );
}

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const admin = createAdminClient();
  const tempPassword = genTempPassword();

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: email.trim(),
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: name.trim() },
  });
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  await admin
    .from('profiles')
    .update({ role: 'editor', full_name: name.trim() })
    .eq('id', authUser.user.id);

  return NextResponse.json({ id: authUser.user.id, name, email, tempPassword });
}
