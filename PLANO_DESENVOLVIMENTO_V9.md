# 🚀 AutoZen V9 - Plano de Desenvolvimento

## 📌 Informações do Documento

| Campo | Valor |
|-------|-------|
| **Versão** | 9.0 |
| **Data** | Junho 2026 |
| **Status** | ✅ Aprovado |
| **Tipo** | Plano de Desenvolvimento |
| **Duração** | 8-10 semanas |
| **Metodologia** | Sprints Semanais |

---

## 🎯 Objetivo

Transformar toda a documentação do AutoZen em um **plano executável** de desenvolvimento, com entregas incrementais, foco em lançamento comercial rápido e geração de receita desde as primeiras semanas.

---

## 📋 Metodologia

### Abordagem
- ✅ **Sprint Semanal** - Ciclos de 7 dias
- ✅ **Entregas Incrementais** - Features funcionais a cada sprint
- ✅ **MVP Rápido** - 8 semanas para lançamento
- ✅ **Foco Comercial** - Pronto para vender

### Duração Total
**8 a 10 semanas** (Sprint 0 → Sprint 8)

### Equipe Recomendada
- 1-2 Desenvolvedores Full-stack
- 1 Product Owner (part-time)
- 1 Designer (part-time, sprints 0-2)

---

## 📅 Visão Geral dos Sprints

```
Sprint 0  →  Sprint 1  →  Sprint 2  →  Sprint 3  →  Sprint 4

 [Setup]     [Auth]     [Clientes]  [Veículos]  [Agenda]
   1 sem      1 sem       1 sem       1 sem       1 sem
     │          │           │           │           │
     ↓          ↓           ↓           ↓           ↓
  Infra    Multi-       CRUD        CRUD      Calendario
  pronta   Tenant     Completo    Completo   Funcional

Sprint 5  →  Sprint 6  →  Sprint 7  →  Sprint 8
  [OS]      [Financ]   [Dashboard]  [Prod]
  1 sem      1 sem       1 sem       1 sem
    │          │           │           │
    ↓          ↓           ↓           ↓
  Core     Controle    Métricas   🚀 LAUNCH
  Produto  Dinheiro     Visuais    Comercial
```

---

## 🏁 Sprint 0: Setup e Fundação

### 🎯 Objetivo
Preparar toda a estrutura técnica do projeto para iniciar o desenvolvimento.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Infraestrutura Base

**Next.js 16+ Setup**
```bash
npx create-next-app@latest autozen --typescript --tailwind --app
cd autozen
```

**Configurações:**
- ✅ TypeScript 5.3+
- ✅ TailwindCSS 4+
- ✅ ESLint + Prettier
- ✅ App Router
- ✅ Configurar `next.config.ts`
- ✅ Configurar `tsconfig.json`

**Shadcn/UI**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card
```

#### 2. Supabase Setup

**Criar Projeto:**

- ✅ Criar conta no Supabase
- ✅ Criar projeto "autozen-prod"
- ✅ Configurar Auth (email/senha)
- ✅ Configurar Database (PostgreSQL)
- ✅ Configurar Storage (7 buckets)

**Instalar Dependências:**
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @supabase/auth-helpers-nextjs
```

**Variáveis de Ambiente:**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

#### 3. Estrutura de Código

**Criar Estrutura src/:**
```
src/
├── app/
│   ├── (auth)/
│   ├── (app)/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── supabase/
│   ├── auth/
│   └── utils.ts
├── types/
├── constants/
└── config/
```

#### 4. Database Schema

