// AutoZen - Database Types
// Tipos gerados do schema Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Role = 'super_admin' | 'admin' | 'gerente' | 'atendente' | 'operador';

export type SubscriptionStatus = 'trial' | 'pending_payment' | 'active' | 'suspended' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          cnpj: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          cnpj?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          cnpj?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          tenant_id: string;
          name: string;
          role: Role;
          avatar_url: string | null;
          phone: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          tenant_id: string;
          name: string;
          role: Role;
          avatar_url?: string | null;
          phone?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          tenant_id?: string;
          name?: string;
          role?: Role;
          avatar_url?: string | null;
          phone?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          tenant_id: string;
          plan: string;
          status: SubscriptionStatus;
          amount: number;
          trial_starts_at: string | null;
          trial_ends_at: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          payment_proof_url: string | null;
          approved_by: string | null;
          approved_at: string | null;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          plan?: string;
          status?: SubscriptionStatus;
          amount?: number;
          trial_starts_at?: string | null;
          trial_ends_at?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          payment_proof_url?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          plan?: string;
          status?: SubscriptionStatus;
          amount?: number;
          trial_starts_at?: string | null;
          trial_ends_at?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          payment_proof_url?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      permissions: {
        Row: {
          id: string;
          name: string;
          resource: string;
          action: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          resource: string;
          action: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          resource?: string;
          action?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      role_permissions: {
        Row: {
          id: string;
          role_id: string;
          permission_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          role_id: string;
          permission_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role_id?: string;
          permission_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      current_tenant_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      role: Role;
      subscription_status: SubscriptionStatus;
    };
  };
}
