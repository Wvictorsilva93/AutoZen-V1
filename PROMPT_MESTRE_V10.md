# 🚀 AutoZen V10 - Prompt Mestre ANTIGRAVITY

## 📌 Informações do Documento

| Campo | Valor |
|-------|-------|
| **Versão** | 10.0 |
| **Data** | Junho 2026 |
| **Status** | ✅ Production-Ready |
| **Tipo** | Prompt Mestre para Desenvolvimento |
| **Nome** | ANTIGRAVITY |

---

## 🎯 Como Usar Este Prompt

### Para Desenvolvedores
Copie todo o conteúdo abaixo e cole em:
- Claude (Anthropic)
- ChatGPT (OpenAI)
- Cursor AI
- Windsurf
- Qualquer outra ferramenta de IA para desenvolvimento

### Para Product Owners
Use este prompt como especificação completa para passar para a equipe de desenvolvimento.

---

## 📋 PROMPT MESTRE ANTIGRAVITY

```markdown
# CONTEXTO

Você é um **Arquiteto de Software Sênior**, **Product Designer Sênior**, **Especialista em SaaS Multi-Tenant** e **Desenvolvedor Full-Stack** com expertise avançada em:

## Tecnologias Core
- Next.js 16+ (App Router)
- React 19+ (Server Components)
- TypeScript 5.3+ (Strict Mode)
- TailwindCSS 4+
- Shadcn/UI
- Node.js 22+
- PHP 8.4

## Backend & Database
- Supabase (BaaS completo)
- PostgreSQL (Database)
- Supabase Auth (Autenticação)
- Supabase Storage (Arquivos)

## Deploy & Infrastructure
- Docker
- Nginx
- VPS Hostinger
- SSL/HTTPS

---

# MISSÃO

Construir o **AutoZen** - um SaaS Multi-Tenant **premium e profissional** para gestão de empresas de estética automotiva, seguindo **rigorosamente** as especificações abaixo.

---

# SOBRE O PRODUTO

## Identificação
**Nome:** AutoZen  
**Slogan:** "Tranquilidade e eficiência na gestão do seu negócio."  
**Categoria:** Micro SaaS Multi-Tenant (B2B)
  
**Segmento:** Estética Automotiva (Lava Jato, Detailing, Polimento, Vitrificação, Higienização, Envelopamento)

## Objetivo Principal
Criar uma plataforma completa para gerenciamento de:
- ✅ Clientes
- ✅ Veículos
- ✅ Agendamentos
- ✅ Ordens de Serviço
- ✅ Financeiro (Contas a Receber/Pagar, Fluxo de Caixa)
- ✅ Estoque (fase posterior)
- ✅ Relatórios

---

# STACK TECNOLÓGICA OBRIGATÓRIA

## Frontend
```json
{
  "framework": "Next.js 16+",
  "library": "React 19+",
  "language": "TypeScript 5.3+",
  "styling": "TailwindCSS 4+",
  "components": "Shadcn/UI",
  "animations": "Framer Motion",
  "state": "Zustand",
  "forms": "React Hook Form",
  "validation": "Zod",
  "tables": "TanStack Table"
}
```

## Backend
```json
{
  "runtime": "Node.js 22+",
  "routes": "Next.js Route Handlers",
  "actions": "Server Actions",
  "database": "PostgreSQL (Supabase)",
  "auth": "Supabase Auth",
  "storage": "Supabase Storage"
}
```

## Infrastructure
```json
{
  "containerization": "Docker",
  "webserver": "Nginx",
  "hosting": "VPS Hostinger",
  "ssl": "Let's Encrypt"
}
```

---

# DESIGN SYSTEM

## Inspiração Visual

Inspirado em produtos premium:
- ✅ **Stripe** - Elegância e simplicidade
- ✅ **Linear** - Velocidade e UX impecável
- ✅ **Notion** - Interface intuitiva
- ✅ **Vercel** - Design moderno e profissional

## Características Visuais
- ✅ **Premium** - Design de alta qualidade
- ✅ **Dark Mode** - Padrão (light mode futuro)
- ✅ **Glassmorphism** - Efeito de vidro
- ✅ **Glow Azul** - Destaques sutis
- ✅ **Minimalista** - Clean e organizado
- ✅ **Enterprise** - Profissional e confiável

## Paleta de Cores

```css
/* Background */
--background: #0A0F1C;

/* Cards e Containers */
--card: #151D2F;

/* Azul Principal */
--primary: #2563EB;

/* Azul Glow */
--primary-glow: #3B82F6;

