-- ============================================
-- AUTOZEN V6 - SUPABASE FOUNDATION
-- Complete SQL Implementation with RLS
-- PostgreSQL 15+ / Supabase
-- ============================================

-- ============================================
-- PART 1: EXTENSIONS
-- ============================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Encryption and hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Full-text search (fuzzy matching)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- PART 2: HELPER FUNCTIONS
-- ============================================

-- Function: Get current tenant_id from authenticated user
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM profiles 
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM platform_admins 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Function: Create audit log
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_changes JSONB;
  v_action TEXT;
  v_tenant_id UUID;
BEGIN
  -- Determine action
  IF TG_OP = 'INSERT' THEN
    v_action := 'INSERT';
    v_old_data := NULL;
    v_new_data := row_to_json(NEW)::JSONB;
    v_tenant_id := NEW.tenant_id;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_old_data := row_to_json(OLD)::JSONB;
    v_new_data := row_to_json(NEW)::JSONB;
    v_tenant_id := NEW.tenant_id;
    
    -- Calculate only changed fields
    v_changes := (
      SELECT jsonb_object_agg(key, value)
      FROM jsonb_each(v_new_data)
      WHERE v_new_data->key IS DISTINCT FROM v_old_data->key
    );
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_old_data := row_to_json(OLD)::JSONB;
    v_new_data := NULL;
    v_tenant_id := OLD.tenant_id;
  END IF;
  
  -- Insert audit log
  INSERT INTO audit_logs (
    tenant_id,
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    changes,
    ip_address
  ) VALUES (
    v_tenant_id,
    auth.uid(),
    v_action,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_old_data,
    v_new_data,
    v_changes,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 3: PLATFORM TABLES
-- ============================================

-- Platform Admins (Super Admins)
CREATE TABLE platform_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_platform_admins_user ON platform_admins(user_id);

-- Platform Settings (Global)
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description) VALUES
  ('trial_days', '14', 'Number of trial days for new tenants'),
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
  ('support_whatsapp', '"+55119999999999"', 'Support WhatsApp number'),
  ('support_email', '"suporte@autozen.com.br"', 'Support email'),
  ('app_version', '"1.0.0"', 'Current application version'),
  ('max_users_per_tenant', '50', 'Maximum users per tenant'),
  ('max_storage_per_tenant_mb', '5000', 'Maximum storage per tenant in MB')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- PART 4: CORE TENANT TABLES
-- ============================================

-- Companies (Tenants)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company Data
  name TEXT NOT NULL,
  document TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  logo_url TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'trial' CHECK (
    status IN ('active', 'trial', 'suspended', 'cancelled')
  ),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_document ON companies(document);
CREATE INDEX idx_companies_deleted ON companies(deleted_at) WHERE deleted_at IS NOT NULL;

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Super admins can view all companies"
  ON companies FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

CREATE POLICY "Super admins can insert companies"
  ON companies FOR INSERT
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can update companies"
  ON companies FOR UPDATE
  USING (is_super_admin());


-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL,
  is_system BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tenant_id, name),
  UNIQUE(name) WHERE is_system = true
);

CREATE INDEX idx_roles_tenant ON roles(tenant_id);
CREATE INDEX idx_roles_level ON roles(level);

-- Insert system roles
INSERT INTO roles (name, description, level, is_system, tenant_id) VALUES
  ('super_admin', 'Administrador da Plataforma', 5, true, NULL),
  ('admin', 'Administrador da Empresa', 4, true, NULL),
  ('gerente', 'Gerente de Operações', 3, true, NULL),
  ('atendente', 'Atendente', 2, true, NULL),
  ('operador', 'Operador de Serviços', 1, true, NULL)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view roles from own tenant"
  ON roles FOR SELECT
  USING (
    is_super_admin() 
    OR tenant_id IS NULL 
    OR tenant_id = current_tenant_id()
  );

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_code ON permissions(code);

-- Insert default permissions
INSERT INTO permissions (code, name, module, description) VALUES
  -- Dashboard
  ('dashboard.view', 'Ver Dashboard', 'dashboard', 'Visualizar dashboard'),
  
  -- Clientes
  ('clients.view', 'Ver Clientes', 'clients', 'Visualizar clientes'),
  ('clients.create', 'Criar Cliente', 'clients', 'Cadastrar clientes'),
  ('clients.edit', 'Editar Cliente', 'clients', 'Modificar clientes'),
  ('clients.delete', 'Excluir Cliente', 'clients', 'Remover clientes'),
  
  -- Veículos
  ('vehicles.view', 'Ver Veículos', 'vehicles', 'Visualizar veículos'),
  ('vehicles.create', 'Criar Veículo', 'vehicles', 'Cadastrar veículos'),
  ('vehicles.edit', 'Editar Veículo', 'vehicles', 'Modificar veículos'),
  ('vehicles.delete', 'Excluir Veículo', 'vehicles', 'Remover veículos'),
  
  -- Agendamentos
  ('appointments.view', 'Ver Agendamentos', 'appointments', 'Visualizar agendamentos'),
  ('appointments.create', 'Criar Agendamento', 'appointments', 'Criar agendamentos'),
  ('appointments.edit', 'Editar Agendamento', 'appointments', 'Modificar agendamentos'),
  ('appointments.delete', 'Excluir Agendamento', 'appointments', 'Cancelar agendamentos'),
  
  -- Ordens de Serviço
  ('os.view', 'Ver OS', 'os', 'Visualizar ordens de serviço'),
  ('os.create', 'Criar OS', 'os', 'Abrir OS'),
  ('os.edit', 'Editar OS', 'os', 'Modificar OS'),
  ('os.delete', 'Excluir OS', 'os', 'Cancelar OS'),
  
  -- Financeiro
  ('financial.view', 'Ver Financeiro', 'financial', 'Visualizar financeiro'),
  ('financial.edit', 'Editar Financeiro', 'financial', 'Modificar lançamentos'),
  
  -- Estoque
  ('stock.view', 'Ver Estoque', 'stock', 'Visualizar estoque'),
  ('stock.edit', 'Editar Estoque', 'stock', 'Modificar estoque'),
  
  -- Relatórios
  ('reports.view', 'Ver Relatórios', 'reports', 'Acessar relatórios'),
  
  -- Configurações
  ('settings.edit', 'Editar Configurações', 'settings', 'Modificar configurações'),
  
  -- Usuários
  ('users.view', 'Ver Usuários', 'users', 'Visualizar usuários'),
  ('users.create', 'Criar Usuário', 'users', 'Adicionar usuários'),
  ('users.edit', 'Editar Usuário', 'users', 'Modificar usuários'),
  ('users.delete', 'Excluir Usuário', 'users', 'Remover usuários')
