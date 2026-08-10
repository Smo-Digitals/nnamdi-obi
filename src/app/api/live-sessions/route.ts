import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getValidAccessTokenForAdmin, createMeetEvent } from '@/lib/google/calendar';

export async function GET(req: NextRequest) {
  const courseId = new URL(req.url).searchParams.get('course_id');
  if (!courseId) return NextResponse.json({ error: 'course_id is required' }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('live_sessions')
    .select('id, course_id, title, description, start_time, end_time, meet_link, created_at')
    .eq('course_id', courseId)
    .order('start_time', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { course_id, title, description, start_time, end_time } = await req.json();
  if (!course_id || !title || !start_time || !end_time) {
    return NextResponse.json({ error: 'course_id, title, start_time and end_time are required' }, { status: 400 });
  }

  const admin = createAdminClient();

  let accessToken: string;
  try {
    accessToken = await getValidAccessTokenForAdmin(user.id);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Google Calendar is not connected.' }, { status: 400 });
  }

  const { data: enrolledStudents } = await admin
    .from('enrollments')
    .select('profiles(email)')
    .eq('course_id', course_id)
    .eq('status', 'active');
  const attendeeEmails = (enrolledStudents ?? [])
    .map((e) => (e.profiles as unknown as { email: string } | null)?.email)
    .filter((e): e is string => !!e);

  let meet: { eventId: string; meetLink: string | null };
  try {
    meet = await createMeetEvent({ accessToken, title, description, startTime: start_time, endTime: end_time, attendeeEmails });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create the Google Calendar event.' }, { status: 500 });
  }

  const { data, error } = await admin
    .from('live_sessions')
    .insert({
      course_id, title, description: description ?? null,
      start_time, end_time,
      instructor_id: user.id,
      meet_link: meet.meetLink,
      calendar_event_id: meet.eventId,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
