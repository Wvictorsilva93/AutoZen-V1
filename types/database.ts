/**
 * Tipos do banco de dados Supabase
 * Sincronizado com schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type CompanyStatus = 'trial' | 'active' | 'expired' | 'blocked'
export type UserRole = 'super_admin' | 'admin_empresa' | 'funcionario'
export type VehicleType = 'carro' | 'moto' | 'suv' | 'van'
export type OrderStatus = 'aguardando' | 'lavando' | 'finalizando' | 'pronto' | 'entregue' | 'cancelado'
export type AppointmentStatus = 'agendado' | 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado'
export type FinancialType = 'receita' | 'despesa'
export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito'

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          owner_name: string
          email: string
          whatsapp: string
          status: CompanyStatus
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_name: string
          email: string
          whatsapp: string
          status?: CompanyStatus
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_name?: string
          email?: string
          whatsapp?: string
          status?: CompanyStatus
          trial_ends_at?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          company_id: string
          auth_id: string
          name: string
          email: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          auth_id: string
          name: string
          email: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          email?: string
          role?: UserRole
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          company_id: string
          name: string
          phone: string | null
          email: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          phone?: string | null
          email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          company_id: string
          customer_id: string
          plate: string
          brand: string | null
          model: string | null
          color: string | null
          type: VehicleType
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          customer_id: string
          plate: string
          brand?: string | null
          model?: string | null
          color?: string | null
          type?: VehicleType
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          plate?: string
          brand?: string | null
          model?: string | null
          color?: string | null
          type?: VehicleType
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          price: number
          duration_minutes: number | null
          category: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          price: number
          duration_minutes?: number | null
          category?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          price?: number
          duration_minutes?: number | null
          category?: string | null
          active?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          company_id: string
          order_number: string
          customer_id: string
          vehicle_id: string
          status: OrderStatus
          total_amount: number
          notes: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          order_number: string
          customer_id: string
          vehicle_id: string
          status?: OrderStatus
          total_amount?: number
          notes?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: OrderStatus
          total_amount?: number
          notes?: string | null
          started_at?: string | null
          completed_at?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          company_id: string
          order_id: string
          service_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          order_id: string
          service_id: string
          quantity?: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          quantity?: number
          unit_price?: number
          total_price?: number
        }
      }
      financial_entries: {
        Row: {
          id: string
          company_id: string
          type: FinancialType
          category: string
          description: string
          amount: number
          payment_method: PaymentMethod | null
          order_id: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          type: FinancialType
          category: string
          description: string
          amount: number
          payment_method?: PaymentMethod | null
          order_id?: string | null
          date?: string
          created_at?: string
        }
        Update: {
          type?: FinancialType
          category?: string
          description?: string
          amount?: number
          payment_method?: PaymentMethod | null
          date?: string
        }
      }
      inventory: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          category: string | null
          quantity: number
          unit: string
          min_quantity: number
          cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          category?: string | null
          quantity?: number
          unit?: string
          min_quantity?: number
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          category?: string | null
          quantity?: number
          unit?: string
          min_quantity?: number
          cost?: number | null
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          company_id: string
          user_id: string | null
          name: string
          phone: string | null
          role: string | null
          commission_rate: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id?: string | null
          name: string
          phone?: string | null
          role?: string | null
          commission_rate?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string | null
          name?: string
          phone?: string | null
          role?: string | null
          commission_rate?: number
          active?: boolean
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          company_id: string
          customer_id: string
          vehicle_id: string
          service_id: string | null
          scheduled_at: string
          status: AppointmentStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          customer_id: string
          vehicle_id: string
          service_id?: string | null
          scheduled_at: string
          status?: AppointmentStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          scheduled_at?: string
          status?: AppointmentStatus
          notes?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      v_revenue_by_period: {
        Row: {
          company_id: string
          period: string
          total_revenue: number
          total_orders: number
        }
      }
    }
    Functions: {
      generate_order_number: {
        Args: { p_company_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
