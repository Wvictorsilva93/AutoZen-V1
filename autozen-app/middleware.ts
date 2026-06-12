import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ENV } from '@/lib/env';

const SUPABASE_URL = ENV.SUPABASE_URL;
const SUPABASE_ANON_KEY = ENV.SUPABASE_ANON_KEY;

const publicRoutes = ['/', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseResponseInit = NextResponse.next({ request });

  // Sem configuração do Supabase em runtime: não derruba o site.
  // Libera rotas públicas e deixa o client-side tratar o resto.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return supabaseResponseInit;
  }

  try {
    let supabaseResponse = supabaseResponseInit;

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
    });

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (publicRoutes.includes(pathname)) {
      if (user && pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // Rota protegida - sem user = redireciona para login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    // Qualquer falha (rede/DNS/backend): nunca retornar 500.
    if (publicRoutes.includes(pathname)) {
      return supabaseResponseInit;
    }
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|api).*)',
  ],
};
