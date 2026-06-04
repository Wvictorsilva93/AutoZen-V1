# 🏗️ AutoZen - Arquitetura Técnica V4

## 📋 Stack Tecnológica Oficial

### Frontend

```json
{
  "framework": "Next.js 16+",
  "library": "React 19+",
  "language": "TypeScript 5.3+",
  "styling": "TailwindCSS 4+",
  "components": "Shadcn/UI",
  "animation": "Framer Motion 11+",
  "tables": "TanStack Table",
  "forms": "React Hook Form",
  "validation": "Zod",
  "icons": "Lucide React"
}
```

### Backend

```json
{
  "runtime": "Node.js 22",
  "api": "Next.js Route Handlers",
  "integrations": "PHP 8.4 (Hostinger específico)",
  "baas": "Supabase"
}
```

### Database

```json
{
  "database": "PostgreSQL 15+",
  "hosting": "Supabase",
  "orm": "Supabase Client",
  "migrations": "Supabase Migrations"
}
```

### Infraestrutura

```json
{
  "hosting": "Hostinger VPS",
  "containerization": "Docker",
  "proxy": "Nginx Reverse Proxy",
  "ssl": "Let's Encrypt",
  "cdn": "Cloudflare (opcional)"
}
```

---

## 📁 Estrutura de Projeto (Monolito Moderno)

```
autozen/
├── apps/
│   └── web/                    # Next.js App
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── services/
│       │   ├── stores/
│       │   ├── types/
│       │   ├── validators/
│       │   └── middleware.ts
│       ├── public/
│       ├── package.json
│       └── next.config.js
│
├── packages/
│   ├── ui/                     # Componentes compartilhados
│   │   ├── components/
│   │   ├── styles/
│   │   └── package.json
│   │
│   ├── types/                  # TypeScript types
│   │   ├── index.ts
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── package.json
│   │
│   ├── utils/                  # Utilitários
│   │   ├── helpers.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── package.json
│   │
│   ├── database/               # Database schema e migrations
│   │   ├── migrations/
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── package.json
│   │
│   ├── auth/                   # Auth helpers
│   │   ├── middleware.ts
│   │   ├── permissions.ts
│   │   └── package.json
│   │
│   └── api/                    # API clients
│       ├── supabase.ts
│       ├── http.ts
│       └── package.json
│
├── docs/                       # Documentação
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   └── DEPLOYMENT.md
│
├── scripts/                    # Scripts úteis
│   ├── setup.sh
│   ├── backup.sh
│   ├── migrate.sh
│   └── seed.sh
│
├── docker/                     # Docker configs
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── .env.example
├── .gitignore
├── package.json
├── turbo.json                  # Turborepo config
└── README.md
```

---

## 🗂️ Estrutura do App Next.js

### Diretório `src/app/`

```
src/app/
├── (auth)/                     # Grupo de rotas públicas
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
│
├── (app)/                      # Grupo de rotas protegidas
│   ├── layout.tsx             # Layout com Sidebar + Header
│   ├── dashboard/
│   │   └── page.tsx
│   ├── clientes/
│   │   ├── page.tsx
│   │   ├── novo/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── editar/
│   │           └── page.tsx
│   ├── veiculos/
│   ├── agendamentos/
│   ├── ordens-servico/
│   ├── servicos/
│   ├── estoque/
│   ├── financeiro/
│   ├── equipe/
│   ├── relatorios/
│   └── configuracoes/
│
├── (super-admin)/              # Grupo de rotas super admin
│   ├── layout.tsx
│   ├── dashboard/
│   ├── empresas/
│   └── metricas/
│
├── api/                        # API Routes
│   └── v1/
│       ├── clients/
│       │   └── route.ts
│       ├── vehicles/
│       │   └── route.ts
│       ├── work-orders/
│       │   └── route.ts
│       └── financial/
│           └── route.ts
│
├── layout.tsx                  # Root layout
├── page.tsx                    # Home (redirect)
├── loading.tsx                 # Loading global
├── error.tsx                   # Error global
└── not-found.tsx              # 404
```

### Diretório `src/components/`

```
src/components/
├── ui/                         # Componentes base
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── alert.tsx
│   └── ...
│
├── layout/                     # Layout components
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   └── breadcrumbs.tsx
│
├── forms/                      # Form components
│   ├── cliente-form.tsx
│   ├── veiculo-form.tsx
│   ├── os-form.tsx
│   └── ...
│
├── tables/                     # Table components
│   ├── clientes-table.tsx
│   ├── veiculos-table.tsx
│   └── ...
│
├── charts/                     # Chart components
│   ├── revenue-chart.tsx
│   ├── services-chart.tsx
│   └── ...
│
└── shared/                     # Shared components
    ├── loading-spinner.tsx
    ├── empty-state.tsx
    ├── error-boundary.tsx
    └── ...
```

---

## 🔐 Autenticação com Supabase

