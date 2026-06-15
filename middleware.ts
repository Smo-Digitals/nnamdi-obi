import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: no logic between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser();

  // ── Admin routes ──────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      // full access — proceed
    } else if (profile?.role === 'editor') {
      if (!pathname.startsWith('/admin/writing')) {
        return NextResponse.redirect(new URL('/admin/writing/posts', request.url));
      }
    } else {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // ── User portal routes ────────────────────────────────────────────────────────
  if (pathname.startsWith('/home')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ── Redirect logged-in users away from public auth pages ─────────────────────
  const authPages = ['/login', '/signup', '/verify'];
  if (authPages.some((p) => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // ── Redirect admin/editor away from admin/login if already signed in ─────────
  if (pathname === '/admin/login' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (profile?.role === 'editor') {
      return NextResponse.redirect(new URL('/admin/writing/posts', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
