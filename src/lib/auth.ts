import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import type { Profile } from '@/types/database';

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') redirect('/');
  return profile;
}

export async function requireMember() {
  const profile = await getProfile();
  if (!profile || !['admin', 'member'].includes(profile.role)) redirect('/login');
  return profile;
}