**Executar SQL Inicial:**
```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Platform Tables
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  tenant_id UUID REFERENCES companies NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. Middleware Global


**middleware.ts:**
```typescript
import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  
  // Rotas públicas
  const publicRoutes = ['/login', '/register'];
  const isPublic = publicRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  
  // Redirect logic
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (session && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}
```

### ✅ Critério de Aceitação Sprint 0

- [ ] Projeto Next.js rodando em `localhost:3000`
- [ ] Supabase conectado e funcionando
- [ ] Estrutura de pastas criada
- [ ] Middleware protegendo rotas
- [ ] Database schema inicial executado
- [ ] Variáveis de ambiente configuradas
- [ ] Shadcn/UI instalado e testado

### 📊 Resultado Esperado
**Base técnica 100% pronta para desenvolvimento.**

---

## 🔐 Sprint 1: Autenticação + Multi-Tenant

### 🎯 Objetivo
Permitir que empresas se cadastrem e façam login no sistema.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Tela de Login

**app/(auth)/login/page.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
    
    setLoading(false);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Login - AutoZen</h1>
        
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        
        <p>
          Não tem conta? <a href="/register">Cadastrar empresa</a>
        </p>
      </form>
    </div>
  );
}
```

#### 2. Cadastro de Empresa (Onboarding)

**app/(auth)/register/page.tsx:**
- ✅ Formulário completo:
  - Nome da empresa
  - Nome do responsável
  - WhatsApp
  - Email
  - Senha
  - Confirmar senha

**Fluxo de Cadastro:**
```
1. Criar usuário (Supabase Auth)
   ↓
2. Criar empresa (companies)
   ↓
3. Criar profile (profiles) com tenant_id
   ↓
4. Criar assinatura trial (subscriptions)
   ↓
5. Login automático
   ↓
6. Redirect para /dashboard
```

#### 3. Recuperação de Senha

**app/(auth)/forgot-password/page.tsx:**
- ✅ Input de email
- ✅ Enviar email de recuperação
- ✅ Link de reset

#### 4. Multi-Tenant Setup

**Database Tables:**
```sql
-- Adicionar RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM profiles 
  WHERE user_id = auth.uid()
$$ LANGUAGE SQL STABLE;

-- Policies
CREATE POLICY "Users see own company"
  ON companies FOR SELECT
  USING (id = current_tenant_id());
```

#### 5. Auth Provider

**src/providers/auth-provider.tsx:**

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### ✅ Critério de Aceitação Sprint 1

- [ ] Usuário consegue se cadastrar
- [ ] Empresa é criada automaticamente
- [ ] Multi-tenant funciona (tenant_id)
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Recuperação de senha funciona
- [ ] Middleware protege rotas
- [ ] RLS ativo e testado

### 📊 Resultado Esperado
**Empresas conseguem entrar no sistema de forma segura.**

---

## 👥 Sprint 2: Clientes

### 🎯 Objetivo
Gestão completa de clientes com CRUD funcional.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Database Schema

```sql
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
  deleted_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation"
  ON clients
  USING (tenant_id = current_tenant_id());

-- Indexes
CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_name ON clients(name);
```

#### 2. Types & Schema

**src/types/client.types.ts:**
```typescript
export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  cpf_cnpj?: string;
  phone: string;
  email?: string;
  birth_date?: string;
  zipcode?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type CreateClientDTO = Omit<Client, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>;
export type UpdateClientDTO = Partial<CreateClientDTO>;
```

**src/validators/client.schema.ts:**
```typescript
import { z } from 'zod';

export const ClientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional(),
  cpf_cnpj: z.string().optional(),
  // ... outros campos
});
```

#### 3. Repository

**src/repositories/client.repository.ts:**
```typescript
import { createServerClient } from '@/lib/supabase/server';
import type { Client, CreateClientDTO } from '@/types/client.types';

export class ClientRepository {
  private supabase = createServerClient();
  
  async findAll(tenantId: string): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
  
  async create(data: CreateClientDTO): Promise<Client> {
    const { data: client, error } = await this.supabase
      .from('clients')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return client;
  }
  
  async update(id: string, data: Partial<Client>): Promise<Client> {
    const { data: client, error } = await this.supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return client;
  }
  
  async softDelete(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('clients')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
      })
      .eq('id', id);
    
    if (error) throw error;
  }
}
```