### Setup Inicial

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export const createServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
};
```

### Middleware de Autenticação

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar sessão
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Se não tem sessão e tenta acessar rota protegida
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se tem sessão
  if (session) {
    // Buscar profile do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, companies(*), subscriptions(*)')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Verificar se empresa está ativa
    if (!profile.companies.active) {
      return NextResponse.redirect(new URL('/suspended', req.url));
    }

    // Verificar assinatura
    const subscription = profile.subscriptions;
    if (subscription.status === 'past_due' || subscription.status === 'cancelled') {
      return NextResponse.redirect(new URL('/billing', req.url));
    }

    // Se logado e tenta acessar rota pública
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## 🏢 Multi-Tenant Implementation

### Database Schema

```sql
-- Tabela de empresas (tenants)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados
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

-- Índices
CREATE INDEX idx_companies_cnpj ON companies(cnpj);
CREATE INDEX idx_companies_active ON companies(active);
```

### Profiles (Estende auth.users)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Dados
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

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

### Exemplo: Tabela com Multi-tenant

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Dados
  tipo TEXT NOT NULL DEFAULT 'PF',
  nome TEXT NOT NULL,
  cpf TEXT,
  cnpj TEXT,
  email TEXT,
  telefone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  
  -- Soft Delete
  deleted_at TIMESTAMP,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_cpf_per_company UNIQUE (company_id, cpf),
  CONSTRAINT unique_cnpj_per_company UNIQUE (company_id, cnpj)
);

-- Índices obrigatórios
CREATE INDEX idx_clients_company ON clients(company_id);
CREATE INDEX idx_clients_deleted ON clients(deleted_at);

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

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
```

---

## 🔑 RBAC (Role-Based Access Control)

### Roles

```typescript
// types/roles.ts
export type Role = 
  | 'super_admin'
  | 'admin'
  | 'gerente'
  | 'atendente'
  | 'operador';

export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 5,
  admin: 4,
  gerente: 3,
  atendente: 2,
  operador: 1,
};
```

### Permissions

```sql
-- Tabela de permissões
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  resource TEXT NOT NULL,      -- 'clients', 'vehicles', etc
  action TEXT NOT NULL,         -- 'create', 'read', 'update', 'delete'
  description TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Permissões por role
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  role TEXT NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(role, permission_id)
);

-- Permissões customizadas por usuário (sobrescreve role)
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id),
  granted BOOLEAN DEFAULT true,  -- true = concede, false = revoga
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, permission_id)
);
```

### Permission Check

```typescript
// lib/auth/permissions.ts
import { createServerClient } from '@/lib/supabase/server';

export async function hasPermission(
  resource: string,
  action: string
): Promise<boolean> {
  const supabase = createServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  // Buscar profile com role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!profile) return false;
  
  // Super admin tem acesso total
  if (profile.role === 'super_admin') return true;
  
  // Verificar permissão da role
  const { data: rolePermission } = await supabase
    .from('role_permissions')
    .select('permissions(*)')
    .eq('role', profile.role)
    .eq('permissions.resource', resource)
    .eq('permissions.action', action)
    .single();
  
  if (rolePermission) return true;
  
  // Verificar permissão customizada do usuário
  const { data: userPermission } = await supabase
    .from('user_permissions')
    .select('granted, permissions(*)')
    .eq('user_id', user.id)
    .eq('permissions.resource', resource)
    .eq('permissions.action', action)
    .single();
  
  return userPermission?.granted ?? false;
}
```

---

## 🗄️ Database Schema Completo

### Core Tables

```sql
-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies (Tenants)
companies

-- Users
profiles
roles
permissions
role_permissions
user_permissions
```

### CRM Tables

```sql
clients
vehicles
```

### Operational Tables

```sql
services
service_categories
appointments
work_orders
work_order_items
work_order_photos
checklists
checklist_items
```

### Inventory Tables

```sql
products
product_categories
suppliers
stock_movements
```

### Financial Tables

```sql
accounts_receivable
accounts_pagar
cash_flow
transactions
payment_methods
```

### System Tables

```sql
subscriptions
settings
notifications
audit_logs
```

---

Continua no próximo bloco...

## 🔄 Padrão UUID e Soft Delete

### UUID em Todas as Tabelas

```sql
-- NUNCA usar serial ou bigserial
-- ❌ ERRADO
CREATE TABLE clients (
  id SERIAL PRIMARY KEY
);

-- ✅ CORRETO
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);
```

### Soft Delete Global

```sql
-- Padrão para TODAS as tabelas com dados do usuário
CREATE TABLE <table_name> (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  
  -- ... campos específicos ...
  
  -- SOFT DELETE (obrigatório)
  deleted_at TIMESTAMP DEFAULT NULL,
  deleted_by UUID REFERENCES profiles(id),
  
  -- Metadata (obrigatório)
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice obrigatório
CREATE INDEX idx_<table>_deleted ON <table_name>(deleted_at);
```

### Helper Functions

