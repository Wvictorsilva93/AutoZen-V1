# 📁 AutoZen V7 - Estrutura Completa de Código

## 🎯 Objetivo

Definir uma **arquitetura de código profissional** para o AutoZen, escalável e preparada para anos de evolução.

### Stack Tecnológica

```typescript
{
  "framework": "Next.js 16+",
  "library": "React 19+",
  "language": "TypeScript 5.3+",
  "backend": "Supabase + PostgreSQL",
  "styling": "TailwindCSS 4+",
  "components": "Shadcn/UI",
  "animation": "Framer Motion",
  "state": "Zustand",
  "forms": "React Hook Form + Zod",
  "architecture": "Multi-Tenant + RBAC"
}
```

---

## 📂 Estrutura Raiz

```
autozen/
├── public/                    # Assets estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/                       # Código-fonte principal
│   ├── app/                   # Next.js App Router
│   ├── components/            # Componentes reutilizáveis
│   ├── features/              # Módulos por feature
│   ├── services/              # Lógica de negócio
│   ├── repositories/          # Camada de dados
│   ├── hooks/                 # Custom hooks
│   ├── providers/             # Context providers
│   ├── stores/                # Zustand stores
│   ├── lib/                   # Bibliotecas internas
│   ├── types/                 # TypeScript types
│   ├── validators/            # Schemas Zod
│   ├── constants/             # Constantes
│   ├── config/                # Configurações
│   ├── styles/                # CSS global
│   └── utils/                 # Utilitários
│
├── docs/                      # Documentação
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── scripts/                   # Scripts de automação
│   ├── setup.sh
│   ├── migrate.sh
│   ├── seed.sh
│   └── backup.sh
│
├── supabase/                  # Configurações Supabase
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── docker/                    # Docker configs
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── tests/                     # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                 # Variáveis locais
├── .env.example               # Exemplo de env
├── .env.production            # Produção
├── .gitignore
├── middleware.ts              # Middleware global
├── next.config.ts             # Next.js config
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🗂️ Estrutura src/

```
src/
├── app/                       # App Router (Next.js 16+)
├── components/                # Componentes compartilhados
├── features/                  # Features isoladas
├── services/                  # Serviços de negócio
├── repositories/              # Acesso a dados
├── hooks/                     # Custom React Hooks
├── providers/                 # Context Providers
├── stores/                    # State Management (Zustand)
├── lib/                       # Bibliotecas internas
├── types/                     # TypeScript definitions
├── validators/                # Zod schemas
├── constants/                 # Constantes do app
├── config/                    # Configurações
├── styles/                    # CSS/Tailwind global
└── utils/                     # Funções utilitárias
```

---

## 🛣️ App Router (src/app/)

### Estrutura Completa

```
src/app/
├── (auth)/                    # Grupo: Rotas públicas
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   └── layout.tsx             # Layout auth
│
├── (app)/                     # Grupo: Rotas protegidas
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
│   │   ├── page.tsx
│   │   ├── novo/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── agendamentos/
│   │   ├── page.tsx
│   │   ├── novo/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── ordens-servico/
│   │   ├── page.tsx
│   │   ├── nova/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── editar/
│   │           └── page.tsx
│   ├── servicos/
│   │   ├── page.tsx
│   │   ├── novo/
│   │   │   └── page.tsx
│   │   └── categorias/
│   │       └── page.tsx
│   ├── estoque/
│   │   ├── produtos/
│   │   │   ├── page.tsx
│   │   │   └── novo/
│   │   │       └── page.tsx
│   │   ├── categorias/
│   │   │   └── page.tsx
│   │   ├── fornecedores/
│   │   │   └── page.tsx
│   │   └── movimentacoes/
│   │       └── page.tsx
│   ├── financeiro/
│   │   ├── receber/
│   │   │   └── page.tsx
│   │   ├── pagar/
│   │   │   └── page.tsx
│   │   └── fluxo-caixa/
│   │       └── page.tsx
│   ├── relatorios/
│   │   ├── vendas/
│   │   │   └── page.tsx
│   │   ├── financeiro/
│   │   │   └── page.tsx
│   │   └── servicos/
│   │       └── page.tsx
│   ├── equipe/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── configuracoes/
│   │   ├── page.tsx
│   │   ├── empresa/
│   │   │   └── page.tsx
│   │   ├── usuarios/
│   │   │   └── page.tsx
│   │   └── assinatura/
│   │       └── page.tsx
│   └── layout.tsx             # Layout principal (Sidebar + Header)
│
├── (super-admin)/             # Grupo: Super Admin
│   ├── dashboard/
│   │   └── page.tsx
│   ├── empresas/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── usuarios/
│   │   └── page.tsx
│   ├── assinaturas/
│   │   └── page.tsx
│   ├── auditoria/
│   │   └── page.tsx
│   ├── configuracoes/
│   │   └── page.tsx
│   └── layout.tsx             # Layout super admin
│
├── api/                       # API Routes
│   └── v1/
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts
│       │   ├── logout/
│       │   │   └── route.ts
│       │   └── me/
│       │       └── route.ts
│       ├── clients/
│       │   ├── route.ts       # GET, POST
│       │   └── [id]/
│       │       └── route.ts   # GET, PUT, DELETE
│       ├── vehicles/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── appointments/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── orders/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── inventory/
│       │   ├── products/
│       │   │   └── route.ts
│       │   └── movements/
│       │       └── route.ts
│       └── financial/
│           ├── receivable/
│           │   └── route.ts
│           └── payable/
│               └── route.ts
│
├── layout.tsx                 # Root layout
├── page.tsx                   # Home (redirect)
├── loading.tsx                # Loading global
├── error.tsx                  # Error global
└── not-found.tsx              # 404
```


---

## 🎨 Components (src/components/)

### Estrutura

```
src/components/
├── ui/                        # Shadcn/UI Components
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   ├── dropdown-menu.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── switch.tsx
│   ├── textarea.tsx
│   ├── alert.tsx
│   ├── toast.tsx
│   ├── skeleton.tsx
│   ├── separator.tsx
│   ├── avatar.tsx
│   └── calendar.tsx
│
├── layout/                    # Layout Components
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── footer.tsx
│   ├── breadcrumbs.tsx
│   ├── page-header.tsx
│   └── mobile-nav.tsx
│
├── forms/                     # Form Components
│   ├── form-field.tsx
│   ├── form-error.tsx
│   ├── form-label.tsx
│   ├── date-picker.tsx
│   ├── phone-input.tsx
│   ├── cpf-input.tsx
│   ├── currency-input.tsx
│   └── file-upload.tsx
│
├── tables/                    # Table Components
│   ├── data-table.tsx
│   ├── data-table-toolbar.tsx
│   ├── data-table-pagination.tsx
│   ├── data-table-column-header.tsx
│   └── data-table-row-actions.tsx
│
├── charts/                    # Chart Components
│   ├── revenue-chart.tsx
│   ├── services-chart.tsx
│   ├── line-chart.tsx
│   ├── bar-chart.tsx
│   └── pie-chart.tsx
│
├── dialogs/                   # Dialog Components
│   ├── confirm-dialog.tsx
│   ├── delete-dialog.tsx
│   └── info-dialog.tsx
│
├── cards/                     # Card Components
│   ├── stat-card.tsx
│   ├── client-card.tsx
│   ├── vehicle-card.tsx
│   └── order-card.tsx
│
├── badges/                    # Badge Components
│   ├── status-badge.tsx
│   ├── role-badge.tsx
│   └── priority-badge.tsx
│
├── loaders/                   # Loading Components
│   ├── spinner.tsx
│   ├── skeleton-loader.tsx
│   └── page-loader.tsx
│
└── animations/                # Animation Components
    ├── fade-in.tsx
    ├── slide-in.tsx
    └── scale.tsx
