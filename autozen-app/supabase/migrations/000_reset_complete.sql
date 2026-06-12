-- ============================================================
-- AutoZen - RESET COMPLETO + SETUP (idempotente)
-- Cole TODO este script no Supabase SQL Editor e execute uma vez.
-- Corrige: ordem de dependências, RLS recursivo e grants ausentes.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 0) REMOVER GATILHO/ TABELA CONFLITANTES (de templates anteriores)
--    Um trigger em auth.users inserindo em "profiles" com company_id
--    NOT NULL estava bloqueando a criação de usuários. Removemos.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ------------------------------------------------------------
-- 1) LIMPEZA (drop em ordem reversa de dependência)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS financial_entries CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

DROP FUNCTION IF EXISTS get_user_company_id() CASCADE;
DROP FUNCTION IF EXISTS is_super_admin() CASCADE;

-- ------------------------------------------------------------
-- 2) TABELAS (ordem correta de dependência)
-- ------------------------------------------------------------
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  responsible TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  logo_url TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial','active','expired','blocked')),
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'funcionario' CHECK (role IN ('super_admin','admin_empresa','funcionario')),
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  notes TEXT,
  recurrence_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plate TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'carro' CHECK (type IN ('carro','moto','caminhonete','suv','outro')),
  year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  active BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL DEFAULT 'Lavagem',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- employees ANTES de orders (orders referencia employees)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Lavador',
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  order_number SERIAL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  employee_id UUID REFERENCES employees(id),
  status TEXT NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando','lavando','finalizando','pronto')),
  services TEXT[] NOT NULL DEFAULT '{}',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  checklist JSONB,
  photos_before TEXT[],
  photos_after TEXT[],
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE financial_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('entrada','saida')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Outros',
  payment_method TEXT NOT NULL DEFAULT 'dinheiro' CHECK (payment_method IN ('pix','dinheiro','cartao')),
  order_id UUID REFERENCES orders(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER NOT NULL DEFAULT 5,
  unit TEXT NOT NULL DEFAULT 'un',
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Geral',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  service_id UUID NOT NULL REFERENCES services(id),
  employee_id UUID REFERENCES employees(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado','confirmado','cancelado','concluido')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('pix','dinheiro','cartao')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3) ÍNDICES
-- ------------------------------------------------------------
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_vehicles_company ON vehicles(company_id);
CREATE INDEX idx_services_company ON services(company_id);
CREATE INDEX idx_orders_company ON orders(company_id, status);
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_financial_company ON financial_entries(company_id, date);
CREATE INDEX idx_inventory_company ON inventory(company_id);
CREATE INDEX idx_appointments_company ON appointments(company_id, date);
CREATE INDEX idx_payments_company ON payments(company_id);

-- ------------------------------------------------------------
-- 4) FUNÇÕES HELPER (SECURITY DEFINER + search_path => sem recursão de RLS)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin');
$$;

-- ------------------------------------------------------------
-- 5) GRANTS (corrige "permission denied for table")
-- ------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ------------------------------------------------------------
-- 6) RLS
-- ------------------------------------------------------------
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- companies
CREATE POLICY companies_select ON companies FOR SELECT
  USING (id = get_user_company_id() OR is_super_admin());
CREATE POLICY companies_update ON companies FOR UPDATE
  USING (id = get_user_company_id() OR is_super_admin());
CREATE POLICY companies_all_admin ON companies FOR ALL
  USING (is_super_admin());

-- users: política self por id = auth.uid() (sem recursão); admin/super via função
CREATE POLICY users_select_self ON users FOR SELECT
  USING (id = auth.uid() OR company_id = get_user_company_id() OR is_super_admin());
CREATE POLICY users_manage ON users FOR ALL
  USING (company_id = get_user_company_id() OR is_super_admin());

-- isolamento por empresa para o restante
CREATE POLICY customers_isolation ON customers FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY vehicles_isolation ON vehicles FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY services_isolation ON services FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY orders_isolation ON orders FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY employees_isolation ON employees FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY financial_isolation ON financial_entries FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY inventory_isolation ON inventory FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY appointments_isolation ON appointments FOR ALL
  USING (company_id = get_user_company_id());
CREATE POLICY payments_isolation ON payments FOR ALL
  USING (company_id = get_user_company_id());