```sql
-- Function para soft delete
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
  NEW.deleted_at = NOW();
  NEW.deleted_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## 📊 Sistema de Auditoria

### Tabela de Auditoria

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Tenant
  company_id UUID REFERENCES companies(id),
  
  -- User
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_name TEXT,
  
  -- Action
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
  resource TEXT NOT NULL, -- 'clients', 'work_orders', etc
  resource_id UUID,
  
  -- Data
  old_data JSONB,
  new_data JSONB,
  changes JSONB, -- Apenas campos alterados
  
  -- Request info
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_audit_company ON audit_logs(company_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

### Audit Trigger

```sql
-- Function para criar audit log automaticamente
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_action TEXT;
BEGIN
  -- Determinar ação
  IF TG_OP = 'INSERT' THEN
    v_action := 'CREATE';
    v_old_data := NULL;
    v_new_data := row_to_json(NEW)::JSONB;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_old_data := row_to_json(OLD)::JSONB;
    v_new_data := row_to_json(NEW)::JSONB;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_old_data := row_to_json(OLD)::JSONB;
    v_new_data := NULL;
  END IF;
  
  -- Inserir log
  INSERT INTO audit_logs (
    company_id,
    user_id,
    action,
    resource,
    resource_id,
    old_data,
    new_data
  ) VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    auth.uid(),
    v_action,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_old_data,
    v_new_data
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar em tabelas críticas
CREATE TRIGGER audit_clients
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_work_orders
  AFTER INSERT OR UPDATE OR DELETE ON work_orders
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_transactions
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();
```

---

## 📦 Storage (Supabase Buckets)

### Buckets Configuration

```typescript
// lib/storage/buckets.ts
export const STORAGE_BUCKETS = {
  // Logos de empresas
  COMPANY_LOGOS: 'company-logos',
  
  // Avatares de usuários
  AVATARS: 'avatars',
  
  // Fotos de veículos
  VEHICLES: 'vehicles',
  
  // Fotos de OS (antes/durante/depois)
  OS_BEFORE: 'os-before',
  OS_DURING: 'os-during',
  OS_AFTER: 'os-after',
  
  // Documentos
  DOCUMENTS: 'documents',
} as const;

