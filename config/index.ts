// AutoZen - Configuration
// Configurações do projeto

export const config = {
  app: {
    name: 'AutoZen',
    description: 'Tranquilidade e eficiência na gestão do seu negócio',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'app.autozen.com.br',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  subscription: {
    plan: 'autozen',
    price: 97.00,
    trialDays: 14,
    pixKey: 'pix@autozen.com.br',
  },
  features: {
    enableSubscription: true,
    enableSuperAdmin: true,
    enableMultiTenant: true,
    enableRBAC: true,
  },
} as const;

// Validação das variáveis de ambiente obrigatórias
if (!config.supabase.url) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definida');
}

if (!config.supabase.anonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida');
}

export default config;