/* Texto */
--foreground: #FFFFFF;

/* Texto Secundário */
--muted-foreground: #94A3B8;

/* Bordas */
--border: rgba(255, 255, 255, 0.1);
```

---

# EXPERIÊNCIA DO USUÁRIO

## Tela Inicial
**NÃO criar Landing Page.**  
Abrir **diretamente na autenticação**.

## Autenticação

### Login (Tabs)
**Tab 1: Entrar**
- Email
- Senha
- Link "Esqueci minha senha"

**Tab 2: Criar Empresa**
- Nome da Empresa
- Nome do Responsável
- WhatsApp
- Email
- Senha
- Confirmar Senha

### Fluxo de Onboarding
```
1. Criar usuário (Supabase Auth)
   ↓
2. Criar empresa (companies)
   ↓
3. Criar profile (profiles) com tenant_id + role admin
   ↓

4. Criar assinatura trial (subscriptions)
   ↓
5. Login automático
   ↓
6. Redirect para /dashboard
```

---

# ARQUITETURA MULTI-TENANT

## Conceito Fundamental
**OBRIGATÓRIO:** Cada empresa possui dados **completamente isolados**.

## Estrutura
Toda tabela operacional deve ter:
- ✅ `tenant_id UUID REFERENCES companies NOT NULL`
- ✅ Row Level Security (RLS) ativo
- ✅ Policies baseadas em `current_tenant_id()`

## Helper Function
```sql
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id 
  FROM profiles 
  WHERE user_id = auth.uid()
$$ LANGUAGE SQL STABLE;
```

## RLS Policy Template
```sql
-- Exemplo para tabela clients
CREATE POLICY "Tenant isolation"
  ON clients
  FOR ALL
  USING (tenant_id = current_tenant_id());
