-- AutoZen - Row Level Security (RLS)
-- Isolamento total de dados entre empresas

-- Enable RLS on all tables
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

-- ========================================
-- Helper function: get user's company_id
-- ========================================
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: check if super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin');
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ========================================
-- COMPANIES Policies
-- ========================================
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (id = get_user_company_id() OR is_super_admin());

CREATE POLICY "Admin can update own company" ON companies
  FOR UPDATE USING (id = get_user_company_id());

CREATE POLICY "Super admin full access companies" ON companies
  FOR ALL USING (is_super_admin());

-- ========================================
-- USERS Policies
-- ========================================
CREATE POLICY "Users see own company users" ON users
  FOR SELECT USING (company_id = get_user_company_id() OR is_super_admin());

CREATE POLICY "Admin manages users" ON users
  FOR ALL USING (company_id = get_user_company_id() OR is_super_admin());

-- ========================================
-- CUSTOMERS Policies
-- ========================================
CREATE POLICY "Company sees own customers" ON customers
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own customers" ON customers
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- VEHICLES Policies
-- ========================================
CREATE POLICY "Company sees own vehicles" ON vehicles
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own vehicles" ON vehicles
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- SERVICES Policies
-- ========================================
CREATE POLICY "Company sees own services" ON services
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own services" ON services
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- ORDERS Policies
-- ========================================
CREATE POLICY "Company sees own orders" ON orders
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own orders" ON orders
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- EMPLOYEES Policies
-- ========================================
CREATE POLICY "Company sees own employees" ON employees
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own employees" ON employees
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- FINANCIAL_ENTRIES Policies
-- ========================================
CREATE POLICY "Company sees own finances" ON financial_entries
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own finances" ON financial_entries
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- INVENTORY Policies
-- ========================================
CREATE POLICY "Company sees own inventory" ON inventory
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own inventory" ON inventory
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- APPOINTMENTS Policies
-- ========================================
CREATE POLICY "Company sees own appointments" ON appointments
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own appointments" ON appointments
  FOR ALL USING (company_id = get_user_company_id());

-- ========================================
-- PAYMENTS Policies
-- ========================================
CREATE POLICY "Company sees own payments" ON payments
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Company manages own payments" ON payments
  FOR ALL USING (company_id = get_user_company_id());
