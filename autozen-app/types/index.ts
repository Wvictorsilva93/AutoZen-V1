export * from './database';

// Session types
export interface SessionUser {
  id: string;
  email: string;
  company_id: string;
  role: import('./database').UserRole;
  name: string;
}

// Dashboard stats
export interface DashboardStats {
  faturamento_hoje: number;
  faturamento_mes: number;
  lucro: number;
  ticket_medio: number;
  veiculos_ativos: number;
  fila_atual: number;
  agendamentos_hoje: number;
}

// Kanban
export interface KanbanColumn {
  id: import('./database').OrderStatus;
  title: string;
  orders: import('./database').Order[];
}
