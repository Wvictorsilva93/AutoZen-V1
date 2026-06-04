import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'
import type { Database } from '@/types/database'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Cliente Supabase para uso no browser (Client Components)
 * Usa singleton pattern para evitar múltiplas instâncias
 */
export function getSupabaseClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      env.supabase.url,
      env.supabase.anonKey
    )
  }
  return client
}