ON CONFLICT (code) DO NOTHING;

-- Role Permissions
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id),
  
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  active BOOLEAN DEFAULT true,
  last_access_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_profiles_tenant ON profiles(tenant_id);
CREATE INDEX idx_profiles_role ON profiles(role_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_deleted ON profiles(deleted_at) WHERE deleted_at IS NOT NULL;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view profiles from own tenant"
  ON profiles FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND deleted_at IS NULL
  );

CREATE POLICY "Admins can insert profiles in own tenant"
  ON profiles FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id());

CREATE POLICY "Admins can update profiles in own tenant"
  ON profiles FOR UPDATE
  USING (tenant_id = current_tenant_id());


-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  plan_id TEXT NOT NULL DEFAULT 'autozen_unico',
  plan_name TEXT NOT NULL DEFAULT 'AutoZen Único',
  plan_price DECIMAL(10,2) NOT NULL DEFAULT 97.00,
  
  status TEXT NOT NULL DEFAULT 'trial' CHECK (
    status IN ('trial', 'active', 'past_due', 'cancelled', 'suspended')
  ),
  
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

CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_ends ON subscriptions(trial_ends_at);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Super admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Users can view own tenant subscription"
  ON subscriptions FOR SELECT
  USING (tenant_id = current_tenant_id());

-- ============================================
-- PART 5: CRM TABLES
-- ============================================

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  cpf_cnpj TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE,
  
  zipcode TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  district TEXT,
  city TEXT,
  state TEXT,
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  deleted_by UUID REFERENCES profiles(id),
  
  CONSTRAINT unique_cpf_cnpj_per_tenant UNIQUE (tenant_id, cpf_cnpj)
);

CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_cpf_cnpj ON clients(cpf_cnpj);
CREATE INDEX idx_clients_deleted ON clients(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_clients_name_trgm ON clients USING GIN (name gin_trgm_ops);
CREATE INDEX idx_clients_phone_trgm ON clients USING GIN (phone gin_trgm_ops);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Super admins can view all clients"
  ON clients FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Users can view clients from own tenant"
  ON clients FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND deleted_at IS NULL
  );

CREATE POLICY "Users can insert clients in own tenant"
  ON clients FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id());

CREATE POLICY "Users can update clients from own tenant"
  ON clients FOR UPDATE
  USING (tenant_id = current_tenant_id());

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  plate TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  fuel TEXT CHECK (fuel IN ('gasoline', 'ethanol', 'diesel', 'flex', 'electric', 'hybrid')),
  chassis TEXT,
  km DECIMAL(10,2),
  
  notes TEXT,
  photos JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  deleted_by UUID REFERENCES profiles(id),
  
  CONSTRAINT unique_plate_per_tenant UNIQUE (tenant_id, plate)
);

CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_vehicles_client ON vehicles(client_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_deleted ON vehicles(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_vehicles_plate_trgm ON vehicles USING GIN (plate gin_trgm_ops);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Super admins can view all vehicles"
  ON vehicles FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Users can view vehicles from own tenant"
  ON vehicles FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND deleted_at IS NULL
  );

CREATE POLICY "Users can insert vehicles in own tenant"
  ON vehicles FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id());

CREATE POLICY "Users can update vehicles from own tenant"
  ON vehicles FOR UPDATE
  USING (tenant_id = current_tenant_id());

-- ============================================
-- PART 6: SERVICE TABLES
-- ============================================

-- Service Categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  UNIQUE(tenant_id, name)
);

CREATE INDEX idx_service_categories_tenant ON service_categories(tenant_id);
CREATE INDEX idx_service_categories_deleted ON service_categories(deleted_at) WHERE deleted_at IS NOT NULL;

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view service categories from own tenant"
  ON service_categories FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND deleted_at IS NULL
  );

CREATE POLICY "Admins can manage service categories in own tenant"
  ON service_categories FOR ALL
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());

