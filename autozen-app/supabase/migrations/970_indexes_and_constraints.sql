-- AutoZen: Performance indexes and NOT NULL constraints
-- Migration: 970

-- =============================================================================
-- 1. PERFORMANCE INDEXES
-- =============================================================================

-- clients: search by name, phone, email
CREATE INDEX IF NOT EXISTS idx_clients_company_name ON clients(company_id, name);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email) WHERE email IS NOT NULL;

-- vehicles: search by plate, model, brand
CREATE INDEX IF NOT EXISTS idx_vehicles_company_plate ON vehicles(company_id, plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_company_model ON vehicles(company_id, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_client ON vehicles(client_id) WHERE client_id IS NOT NULL;

-- financial_transactions: filter by type and date
CREATE INDEX IF NOT EXISTS idx_financial_company_type ON financial_transactions(company_id, type);
CREATE INDEX IF NOT EXISTS idx_financial_company_date ON financial_transactions(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_company_type_date ON financial_transactions(company_id, type, created_at DESC);

-- inventory_products: search by name
CREATE INDEX IF NOT EXISTS idx_inventory_company_name ON inventory_products(company_id, name);

-- services: filter by active status
CREATE INDEX IF NOT EXISTS idx_services_company_active ON services(company_id, active) WHERE active = true;

-- orders (service_orders): filter by status and date
CREATE INDEX IF NOT EXISTS idx_orders_company_status ON service_orders(company_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_company_date ON service_orders(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_vehicle ON service_orders(vehicle_id) WHERE vehicle_id IS NOT NULL;

-- appointments: filter by date and status
CREATE INDEX IF NOT EXISTS idx_appointments_company_date ON appointments(company_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_company_status ON appointments(company_id, status);

-- employees: filter by active status
CREATE INDEX IF NOT EXISTS idx_employees_company_active ON employees(company_id, active) WHERE active = true;

-- =============================================================================
-- 2. NOT NULL CONSTRAINTS (non-critical, safe to add)
-- =============================================================================

-- clients: required fields
ALTER TABLE clients ALTER COLUMN name SET NOT NULL;
ALTER TABLE clients ALTER COLUMN phone SET NOT NULL;

-- vehicles: required fields
ALTER TABLE vehicles ALTER COLUMN plate SET NOT NULL;
ALTER TABLE vehicles ALTER COLUMN company_id SET NOT NULL;

-- financial_transactions: required fields
ALTER TABLE financial_transactions ALTER COLUMN type SET NOT NULL;
ALTER TABLE financial_transactions ALTER COLUMN description SET NOT NULL;
ALTER TABLE financial_transactions ALTER COLUMN amount SET NOT NULL;
ALTER TABLE financial_transactions ALTER COLUMN company_id SET NOT NULL;

-- inventory_products: required fields
ALTER TABLE inventory_products ALTER COLUMN name SET NOT NULL;
ALTER TABLE inventory_products ALTER COLUMN quantity SET NOT NULL;
ALTER TABLE inventory_products ALTER COLUMN company_id SET NOT NULL;

-- services: required fields
ALTER TABLE services ALTER COLUMN name SET NOT NULL;
ALTER TABLE services ALTER COLUMN price SET NOT NULL;
ALTER TABLE services ALTER COLUMN company_id SET NOT NULL;

-- =============================================================================
-- 3. CHECK CONSTRAINTS
-- =============================================================================

-- financial_transactions: type must be income or expense
DO $$ BEGIN
  ALTER TABLE financial_transactions
    ADD CONSTRAINT chk_financial_type CHECK (type IN ('income', 'expense'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- financial_transactions: amount must be non-negative
DO $$ BEGIN
  ALTER TABLE financial_transactions
    ADD CONSTRAINT chk_financial_amount CHECK (amount >= 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- inventory_products: quantity must be non-negative
DO $$ BEGIN
  ALTER TABLE inventory_products
    ADD CONSTRAINT chk_inventory_quantity CHECK (quantity >= 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- inventory_products: unit_price must be non-negative
DO $$ BEGIN
  ALTER TABLE inventory_products
    ADD CONSTRAINT chk_inventory_price CHECK (unit_price >= 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- vehicles: status must be a known value
DO $$ BEGIN
  ALTER TABLE vehicles
    ADD CONSTRAINT chk_vehicle_status CHECK (status IN ('fila', 'em_andamento', 'concluido', 'entregue'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- Done
-- =============================================================================