// Configuração de bucket (criar via Supabase Dashboard)
export const BUCKET_CONFIG = {
  [STORAGE_BUCKETS.COMPANY_LOGOS]: {
    public: true,
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  [STORAGE_BUCKETS.AVATARS]: {
    public: true,
    fileSizeLimit: 1 * 1024 * 1024, // 1MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  [STORAGE_BUCKETS.VEHICLES]: {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  [STORAGE_BUCKETS.OS_BEFORE]: {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  [STORAGE_BUCKETS.DOCUMENTS]: {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
};
```

### Upload Helper

```typescript
// lib/storage/upload.ts
import { createClient } from '@/lib/supabase/client';

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string; path: string } | null> {
  const supabase = createClient();
  
  // Upload
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
  
  return {
    url: publicUrl,
    path: data.path,
  };
}

// Gerar path único
export function generateFilePath(
  companyId: string,
  prefix: string,
  filename: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const ext = filename.split('.').pop();
  
  return `${companyId}/${prefix}/${timestamp}-${random}.${ext}`;
}
```

---

## 💳 Sistema de Assinaturas

### Schema

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Plan
  plan_id TEXT NOT NULL DEFAULT 'autozen_unico',
  plan_name TEXT NOT NULL DEFAULT 'AutoZen Único',
  plan_price DECIMAL(10,2) NOT NULL DEFAULT 97.00,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'trial',
  -- 'trial', 'active', 'past_due', 'cancelled', 'suspended'
  
  -- Dates
  trial_starts_at TIMESTAMP DEFAULT NOW(),
  trial_ends_at TIMESTAMP DEFAULT NOW() + INTERVAL '14 days',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Payment
  payment_method TEXT, -- 'pix', 'credit_card', 'boleto'
  payment_gateway TEXT, -- 'stripe', 'mercadopago', 'asaas'
  gateway_subscription_id TEXT,
  gateway_customer_id TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Histórico de pagamentos
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  
  -- Payment
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'paid', 'failed', 'refunded'
  payment_method TEXT,
  payment_date TIMESTAMP,
  
  -- Gateway
  gateway_payment_id TEXT,
  gateway_response JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Subscription Check Middleware

```typescript
// lib/subscription/check.ts
export async function checkSubscription(companyId: string): Promise<{
  active: boolean;
  status: string;
  message?: string;
}> {
  const supabase = createServerClient();
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('company_id', companyId)
    .single();
  
  if (!subscription) {
    return {
      active: false,
      status: 'no_subscription',
      message: 'Nenhuma assinatura encontrada',
    };
  }
  
  // Trial ativo
  if (subscription.status === 'trial') {
    const trialEnd = new Date(subscription.trial_ends_at);
    const now = new Date();
    
    if (now < trialEnd) {
      return {
        active: true,
        status: 'trial',
      };
    } else {
      return {
        active: false,
        status: 'trial_expired',
        message: 'Período de teste expirado',
      };
    }
  }
  
  // Assinatura ativa
  if (subscription.status === 'active') {
    return {
      active: true,
      status: 'active',
    };
  }
  
  // Outros status
  return {
    active: false,
    status: subscription.status,
    message: 'Assinatura inativa',
  };
}
```

---

## ⚙️ Configurações por Tenant

### Schema

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Configurações gerais
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Estrutura do JSONB config:
{
  "general": {
    "company_name": "Auto Detailing XYZ",
    "logo_url": "https://...",
    "timezone": "America/Sao_Paulo",
    "language": "pt-BR"
  },
  "contact": {
    "phone": "(11) 99999-9999",
    "whatsapp": "(11) 99999-9999",
    "email": "contato@empresa.com",
    "website": "https://empresa.com"
  },
  "address": {
    "cep": "01310-100",
    "street": "Av. Paulista",
    "number": "1000",
    "complement": "Sala 10",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP"
  },
  "business_hours": {
    "monday": { "open": "08:00", "close": "18:00", "closed": false },
    "tuesday": { "open": "08:00", "close": "18:00", "closed": false },
    "wednesday": { "open": "08:00", "close": "18:00", "closed": false },
    "thursday": { "open": "08:00", "close": "18:00", "closed": false },
    "friday": { "open": "08:00", "close": "18:00", "closed": false },
    "saturday": { "open": "08:00", "close": "14:00", "closed": false },
    "sunday": { "open": null, "close": null, "closed": true }
  },
  "features": {
    "enable_appointments": true,
    "enable_inventory": true,
    "enable_financial": true,
    "enable_reports": true,
    "enable_notifications": true
  },
  "theme": {
    "primary_color": "#3b82f6",
    "logo_position": "left"
  },
  "notifications": {
    "email_notifications": true,
    "whatsapp_notifications": true,
    "sms_notifications": false
  }
}
```

### Settings Helper

```typescript
// lib/settings/get.ts
export async function getSettings(companyId: string) {
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from('settings')
    .select('config')
    .eq('company_id', companyId)
    .single();
  
  return data?.config || {};
}

export async function updateSettings(
  companyId: string,
  updates: Record<string, any>
) {
  const supabase = createServerClient();
  
  const current = await getSettings(companyId);
  const merged = { ...current, ...updates };
  
  const { error } = await supabase
    .from('settings')
    .upsert({
      company_id: companyId,
      config: merged,
    });
  
  return !error;
}
```

---

## 🚀 Cache com Redis (Fase Futura)

### Setup

```typescript
// lib/cache/redis.ts
import { Redis } from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!);
  }
  return redis;
}

// Cache wrapper
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const client = getRedisClient();
  
  // Try cache
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch
  const data = await fetcher();
  
  // Store
  await client.setex(key, ttl, JSON.stringify(data));
  
  return data;
}
```


### Cache Usage Examples

```typescript
// Dashboard KPIs
export async function getDashboardKPIs(companyId: string) {
  return cached(
    `dashboard:${companyId}`,
    async () => {
      // Fetch from database
      const supabase = createServerClient();
      // ... queries
      return kpis;
    },
    300 // 5 minutos
  );
}

// Invalidate cache
export async function invalidateCache(pattern: string) {
  const client = getRedisClient();
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(...keys);
  }
}

// Invalidar ao criar/editar
invalidateCache(`dashboard:${companyId}`);
```

---

## 🔒 Segurança

### Headers de Segurança

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self' data:;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co;
      frame-ancestors 'self';
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Password Hashing

```typescript
// lib/auth/hash.ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Rate Limiting

```typescript
// lib/security/rate-limit.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function rateLimit(
  identifier: string,
  max: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate-limit:${identifier}`;
  
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.pexpire(key, windowMs);
  }
  
  const allowed = current <= max;
  const remaining = Math.max(0, max - current);
  
  return { allowed, remaining };
}

// Uso em API Route
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  // 10 requests por minuto
  const { allowed, remaining } = await rateLimit(ip, 10, 60000);
  
  if (!allowed) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // ... rest of handler
}
```

### Input Sanitization

```typescript
// lib/security/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000); // Max length
}
```

---

## ✅ Validação com Zod

### Schemas Compartilhados

```typescript
// validators/schemas.ts
import { z } from 'zod';

// Cliente
export const ClientSchema = z.object({
  tipo: z.enum(['PF', 'PJ']),
  nome: z.string().min(3).max(100),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().min(10),
  whatsapp: z.string().min(10),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().length(2).optional(),
}).refine(
  (data) => {
    if (data.tipo === 'PF' && !data.cpf) return false;
    if (data.tipo === 'PJ' && !data.cnpj) return false;
    return true;
  },
  {
    message: 'CPF é obrigatório para Pessoa Física e CNPJ para Pessoa Jurídica',
  }
);

// Veículo
export const VehicleSchema = z.object({
  client_id: z.string().uuid(),
  placa: z.string().min(7).max(8),
  marca: z.string().min(2),
  modelo: z.string().min(2),
  ano: z.number().min(1900).max(2100),
  cor: z.string().min(2),
  km: z.number().optional(),
  chassi: z.string().optional(),
  combustivel: z.enum(['GASOLINA', 'ETANOL', 'DIESEL', 'FLEX', 'ELETRICO', 'HIBRIDO']),
});

// Ordem de Serviço
export const WorkOrderSchema = z.object({
  client_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  scheduled_date: z.string().datetime(),
  services: z.array(z.object({
    service_id: z.string().uuid(),
    quantidade: z.number().min(1),
    valor_unitario: z.number().min(0),
    desconto: z.number().min(0).max(100).optional(),
  })).min(1),
  observacoes: z.string().max(1000).optional(),
  funcionario_id: z.string().uuid(),
});

// Produto
export const ProductSchema = z.object({
  nome: z.string().min(2).max(100),
  descricao: z.string().max(500).optional(),
  codigo_barras: z.string().optional(),
  categoria_id: z.string().uuid(),
  unidade: z.enum(['UN', 'LT', 'ML', 'KG', 'G', 'CX']),
  estoque_minimo: z.number().min(0),
  estoque_atual: z.number().min(0),
  custo: z.number().min(0),
  preco_venda: z.number().min(0),
  ativo: z.boolean().default(true),
});
```

### Validação em API Routes

```typescript
// app/api/v1/clients/route.ts
import { NextResponse } from 'next/server';
import { ClientSchema } from '@/validators/schemas';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    // Parse body
    const body = await req.json();
    
    // Validate
    const validated = ClientSchema.parse(body);
    
    // Get user
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get company
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
    
    // Insert
    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...validated,
        company_id: profile.company_id,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Validação no Frontend

```typescript
// components/forms/cliente-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientSchema } from '@/validators/schemas';
import type { z } from 'zod';

type ClientFormData = z.infer<typeof ClientSchema>;

export function ClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
  });
  
  const onSubmit = async (data: ClientFormData) => {
    const res = await fetch('/api/v1/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (res.ok) {
      // Success
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <input {...register('nome')} />
      {errors.nome && <span>{errors.nome.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        Salvar
      </button>
    </form>
  );
}
```

---

## 🌐 Padrão de API REST

### Estrutura de Resposta

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
  error?: string;
  errors?: Record<string, string[]>;
}

// Helper
export function apiResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse['meta']
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function apiError(
  error: string,
  errors?: Record<string, string[]>
): ApiResponse {
  return {
    success: false,
    error,
    errors,
  };
}
```

### Endpoints Pattern

```
GET    /api/v1/clients          → List all
GET    /api/v1/clients/:id      → Get one
POST   /api/v1/clients          → Create
PUT    /api/v1/clients/:id      → Update
DELETE /api/v1/clients/:id      → Delete (soft)

Query params:
- page=1
- perPage=20
- search=termo
- orderBy=nome
- order=asc|desc
- filter[campo]=valor
```

### Pagination Helper

```typescript
// lib/api/pagination.ts
export interface PaginationParams {
  page: number;
  perPage: number;
}

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '20');
  
  return {
    page: Math.max(1, page),
    perPage: Math.min(100, Math.max(1, perPage)),
  };
}

export function calculatePagination(
  total: number,
  page: number,
  perPage: number
) {
  return {
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    from: (page - 1) * perPage,
    to: Math.min(page * perPage, total),
  };
}
```

### Generic CRUD Handler

```typescript
// lib/api/crud.ts
export async function list<T>(
  table: string,
  companyId: string,
  params: URLSearchParams
) {
  const supabase = createServerClient();
  const { page, perPage } = parsePagination(params);
  const search = params.get('search') || '';
  
  // Count
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .is('deleted_at', null);
  
  // Query
  let query = supabase
    .from(table)
    .select('*')
    .eq('company_id', companyId)
    .is('deleted_at', null)
    .range((page - 1) * perPage, page * perPage - 1);
  
  // Search
  if (search) {
    query = query.ilike('nome', `%${search}%`);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return {
    data,
    meta: calculatePagination(count || 0, page, perPage),
  };
}
```

---

## ⚡ Performance e Otimizações

### Server Components (Padrão)

```typescript
// app/(app)/clientes/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import { ClientsTable } from '@/components/tables/clients-table';

// Server Component (sem 'use client')
export default async function ClientsPage() {
  const supabase = createServerClient();
  
  // Fetch no servidor
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .is('deleted_at', null)
    .limit(20);
  
  return (
    <div>
      <h1>Clientes</h1>
      <ClientsTable data={clients} />
    </div>
  );
}
```

### Streaming SSR

```typescript
// app/(app)/dashboard/page.tsx
import { Suspense } from 'react';
import { DashboardKPIs } from '@/components/dashboard/kpis';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<Skeleton className="h-32" />}>
        <DashboardKPIs />
      </Suspense>
      
      <Suspense fallback={<Skeleton className="h-64" />}>
        <RevenueChart />
      </Suspense>
    </div>
  );
}
```

### Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    domains: [
      'your-project.supabase.co',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};

// Uso
import Image from 'next/image';

<Image
  src={vehicle.photo_url}
  alt={vehicle.modelo}
  width={400}
  height={300}
  className="rounded-lg"
  loading="lazy"
/>
```

### Code Splitting

```typescript
// Dynamic imports
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/charts/heavy-chart'),
  {
    loading: () => <Skeleton className="h-64" />,
    ssr: false,
  }
);