#### 4. Server Actions

**src/features/clients/actions/create-client.ts:**
```typescript
'use server';

import { ClientRepository } from '@/repositories/client.repository';
import { getCurrentTenantId } from '@/lib/tenant/current-tenant';
import { ClientSchema } from '@/validators/client.schema';

export async function createClient(formData: FormData) {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) throw new Error('Tenant not found');
  
  const data = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    // ... outros campos
  };
  
  // Validar
  const validated = ClientSchema.parse(data);
  
  // Criar
  const repository = new ClientRepository();
  return repository.create({ ...validated, tenant_id: tenantId });
}
```

#### 5. UI Components

**Páginas:**
- ✅ `/clientes` - Listagem (DataTable)
- ✅ `/clientes/novo` - Cadastro
- ✅ `/clientes/[id]` - Detalhes
- ✅ `/clientes/[id]/editar` - Edição

**Componentes:**
- ✅ `ClientForm` - Formulário reutilizável
- ✅ `ClientTable` - Tabela com filtros
- ✅ `ClientCard` - Card resumido

### ✅ Critério de Aceitação Sprint 2

- [ ] Criar cliente funciona
- [ ] Listar clientes funciona
- [ ] Editar cliente funciona
- [ ] Arquivar cliente funciona (soft delete)
- [ ] Pesquisar clientes funciona
- [ ] Validação de formulário funciona
- [ ] Multi-tenant isolando dados
- [ ] Interface responsiva

### 📊 Resultado Esperado
**Base de clientes 100% funcional e segura.**

---

## 🚗 Sprint 3: Veículos

### 🎯 Objetivo
Histórico completo dos veículos vinculados aos clientes.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Database Schema

```sql
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

-- RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation"
  ON vehicles
  USING (tenant_id = current_tenant_id());

-- Indexes
CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_vehicles_client ON vehicles(client_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
```

#### 2. CRUD Completo

**Estrutura similar aos clientes:**
- Types & Schemas
- Repository
- Server Actions
- UI Components

**Páginas:**
- ✅ `/veiculos` - Listagem
- ✅ `/veiculos/novo` - Cadastro
- ✅ `/veiculos/[id]` - Detalhes + Histórico

#### 3. Relacionamento Cliente → Veículos

**Na página do cliente:**
```typescript
// Mostrar veículos do cliente
const vehicles = await getVehiclesByClient(clientId);
```

**Na página do veículo:**
```typescript
// Mostrar dados do cliente
const client = await getClientById(vehicle.client_id);
```

### ✅ Critério de Aceitação Sprint 3

- [ ] CRUD de veículos completo
- [ ] Vínculo com cliente funciona
- [ ] Histórico do veículo visível
- [ ] Pesquisa por placa funciona
- [ ] Multi-tenant isolando dados
- [ ] Interface responsiva

### 📊 Resultado Esperado
**Controle completo dos veículos com histórico.**

---

## 📅 Sprint 4: Agendamentos

### 🎯 Objetivo
Organizar a operação com agenda funcional.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Database Schema

```sql
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

-- Status: scheduled, confirmed, in_progress, completed, cancelled
```

#### 2. Funcionalidades

- ✅ **Criar agendamento**
  - Cliente
  - Veículo
  - Data/Hora
  - Serviço
  - Status

- ✅ **Visualizações**
  - Lista (hoje, semana, mês)
  - Calendário visual (futuro)

- ✅ **Ações**
  - Confirmar
  - Iniciar atendimento
  - Finalizar
  - Cancelar

#### 3. UI

**Página principal:**
- ✅ Filtros (data, status)
- ✅ Lista de agendamentos
- ✅ Badges de status
- ✅ Ações rápidas

### ✅ Critério de Aceitação Sprint 4

