'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message));
  }

  redirect('/home');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password: formData.get('password') as string,
    options: {
      data: { full_name: formData.get('full_name') as string },
    },
  });

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message));
  }

  redirect('/verify?email=' + encodeURIComponent(email));
}

export async function resendOtp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resend({ email, type: 'signup' });

  if (error) {
    redirect('/verify?email=' + encodeURIComponent(email) + '&error=' + encodeURIComponent(error.message));
  }

  redirect('/verify?email=' + encodeURIComponent(email) + '&resent=true');
}

export async function verifyOtp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) {
    redirect(
      '/verify?email=' +
        encodeURIComponent(email) +
        '&error=' +
        encodeURIComponent(error.message)
    );
  }

  redirect('/home');
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin') ?? 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) redirect('/login?error=' + encodeURIComponent(error.message));
  if (data.url) redirect(data.url);
}

export async function adminLogin(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    redirect('/admin/login?error=' + encodeURIComponent(error.message));
  }

  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