export function Dashboard() {
  return (
    <div>
      <HeavyChart />
    </div>
  );
}
```

### Database Indexes

```sql
-- Índices obrigatórios para performance

-- Multi-tenant
CREATE INDEX idx_clients_company ON clients(company_id);
CREATE INDEX idx_vehicles_company ON vehicles(company_id);
CREATE INDEX idx_work_orders_company ON work_orders(company_id);

-- Soft delete
CREATE INDEX idx_clients_deleted ON clients(deleted_at);
CREATE INDEX idx_vehicles_deleted ON vehicles(deleted_at);

-- Buscas frequentes
CREATE INDEX idx_clients_nome ON clients(nome);
CREATE INDEX idx_clients_telefone ON clients(telefone);
CREATE INDEX idx_vehicles_placa ON vehicles(placa);

-- Composite indexes
CREATE INDEX idx_work_orders_company_status ON work_orders(company_id, status);
CREATE INDEX idx_work_orders_company_date ON work_orders(company_id, scheduled_date);

-- Full-text search (futuro)
CREATE INDEX idx_clients_search ON clients USING gin(to_tsvector('portuguese', nome || ' ' || COALESCE(email, '')));
```

---

## 🌍 Variáveis de Ambiente

### `.env.local`

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AutoZen
NODE_ENV=development

# Supabase (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Backend) - NUNCA expor ao frontend
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (se conexão direta)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis (futuro)
REDIS_URL=redis://localhost:6379

# Webhooks
WEBHOOK_SECRET=your-webhook-secret

# Payment Gateways (futuro)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
ASAAS_API_KEY=...

# Storage
STORAGE_BUCKET=autozen-uploads

# Email (futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@autozen.com
SMTP_PASS=...

# WhatsApp (futuro)
WHATSAPP_API_URL=...
WHATSAPP_API_TOKEN=...

# Analytics (futuro)
NEXT_PUBLIC_GA_ID=G-...
```