- [ ] Criar agendamento funciona
- [ ] Listar agendamentos funciona
- [ ] Filtrar por data funciona
- [ ] Mudar status funciona
- [ ] Cancelar agendamento funciona
- [ ] Interface responsiva

### 📊 Resultado Esperado
**Agenda operacional 100% funcional.**

---

## 📝 Sprint 5: Ordens de Serviço (OS)

### 🎯 Objetivo
Implementar o coração do AutoZen - Ordens de Serviço completas.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Database Schema

```sql
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

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders_service NOT NULL,
  service_id UUID REFERENCES services NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Status: open, in_progress, finished, delivered, cancelled
```

#### 2. Funcionalidades Core

- ✅ **Criar OS**
  - Cliente + Veículo
  - Adicionar serviços
  - Calcular total
  - KM entrada

- ✅ **Gerenciar OS**
  - Editar
  - Adicionar/remover serviços
  - Atualizar status
  - Finalizar

- ✅ **Gerar PDF**
  - Logo da empresa
  - Dados do cliente/veículo
  - Lista de serviços
  - Totais
  - Observações

#### 3. Status Flow

```
ABERTA → EM EXECUÇÃO → FINALIZADA → ENTREGUE
   ↓
CANCELADA
```

### ✅ Critério de Aceitação Sprint 5

- [ ] Criar OS funciona
- [ ] Adicionar serviços funciona
- [ ] Cálculo automático funciona
- [ ] Mudar status funciona
- [ ] Gerar PDF funciona
- [ ] Número sequencial funciona
- [ ] Multi-tenant isolando dados

### 📊 Resultado Esperado
**Fluxo operacional completo - Core do produto funcionando.**

---

## 💰 Sprint 6: Financeiro

### 🎯 Objetivo
Controle financeiro básico e funcional.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Database Schema

```sql
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

-- Status: pending, paid, overdue, cancelled
```

#### 2. Funcionalidades

**Contas a Receber:**
- ✅ Cadastrar conta
- ✅ Vínculo com OS (opcional)
- ✅ Baixar (marcar como pago)
- ✅ Filtros (status, período)

**Contas a Pagar:**
- ✅ Cadastrar conta
- ✅ Baixar
- ✅ Filtros

**Fluxo de Caixa:**
- ✅ Entradas (contas a receber pagas)
- ✅ Saídas (contas a pagar pagas)
- ✅ Saldo
- ✅ Filtro por período

#### 3. Auto-create

**Ao finalizar OS:**
```typescript
// Criar conta a receber automaticamente
await createReceivable({
  client_id: order.client_id,
  order_id: order.id,
  amount: order.total,
  due_date: new Date(),
  status: 'pending',
});
```

### ✅ Critério de Aceitação Sprint 6

- [ ] Contas a receber funciona
- [ ] Contas a pagar funciona
- [ ] Baixa de contas funciona
- [ ] Fluxo de caixa calcula corretamente
- [ ] Filtros funcionam
- [ ] Vínculo com OS funciona

### 📊 Resultado Esperado
**Controle financeiro básico e funcional.**

---

## 📊 Sprint 7: Dashboard

### 🎯 Objetivo
Entregar inteligência operacional com métricas visuais.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. KPIs Principais

```typescript
// Dashboard data
interface DashboardData {
  // Financeiro
  monthlyRevenue: number;
  todayRevenue: number;
  pendingRevenue: number;
  
  // Operacional
  openOrders: number;
  todayAppointments: number;
  completedOrdersMonth: number;
  
  // Clientes
  totalClients: number;
  newClientsMonth: number;
  
  // Métricas
  averageTicket: number;
  topServices: Array<{ name: string; count: number }>;
}
```

#### 2. Componentes Visuais

**KPI Cards:**
- ✅ Faturamento do mês
- ✅ OS abertas
- ✅ Agendamentos hoje
- ✅ Total de clientes

