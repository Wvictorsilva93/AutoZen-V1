'use client';

import { createBrowserClient } from '@supabase/ssr';
import { ENV } from './env';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (client) return client;
  client = createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
  return client;
}