### Validação de Env

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Public
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  
  // Private
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

---


## 🐳 Docker Setup

### Dockerfile

```dockerfile
# Dockerfile
FROM node:22-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Next.js App
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
    networks:
      - autozen-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    restart: unless-stopped
    networks:
      - autozen-network

  # Redis (futuro)
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - autozen-network

networks:
  autozen-network:
    driver: bridge

volumes:
  redis-data:
```

### nginx.conf

```nginx
# docker/nginx.conf
events {
  worker_connections 1024;
}

http {
  upstream nextjs {
    server web:3000;
  }

  # Rate limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  limit_req_zone $binary_remote_addr zone=general:10m rate=100r/s;

  # HTTP → HTTPS redirect
  server {
    listen 80;
    server_name autozen.com.br www.autozen.com.br;
    return 301 https://$server_name$request_uri;
  }

  # HTTPS
  server {
    listen 443 ssl http2;
    server_name autozen.com.br www.autozen.com.br;

    # SSL
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # API rate limiting
    location /api/ {
      limit_req zone=api burst=20 nodelay;
      proxy_pass http://nextjs;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static/ {
      proxy_pass http://nextjs;
      proxy_cache_valid 200 365d;
      add_header Cache-Control "public, immutable";
    }

    # General traffic
    location / {
      limit_req zone=general burst=50 nodelay;
      proxy_pass http://nextjs;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
```

---

## 💾 Backups

### Script de Backup Database

```bash
#!/bin/bash
# scripts/backup-db.sh

# Configurações
PROJECT_ID="your-supabase-project"
BACKUP_DIR="/backups/autozen"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup via pg_dump
PGPASSWORD=$DATABASE_PASSWORD pg_dump \
  -h db.${PROJECT_ID}.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f "${BACKUP_DIR}/autozen_${DATE}.dump"

# Comprimir
gzip "${BACKUP_DIR}/autozen_${DATE}.dump"

# Remover backups antigos
find $BACKUP_DIR -name "*.dump.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup concluído: autozen_${DATE}.dump.gz"
```

### Script de Restore

```bash
#!/bin/bash
# scripts/restore-db.sh

if [ -z "$1" ]; then
  echo "Uso: ./restore-db.sh <arquivo_backup>"
  exit 1
fi

BACKUP_FILE=$1

# Descomprimir se necessário
if [[ $BACKUP_FILE == *.gz ]]; then
  gunzip -c $BACKUP_FILE > /tmp/restore.dump
  BACKUP_FILE=/tmp/restore.dump
fi

# Restore
PGPASSWORD=$DATABASE_PASSWORD pg_restore \
  -h db.${PROJECT_ID}.supabase.co \
  -U postgres \
  -d postgres \
  --clean \
  --if-exists \
  $BACKUP_FILE

echo "Restore concluído"
```

### Backup Storage (Supabase)

```bash
#!/bin/bash
# scripts/backup-storage.sh

BUCKET="company-logos"
BACKUP_DIR="/backups/storage"
DATE=$(date +%Y%m%d_%H%M%S)

# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Backup
supabase storage download \
  --bucket $BUCKET \
  --local $BACKUP_DIR/$DATE

# Comprimir
tar -czf "${BACKUP_DIR}/storage_${DATE}.tar.gz" "${BACKUP_DIR}/${DATE}"
rm -rf "${BACKUP_DIR}/${DATE}"

echo "Backup de storage concluído"
```

### Cron para Backups Automáticos

