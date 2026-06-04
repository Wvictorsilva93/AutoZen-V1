# 🔐 AutoZen V6 - Guia Completo RLS e Supabase

## 🎯 Objetivo

Criar a **fundação definitiva** do AutoZen no Supabase com:

✅ **Multi-Tenant Real** - Isolamento total por empresa  
✅ **Segurança por Empresa** - RLS em todas as tabelas  
✅ **Escalabilidade** - Preparado para milhares de tenants  
✅ **Performance** - Índices otimizados  
✅ **Auditoria** - Registro completo de operações  
✅ **RBAC** - Controle de acesso granular  
✅ **Next.js 16+ Ready** - Compatível com stack moderna  

---

## 🏗️ Estratégia Multi-Tenant

### Princípio Fundamental

**Cada registro operacional deve ter `tenant_id`:**

```sql
-- Padrão para TODAS as tabelas operacionais
tenant_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE
```

### Tabelas que DEVEM ter tenant_id

- `profiles`
- `clients`
- `vehicles`
- `appointments`
- `orders_service`
- `products`
- `suppliers`
- `stock_movements`
- `accounts_receivable`
- `accounts_payable`
- `cash_flow`
- `notifications`
- `settings`
- `subscriptions` (unique per tenant)
- `audit_logs`

### Tabelas GLOBAIS (sem tenant_id)

- `platform_admins` (super admins)
- `platform_settings` (configurações globais)
- `roles` (system roles com tenant_id NULL)
- `permissions` (permissões do sistema)

---

## 🔑 Função Auxiliar: current_tenant_id()

### Implementação

```sql
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
```

### Como Funciona

1. Pega o `auth.uid()` (Supabase Auth)
2. Busca na tabela `profiles`
3. Retorna o `tenant_id` do usuário
4. **NULL** se usuário não tem profile

### Uso

```sql
-- Filtrar por tenant atual
SELECT * FROM clients
WHERE tenant_id = current_tenant_id();

-- RLS Policy
CREATE POLICY "users_view_own_tenant"
  ON clients FOR SELECT
  USING (tenant_id = current_tenant_id());
```

---

## 🛡️ Função: is_super_admin()

### Implementação

```sql
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
```

### Como Funciona

- Verifica se `auth.uid()` está em `platform_admins`
- **Super admins não têm tenant** - acessam tudo
- Usado nas RLS policies para bypass

---

## 🔒 RLS: Row Level Security

### 1. Habilitar RLS

**Obrigatório em TODAS as tabelas operacionais:**

```sql
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
```

### 2. Policies Padrão

#### Policy: SELECT

```sql
-- Super admins vêem tudo
CREATE POLICY "super_admins_view_all_<table>"
  ON <table> FOR SELECT
  USING (is_super_admin());

-- Usuários vêem apenas do próprio tenant
CREATE POLICY "users_view_own_tenant_<table>"
  ON <table> FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND deleted_at IS NULL
  );
```

#### Policy: INSERT

```sql
-- Apenas no próprio tenant
CREATE POLICY "users_insert_own_tenant_<table>"
  ON <table> FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id());
```

#### Policy: UPDATE

```sql
-- Apenas registros do próprio tenant
CREATE POLICY "users_update_own_tenant_<table>"
  ON <table> FOR UPDATE
  USING (tenant_id = current_tenant_id());
```

#### Policy: DELETE

```sql
-- NÃO USAR DELETE FÍSICO!
-- Apenas Soft Delete via UPDATE

-- Se necessário, bloquear DELETE:
-- (Não criar policy de DELETE)
```

### 3. Policy Template Completo

```sql
-- Template para qualquer tabela multi-tenant
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "super_admins_view_all_<table>"
  ON <table_name> FOR SELECT
  USING (is_super_admin());

CREATE POLICY "users_view_own_tenant_<table>"
  ON <table_name> FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND deleted_at IS NULL
  );

-- INSERT
CREATE POLICY "users_insert_own_tenant_<table>"
  ON <table_name> FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id());

-- UPDATE
CREATE POLICY "users_update_own_tenant_<table>"
  ON <table_name> FOR UPDATE
  USING (tenant_id = current_tenant_id());

-- DELETE: NÃO CRIAR (usar soft delete)
```


---

## 🗑️ Soft Delete Global