```

---

## 🧩 Features (src/features/)

### Estrutura por Feature

```
src/features/
├── auth/                      # Autenticação
│   ├── components/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── reset-password-form.tsx
│   ├── hooks/
│   │   ├── use-login.ts
│   │   ├── use-logout.ts
│   │   └── use-session.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── schemas/
│   │   └── auth.schema.ts
│   ├── types/
│   │   └── auth.types.ts
│   └── actions/
│       ├── login.action.ts
│       └── logout.action.ts
│
├── dashboard/                 # Dashboard
│   ├── components/
│   │   ├── dashboard-kpis.tsx
│   │   ├── revenue-chart.tsx
│   │   ├── recent-orders.tsx
│   │   └── quick-actions.tsx
│   ├── hooks/
│   │   └── use-dashboard-data.ts
│   ├── services/
│   │   └── dashboard.service.ts
│   └── types/
│       └── dashboard.types.ts
│
├── clients/                   # Clientes
│   ├── components/
│   │   ├── client-form.tsx
│   │   ├── client-table.tsx
│   │   ├── client-card.tsx
│   │   └── client-details.tsx
│   ├── hooks/
│   │   ├── use-clients.ts
│   │   ├── use-client.ts
│   │   └── use-create-client.ts
│   ├── services/
│   │   └── client.service.ts
│   ├── repositories/
│   │   └── client.repository.ts
│   ├── schemas/
│   │   └── client.schema.ts
│   ├── types/
│   │   └── client.types.ts
│   └── actions/
│       ├── create-client.action.ts
│       ├── update-client.action.ts
│       └── delete-client.action.ts
│
├── vehicles/                  # Veículos
│   ├── components/
│   │   ├── vehicle-form.tsx
│   │   ├── vehicle-table.tsx
│   │   └── vehicle-card.tsx
│   ├── hooks/
│   │   ├── use-vehicles.ts
│   │   └── use-vehicle.ts
│   ├── services/
│   │   └── vehicle.service.ts
│   ├── repositories/
│   │   └── vehicle.repository.ts
│   ├── schemas/
│   │   └── vehicle.schema.ts
│   └── types/
│       └── vehicle.types.ts
│
├── appointments/              # Agendamentos
│   ├── components/
│   │   ├── appointment-form.tsx
│   │   ├── appointment-calendar.tsx
│   │   └── appointment-list.tsx
│   ├── hooks/
│   │   ├── use-appointments.ts
│   │   └── use-create-appointment.ts
│   ├── services/
│   │   └── appointment.service.ts
│   ├── repositories/
│   │   └── appointment.repository.ts
│   └── schemas/
│       └── appointment.schema.ts
│
├── work-orders/               # Ordens de Serviço
│   ├── components/
│   │   ├── order-form.tsx
│   │   ├── order-table.tsx
│   │   ├── order-details.tsx
│   │   ├── order-items.tsx
│   │   └── order-photos.tsx
│   ├── hooks/
│   │   ├── use-orders.ts
│   │   ├── use-order.ts
│   │   └── use-create-order.ts
│   ├── services/
│   │   └── order.service.ts
│   ├── repositories/
│   │   └── order.repository.ts
│   ├── schemas/
│   │   └── order.schema.ts
│   └── types/
│       └── order.types.ts
│
├── services/                  # Serviços
│   ├── components/
│   │   ├── service-form.tsx
│   │   ├── service-table.tsx
│   │   └── service-category-form.tsx
│   ├── hooks/
│   │   └── use-services.ts
│   ├── services/
│   │   └── service.service.ts
│   └── schemas/
│       └── service.schema.ts
│
├── inventory/                 # Estoque
│   ├── components/
│   │   ├── product-form.tsx
│   │   ├── product-table.tsx
│   │   ├── stock-movement-form.tsx
│   │   └── low-stock-alert.tsx
│   ├── hooks/
│   │   ├── use-products.ts
│   │   └── use-stock-movements.ts
│   ├── services/
│   │   ├── product.service.ts
│   │   └── stock.service.ts
│   └── schemas/
│       └── product.schema.ts
│
├── financial/                 # Financeiro
│   ├── components/
│   │   ├── receivable-form.tsx
│   │   ├── payable-form.tsx
│   │   ├── cash-flow-table.tsx
│   │   └── financial-summary.tsx
│   ├── hooks/
│   │   ├── use-receivables.ts
│   │   ├── use-payables.ts
│   │   └── use-cash-flow.ts
│   ├── services/
│   │   └── financial.service.ts
│   └── schemas/
│       └── financial.schema.ts
│
├── reports/                   # Relatórios
│   ├── components/
│   │   ├── report-filters.tsx
│   │   ├── sales-report.tsx
│   │   ├── financial-report.tsx
│   │   └── services-report.tsx
│   ├── hooks/
│   │   └── use-report.ts
│   └── services/
│       └── report.service.ts
│
├── users/                     # Usuários
│   ├── components/
│   │   ├── user-form.tsx
│   │   ├── user-table.tsx
│   │   └── role-selector.tsx
│   ├── hooks/
│   │   └── use-users.ts
│   ├── services/
│   │   └── user.service.ts
│   └── schemas/
│       └── user.schema.ts
│
└── settings/                  # Configurações
    ├── components/
    │   ├── company-settings-form.tsx
    │   ├── subscription-info.tsx
    │   └── notification-settings.tsx
    ├── hooks/
    │   └── use-settings.ts
    └── services/
        └── settings.service.ts
