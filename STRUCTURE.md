# 📁 Estrutura do Projeto AutoZen V4

## 🏗️ Arquitetura de Pastas

```
AutoZen/
│
├── 📱 app/                          # Next.js 15 App Router
│   ├── layout.tsx                  # Layout raiz (dark mode, metadata)
│   ├── page.tsx                    # Página inicial (LoginPage)
│   ├── globals.css                 # Estilos globais + glassmorphism
│   │
│   ├── 🔐 (auth)/                  # Grupo de rotas de autenticação
│   │   ├── login/                  # Rota de login (futuro)
│   │   └── signup/                 # Rota de cadastro (futuro)
│   │
│   ├── 📊 (dashboard)/             # Grupo de rotas protegidas
│   │   ├── layout.tsx              # Layout com sidebar (futuro)
│   │   ├── page.tsx                # Dashboard principal (futuro)
│   │   ├── clientes/               # Módulo de clientes (futuro)
│   │   ├── veiculos/               # Módulo de veículos (futuro)
│   │   ├── servicos/               # Módulo de serviços (futuro)
│   │   ├── os/                     # Ordens de serviço (futuro)
│   │   ├── kanban/                 # Kanban operacional (futuro)
│   │   ├── financeiro/             # Financeiro (futuro)
│   │   ├── estoque/                # Estoque (futuro)
│   │   └── relatorios/             # Relatórios (futuro)
│   │
│   └── 🔌 api/                     # API Route Handlers
│       ├── auth/                   # Endpoints de autenticação (futuro)
│       └── webhook/                # Webhooks (futuro)
│
├── 🧩 components/                   # Componentes reutilizáveis
│   └── ui/                         # Componentes do Shadcn/UI
│       ├── button.tsx              # Botão
│       ├── card.tsx                # Card
│       ├── input.tsx               # Input
│       ├── label.tsx               # Label
│       ├── tabs.tsx                # Tabs
│       └── separator.tsx           # Separador
│
├── 🎯 modules/                      # Módulos de funcionalidades
│   └── auth/                       # Módulo de autenticação
│       └── components/
│           └── LoginPage.tsx       # Tela de login/cadastro
│
├── 📚 lib/                          # Bibliotecas e utilitários
│   ├── env.ts                      # Variáveis de ambiente (safe)
│   ├── utils.ts                    # Utilitários BR (moeda, data, placa)
│   └── supabase/
│       ├── client.ts               # Cliente Browser (singleton)
│       └── server.ts               # Cliente Server + Admin
│
├── 📝 types/                        # TypeScript types
│   └── database.ts                 # Types do Supabase (sincronizado)
│
├── 🪝 hooks/                        # Custom React Hooks
│   └── .gitkeep                    # (futuro: useAuth, useCompany, etc)
│
├── 🗄️ store/                        # State Management
│   └── .gitkeep                    # (futuro: Zustand ou Context)
│
├── 🗃️ supabase/                     # Database
│   ├── schema.sql                  # Schema SQL completo
│   └── README.md                   # Instruções de setup
│
├── 🎨 public/                       # Assets estáticos
│   ├── manifest.json               # PWA manifest
│   └── logo.png                    # Logo AutoZen
│
├── ⚙️ Configurações
│   ├── .env.local                  # Variáveis de ambiente (não commitado)
│   ├── .gitignore                  # Arquivos ignorados
│   ├── next.config.ts              # Config Next.js (standalone)
│   ├── tsconfig.json               # Config TypeScript (strict)
│   ├── tailwind.config.ts          # Config Tailwind (tema premium)
│   ├── postcss.config.mjs          # Config PostCSS
│   ├── package.json                # Dependências
│   └── .eslintrc.json              # Config ESLint
│
└── 📄 Documentação
    ├── README.md                   # Documentação principal
    └── STRUCTURE.md                # Este arquivo
```

## 🎨 Convenções de Código

### Nomenclatura de Arquivos
- **Componentes React:** `PascalCase.tsx` (ex: `LoginPage.tsx`)
- **Utilitários:** `camelCase.ts` (ex: `utils.ts`)
- **Tipos:** `camelCase.ts` (ex: `database.ts`)
- **Rotas:** `kebab-case/` (ex: `ordem-servico/`)

### Estrutura de Componentes
```tsx
'use client' // Se for Client Component

import { } from 'react'
import { } from 'next/...'
import { } from '@/components/...'
import { } from '@/lib/...'

export function ComponentName() {
  // 1. Hooks
  // 2. State
  // 3. Handlers
  // 4. Effects
  // 5. Render
}
```

### Imports
Usar sempre path alias `@/`:
```tsx
import { Button } from '@/components/ui/button'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
```

## 🔐 Multi-Tenant Architecture

### Princípio Fundamental
**Toda operação DEVE filtrar por `company_id`**

### Exemplos:

#### ❌ ERRADO (Sem filtro)
```ts
const { data } = await supabase
  .from('customers')
  .select('*')
```

#### ✅ CORRETO (Com filtro)
```ts
const { data } = await supabase
  .from('customers')
  .select('*')
  .eq('company_id', session.company_id)
```

### RLS (Row Level Security)
O Supabase já filtra automaticamente no backend via RLS!
Mas sempre adicione o filtro para clareza e performance.

## 🚀 Próximas Implementações

### Fase 1: Autenticação
- [ ] Server Action de login
- [ ] Server Action de cadastro
- [ ] Middleware de autenticação
- [ ] Hook useAuth()
- [ ] Redirect após login

### Fase 2: Dashboard
- [ ] Layout com sidebar
- [ ] Cards de métricas
- [ ] Gráficos de faturamento
- [ ] Indicadores de performance

### Fase 3: Módulos Core
- [ ] CRUD de Clientes
- [ ] CRUD de Veículos
- [ ] CRUD de Serviços
- [ ] Sistema de OS
- [ ] Kanban operacional

### Fase 4: Financeiro
- [ ] Lançamentos
- [ ] Caixa diário
- [ ] Fluxo de caixa
- [ ] Relatórios

### Fase 5: Extras
- [ ] Agendamentos
- [ ] Estoque
- [ ] Funcionários
- [ ] WhatsApp
- [ ] Fotos de veículos

## 📦 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento (http://localhost:3000)
npm run build      # Build de produção
npm start          # Inicia build de produção
npm run lint       # Lint do código
npm run type-check # Verificação TypeScript
```

## 🎯 Status Atual

✅ **Concluído:**
- Estrutura base do projeto
- Componentes UI (Shadcn)
- Tela de login/cadastro premium
- Schema SQL completo
- Types TypeScript sincronizados
- Configuração Supabase
- Sistema multi-tenant
- RLS policies

⏳ **Em Desenvolvimento:**
- Autenticação funcional
- Dashboard

🔜 **Próximo:**
- Implementar Server Actions de auth
- Criar middleware
- Desenvolver dashboard
