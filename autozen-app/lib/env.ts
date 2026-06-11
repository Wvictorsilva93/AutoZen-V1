// Variáveis de ambiente com fallback seguro para não quebrar build
export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
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