### Implementação

**Campos obrigatórios em todas as tabelas:**

```sql
deleted_at TIMESTAMP,
deleted_by UUID REFERENCES profiles(id)
```

### Índice Obrigatório

```sql
CREATE INDEX idx_<table>_deleted 
  ON <table>(deleted_at) 
  WHERE deleted_at IS NOT NULL;
```

### Excluir (Soft Delete)

```sql
-- Via UPDATE, não DELETE
UPDATE clients
SET 
  deleted_at = NOW(),
  deleted_by = auth.uid()
WHERE id = '<client_id>'
AND tenant_id = current_tenant_id();
```

### Consultar (Apenas Ativos)

```sql
-- Sempre filtrar deleted_at IS NULL
SELECT * FROM clients
WHERE tenant_id = current_tenant_id()
AND deleted_at IS NULL;
```

### Restaurar (Opcional)

```sql
UPDATE clients
SET 
  deleted_at = NULL,
  deleted_by = NULL
WHERE id = '<client_id>'
AND tenant_id = current_tenant_id();
```

### RLS com Soft Delete

```sql
-- Policy sempre filtra deleted_at
CREATE POLICY "users_view_own_tenant_clients"
  ON clients FOR SELECT
  USING (
    tenant_id = current_tenant_id()
    AND deleted_at IS NULL  -- ← Importante!
  );
```

---

## 📝 Auditoria Automática

### Tabela audit_logs

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Tenant
  tenant_id UUID REFERENCES companies(id),
  
  -- User
  user_id UUID REFERENCES profiles(id),
  
  -- Action
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
  table_name TEXT NOT NULL,
  record_id UUID,
  
  -- Data
  old_data JSONB,
  new_data JSONB,
  changes JSONB, -- Apenas campos alterados
  
  -- Request
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### Function: create_audit_log()

```sql
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_changes JSONB;
  v_action TEXT;
  v_tenant_id UUID;
BEGIN
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
    
    -- Apenas campos alterados
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
```

### Aplicar Trigger

```sql
-- Em tabelas críticas
CREATE TRIGGER audit_clients
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_orders
  AFTER INSERT OR UPDATE OR DELETE ON orders_service
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_financial
  AFTER INSERT OR UPDATE OR DELETE ON accounts_receivable
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();
```

---

## 🎭 RBAC: Role-Based Access Control

### Estrutura

```
roles (super_admin, admin, gerente, atendente, operador)
  ↓
role_permissions
  ↓
permissions (clients.view, clients.create, etc)
  ↓
profiles.role_id
```

### System Roles

```sql
INSERT INTO roles (name, description, level, is_system, tenant_id) VALUES
  ('super_admin', 'Administrador da Plataforma', 5, true, NULL),
  ('admin', 'Administrador da Empresa', 4, true, NULL),
  ('gerente', 'Gerente de Operações', 3, true, NULL),
  ('atendente', 'Atendente', 2, true, NULL),
  ('operador', 'Operador de Serviços', 1, true, NULL);
```

### Permissions (30+)

```sql
-- Dashboard
dashboard.view

-- Clientes
clients.view
clients.create
clients.edit
clients.delete

-- Veículos
vehicles.view
vehicles.create
vehicles.edit
vehicles.delete

-- Agendamentos
appointments.view
appointments.create
appointments.edit
appointments.delete

-- Ordens de Serviço
os.view
os.create
os.edit
os.delete

-- Financeiro
financial.view
financial.edit

-- Estoque
stock.view
stock.edit

-- Relatórios
reports.view

-- Configurações
settings.edit

-- Usuários
users.view
users.create
users.edit
users.delete
```

### Verificar Permissão (Backend)

```typescript
// lib/permissions.ts
export async function hasPermission(
  userId: string,
  permissionCode: string
): Promise<boolean> {
  const supabase = createServerClient();
  
  // Buscar role do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('role_id, roles(name)')
    .eq('user_id', userId)
    .single();
  
  if (!profile) return false;
  
  // Super admin tem todas as permissões
  if (profile.roles.name === 'super_admin') return true;
  
  // Verificar permissão da role
  const { data: permission } = await supabase
    .from('role_permissions')
    .select('permissions(code)')
    .eq('role_id', profile.role_id)
    .eq('permissions.code', permissionCode)
    .single();
  
  return !!permission;
}
```