```


---

## 🔧 Services (src/services/)

```typescript
// src/services/client.service.ts
import { ClientRepository } from '@/repositories/client.repository';
import { CreateClientDTO, UpdateClientDTO } from '@/types/client.types';
import { auditLog } from '@/lib/audit/audit-log';

export class ClientService {
  private repository: ClientRepository;
  
  constructor() {
    this.repository = new ClientRepository();
  }
  
  async create(data: CreateClientDTO, userId: string) {
    const client = await this.repository.create(data);
    
    await auditLog({
      action: 'CREATE',
      table: 'clients',
      recordId: client.id,
      newData: client,
      userId,
    });
    
    return client;
  }
  
  async update(id: string, data: UpdateClientDTO, userId: string) {
    const oldClient = await this.repository.findById(id);
    const updatedClient = await this.repository.update(id, data);
    
    await auditLog({
      action: 'UPDATE',
      table: 'clients',
      recordId: id,
      oldData: oldClient,
      newData: updatedClient,
      userId,
    });
    
    return updatedClient;
  }
  
  async delete(id: string, userId: string) {
    await this.repository.softDelete(id, userId);
    
    await auditLog({
      action: 'DELETE',
      table: 'clients',
      recordId: id,
      userId,
    });
  }
  
  async findAll(tenantId: string) {
    return this.repository.findAll(tenantId);
  }
  
