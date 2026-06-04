-- =====================================================
-- AUTOZEN V4 - SCHEMA MULTIEMPRESA
-- Sistema SaaS com isolamento total de dados
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: companies (Empresas)
-- =====================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'expired', 'blocked')),
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para busca rápida
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

-- =====================================================
-- TABELA: users (Usuários)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  auth_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'funcionario' CHECK (role IN ('super_admin', 'admin_empresa', 'funcionario')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(auth_id)
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_auth ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- TABELA: customers (Clientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_company ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- =====================================================
-- TABELA: vehicles (Veículos)
-- =====================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plate TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  color TEXT,
  type TEXT NOT NULL DEFAULT 'carro' CHECK (type IN ('carro', 'moto', 'suv', 'van')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, plate)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_company ON vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);

-- =====================================================
-- TABELA: services (Serviços/Produtos)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER,
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_company ON services(company_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- =====================================================
-- TABELA: orders (Ordens de Serviço)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  status TEXT NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'lavando', 'finalizando', 'pronto', 'entregue', 'cancelado')),
  total_amount DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, order_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_company ON orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vehicle ON orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- =====================================================
-- TABELA: order_items (Itens da OS)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_company ON order_items(company_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- =====================================================
-- TABELA: financial_entries (Lançamentos Financeiros)
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('dinheiro', 'pix', 'cartao_credito', 'cartao_debito')),
  order_id UUID REFERENCES orders(id),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_financial_company ON financial_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_financial_type ON financial_entries(type);
CREATE INDEX IF NOT EXISTS idx_financial_date ON financial_entries(date DESC);

-- =====================================================
-- TABELA: inventory (Estoque)
-- =====================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  quantity DECIMAL(10, 2) DEFAULT 0,
  unit TEXT DEFAULT 'un',
  min_quantity DECIMAL(10, 2) DEFAULT 0,
  cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_company ON inventory(company_id);

-- =====================================================
-- TABELA: employees (Funcionários)
-- =====================================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  commission_rate DECIMAL(5, 2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(active);

-- =====================================================
-- TABELA: appointments (Agendamentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  service_id UUID REFERENCES services(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_company ON appointments(company_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Isolamento total de dados por empresa
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES - companies
-- =====================================================
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own company"
  ON companies FOR UPDATE
  USING (
    id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid() AND role = 'admin_empresa'
    )
  );

-- =====================================================
-- POLICIES - users
-- =====================================================
CREATE POLICY "Users can view users from their company"
  ON users FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  );

-- =====================================================
-- POLICIES - Tabelas com company_id
-- =====================================================

-- Macro para criar policies padrão
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY['customers', 'vehicles', 'services', 'orders', 'order_items', 
                        'financial_entries', 'inventory', 'employees', 'appointments'])
  LOOP
    -- SELECT
    EXECUTE format('
      CREATE POLICY "Users can view their company %I"
        ON %I FOR SELECT
        USING (
          company_id IN (
            SELECT company_id FROM users WHERE auth_id = auth.uid()
          )
        )
    ', table_name, table_name);

    -- INSERT
    EXECUTE format('
      CREATE POLICY "Users can insert into their company %I"
        ON %I FOR INSERT
        WITH CHECK (
          company_id IN (
            SELECT company_id FROM users WHERE auth_id = auth.uid()
          )
        )
    ', table_name, table_name);

    -- UPDATE
    EXECUTE format('
      CREATE POLICY "Users can update their company %I"
        ON %I FOR UPDATE
        USING (
          company_id IN (
            SELECT company_id FROM users WHERE auth_id = auth.uid()
          )
        )
    ', table_name, table_name);

    -- DELETE
    EXECUTE format('
      CREATE POLICY "Users can delete from their company %I"
        ON %I FOR DELETE
        USING (
          company_id IN (
            SELECT company_id FROM users WHERE auth_id = auth.uid()
          )
        )
    ', table_name, table_name);
  END LOOP;
END $$;

-- =====================================================
-- FUNCTIONS - Triggers para updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY['companies', 'users', 'customers', 'vehicles', 'services', 
                        'orders', 'inventory', 'employees', 'appointments'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- =====================================================
-- FUNCTIONS - Gerar número de OS automático
-- =====================================================

CREATE OR REPLACE FUNCTION generate_order_number(p_company_id UUID)
RETURNS TEXT AS $$
DECLARE
  last_number INTEGER;
  new_number TEXT;
BEGIN
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(order_number FROM '[0-9]+$') AS INTEGER)), 
    0
  ) INTO last_number
  FROM orders
  WHERE company_id = p_company_id;
  
  new_number := 'OS-' || LPAD((last_number + 1)::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA (Desenvolvimento)
-- =====================================================

-- Inserir empresa de teste (apenas se não existir)
INSERT INTO companies (id, name, owner_name, email, whatsapp, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Lava Jato Exemplo',
  'Admin Teste',
  'admin@exemplo.com',
  '11999999999',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- VIEWS - Relatórios e Analytics
-- =====================================================

-- View: Faturamento por período
CREATE OR REPLACE VIEW v_revenue_by_period AS
SELECT 
  company_id,
  DATE_TRUNC('day', date) as period,
  SUM(amount) as total_revenue,
  COUNT(DISTINCT order_id) as total_orders
FROM financial_entries
WHERE type = 'receita'
GROUP BY company_id, DATE_TRUNC('day', date);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE companies IS 'Empresas cadastradas no sistema SaaS';
COMMENT ON TABLE users IS 'Usuários do sistema vinculados a empresas';
COMMENT ON TABLE customers IS 'Clientes das empresas';
COMMENT ON TABLE vehicles IS 'Veículos dos clientes';
COMMENT ON TABLE orders IS 'Ordens de serviço';
COMMENT ON COLUMN companies.status IS 'trial: 7 dias teste | active: ativo | expired: expirado | blocked: bloqueado';
COMMENT ON COLUMN users.role IS 'super_admin: admin SaaS | admin_empresa: dono | funcionario: operador';