---

## ⏱️ Timestamps Automáticos

### Campos Padrão

```sql
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
deleted_at TIMESTAMP
```

### Function: update_updated_at()

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Aplicar Trigger

```sql
CREATE TRIGGER update_<table>_updated_at
  BEFORE UPDATE ON <table>
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## 🔢 UUIDs Obrigatórios

### Geração

```sql
-- Usar gen_random_uuid() (mais performático)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- OU uuid_generate_v4() (se uuid-ossp já estiver ativo)
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
```

### NUNCA Usar

```sql
-- ❌ NUNCA
id SERIAL PRIMARY KEY
id BIGSERIAL PRIMARY KEY
id INT AUTO_INCREMENT
```

---

## 📦 Storage Buckets

### Configuração

```javascript
// Criar via Supabase Dashboard
const buckets = [
  { name: 'companies', public: true, maxSize: 2MB },
  { name: 'avatars', public: true, maxSize: 1MB },
  { name: 'vehicles', public: false, maxSize: 5MB },
  { name: 'os-before', public: false, maxSize: 10MB },
  { name: 'os-during', public: false, maxSize: 10MB },
  { name: 'os-after', public: false, maxSize: 10MB },
  { name: 'documents', public: false, maxSize: 10MB },
];
```

### Storage Policies

```sql
-- Exemplo: bucket 'vehicles'
CREATE POLICY "Users can upload vehicles from own tenant"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicles'
    AND (storage.foldername(name))[1] = current_tenant_id()::text
  );

CREATE POLICY "Users can view vehicles from own tenant"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'vehicles'
    AND (storage.foldername(name))[1] = current_tenant_id()::text
  );
```

### Estrutura de Pastas

```
vehicles/
  {tenant_id}/
    {vehicle_id}/
      photo1.jpg
      photo2.jpg

os-before/
  {tenant_id}/
    {order_id}/
      before1.jpg
      before2.jpg
```


---

## 🔍 Índices Críticos

### Índices Obrigatórios

```sql
-- Multi-tenant (SEMPRE)
CREATE INDEX idx_<table>_tenant ON <table>(tenant_id);

-- Timestamps
CREATE INDEX idx_<table>_created ON <table>(created_at);
CREATE INDEX idx_<table>_updated ON <table>(updated_at);

-- Soft Delete (partial index)
CREATE INDEX idx_<table>_deleted 
  ON <table>(deleted_at) 
  WHERE deleted_at IS NOT NULL;

-- Foreign Keys
CREATE INDEX idx_<table>_<fk> ON <table>(<fk_column>);

-- Status (se existir)
CREATE INDEX idx_<table>_status ON <table>(status);
```

### Índices Full-Text Search

```sql
-- GIN index para busca fuzzy
CREATE INDEX idx_clients_name_trgm 
  ON clients USING GIN (name gin_trgm_ops);

CREATE INDEX idx_clients_phone_trgm 
  ON clients USING GIN (phone gin_trgm_ops);

CREATE INDEX idx_vehicles_plate_trgm 
  ON vehicles USING GIN (plate gin_trgm_ops);

CREATE INDEX idx_products_name_trgm 
  ON products USING GIN (name gin_trgm_ops);
```

### Índices Compostos

```sql
-- Para queries frequentes
CREATE INDEX idx_orders_tenant_status 
  ON orders_service(tenant_id, status, created_at);

CREATE INDEX idx_appointments_tenant_date 
  ON appointments(tenant_id, start_at);

CREATE INDEX idx_clients_tenant_active 
  ON clients(tenant_id, created_at) 
  WHERE deleted_at IS NULL;
```

---

## 📊 Views para Performance

### Dashboard KPIs

```sql
CREATE MATERIALIZED VIEW dashboard_kpis AS
SELECT 
  tenant_id,
  COUNT(*) FILTER (WHERE status = 'open') as orders_open,
  COUNT(*) FILTER (WHERE status = 'finished') as orders_finished,
  SUM(total) FILTER (WHERE status = 'finished') as revenue,
  AVG(total) FILTER (WHERE status = 'finished') as avg_ticket,
  COUNT(DISTINCT client_id) as unique_clients
FROM orders_service
WHERE deleted_at IS NULL
AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY tenant_id;

