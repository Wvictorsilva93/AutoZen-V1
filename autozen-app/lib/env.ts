// Variáveis de ambiente com fallback seguro para não quebrar build/runtime.
// URL e ANON_KEY são públicas (expostas ao navegador), por isso têm fallback.
// SERVICE_ROLE_KEY é apenas server-side e NÃO tem fallback público.
const FALLBACK_SUPABASE_URL = 'https://rpakyjmdijhmpqsnnjke.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_AstiJ1Ny0Hr3CSkao4u8Tg_k2yYgkMv';

export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL,
  SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
} as const;

export function validateEnv() {
  const missing: string[] = [];
  if (!ENV.SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!ENV.SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missing.length > 0) {
    console.warn(`⚠️ AutoZen: Variáveis de ambiente não definidas: ${missing.join(', ')}`);
  }
  return missing.length === 0;
}