**Gráficos:**
- ✅ Receita dos últimos 6 meses (Line Chart)
- ✅ Serviços mais vendidos (Bar Chart)
- ✅ Status das OS (Pie Chart)

**Listas:**
- ✅ Agendamentos do dia
- ✅ OS recentes
- ✅ Contas a vencer

#### 3. Queries Otimizadas

```sql
-- Faturamento do mês
SELECT SUM(total) 
FROM orders_service 
WHERE tenant_id = $1 
  AND status = 'delivered'
  AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW());

-- Ticket médio
SELECT AVG(total) 
FROM orders_service 
WHERE tenant_id = $1 
  AND status = 'delivered';
```

### ✅ Critério de Aceitação Sprint 7

- [ ] KPIs calculam corretamente
- [ ] Gráficos renderizam
- [ ] Dados em tempo real
- [ ] Performance < 2s
- [ ] Responsivo
- [ ] Loading states

### 📊 Resultado Esperado
**Visão geral completa do negócio em um dashboard moderno.**

---

## 🚀 Sprint 8: Produção e Assinaturas

### 🎯 Objetivo
Preparar sistema para lançamento comercial.

### ⏱️ Duração
**1 semana**

### 📦 Entregas

#### 1. Sistema de Assinatura

**Database:**
```sql
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status: trial, active, past_due, cancelled, suspended
```

**Middleware de Assinatura:**
```typescript
// Verificar assinatura válida
const subscription = await getSubscription(tenantId);

if (subscription.status === 'past_due' || subscription.status === 'cancelled') {
  return redirect('/billing');
}
```

#### 2. Integração Asaas

**Instalação:**
```bash
npm install asaas-sdk
```

**Setup:**
- ✅ Criar conta no Asaas
- ✅ Configurar API key
- ✅ Criar cliente automaticamente
- ✅ Gerar cobrança recorrente
- ✅ Webhook de pagamento

**Fluxo:**
```
Trial acaba
  ↓
Criar cobrança no Asaas
  ↓
Cliente paga (PIX ou Cartão)
  ↓
Webhook confirma pagamento
  ↓
Atualizar subscription → active
```

#### 3. Deploy Produção

