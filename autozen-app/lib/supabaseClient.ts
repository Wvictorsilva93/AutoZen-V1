'use client';

import { createBrowserClient } from '@supabase/ssr';
import { ENV } from './env';

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Retorna o client Supabase do browser.
 * Padrão seguro: nunca lança/quebra o build. Se faltar configuração,
 * retorna null e o caller deve validar antes de usar.
 */
export function getSupabaseClient() {
  if (client) return client;
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) return null;
  client = createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
  return client;
}