  async findById(id: string, tenantId: string) {
    return this.repository.findById(id, tenantId);
  }
}
```

---

## 💾 Repositories (src/repositories/)

```typescript
// src/repositories/client.repository.ts
import { createServerClient } from '@/lib/supabase/server';
import type { Client, CreateClientDTO, UpdateClientDTO } from '@/types/client.types';

export class ClientRepository {
  private supabase = createServerClient();
  
  async create(data: CreateClientDTO): Promise<Client> {
    const { data: client, error } = await this.supabase
      .from('clients')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return client;
  }
  
  async update(id: string, data: UpdateClientDTO): Promise<Client> {
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
  
  async findAll(tenantId: string): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
  
  async findById(id: string, tenantId: string): Promise<Client | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();
    
    if (error) return null;
    return data;
  }
}
```

---

## 🪝 Hooks (src/hooks/)

```typescript
// src/hooks/use-auth.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
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
  
  return { user, loading, isAuthenticated: !!user };
}

// src/hooks/use-tenant.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Company } from '@/types/company.types';

export function useTenant() {
  const [tenant, setTenant] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTenant = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id, companies(*)')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.companies) {
        setTenant(profile.companies as Company);
      }
      
      setLoading(false);
    };
    
    fetchTenant();
  }, []);
  
  return { tenant, loading };
}