**Hostinger VPS:**
- ✅ Contratar VPS
- ✅ Instalar Docker
- ✅ Instalar Nginx
- ✅ Configurar SSL (Let's Encrypt)
- ✅ Configurar domínio

**Docker Setup:**
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    restart: unless-stopped
```

**Nginx:**
```nginx
server {
  listen 80;
  server_name autozen.com.br;
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

#### 4. Monitoramento

- ✅ Sentry (error tracking)
- ✅ Vercel Analytics (opcional)
- ✅ Logs do servidor
- ✅ Uptime monitoring

#### 5. Landing Page

**Criar página pública:**
- ✅ `/` - Landing page
- ✅ Features
- ✅ Pricing (R$ 97/mês)
- ✅ CTA "Começar grátis"
- ✅ Redirect para `/register`

### ✅ Critério de Aceitação Sprint 8

- [ ] Assinatura trial funciona (14 dias)
- [ ] Integração Asaas funciona
- [ ] Cobrança automática funciona
- [ ] Deploy em produção OK
- [ ] SSL configurado
- [ ] Domínio funcionando
- [ ] Landing page no ar
- [ ] Monitoramento ativo

### 📊 Resultado Esperado
**🚀 SISTEMA PRONTO PARA VENDER E GERAR RECEITA!**

---

## 📋 Critério de Lançamento

O AutoZen poderá ser lançado comercialmente quando possuir:

- [x] ✅ Login funcional
- [x] ✅ Cadastro de empresa
- [x] ✅ Multi-Tenant isolando dados
- [x] ✅ Clientes (CRUD completo)
- [x] ✅ Veículos (CRUD completo)
- [x] ✅ Agendamentos funcionais
- [x] ✅ Ordens de Serviço (core produto)
- [x] ✅ Financeiro básico
- [x] ✅ Dashboard com métricas
- [x] ✅ Sistema de assinatura
- [x] ✅ Hospedagem em produção
- [x] ✅ Domínio configurado
- [x] ✅ SSL ativo
- [x] ✅ Landing page
- [x] ✅ Suporte básico configurado

---

## 🎯 Metas do MVP

### Prazo
**8 semanas** (Sprint 0 → Sprint 8)

### Primeiros Clientes
**10 empresas** no primeiro mês

### Receita Inicial
```
10 empresas × R$ 97,00 = R$ 970,00/mês
```

### Meta de Validação (6 meses)
```
50 empresas ativas
50 × R$ 97,00 = R$ 4.850,00/mês (MRR)
R$ 58.200,00/ano (ARR)
```

### Breakeven
**42 empresas** para cobrir custos fixos

---

## 📦 Backlog Pós-Lançamento

### V1.1 (1 mês após launch)
- ⭐ Upload de fotos (veículo + OS)
- ⭐ Assinatura digital na OS
- ⭐ Dashboard avançado (mais gráficos)
- ⭐ Auditoria completa

### V1.2 (3 meses após launch)
- 🔷 Módulo de estoque completo
- 🔷 Cadastro de fornecedores
- 🔷 Alertas (baixo estoque, contas vencendo)
- 🔷 Notificações

### V2.0 (6 meses após launch)
- 🚀 Integração WhatsApp
- 🚀 PIX integrado
- 🚀 Google Calendar sync
- 🚀 Mercado Pago

### V3.0 (1 ano após launch)
- 🧠 AutoZen AI (OpenAI)
- 🧠 Insights automáticos
- 🧠 Assistente inteligente
- 🧠 Sugestões de upsell

---

## 📊 Resumo Executivo

| Item | Valor |
|------|-------|
| **Duração Total** | 8-10 semanas |
| **Sprints** | 9 (Sprint 0 → Sprint 8) |
| **Metodologia** | Agile, entregas semanais |
| **Equipe** | 1-2 devs + 1 PO |
| **Stack** | Next.js 16+, Supabase, TypeScript |
| **Investimento** | ~R$ 1.500/mês (infra + ferramentas) |
| **Breakeven** | 42 empresas |
| **Receita Projetada (ano 1)** | R$ 232.800 |

---

## ✅ Checklist Geral

### Sprint 0
- [ ] Next.js configurado
- [ ] Supabase configurado
- [ ] Estrutura de código criada
- [ ] Middleware funcionando

### Sprint 1
- [ ] Login funcional
- [ ] Cadastro de empresa funcional
- [ ] Multi-tenant ativo

### Sprint 2
- [ ] CRUD de clientes completo

### Sprint 3
- [ ] CRUD de veículos completo

### Sprint 4
- [ ] Agendamentos funcionais

### Sprint 5
- [ ] Ordens de Serviço completas
- [ ] PDF gerado

### Sprint 6
- [ ] Financeiro funcional

### Sprint 7
- [ ] Dashboard com métricas

### Sprint 8
- [ ] Assinatura funcional
- [ ] Deploy em produção
- [ ] **🚀 LANÇAMENTO**

---

## 🚀 Resultado Final

**Plano de execução completo** para levar o AutoZen:

✅ Da **ideia** ao **lançamento comercial**  
✅ Com **foco em velocidade**  
✅ Com **qualidade** e **escalabilidade**  
✅ Gerando **receita recorrente** desde as primeiras semanas  
✅ **MVP enxuto e funcional** em 8 semanas  
✅ **Pronto para vender** e crescer  

---

**Documento:** PLANO_DESENVOLVIMENTO_V9.md  
**Versão:** 9.0  
**Data:** Junho 2026  
**Status:** ✅ Aprovado e Pronto para Execução

**Do zero ao lançamento em 8 semanas! 🚀**
