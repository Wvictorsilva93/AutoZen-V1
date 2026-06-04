import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

/**
 * Middleware para proteger rotas e gerenciar sessão
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    env.supabase.url,
    env.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Rotas públicas
  const publicRoutes = ['/', '/login', '/signup']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Se não está autenticado e tenta acessar rota protegida
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se está autenticado e tenta acessar rota pública
  if (session && isPublicRoute) {
    // Buscar dados do usuário para verificar empresa
    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('auth_id', session.user.id)
      .single()

    if (userData) {
      // Buscar status da empresa
      const { data: companyData } = await supabase
        .from('companies')
        .select('status')
        .eq('id', userData.company_id)
        .single()

      // Redirecionar baseado no status
      if (companyData?.status === 'expired' || companyData?.status === 'blocked') {
        return NextResponse.redirect(new URL('/billing', request.url))
      }

      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
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
}