// src/hooks/use-permission.ts
'use client';

import { useEffect, useState } from 'react';
import { hasPermission } from '@/lib/permissions/check-permission';

export function usePermission(permissionCode: string) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkPermission = async () => {
      const result = await hasPermission(permissionCode);
      setAllowed(result);
      setLoading(false);
    };
    
    checkPermission();
  }, [permissionCode]);
  
  return { allowed, loading };
}

// src/hooks/use-clients.ts
'use client';

import useSWR from 'swr';
import { ClientService } from '@/services/client.service';

const clientService = new ClientService();

export function useClients(tenantId: string) {
  const { data, error, mutate } = useSWR(
    tenantId ? ['clients', tenantId] : null,
    () => clientService.findAll(tenantId)
  );
  
  return {
    clients: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
```

---

## 🎭 Providers (src/providers/)

```typescript
// src/providers/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
  
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);

// src/providers/tenant-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTenant } from '@/hooks/use-tenant';
import type { Company } from '@/types/company.types';

interface TenantContextType {
  tenant: Company | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { tenant, loading } = useTenant();
  
  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenantContext = () => useContext(TenantContext);
```

---

## 📦 Stores (src/stores/)

```typescript
// src/stores/auth.store.ts
import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

// src/stores/ui.store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

// src/stores/notification.store.ts
import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: crypto.randomUUID() },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
```


---

## 📚 Lib (src/lib/)

### Estrutura

```
src/lib/
├── supabase/
│   ├── client.ts              # Client-side Supabase
│   ├── server.ts              # Server-side Supabase
│   ├── middleware.ts          # Middleware Supabase
│   └── admin.ts               # Admin Supabase (service role)
│
├── auth/
│   ├── session.ts             # Session helpers
│   ├── roles.ts               # Role helpers
│   ├── permissions.ts         # Permission checks
│   └── guards.ts              # Route guards
│
├── tenant/
│   ├── current-tenant.ts      # Get current tenant
│   ├── tenant-context.ts      # Tenant context
│   └── tenant-guard.ts        # Tenant guard
│
├── audit/
│   ├── audit-log.ts           # Create audit log
│   └── audit-service.ts       # Audit service
│
├── storage/
│   ├── upload.ts              # File upload
│   ├── download.ts            # File download
│   └── delete.ts              # File delete
│
├── permissions/
│   ├── check-permission.ts    # Check permission
│   ├── role-permissions.ts    # Role-based permissions
│   └── constants.ts           # Permission constants
│
└── utils.ts                   # Utility functions (cn, etc)
```

### Exemplos

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// src/lib/supabase/server.ts
import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export function createServerClient() {
  const cookieStore = cookies();
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// src/lib/tenant/current-tenant.ts
import { createServerClient } from '@/lib/supabase/server';

export async function getCurrentTenantId(): Promise<string | null> {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  return profile?.tenant_id || null;
}

// src/lib/permissions/check-permission.ts
import { createServerClient } from '@/lib/supabase/server';

export async function hasPermission(permissionCode: string): Promise<boolean> {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role_id, roles(name)')
    .eq('user_id', user.id)
    .single();
  
  if (!profile) return false;
  
  // Super admin tem todas as permissões
  if (profile.roles.name === 'super_admin') return true;
  
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

## ✅ Validators (src/validators/)

```typescript
// src/validators/client.schema.ts
import { z } from 'zod';

export const ClientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf_cnpj: z.string().optional(),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional(),
  birth_date: z.string().optional(),
  zipcode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof ClientSchema>;

// src/validators/vehicle.schema.ts
import { z } from 'zod';

export const VehicleSchema = z.object({
  client_id: z.string().uuid('Cliente inválido'),
  plate: z.string().min(7, 'Placa inválida'),
  brand: z.string().min(2, 'Marca inválida'),
  model: z.string().min(2, 'Modelo inválido'),
  year: z.number().min(1900).max(2100),
  color: z.string().min(2, 'Cor inválida'),
  fuel: z.enum(['gasoline', 'ethanol', 'diesel', 'flex', 'electric', 'hybrid']),
  chassis: z.string().optional(),
  km: z.number().optional(),
  notes: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof VehicleSchema>;

// src/validators/order.schema.ts
import { z } from 'zod';

export const OrderSchema = z.object({
  client_id: z.string().uuid('Cliente inválido'),
  vehicle_id: z.string().uuid('Veículo inválido'),
  employee_id: z.string().uuid('Funcionário inválido').optional(),
  services: z.array(z.object({
    service_id: z.string().uuid(),
    quantity: z.number().min(1),
    unit_price: z.number().min(0),
  })).min(1, 'Adicione pelo menos um serviço'),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
  km_in: z.number().optional(),
});

export type OrderFormData = z.infer<typeof OrderSchema>;
```

---

## 🎯 Constants (src/constants/)

```typescript
// src/constants/roles.ts
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  GERENTE: 'gerente',
  ATENDENTE: 'atendente',
  OPERADOR: 'operador',
} as const;

export const ROLE_LEVELS = {
  [ROLES.SUPER_ADMIN]: 5,
  [ROLES.ADMIN]: 4,
  [ROLES.GERENTE]: 3,
  [ROLES.ATENDENTE]: 2,
  [ROLES.OPERADOR]: 1,
} as const;

// src/constants/permissions.ts
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  
  // Clients
  CLIENTS_VIEW: 'clients.view',
  CLIENTS_CREATE: 'clients.create',
  CLIENTS_EDIT: 'clients.edit',
  CLIENTS_DELETE: 'clients.delete',
  
  // Vehicles
  VEHICLES_VIEW: 'vehicles.view',
  VEHICLES_CREATE: 'vehicles.create',
  VEHICLES_EDIT: 'vehicles.edit',
  VEHICLES_DELETE: 'vehicles.delete',
  
  // Orders
  OS_VIEW: 'os.view',
  OS_CREATE: 'os.create',
  OS_EDIT: 'os.edit',
  OS_DELETE: 'os.delete',
  
  // Financial
  FINANCIAL_VIEW: 'financial.view',
  FINANCIAL_EDIT: 'financial.edit',
  
  // Settings
  SETTINGS_EDIT: 'settings.edit',
} as const;

// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clientes',
  VEHICLES: '/veiculos',
  APPOINTMENTS: '/agendamentos',
  ORDERS: '/ordens-servico',
  SERVICES: '/servicos',
  INVENTORY: '/estoque',
  FINANCIAL: '/financeiro',
  REPORTS: '/relatorios',
  USERS: '/equipe',
  SETTINGS: '/configuracoes',
} as const;

