// AutoZen - Tipos do Banco de Dados (Multi-tenant)

export type UserRole = 'super_admin' | 'admin_empresa' | 'funcionario';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'blocked';
export type OrderStatus = 'aguardando' | 'lavando' | 'finalizando' | 'pronto';
export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';
export type FinancialType = 'entrada' | 'saida';
export type VehicleType = 'carro' | 'moto' | 'caminhonete' | 'suv' | 'outro';

export interface Company {
  id: string;
  name: string;
  responsible: string;
  whatsapp: string;
  email: string;
  logo_url?: string;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  company_id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  notes?: string;
  recurrence_count: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  company_id: string;
  client_id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  type: VehicleType;
  year?: number;
  created_at: string;
}

export interface Service {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  active: boolean;
  category: string;
  created_at: string;
}

export interface Order {
  id: string;
  company_id: string;
  order_number: number;
  client_id: string;
  vehicle_id: string;
  employee_id?: string;
  status: OrderStatus;
  services: string[];
  total: number;
  notes?: string;
  checklist?: Record<string, boolean>;
  photos_before?: string[];
  photos_after?: string[];
  started_at?: string;
  finished_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialEntry {
  id: string;
  company_id: string;
  type: FinancialType;
  amount: number;
  description: string;
  category: string;
  payment_method: PaymentMethod;
  order_id?: string;
  date: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  company_id: string;
  name: string;
  quantity: number;
  min_quantity: number;
  unit: string;
  cost: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  company_id: string;
  user_id?: string;
  name: string;
  phone: string;
  role: string;
  commission_rate: number;
  active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  company_id: string;
  client_id: string;
  vehicle_id: string;
  service_id: string;
  employee_id?: string;
  date: string;
  time: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  notes?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  company_id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'paid' | 'refunded';
  paid_at?: string;
  created_at: string;
}
