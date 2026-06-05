// AutoZen - Types
// Tipos globais do projeto

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenant_id: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  cpf_cnpj?: string;
  phone: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  tenant_id: string;
  client_id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan: string;
  status: 'trial' | 'pending_payment' | 'active' | 'suspended' | 'cancelled';
  amount: number;
  trial_ends_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  payment_proof_url?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export type Role = 'super_admin' | 'admin' | 'gerente' | 'atendente' | 'operador';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