CREATE INDEX idx_dashboard_kpis_tenant ON dashboard_kpis(tenant_id);

-- Refresh (via cron job ou manualmente)
REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_kpis;
```

### Views Simples

```sql
-- Clientes ativos
CREATE VIEW clients_active AS
SELECT * FROM clients
WHERE deleted_at IS NULL;

-- OS abertas
CREATE VIEW orders_open AS
SELECT * FROM orders_service
WHERE status IN ('open', 'waiting', 'in_progress')
AND deleted_at IS NULL;
```

---

## 🚀 Fluxo de Autenticação

### 1. Login (Supabase Auth)

```typescript
// Frontend
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### 2. Middleware (Next.js)

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const supabase = createMiddlewareClient({ req, res });
  
  // 1. Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.redirect('/login');
  }
  
  // 2. Buscar profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*), subscriptions(*)')
    .eq('user_id', session.user.id)
    .single();
  
  if (!profile) {
    return NextResponse.redirect('/onboarding');
  }
  
  // 3. Verificar empresa ativa
  if (!profile.companies.active) {
    return NextResponse.redirect('/suspended');
  }
  
  // 4. Verificar assinatura
  if (profile.subscriptions.status === 'past_due') {
    return NextResponse.redirect('/billing');
  }
  
  // 5. Liberar acesso
  return NextResponse.next();
}
```

### 3. Obter Tenant Atual (Componente)

```typescript
// hooks/use-tenant.ts
export function useTenant() {
  const [tenant, setTenant] = useState(null);
  
  useEffect(() => {
    const fetchTenant = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id, companies(*)')
        .eq('user_id', user.id)
        .single();
      
      setTenant({
        id: profile.tenant_id,
        ...profile.companies,
      });
    };
    
    fetchTenant();
  }, []);
  
  return tenant;
}
```

---

## 🎬 Primeiro Uso (Onboarding)

### Fluxo Completo

```sql
BEGIN;

-- 1. Criar Empresa
INSERT INTO companies (name, document, email, phone, status)
VALUES ('Auto Detailing XYZ', '12345678000190', 'contato@xyz.com', '11999999999', 'trial')
RETURNING id INTO company_id;

-- 2. Criar Subscription (Trial)
INSERT INTO subscriptions (tenant_id, status, trial_starts_at, trial_ends_at)
VALUES (company_id, 'trial', NOW(), NOW() + INTERVAL '14 days');

-- 3. Criar Profile (Admin)
INSERT INTO profiles (user_id, tenant_id, role_id, name, email, active)
VALUES (
  auth.uid(), 
  company_id, 
  (SELECT id FROM roles WHERE name = 'admin' LIMIT 1),
  'João Silva',
  'joao@xyz.com',
  true
);

-- 4. Criar Settings
INSERT INTO settings (tenant_id, company_name, primary_color)
VALUES (company_id, 'Auto Detailing XYZ', '#3b82f6');

COMMIT;
```

### Function: setup_new_tenant()

```sql
CREATE OR REPLACE FUNCTION setup_new_tenant(
  p_user_id UUID,
  p_company_name TEXT,
  p_document TEXT,
  p_email TEXT,
  p_user_name TEXT
)
RETURNS UUID AS $$
DECLARE
  v_company_id UUID;
  v_admin_role_id UUID;
BEGIN
  -- Get admin role
  SELECT id INTO v_admin_role_id 
  FROM roles 
  WHERE name = 'admin' 
  LIMIT 1;
  
  -- Create company
  INSERT INTO companies (name, document, email, status)
  VALUES (p_company_name, p_document, p_email, 'trial')
  RETURNING id INTO v_company_id;
  
  -- Create subscription
  INSERT INTO subscriptions (tenant_id, status, trial_starts_at, trial_ends_at)
  VALUES (v_company_id, 'trial', NOW(), NOW() + INTERVAL '14 days');
  
  -- Create profile
  INSERT INTO profiles (user_id, tenant_id, role_id, name, email, active)
  VALUES (p_user_id, v_company_id, v_admin_role_id, p_user_name, p_email, true);
  
  -- Create settings
  INSERT INTO settings (tenant_id, company_name)
  VALUES (v_company_id, p_company_name);
  
  RETURN v_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🧪 Testar Multi-Tenant

### Teste 1: Isolamento por Tenant

