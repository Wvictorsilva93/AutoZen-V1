import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import type { Database } from '@/types/database'

/**
 * Cliente Supabase para uso no servidor (Server Components, Route Handlers, Server Actions)
 * Gerencia cookies automaticamente para manter sessão
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    env.supabase.url,
    env.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Erro ao setar cookies (pode acontecer em middleware)
          }
        },
      },
    }
  )
}

/**
 * Cliente Supabase com SERVICE_ROLE para operações administrativas
 * USO RESTRITO: Apenas para operações que precisam bypassar RLS
 */
export function getSupabaseAdmin() {
  if (!env.supabase.serviceRoleKey) {
    throw new Error('SERVICE_ROLE_KEY não configurada')
  }

  return createServerClient<Database>(
    env.supabase.url,
    env.supabase.serviceRoleKey,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}
