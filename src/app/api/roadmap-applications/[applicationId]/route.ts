import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type Params = Promise<{ applicationId: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { applicationId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status, review_note } = await req.json() as { status: 'approved' | 'rejected'; review_note?: string };
  const admin = createAdminClient();

  let cooldown_until: string | null = null;
  if (status === 'rejected') {
    const { data: application } = await admin
      .from('roadmap_applications')
      .select('roadmap_id')
      .eq('id', applicationId)
      .single();
    const { data: roadmap } = await admin
      .from('roadmaps')
      .select('cooldown_days')
      .eq('id', application?.roadmap_id)
      .single();
    const days = roadmap?.cooldown_days ?? 30;
    cooldown_until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  }

  const { data, error } = await admin
    .from('roadmap_applications')
    .update({
      status,
      review_note: review_note ?? null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      cooldown_until,
    })
    .eq('id', applicationId)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