```bash
# crontab -e

# Backup diário do banco às 3h da manhã
0 3 * * * /home/user/autozen/scripts/backup-db.sh >> /var/log/autozen-backup.log 2>&1

# Backup semanal do storage (domingo às 4h)
0 4 * * 0 /home/user/autozen/scripts/backup-storage.sh >> /var/log/autozen-storage-backup.log 2>&1
```

---

## 📊 Monitoring e Logs

### Application Logs

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});

// Uso
logger.info({ userId: '123', action: 'login' }, 'User logged in');
logger.error({ error: err.message }, 'Failed to process payment');
```

### Error Tracking (Sentry - Futuro)

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Capturar erro
try {
  // ...
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      storage: 'unknown',
    },
  };

  try {
    // Check database
    const supabase = createServerClient();
    const { error } = await supabase.from('companies').select('id').limit(1);
    
    checks.services.database = error ? 'unhealthy' : 'healthy';
    
    // Check storage
    const { data: buckets } = await supabase.storage.listBuckets();
    checks.services.storage = buckets ? 'healthy' : 'unhealthy';
    
    // Overall status
    const allHealthy = Object.values(checks.services).every(s => s === 'healthy');
    checks.status = allHealthy ? 'healthy' : 'degraded';
    
  } catch (error) {
    checks.status = 'unhealthy';
  }

  const status = checks.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(checks, { status });
}
```

---

## 🚀 Deploy na Hostinger VPS

### 1. Preparar VPS

```bash
# Conectar via SSH
ssh root@seu-vps-ip

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install -y docker-compose

# Instalar Nginx
apt install -y nginx

# Instalar Certbot (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
```

### 2. Clonar Projeto

```bash
# Criar diretório
mkdir -p /var/www/autozen
cd /var/www/autozen

# Clonar (ou upload via FTP)
git clone https://github.com/seu-usuario/autozen.git .

# Instalar dependências
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Criar .env.production
cp .env.example .env.production

# Editar com dados reais
nano .env.production
```

### 4. Build e Deploy

```bash
# Build
npm run build

# Ou via Docker
docker-compose up -d --build
```

### 5. Configurar Nginx

```bash
# Criar arquivo de configuração
nano /etc/nginx/sites-available/autozen

# Conteúdo (ver nginx.conf acima)

# Ativar site
ln -s /etc/nginx/sites-available/autozen /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Recarregar Nginx
systemctl reload nginx
```

### 6. Certificado SSL

```bash
# Gerar certificado Let's Encrypt
certbot --nginx -d autozen.com.br -d www.autozen.com.br

# Renovação automática (já vem configurado)
certbot renew --dry-run
```

### 7. Process Manager (PM2)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "autozen" -- start

# Salvar configuração
pm2 save

# Iniciar no boot
pm2 startup
```

### 8. Firewall

```bash
# Configurar UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 🔧 Scripts Úteis

### setup.sh

```bash
#!/bin/bash
# scripts/setup.sh

echo "🚀 Setup AutoZen"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar .env.local
if [ ! -f .env.local ]; then
  echo "📝 Criando .env.local..."
  cp .env.example .env.local
  echo "⚠️  Configure as variáveis em .env.local"
fi

# Setup Supabase (se tiver CLI)
if command -v supabase &> /dev/null; then
  echo "🗄️  Iniciando Supabase..."
  supabase start
fi

echo "✅ Setup concluído!"
echo "Execute 'npm run dev' para iniciar"
```

### migrate.sh

```bash
#!/bin/bash
# scripts/migrate.sh

echo "🔄 Executando migrations..."

# Via Supabase CLI
if command -v supabase &> /dev/null; then
  supabase db push
else
  echo "⚠️  Supabase CLI não encontrado"
  echo "Execute manualmente as migrations em packages/database/migrations/"
fi

echo "✅ Migrations concluídas"
```

### seed.sh

```bash
#!/bin/bash
# scripts/seed.sh

echo "🌱 Populando banco de dados..."

# Executar seed.sql
PGPASSWORD=$DATABASE_PASSWORD psql \
  -h db.$PROJECT_ID.supabase.co \
  -U postgres \
  -d postgres \
  -f packages/database/seed.sql

echo "✅ Seed concluído"
```

---

## 📈 Roadmap Técnico

### Fase 1: MVP (Meses 1-2)
- ✅ Setup inicial do projeto
- ✅ Autenticação com Supabase
- ✅ Multi-tenant básico
- ✅ CRUD de Clientes
- ✅ CRUD de Veículos
- ✅ CRUD de Ordens de Serviço
- ✅ Dashboard básico
- ✅ Deploy inicial

### Fase 2: Core Features (Meses 3-4)
- [ ] Sistema de Agendamentos
- [ ] Módulo Financeiro completo
- [ ] Módulo de Estoque
- [ ] Relatórios básicos
- [ ] Notificações por email
- [ ] Upload de fotos nas OS

### Fase 3: Integrações (Meses 5-6)
- [ ] Integração WhatsApp
- [ ] Integração PIX
- [ ] Gateway de pagamento (Stripe/Asaas)
- [ ] Exportação de relatórios PDF/Excel
- [ ] API pública documentada

### Fase 4: Advanced Features (Meses 7-9)
- [ ] Redis cache
- [ ] Filas de processamento
- [ ] Webhooks
- [ ] NFe integração
- [ ] Mobile app (React Native/PWA)