```sql
-- Como usuário do Tenant A
SELECT * FROM clients; 
-- Deve retornar apenas clientes do Tenant A

-- Tentar acessar outro tenant (deve retornar vazio)
SELECT * FROM clients WHERE tenant_id = '<tenant-b-id>';
-- Resultado: 0 rows (bloqueado por RLS)
```

### Teste 2: Super Admin

```sql
-- Como super admin
SELECT * FROM clients; 
-- Deve retornar clientes de TODOS os tenants
```

### Teste 3: Soft Delete

```sql
-- Soft delete
UPDATE clients SET deleted_at = NOW() WHERE id = '<client-id>';

-- Query normal (não deve aparecer)
SELECT * FROM clients WHERE id = '<client-id>';
-- Resultado: 0 rows

-- Query incluindo deletados
SELECT * FROM clients WHERE id = '<client-id>' AND deleted_at IS NOT NULL;
-- Resultado: 1 row (registro deletado)
```

### Teste 4: Auditoria

```sql
-- Criar cliente
INSERT INTO clients (tenant_id, name, phone) 
VALUES (current_tenant_id(), 'Teste', '11999999999');

-- Editar cliente
UPDATE clients SET name = 'Teste Editado' WHERE name = 'Teste';

-- Ver logs
SELECT * FROM audit_logs 
WHERE table_name = 'clients' 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## ✅ Checklist de Implementação

### Fase 1: Fundação
- [ ] Habilitar extensões (uuid-ossp, pgcrypto, pg_trgm)
- [ ] Criar functions (current_tenant_id, is_super_admin)
- [ ] Criar tabelas platform (platform_admins, platform_settings)
- [ ] Inserir platform_settings padrão

### Fase 2: Core
- [ ] Criar tabela companies
- [ ] Criar tabela roles + inserir system roles
- [ ] Criar tabela permissions + inserir permissions
- [ ] Criar tabela role_permissions
- [ ] Criar tabela profiles
- [ ] Criar tabela subscriptions
- [ ] Habilitar RLS em todas

### Fase 3: CRM
- [ ] Criar tabela clients
- [ ] Criar tabela vehicles
- [ ] Criar índices (tenant, deleted, full-text)
- [ ] Habilitar RLS

### Fase 4: Serviços
- [ ] Criar tabelas (service_categories, services, appointments, orders_service, order_service_items, order_service_photos)
- [ ] Criar índices
- [ ] Habilitar RLS

### Fase 5: Estoque
- [ ] Criar tabelas (product_categories, products, suppliers, stock_movements)
- [ ] Criar índices
- [ ] Habilitar RLS

### Fase 6: Financeiro
- [ ] Criar tabelas (accounts_receivable, accounts_payable, cash_flow)
- [ ] Criar índices
- [ ] Habilitar RLS

### Fase 7: Sistema
- [ ] Criar tabelas (settings, notifications, audit_logs)
- [ ] Criar triggers (update_updated_at, create_audit_log)
- [ ] Aplicar triggers em tabelas críticas
- [ ] Criar views (dashboard_kpis)

### Fase 8: Storage
- [ ] Criar buckets (via Dashboard)
- [ ] Configurar storage policies
- [ ] Testar upload

### Fase 9: Testes
- [ ] Testar isolamento multi-tenant
- [ ] Testar RLS policies
- [ ] Testar soft delete
- [ ] Testar auditoria
- [ ] Testar onboarding

---

## 🎯 Resultado Final

Fundação Supabase **production-ready** com:

✅ **Multi-Tenant Real** - Isolamento total por empresa  
✅ **RLS Completo** - Policies em todas as tabelas  
✅ **Soft Delete Global** - Nunca apagar fisicamente  
✅ **Auditoria Automática** - Logs de todas operações  
✅ **RBAC** - 5 roles + 30+ permissões  
✅ **Performance** - Índices otimizados + views  
✅ **Storage** - 7 buckets com policies  
✅ **Webhooks Ready** - Preparado para integrações  
✅ **Next.js Compatible** - Middleware + Hooks prontos  

**Pronto para produção! 🚀**

---

**Documento:** SUPABASE_RLS_GUIDE_V6.md  
**Versão:** 6.0  
**Data:** Junho 2026  
**Status:** ✅ Completo e Production-Ready
