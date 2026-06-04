-- ============================================
-- AutoZen - Database Schema V4
-- PostgreSQL 15+ / Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Companies (Tenants)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados da empresa
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  whatsapp TEXT,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  
  -- Logo
  logo_url TEXT,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_companies_cnpj ON companies(cnpj);
CREATE INDEX idx_companies_active ON companies(active);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Dados pessoais
  nome TEXT NOT NULL,
  avatar_url TEXT,
  telefone TEXT,
  
  -- Permissões
  role TEXT NOT NULL DEFAULT 'atendente',
  permissions JSONB DEFAULT '[]',
  
  -- Status
  active BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, display_name, description, level) VALUES
  ('super_admin', 'Super Admin', 'Acesso total à plataforma', 5),
  ('admin', 'Administrador', 'Acesso total à empresa', 4),
  ('gerente', 'Gerente', 'Gerencia operações e equipe', 3),
  ('atendente', 'Atendente', 'Atende clientes e cria OS', 2),
  ('operador', 'Operador', 'Executa serviços', 1);

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(resource, action)
);

-- Insert basic permissions
INSERT INTO permissions (resource, action, description) VALUES
  ('clients', 'create', 'Criar clientes'),
  ('clients', 'read', 'Ver clientes'),
  ('clients', 'update', 'Editar clientes'),
  ('clients', 'delete', 'Excluir clientes'),
  ('vehicles', 'create', 'Criar veículos'),
  ('vehicles', 'read', 'Ver veículos'),
  ('vehicles', 'update', 'Editar veículos'),
  ('vehicles', 'delete', 'Excluir veículos'),
  ('work_orders', 'create', 'Criar OS'),
  ('work_orders', 'read', 'Ver OS'),
  ('work_orders', 'update', 'Editar OS'),
  ('work_orders', 'delete', 'Excluir OS'),
  ('financial', 'create', 'Criar lançamentos'),
  ('financial', 'read', 'Ver financeiro'),
  ('financial', 'update', 'Editar financeiro'),
  ('financial', 'delete', 'Excluir lançamentos'),
  ('inventory', 'create', 'Criar produtos'),
  ('inventory', 'read', 'Ver estoque'),
  ('inventory', 'update', 'Editar produtos'),
  ('inventory', 'delete', 'Excluir produtos'),
  ('reports', 'read', 'Ver relatórios'),
  ('settings', 'update', 'Editar configurações');

-- Role Permissions
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL REFERENCES roles(name),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- User Custom Permissions (override role)
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id),
  granted BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, permission_id)
);

-- ============================================
-- CRM TABLES
-- ============================================

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Dados
  tipo TEXT NOT NULL DEFAULT 'PF' CHECK (tipo IN ('PF', 'PJ')),
  nome TEXT NOT NULL,
  cpf TEXT,
  cnpj TEXT,
  email TEXT,
  telefone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  data_nascimento DATE,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES profiles(id),
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_cpf_per_company UNIQUE (company_id, cpf),
  CONSTRAINT unique_cnpj_per_company UNIQUE (company_id, cnpj)
);

CREATE INDEX idx_clients_company ON clients(company_id);
CREATE INDEX idx_clients_deleted ON clients(deleted_at);
CREATE INDEX idx_clients_nome ON clients(nome);
CREATE INDEX idx_clients_telefone ON clients(telefone);

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Dados do veículo
  placa TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  cor TEXT NOT NULL,
  km DECIMAL(10,2),
  chassi TEXT,
  combustivel TEXT CHECK (combustivel IN ('GASOLINA', 'ETANOL', 'DIESEL', 'FLEX', 'ELETRICO', 'HIBRIDO')),
  
  -- Fotos
  fotos JSONB DEFAULT '[]',
  
  -- Observações
  observacoes TEXT,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES profiles(id),
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_placa_per_company UNIQUE (company_id, placa)
);

CREATE INDEX idx_vehicles_company ON vehicles(company_id);
CREATE INDEX idx_vehicles_client ON vehicles(client_id);
CREATE INDEX idx_vehicles_placa ON vehicles(placa);
CREATE INDEX idx_vehicles_deleted ON vehicles(deleted_at);

