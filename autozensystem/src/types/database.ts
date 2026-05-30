/**
 * Database type definitions for Supabase
 * These types are generated based on your Supabase schema
 */

export type Company = {
  id: string;
  name: string;
  created_at: string;
  trial_ends_at: string | null;
  is_active: boolean;
  settings: Json;
};

export type Tenant = {
  id: string;
  company_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'employee';
  created_at: string;
};

export type Client = {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type Vehicle = {
  id: string;
  company_id: string;
  license_plate: string;
  vin: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceRecord = {
  id: string;
  company_id: string;
  vehicle_id: string;
  client_id: string | null;
  service_type: string;
  description: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Invoice = {
  id: string;
  company_id: string;
  client_id: string | null;
  service_record_id: string | null;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Employee = {
  id: string;
  company_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  hire_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  company_id: string;
  client_id: string;
  vehicle_id: string | null;
  service_type: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FinancialTransaction = {
  id: string;
  company_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string | null;
  date: string;
  related_to: string | null; // Could be invoice_id, expense_id, etc.
  created_at: string;
  updated_at: string;
};

export type KanbanColumn = {
  id: string;
  company_id: string;
  name: string;
  position: number;
  color: string | null;
  created_at: string;
  updated_at: string;
};

export type KanbanCard = {
  id: string;
  company_id: string;
  column_id: string;
  title: string;
  description: string | null;
  position: number;
  assigned_to: string | null; // employee_id
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  company_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  related_to: string | null; // Could be any entity ID
  created_at: string;
};

export type PhotoLog = {
  id: string;
  company_id: string;
  service_record_id: string | null;
  vehicle_id: string | null;
  description: string | null;
  storage_path: string;
  uploaded_by: string; // user_id
  created_at: string;
};

// Helper type for JSON fields
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/**
 * Database schema types for Supabase
 * These match the tables in your Supabase database
 */

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company;
        Insert: Omit<Company, 'id' | 'created_at'>;
        Update: Partial<Omit<Company, 'id' | 'created_at'>>;
      };
      tenants: {
        Row: Tenant;
        Insert: Omit<Tenant, 'id' | 'created_at'>;
        Update: Partial<Omit<Tenant, 'id' | 'created_at'>>;
      };
      clients: {
        Row: Client;
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;
      };
      vehicles: {
        Row: Vehicle;
        Insert: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>>;
      };
      service_records: {
        Row: ServiceRecord;
        Insert: Omit<ServiceRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ServiceRecord, 'id' | 'created_at' | 'updated_at'>>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at'>>;
      };
      employees: {
        Row: Employee;
        Insert: Omit<Employee, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>;
      };
      financial_transactions: {
        Row: FinancialTransaction;
        Insert: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>>;
      };
      kanban_columns: {
        Row: KanbanColumn;
        Insert: Omit<KanbanColumn, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KanbanColumn, 'id' | 'created_at' | 'updated_at'>>;
      };
      kanban_cards: {
        Row: KanbanCard;
        Insert: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KanbanCard, 'id' | 'created_at' | 'updated_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      photo_logs: {
        Row: PhotoLog;
        Insert: Omit<PhotoLog, 'id' | 'created_at'>;
        Update: Partial<Omit<PhotoLog, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}