```

---

# NÍVEIS DE ACESSO (RBAC)

## Roles Disponíveis
1. **super_admin** - Acesso global à plataforma
2. **admin** - Admin da empresa (todas permissões)
3. **gerente** - Gerente operacional
4. **atendente** - Atendente/Recepcionista
5. **operador** - Operador de serviços

## Permissões (Exemplos)
```typescript
// 30+ permissões definidas
const PERMISSIONS = {
  'dashboard.view',
  'clients.view',
  'clients.create',
  'clients.edit',
  'clients.delete',
  'vehicles.view',
  'vehicles.create',
  // ... etc
};
```

## Verificação de Permissão
```typescript
// Middleware ou helper
async function hasPermission(permission: string): Promise<boolean> {
  // Verificar role_permissions
  // Super admin sempre retorna true
}
```

---

# MÓDULOS MVP

## 1. Dashboard

### KPIs Principais

- Faturamento do mês
- Total de clientes
- Total de veículos
- OS abertas
- Agendamentos hoje

### Gráficos
- Receita dos últimos 6 meses (Line Chart)
- Serviços mais vendidos (Bar Chart)
- Status das OS (Pie Chart)

### Listas
- Agendamentos do dia
- OS recentes
- Contas a vencer

---

## 2. Clientes

### CRUD Completo
- ✅ **Criar** - Formulário completo
- ✅ **Listar** - DataTable com filtros
- ✅ **Editar** - Formulário preenchido
- ✅ **Arquivar** - Soft delete

### Campos
```typescript
interface Client {
  id: string;
  tenant_id: string;
  name: string;
  cpf_cnpj?: string;
  phone: string;
  email?: string;
  birth_date?: Date;
  zipcode?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  notes?: string;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

### Funcionalidades
- ✅ Pesquisa (nome, telefone, email)
- ✅ Filtros
- ✅ Histórico de serviços
- ✅ Lista de veículos vinculados

---

## 3. Veículos

### CRUD Completo
Similar aos clientes

### Campos
```typescript
interface Vehicle {
  id: string;
  tenant_id: string;
  client_id: string; // FK → clients
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuel: 'gasoline' | 'ethanol' | 'diesel' | 'flex' | 'electric' | 'hybrid';
  chassis?: string;
  km?: number;
  notes?: string;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

### Relacionamento
- ✅ Vínculo com cliente
- ✅ Histórico completo de serviços
- ✅ Histórico de agendamentos

---

## 4. Agendamentos

### Funcionalidades

- ✅ Criar agendamento
- ✅ Editar agendamento
- ✅ Cancelar agendamento
- ✅ Visualização em lista/calendário

### Campos
```typescript
interface Appointment {
  id: string;
  tenant_id: string;
  client_id: string;
  vehicle_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  service_description?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
```

---

## 5. Ordens de Serviço (Core do Produto)

### Funcionalidades
- ✅ **Criar OS**
  - Selecionar cliente + veículo
  - Adicionar múltiplos serviços
  - Calcular subtotal, desconto, total
  - KM entrada
  
- ✅ **Editar OS**
  - Adicionar/remover serviços
  - Atualizar valores
  
- ✅ **Finalizar OS**
  - Mudar status
  - KM saída
  
- ✅ **Exportar PDF**
  - Logo da empresa
  - Dados cliente/veículo
  - Lista de serviços
  - Totais

### Campos
```typescript
interface OrderService {
  id: string;
  tenant_id: string;
  order_number: number; // Sequencial por tenant
  client_id: string;
  vehicle_id: string;
  employee_id?: string;
  km_in?: number;
  km_out?: number;
  subtotal: number;
  discount: number;
  total: number;
  status: 'open' | 'in_progress' | 'finished' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

interface OrderServiceItem {
  id: string;
  order_id: string;
  service_id: string;
  quantity: number;
  unit_price: number;
  total: number;
}
```

---

## 6. Financeiro

### Contas a Receber

- ✅ Cadastrar conta
- ✅ Vínculo com OS (auto-create ao finalizar)
- ✅ Baixar (marcar como pago)
- ✅ Filtros (status, período)

### Contas a Pagar
- ✅ Cadastrar conta
- ✅ Baixar
- ✅ Filtros

### Fluxo de Caixa
- ✅ Entradas (recebimentos)
- ✅ Saídas (pagamentos)
- ✅ Saldo
- ✅ Filtro por período

---

## 7. Configurações

### Dados da Empresa
- Nome fantasia
- Razão social
- CNPJ
- Telefone, Email, WhatsApp
- Endereço
- Logo (upload)

### Usuários
- Listar usuários da empresa
- Adicionar usuário
- Editar role
- Desativar usuário

### Assinatura
- Plano atual
- Status
- Data de vencimento
- Histórico de pagamentos

---

# DATABASE SCHEMA

## Tabelas Principais

### Platform Tables (Não tem tenant_id)

```sql
-- Companies (Empresas)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  legal_name TEXT,
  cnpj TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  logo_url TEXT,
  zipcode TEXT,
  street TEXT,
  number TEXT,
  district TEXT,
  city TEXT,
  state TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (Usuários)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  tenant_id UUID REFERENCES companies NOT NULL,
  name TEXT NOT NULL,
  role_id UUID REFERENCES roles NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  level INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role Permissions
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles NOT NULL,
  permission_id UUID REFERENCES permissions NOT NULL,
  PRIMARY KEY (role_id, permission_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  plan TEXT DEFAULT 'autozen',
  status TEXT DEFAULT 'trial',
  amount DECIMAL(10,2) DEFAULT 97.00,
  trial_ends_at DATE,
  current_period_start DATE,
  current_period_end DATE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Operational Tables (Com tenant_id)

```sql
-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
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
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES profiles,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  plate TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT,
  fuel TEXT,
  chassis TEXT,
  km INTEGER,
  notes TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  default_price DECIMAL(10,2),
  estimated_time INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  vehicle_id UUID REFERENCES vehicles NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  service_description TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Service
CREATE TABLE orders_service (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  order_number INTEGER NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  vehicle_id UUID REFERENCES vehicles NOT NULL,
  employee_id UUID REFERENCES profiles,
  km_in INTEGER,
  km_out INTEGER,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Service Items
CREATE TABLE order_service_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders_service NOT NULL,
  service_id UUID REFERENCES services NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Accounts Receivable
CREATE TABLE accounts_receivable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  client_id UUID REFERENCES clients,
  order_id UUID REFERENCES orders_service,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts Payable  
CREATE TABLE accounts_payable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  supplier_name TEXT,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies,
  user_id UUID REFERENCES profiles NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Índices Essenciais

```sql
-- Tenant isolation indexes (CRÍTICO para performance)
CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_orders_tenant ON orders_service(tenant_id);
CREATE INDEX idx_accounts_rec_tenant ON accounts_receivable(tenant_id);

-- Search indexes
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_clients_name ON clients(name);

-- Foreign key indexes
CREATE INDEX idx_vehicles_client ON vehicles(client_id);
CREATE INDEX idx_orders_client ON orders_service(client_id);
```

---

# SEGURANÇA

## Row Level Security (RLS)

**OBRIGATÓRIO em TODAS as tabelas operacionais:**

```sql
-- Ativar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_service ENABLE ROW LEVEL SECURITY;
-- ... todas as tabelas operacionais

-- Policy padrão
CREATE POLICY "Tenant isolation"
  ON clients
  FOR ALL
  USING (tenant_id = current_tenant_id());
```

## Middleware de Segurança

### 1. Auth Middleware
```typescript
// Verifica sessão ativa
if (!session) redirect('/login');
```

### 2. Tenant Middleware
```typescript
// Verifica tenant_id válido
const tenantId = await getCurrentTenantId();
if (!tenantId) redirect('/onboarding');
```

### 3. Subscription Middleware
```typescript
// Verifica assinatura ativa
const sub = await getSubscription(tenantId);
if (sub.status !== 'active' && sub.status !== 'trial') {
  redirect('/billing');
}
```

### 4. Permission Middleware
```typescript
// Verifica permissão específica
const allowed = await hasPermission('clients.create');
if (!allowed) redirect('/unauthorized');
```

## Soft Delete

**SEMPRE usar soft delete, nunca delete físico:**

```typescript
// Soft delete
await supabase
  .from('clients')
  .update({
    deleted_at: new Date().toISOString(),
    deleted_by: userId,
  })
  .eq('id', clientId);

// Queries sempre filtrar deleted_at IS NULL
.is('deleted_at', null)
```

## Auditoria

Registrar ações críticas:
- CREATE, UPDATE, DELETE
- LOGIN, LOGOUT
- Mudanças financeiras
- Mudanças de permissões

---

# STORAGE (Supabase)

## Buckets

```typescript
const BUCKETS = {
  companies: 'companies',      // Logos empresas
  avatars: 'avatars',          // Avatares usuários
  vehicles: 'vehicles',        // Fotos veículos
  osBefore: 'os-before',       // Fotos OS antes
  osDuring: 'os-during',       // Fotos OS durante
  osAfter: 'os-after',         // Fotos OS depois
  documents: 'documents',      // Documentos
};
```

## Estrutura de Pastas

```
{bucket}/{tenant_id}/{entity_id}/file.ext

Exemplo:
companies/abc123/logo.png
vehicles/abc123/xyz789/photo1.jpg
os-before/abc123/order456/before1.jpg
```

## Policies de Storage

```sql
-- Apenas arquivos do próprio tenant
CREATE POLICY "Tenant files only"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'vehicles' AND (storage.foldername(name))[1] = current_tenant_id()::text);
```

---

# ASSINATURA

## Plano Único

**Nome:** AutoZen  
**Valor:** R$ 97,00/mês  
**Trial:** 14 dias grátis  
**Recursos:** TUDO ilimitado

## Status
- `trial` - Trial de 14 dias
- `active` - Pagando normalmente
- `past_due` - Pagamento atrasado
- `suspended` - Suspensa por falta de pagamento
- `cancelled` - Cancelada pelo cliente

## Verificação

```typescript
// No middleware
const subscription = await getSubscription(tenantId);

if (subscription.status === 'past_due' || subscription.status === 'cancelled') {
  // Bloquear acesso
  redirect('/billing');
}

// Trial expirando
if (subscription.status === 'trial') {
  const daysLeft = daysBetween(now, subscription.trial_ends_at);
  if (daysLeft <= 3) {
    showBanner(`Trial expira em ${daysLeft} dias`);
  }
}
```

---

# RESPONSIVIDADE

## Breakpoints (TailwindCSS)

```css
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // XL desktop
```

## Prioridades
1. **Desktop First** - Desenvolver desktop primeiro
2. **Tablet** - Adaptar para tablets
3. **Mobile** - Adaptar para mobile (funcional mas simplificado)

## Sidebar Responsivo
- Desktop: Sidebar fixa
- Tablet/Mobile: Sidebar colapsável (hamburguer)

---

# PERFORMANCE

## Otimizações Obrigatórias

### 1. Server Components (Padrão)
```typescript
// Usar Server Components por padrão
// Usar 'use client' apenas quando necessário
export default async function Page() {
  const data = await fetchData(); // Server-side
  return <Component data={data} />;
}
```

### 2. Lazy Loading
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

### 3. Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // Para LCP
/>
```

### 4. Streaming
```typescript
// App Router streaming automático
export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DataComponent />
    </Suspense>
  );
}
```

### 5. Database Queries
- ✅ Usar `.select()` com campos específicos
- ✅ Usar índices
- ✅ Evitar N+1 queries
- ✅ Usar joins quando apropriado

---

# ESTRUTURA DE CÓDIGO

## Estrutura de Pastas

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── clientes/
│   │   ├── veiculos/
│   │   ├── agendamentos/
│   │   ├── ordens-servico/
│   │   ├── financeiro/
│   │   └── configuracoes/
│   ├── api/
│   │   └── v1/
│   └── layout.tsx
├── components/
│   ├── ui/          # Shadcn components
│   └── layout/      # Header, Sidebar, etc
├── features/
│   ├── auth/
│   ├── clients/
│   ├── vehicles/
│   └── orders/
├── lib/
│   ├── supabase/
│   ├── auth/
│   └── utils.ts
├── types/
├── validators/      # Zod schemas
├── constants/
└── config/
```

## Padrão de Feature

```
features/clients/
├── components/
│   ├── client-form.tsx
│   ├── client-table.tsx
│   └── client-card.tsx
├── hooks/
│   └── use-clients.ts
├── services/
│   └── client.service.ts
├── repositories/
│   └── client.repository.ts
├── schemas/
│   └── client.schema.ts
├── types/
│   └── client.types.ts
└── actions/
    ├── create-client.ts
    └── update-client.ts
```

---

# QUALIDADE DE CÓDIGO

## TypeScript
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## ESLint + Prettier
- ✅ Configurar ESLint
- ✅ Configurar Prettier
- ✅ Lint antes de commit

## Princípios
- ✅ **SOLID** - Single Responsibility, Open/Closed, etc
- ✅ **DRY** - Don't Repeat Yourself
- ✅ **KISS** - Keep It Simple, Stupid
- ✅ **Clean Architecture** - Camadas bem definidas
- ✅ **Componentização** - Components reutilizáveis

---

# VARIÁVEIS DE AMBIENTE

## Supabase (Fornecidas)

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://rpakyjmdijhmpqsnnjke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYWt5am1kaWpobXBxc25uamtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODcyMDQsImV4cCI6MjA5NTA2MzIwNH0.HrP5BTGkIgjgKQRnxGnuTh9tJmIsCVtKtPSDhtL39sA

# Service Role (usar apenas server-side)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYWt5am1kaWpobXBxc25uamtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ4NzIwNCwiZXhwIjoyMDk1MDYzMjA0fQ.tgE4L1MehD1nk6_szEAbj3uzzwvz9nik3lbHj2iAH_g
```

---

# RESULTADO ESPERADO

Gerar uma aplicação SaaS **profissional e production-ready** chamada **AutoZen** com:

✅ **Qualidade Premium** - Design inspirado em Stripe, Linear, Vercel  
✅ **Multi-Tenant Real** - Isolamento total de dados  
✅ **Segurança Enterprise** - RLS, Auth, Permissions, Audit  
✅ **Performance Otimizada** - < 2s carregamento, Server Components  
✅ **Código Limpo** - TypeScript Strict, SOLID, Clean Architecture  
✅ **Escalável** - Preparado para crescimento  
✅ **Manutenível** - Estrutura organizada, documentado  
✅ **Responsivo** - Desktop, Tablet, Mobile  
✅ **Comercializável** - Pronto para vender (R$ 97/mês)  

O sistema deve:
- ✅ Parecer um produto **premium**
- ✅ Ser **extremamente rápido**
- ✅ Ter **UX impecável**
- ✅ Ser **100% seguro** (RLS em tudo)
- ✅ Estar pronto para **produção**

---

**PRIORIDADES:**
1. **Qualidade** sobre quantidade
2. **Segurança** (multi-tenant) é crítica
3. **Performance** é essencial
4. **UX/UI** deve ser impecável
5. **Código** deve ser escalável e manutenível

**Foco total no segmento de estética automotiva com gestão completa de clientes, veículos, agendamentos, ordens de serviço e financeiro.**
```

---

## 📊 Como Usar

### 1. Copiar o Prompt
Copie todo o conteúdo entre as aspas triplas acima.

### 2. Colar na IA
Cole em Claude, ChatGPT, Cursor, ou qualquer ferramenta de IA.

### 3. Começar Desenvolvimento
A IA seguirá as especificações para gerar o código do AutoZen.

### 4. Iteração
Peça ajustes específicos conforme necessário.

---

**Documento:** PROMPT_MESTRE_V10.md  
**Versão:** 10.0  
**Data:** Junho 2026  
**Status:** ✅ Production-Ready  
**Nome:** ANTIGRAVITY

**Prompt mestre completo e profissional para gerar o AutoZen! 🚀**
