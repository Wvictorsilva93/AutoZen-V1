// AutoZen - Middleware Principal
// Verifica autenticação, tenant e permissões

import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/src/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Atualizar sessão Supabase
  let response = await updateSession(request);

  // Criar cliente Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Verificar usuário
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirecionar usuário não autenticado
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirecionar usuário autenticado tentando acessar rotas públicas
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // TODO Sprint 1: Verificar assinatura ativa (trial ou active)
  // TODO Sprint 1: Verificar permissões RBAC

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