### Fase 5: Scale & Optimize (Meses 10-12)
- [ ] CDN setup
- [ ] Advanced monitoring (Datadog/New Relic)
- [ ] Load balancing
- [ ] Database read replicas
- [ ] Edge functions
- [ ] Multi-region support

---

## 📚 Recursos e Referências

### Documentação Oficial
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs)
- [Shadcn/UI](https://ui.shadcn.com)

### Bibliotecas Utilizadas
- [Framer Motion](https://www.framer.com/motion) - Animações
- [TanStack Table](https://tanstack.com/table) - Tabelas avançadas
- [React Hook Form](https://react-hook-form.com) - Formulários
- [Zod](https://zod.dev) - Validação
- [Lucide React](https://lucide.dev) - Ícones

### Deploy e DevOps
- [Docker](https://docs.docker.com)
- [Nginx](https://nginx.org/en/docs)
- [Let's Encrypt](https://letsencrypt.org/docs)
- [PM2](https://pm2.keymetrics.io/docs)

---

## ✅ Checklist de Implementação

### Setup Inicial
- [ ] Criar projeto Next.js 16
- [ ] Configurar TypeScript
- [ ] Instalar TailwindCSS 4
- [ ] Configurar Shadcn/UI
- [ ] Setup Supabase project
- [ ] Configurar variáveis de ambiente
- [ ] Setup Git repository

### Database
- [ ] Criar tabelas core (companies, profiles, roles, permissions)
- [ ] Criar tabelas CRM (clients, vehicles)
- [ ] Criar tabelas operacionais (services, work_orders)
- [ ] Criar tabelas financeiras
- [ ] Criar tabelas de sistema (subscriptions, settings, audit_logs)
- [ ] Configurar RLS policies
- [ ] Criar índices de performance
- [ ] Criar triggers (soft_delete, updated_at, audit)

### Autenticação
- [ ] Implementar Supabase Auth
- [ ] Criar middleware de autenticação
- [ ] Criar middleware de tenant
- [ ] Implementar RBAC
- [ ] Criar sistema de permissões

### Features Core
- [ ] Dashboard
- [ ] CRUD Clientes
- [ ] CRUD Veículos
- [ ] CRUD Serviços
- [ ] CRUD Ordens de Serviço
- [ ] Agendamentos
- [ ] Estoque
- [ ] Financeiro

### Storage
- [ ] Configurar buckets Supabase
- [ ] Implementar upload de arquivos
- [ ] Implementar otimização de imagens
- [ ] Configurar CDN

### API
- [ ] Estruturar rotas /api/v1
- [ ] Implementar validação com Zod
- [ ] Implementar paginação
- [ ] Implementar rate limiting
- [ ] Documentar API

### Segurança
- [ ] Configurar headers de segurança
- [ ] Implementar CSP
- [ ] Configurar CORS
- [ ] Implementar sanitização de inputs
- [ ] Configurar logs de auditoria

### Performance
- [ ] Otimizar queries (indexes)
- [ ] Implementar caching (Redis - futuro)
- [ ] Configurar image optimization
- [ ] Implementar code splitting
- [ ] Setup lazy loading

### Deploy
- [ ] Configurar Docker
- [ ] Configurar Nginx
- [ ] Setup SSL (Let's Encrypt)
- [ ] Configurar backups automáticos
- [ ] Setup monitoring
- [ ] Configurar CI/CD

### Testes (Futuro)
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Load tests

---

## 🎯 Conclusão

Este documento apresenta a **arquitetura técnica completa** do AutoZen, um SaaS multi-tenant enterprise-ready para gestão de estética automotiva.

### Principais Destaques

✅ **Stack Moderna**: Next.js 16, React 19, TypeScript, Supabase, PostgreSQL  
✅ **Multi-Tenant**: Isolamento total de dados via `company_id`  
✅ **RBAC**: 5 níveis de acesso com permissões granulares  
✅ **Segurança**: RLS, Soft Delete, Auditoria, Headers de Segurança  
✅ **Performance**: Server Components, Streaming SSR, Caching, Indexes  
✅ **Escalável**: Docker, Nginx, Redis, CDN ready  
✅ **Validação**: Zod em 3 camadas (Frontend, Backend, Database)  
✅ **APIs**: RESTful pattern com paginação e rate limiting  
✅ **Storage**: Supabase Storage com múltiplos buckets  
✅ **Backups**: Scripts automatizados para Database e Storage  
✅ **Deploy**: Pronto para Hostinger VPS com Docker + Nginx  

### Próximos Passos

1. Implementar database schema completo
2. Desenvolver autenticação e RBAC
3. Criar CRUDs principais (Clientes, Veículos, OS)
4. Implementar Dashboard com KPIs
5. Deploy inicial no VPS
6. Testes com primeiros clientes beta

**O AutoZen está pronto para escalar e atender milhares de empresas do setor automotivo! 🚀**

---

**Documento:** ARQUITETURA_TECNICA_V4.md  
**Versão:** 4.0  
**Data:** Junho 2026  
**Autor:** Equipe AutoZen  
**Status:** ✅ Completo e Pronto para Implementação

