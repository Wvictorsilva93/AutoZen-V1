// AutoZen - Constants
// Constantes globais do projeto

export const APP_NAME = 'AutoZen';
export const APP_DESCRIPTION = 'Tranquilidade e eficiência na gestão do seu negócio';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  GERENTE: 'gerente',
  ATENDENTE: 'atendente',
  OPERADOR: 'operador',
} as const;

export const SUBSCRIPTION_STATUS = {
  TRIAL: 'trial',
  PENDING_PAYMENT: 'pending_payment',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
} as const;

export const SUBSCRIPTION_PLAN = {
  AUTOZEN: 'autozen',
  PRICE: 97.00,
  TRIAL_DAYS: 14,
} as const;

export const STORAGE_BUCKETS = {
  COMPANIES: 'companies',
  AVATARS: 'avatars',
  VEHICLES: 'vehicles',
  OS_BEFORE: 'os-before',
  OS_DURING: 'os-during',
  OS_AFTER: 'os-after',
  DOCUMENTS: 'documents',
  PAYMENT_PROOFS: 'payment-proofs',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CLIENTS: '/dashboard/clients',
  VEHICLES: '/dashboard/vehicles',
  APPOINTMENTS: '/dashboard/appointments',
  ORDERS: '/dashboard/orders',
  FINANCIAL: '/dashboard/financial',
  SETTINGS: '/dashboard/settings',
  SUBSCRIPTION: '/dashboard/subscription',
  SUPER_ADMIN: '/super-admin',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
  },
  CLIENTS: '/api/clients',
  VEHICLES: '/api/vehicles',
  SUBSCRIPTIONS: '/api/subscriptions',
} as const;