// src/constants/status.ts
export const ORDER_STATUS = {
  OPEN: 'open',
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const SUBSCRIPTION_STATUS = {
  TRIAL: 'trial',
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended',
} as const;
```

---

## ⚙️ Config (src/config/)

```typescript
// src/config/app.ts
export const appConfig = {
  name: 'AutoZen',
  description: 'Sistema de Gestão para Estética Automotiva',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  author: 'AutoZen Team',
};

// src/config/supabase.ts
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// src/config/theme.ts
export const themeConfig = {
  defaultTheme: 'dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  },
};
```

---

## 🎨 Styles (src/styles/)

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    /* ... more CSS variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}

@layer components {
  .container-custom {
    @apply mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl;
  }
  
  .card-shadow {
    @apply shadow-lg shadow-black/10 dark:shadow-black/50;
  }
}

/* src/styles/animations.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slide-in {
  animation: slideInFromLeft 0.3s ease-in-out;
}
```


---

## 🔄 Middleware Global

```typescript
// middleware.ts (root)
import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // 1. Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  
  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );
  
  // Se não tem sessão e não é rota pública
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Se tem sessão
  if (session) {
    // 2. Buscar profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, companies(*), subscriptions(*), roles(name)')
      .eq('user_id', session.user.id)
      .single();
    
    if (!profile && req.nextUrl.pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
    
    // 3. Verificar empresa ativa
    if (profile && !profile.companies.active) {
      return NextResponse.redirect(new URL('/suspended', req.url));
    }
    
    // 4. Verificar assinatura
    if (profile?.subscriptions) {
      const sub = profile.subscriptions;
      if (sub.status === 'past_due' || sub.status === 'cancelled') {
        if (req.nextUrl.pathname !== '/billing') {
          return NextResponse.redirect(new URL('/billing', req.url));
        }
      }
    }
    
    // 5. Verificar acesso super admin
    if (req.nextUrl.pathname.startsWith('/super-admin')) {
      if (profile?.roles.name !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    
    // 6. Se logado e tenta acessar rota pública
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

## 📝 Nomenclatura e Padrões

### Arquivos

```bash
# kebab-case
create-client.ts
client-form.tsx
use-clients.ts
```

### Componentes

```typescript
// PascalCase
ClientForm
VehicleCard
DataTable
```

### Hooks

```typescript
// camelCase com prefixo "use"
useAuth
useTenant
useClients
```

### Services

```typescript
// PascalCase com sufixo "Service"
ClientService
AuthService
OrderService
```

### Repositories

```typescript
// PascalCase com sufixo "Repository"
ClientRepository
VehicleRepository
```

### Constantes

```typescript
// SCREAMING_SNAKE_CASE
const MAX_FILE_SIZE = 10_000_000;
const DEFAULT_PAGE_SIZE = 20;
```

---

## 🔄 Padrão CRUD

### Estrutura Padrão para cada Módulo

```
feature/
├── pages/
│   ├── list.tsx               # Listagem
│   ├── create.tsx             # Cadastro
│   ├── edit.tsx               # Edição
│   └── details.tsx            # Detalhes
│
├── components/
│   ├── feature-form.tsx       # Formulário
│   ├── feature-table.tsx      # Tabela
│   └── feature-card.tsx       # Card
│
├── actions/
│   ├── create-feature.ts      # Server Action: Create
│   ├── update-feature.ts      # Server Action: Update
│   ├── delete-feature.ts      # Server Action: Delete
│   └── get-features.ts        # Server Action: List
│
├── services/
│   └── feature.service.ts     # Business Logic
│
├── repositories/
│   └── feature.repository.ts  # Data Access
│
├── schemas/
│   └── feature.schema.ts      # Validation
│
└── types/
    └── feature.types.ts       # TypeScript Types
```

---

## 🧪 Testes (Futuro)

```
tests/
├── unit/
│   ├── services/
│   │   └── client.service.test.ts
│   ├── repositories/
│   │   └── client.repository.test.ts
│   └── utils/
│       └── formatters.test.ts
│
├── integration/
│   ├── api/
│   │   └── clients.test.ts
│   └── features/
│       └── auth.test.ts
│
└── e2e/
    ├── auth.spec.ts
    ├── clients.spec.ts
    └── orders.spec.ts
```

**Ferramentas:**
- **Vitest** - Unit & Integration
- **Playwright** - E2E
- **Testing Library** - React Components

---

## 📊 Observabilidade (Futuro)

### Logs

```
logs/
├── application.log            # Logs gerais
├── audit.log                  # Logs de auditoria
├── errors.log                 # Logs de erros
└── performance.log            # Logs de performance
```

### Integrações

- **Sentry** - Error tracking
- **OpenTelemetry** - Tracing
- **Better Stack** - Log management
- **Vercel Analytics** - Web analytics

---

## 📦 Upload de Arquivos

### Buckets (Supabase Storage)

```
Storage/
├── companies/                 # Logos de empresas
│   └── {tenant_id}/
│       └── logo.png
│
├── avatars/                   # Avatares de usuários
│   └── {user_id}/
│       └── avatar.jpg
│
├── vehicles/                  # Fotos de veículos
│   └── {tenant_id}/
│       └── {vehicle_id}/
│           ├── photo1.jpg
│           └── photo2.jpg
│
├── os-before/                 # Fotos OS (antes)
│   └── {tenant_id}/
│       └── {order_id}/
│           └── before1.jpg
│
├── os-during/                 # Fotos OS (durante)
│   └── {tenant_id}/
│       └── {order_id}/
│           └── during1.jpg
│
├── os-after/                  # Fotos OS (depois)
│   └── {tenant_id}/
│       └── {order_id}/
│           └── after1.jpg
│
└── documents/                 # Documentos
    └── {tenant_id}/
        └── {document_id}/
            └── document.pdf
```

---

## ✅ Checklist de Implementação

### Fase 1: Setup Inicial
- [ ] Criar estrutura de pastas
- [ ] Configurar Next.js + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar Shadcn/UI
- [ ] Configurar Supabase
- [ ] Configurar variáveis de ambiente

### Fase 2: Fundação
- [ ] Criar lib/supabase (client, server, middleware)
- [ ] Criar middleware global
- [ ] Implementar auth provider
- [ ] Implementar tenant provider
- [ ] Criar hooks básicos (useAuth, useTenant)

### Fase 3: UI Base
- [ ] Instalar componentes Shadcn/UI
- [ ] Criar layout components (Header, Sidebar, Footer)
- [ ] Criar form components
- [ ] Implementar theme provider (dark/light)

### Fase 4: Features Core
- [ ] Implementar auth (login, register)
- [ ] Implementar dashboard
- [ ] Implementar CRUD clientes
- [ ] Implementar CRUD veículos
- [ ] Implementar CRUD serviços

### Fase 5: Features Avançadas
- [ ] Implementar agendamentos
- [ ] Implementar ordens de serviço
- [ ] Implementar estoque
- [ ] Implementar financeiro

### Fase 6: Sistema
- [ ] Implementar RBAC
- [ ] Implementar auditoria
- [ ] Implementar notificações
- [ ] Implementar relatórios

### Fase 7: Testes
- [ ] Configurar Vitest
- [ ] Escrever unit tests
- [ ] Configurar Playwright
- [ ] Escrever E2E tests

### Fase 8: Deploy
- [ ] Configurar Docker
- [ ] Configurar CI/CD
- [ ] Deploy em staging
- [ ] Deploy em produção

---

## 🎯 Resultado Final

Estrutura de código **enterprise-ready** com:

✅ **Organização Clara** - Pastas por feature, fácil de navegar  
✅ **Escalável** - Preparado para crescimento do produto  
✅ **Manutenível** - Código organizado e padronizado  
✅ **Testável** - Estrutura preparada para testes  
✅ **Multi-Tenant** - Isolamento total por empresa  
✅ **RBAC** - Controle de acesso granular  
✅ **Type-Safe** - TypeScript em toda aplicação  
✅ **Performance** - Server Components + Caching  
✅ **Developer Experience** - Padrões consistentes  
✅ **Team Ready** - Preparado para desenvolvimento em equipe  

**Arquitetura profissional, escalável e preparada para anos de evolução! 🚀**

---

**Documento:** ESTRUTURA_CODIGO_V7.md  
**Versão:** 7.0  
**Data:** Junho 2026  
**Status:** ✅ Completo e Production-Ready