-- ============================================
-- SERVICES
-- ============================================

-- Service Categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT DEFAULT '#3b82f6',
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(company_id, nome)
);

CREATE INDEX idx_service_categories_company ON service_categories(company_id);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id),
  
  nome TEXT NOT NULL,
  descricao TEXT,
  valor DECIMAL(10,2) NOT NULL,
  tempo_estimado INTEGER, -- minutos
  comissao DECIMAL(5,2) DEFAULT 0, -- porcentagem
  
  ativo BOOLEAN DEFAULT true,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(company_id, nome)
);

CREATE INDEX idx_services_company ON services(company_id);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_ativo ON services(ativo);

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  
  -- Agendamento
  data_agendamento TIMESTAMP NOT NULL,
  duracao_estimada INTEGER NOT NULL, -- minutos
  
  -- Serviços
  servicos JSONB NOT NULL, -- [{service_id, valor}]
  
  -- Status
  status TEXT DEFAULT 'AGENDADO' CHECK (status IN ('AGENDADO', 'CONFIRMADO', 'EM_ATENDIMENTO', 'FINALIZADO', 'CANCELADO')),
  
  -- Observações
  observacoes TEXT,
  
  -- Atribuição
  funcionario_id UUID REFERENCES profiles(id),
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES profiles(id),
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_company ON appointments(company_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_vehicle ON appointments(vehicle_id);
CREATE INDEX idx_appointments_data ON appointments(data_agendamento);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================
-- WORK ORDERS
-- ============================================

CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  appointment_id UUID REFERENCES appointments(id),
  
  -- Numeração sequencial por empresa
  numero INTEGER NOT NULL,
  
  -- Datas
  data_entrada TIMESTAMP NOT NULL DEFAULT NOW(),
  data_prevista TIMESTAMP,
  data_saida TIMESTAMP,
  
  -- Status
  status TEXT DEFAULT 'ABERTA' CHECK (status IN ('ABERTA', 'AGUARDANDO', 'EM_EXECUCAO', 'FINALIZADA', 'ENTREGUE', 'CANCELADA')),
  
  -- Valores
  valor_servicos DECIMAL(10,2) DEFAULT 0,
  valor_produtos DECIMAL(10,2) DEFAULT 0,
  desconto DECIMAL(10,2) DEFAULT 0,
  valor_total DECIMAL(10,2) DEFAULT 0,
  
  -- KM
  km_entrada DECIMAL(10,2),
  km_saida DECIMAL(10,2),
  
  -- Observações
  observacoes TEXT,
  defeitos_relatados TEXT,
  servicos_executados TEXT,
  
  -- Atribuição
  funcionario_id UUID REFERENCES profiles(id),
  
  -- Assinatura
  assinatura_cliente TEXT, -- Base64
  assinatura_funcionario TEXT, -- Base64
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES profiles(id),
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(company_id, numero)
);

CREATE INDEX idx_work_orders_company ON work_orders(company_id);
CREATE INDEX idx_work_orders_client ON work_orders(client_id);
CREATE INDEX idx_work_orders_vehicle ON work_orders(vehicle_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_data_entrada ON work_orders(data_entrada);
CREATE INDEX idx_work_orders_numero ON work_orders(numero);

-- Work Order Items (Services)
CREATE TABLE work_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  
  tipo TEXT NOT NULL CHECK (tipo IN ('SERVICO', 'PRODUTO')),
  
  -- Referências
  service_id UUID REFERENCES services(id),
  product_id UUID, -- será criado na tabela products
  
  -- Dados
  nome TEXT NOT NULL,
  descricao TEXT,
  quantidade DECIMAL(10,2) NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  valor_total DECIMAL(10,2) NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_work_order_items_wo ON work_order_items(work_order_id);

-- Work Order Photos
CREATE TABLE work_order_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  
  tipo TEXT NOT NULL CHECK (tipo IN ('ANTES', 'DURANTE', 'DEPOIS')),
  url TEXT NOT NULL,
  descricao TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_work_order_photos_wo ON work_order_photos(work_order_id);

-- ============================================
-- INVENTORY
-- ============================================

-- Product Categories
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  nome TEXT NOT NULL,
  descricao TEXT,
  
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(company_id, nome)
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES product_categories(id),
  
  nome TEXT NOT NULL,
  descricao TEXT,
  codigo_barras TEXT,
  sku TEXT,
  
  -- Estoque
  unidade TEXT CHECK (unidade IN ('UN', 'LT', 'ML', 'KG', 'G', 'CX')),
  estoque_minimo DECIMAL(10,2) DEFAULT 0,
  estoque_atual DECIMAL(10,2) DEFAULT 0,
  
  -- Preços
  custo DECIMAL(10,2) DEFAULT 0,
  preco_venda DECIMAL(10,2) DEFAULT 0,
  margem DECIMAL(5,2) DEFAULT 0, -- porcentagem
  
  ativo BOOLEAN DEFAULT true,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES profiles(id),
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(company_id, nome)
);

CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_ativo ON products(ativo);

-- Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  nome TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  email TEXT,
  contato TEXT,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  
  observacoes TEXT,
  
  ativo BOOLEAN DEFAULT true,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock Movements
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  
  tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA', 'AJUSTE')),
  quantidade DECIMAL(10,2) NOT NULL,
  
  -- Referências
  work_order_id UUID REFERENCES work_orders(id),
  supplier_id UUID REFERENCES suppliers(id),
  
  -- Valores
  custo_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  
  motivo TEXT,
  observacoes TEXT,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_company ON stock_movements(company_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_tipo ON stock_movements(tipo);

-- ============================================
-- FINANCIAL
-- ============================================

-- Accounts Receivable
CREATE TABLE accounts_receivable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id),
  work_order_id UUID REFERENCES work_orders(id),
  
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  
  status TEXT DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO')),
  
  forma_pagamento TEXT,
  observacoes TEXT,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_accounts_receivable_company ON accounts_receivable(company_id);
CREATE INDEX idx_accounts_receivable_client ON accounts_receivable(client_id);
CREATE INDEX idx_accounts_receivable_status ON accounts_receivable(status);
CREATE INDEX idx_accounts_receivable_vencimento ON accounts_receivable(data_vencimento);

-- Accounts Payable
CREATE TABLE accounts_payable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),
  
  descricao TEXT NOT NULL,
  categoria TEXT,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  
  status TEXT DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO')),
  
  forma_pagamento TEXT,
  observacoes TEXT,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_accounts_payable_company ON accounts_payable(company_id);
CREATE INDEX idx_accounts_payable_supplier ON accounts_payable(supplier_id);
CREATE INDEX idx_accounts_payable_status ON accounts_payable(status);

-- ============================================
-- SYSTEM TABLES
-- ============================================

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  plan_id TEXT NOT NULL DEFAULT 'autozen_unico',
  plan_name TEXT NOT NULL DEFAULT 'AutoZen Único',
  plan_price DECIMAL(10,2) NOT NULL DEFAULT 97.00,
  
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'cancelled', 'suspended')),
  
  trial_starts_at TIMESTAMP DEFAULT NOW(),
  trial_ends_at TIMESTAMP DEFAULT NOW() + INTERVAL '14 days',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  payment_method TEXT,
  payment_gateway TEXT,
  gateway_subscription_id TEXT,
  gateway_customer_id TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Settings
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  link TEXT,
  
  lida BOOLEAN DEFAULT false,
  lida_em TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_lida ON notifications(lida);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_name TEXT,
  
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id UUID,
  
  old_data JSONB,
  new_data JSONB,
  changes JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_company ON audit_logs(company_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function: Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tenant tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Example RLS Policies for clients
CREATE POLICY "Users can view clients from own company"
  ON clients FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
    AND deleted_at IS NULL
  );

CREATE POLICY "Users can insert clients in own company"
  ON clients FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update clients from own company"
  ON clients FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- END OF SCHEMA
-- ============================================
