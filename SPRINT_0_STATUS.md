# 🚀 AutoZen - Sprint 0 - STATUS

## 📌 Informações

| Campo | Valor |
|-------|-------|
| **Sprint** | 0 - Fundação |
| **Data** | Junho 2026 |
| **Status** | ✅ **EM PROGRESSO** |
| **Objetivo** | Criar estrutura inicial profissional |

---

## ✅ COMPLETADO

### 1. Estrutura do Projeto ✅

```
AutoZen/
├── src/                    ⭐ NOVA estrutura profissional
│   ├── app/                ✅ App Router movido
│   ├── components/         ✅ Componentes globais
│   ├── features/           ⭐ NOVA - Módulos por domínio
│   │   ├── auth/          ⭐ Feature autenticação
│   │   ├── tenant/        ⭐ Feature multi-tenant
│   │   └── dashboard/     ⭐ Feature dashboard
│   ├── services/           ✅ Serviços API
│   ├── repositories/       ⭐ NOVA - Acesso dados
│   ├── hooks/              ✅ Hooks customizados
│   ├── providers/          ⭐ NOVA - Context providers
│   ├── lib/                ✅ Bibliotecas
│   │   └── supabase/      ⭐ NOVA - Cliente Supabase
│   │       ├── client.ts  ⭐ Browser client
│   │       ├── server.ts  ⭐ Server client
│   │       └── middleware.ts ⭐ Middleware client
│   ├── types/              ✅ TypeScript types
│   │   └── database.ts    ⭐ NOVA - Database types
│   ├── validators/         ⭐ NOVA - Zod schemas
│   ├── constants/          ✅ Constantes
│   ├── config/             ✅ Configurações
│   └── styles/             ⭐ NOVA - Estilos globais
├── middleware.ts           ⭐ NOVO - Middleware principal
├── .env.local              ✅ Variáveis ambiente
└── package.json            ✅ ATUALIZADO
```

### 2. Supabase Integração ✅

**Arquivos Criados:**
- ✅ `src/lib/supabase/client.ts` - Cliente browser
- ✅ `src/lib/supabase/server.ts` - Cliente server
- ✅ `src/lib/supabase/middleware.ts` - Cliente middleware

**Dependências Instaladas:**
- ✅ `@supabase/ssr` (15 pacotes novos)
- ✅ `@supabase/supabase-js`
- ✅ `zustand`
- ✅ `react-hook-form`
- ✅ `@hookform/resolvers`
- ✅ `zod`

**Variáveis de Ambiente:**
```env
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
⏳ SUPABASE_SERVICE_ROLE_KEY (para usar)
```

### 3. Providers ✅

**Criados:**
- ✅ `src/providers/auth-provider.tsx` - Gerencia autenticação
- ✅ `src/providers/tenant-provider.tsx` - Gerencia multi-tenant

**Funcionalidades:**
- ✅ Auth: user, loading, signOut
- ✅ Tenant: tenantId, company, profile, loading, refresh

### 4. Types ✅

**Arquivo:**
- ✅ `src/types/database.ts` (completo)

**Tipos Incluídos:**
- ✅ Database (todas tabelas)
- ✅ Role (5 roles)
- ✅ SubscriptionStatus (5 status)
- ✅ companies, profiles, subscriptions
- ✅ roles, permissions, role_permissions

### 5. Middleware ✅

**Arquivo:**
- ✅ `middleware.ts` (raiz)

**Funcionalidades:**
- ✅ Atualiza sessão Supabase
- ✅ Verifica autenticação
- ✅ Protege rotas privadas
- ✅ Redireciona rotas públicas (se logado)
- ⏳ Verificação de assinatura (Sprint 1)
- ⏳ Verificação RBAC (Sprint 1)

**Rotas Públicas:**
- `/login`
- `/register`
- `/forgot-password`

---

## ⏳ PRÓXIMAS TAREFAS (Sprint 0)

### 1. Autenticação 🔄

**Páginas a Criar:**
- [ ] `/src/app/login/page.tsx` - Página login
- [ ] `/src/app/register/page.tsx` - Página cadastro
- [ ] `/src/app/forgot-password/page.tsx` - Recuperar senha

**Server Actions:**
- [ ] `src/features/auth/actions/login.ts`
- [ ] `src/features/auth/actions/register.ts`
- [ ] `src/features/auth/actions/forgot-password.ts`

**Validators:**
- [ ] `src/features/auth/validators/login.schema.ts`
- [ ] `src/features/auth/validators/register.schema.ts`

**Fluxo Cadastro:**
```
1. Criar empresa (companies)
2. Criar usuário (auth.users)
3. Criar profile (profiles)
4. Criar assinatura trial (subscriptions)
5. Login automático
6. Redirect /dashboard
```

### 2. Layout Principal 🔄

**Criar:**
- [ ] `src/app/dashboard/layout.tsx` - Layout dashboard
- [ ] `src/components/layout/sidebar.tsx` - Menu lateral
- [ ] `src/components/layout/header.tsx` - Cabeçalho
- [ ] `src/components/layout/user-menu.tsx` - Menu usuário

**Sidebar Menu:**
```
- Dashboard
- Clientes
- Veículos
- Agendamentos
- Ordens de Serviço
- Financeiro
- Configurações
```

### 3. Dashboard Inicial 🔄

**Criar:**
- [ ] `src/app/dashboard/page.tsx` - Dashboard base

**KPIs Mockados:**
```typescript
const mockData = {
  receita: 'R$ 12.480,00',
  clientes: 89,
  veiculos: 142,
  osAbertas: 12,
};
```

### 4. Design System 🔄

**Tela Login (2 colunas):**

**Esquerda:**
- [ ] Logo AutoZen
- [ ] Título + Subtítulo
- [ ] 4 Cards animados (Framer Motion):
  - Veículos em atendimento (24)
  - Caixa do dia (R$ 3.480,00)
  - Agendamentos (18)
  - OS abertas (12)

**Direita:**
- [ ] Card Glass Premium
- [ ] Tabs: Entrar | Criar Empresa
- [ ] Formulário login/cadastro

**Cores (Tailwind):**
```typescript
// tailwind.config.ts
colors: {
  background: {
    primary: '#0A0F1C',
    secondary: '#151D2F',
  },
  primary: {
    DEFAULT: '#2563EB',
    glow: '#3B82F6',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
  },
}
```

### 5. Database Migrações 🔄

**Criar SQL:**
- [ ] `supabase/migrations/001_initial_schema.sql`

**Tabelas:**
```sql
- companies (UUID, name, cnpj, phone, email, logo_url, active, timestamps)
- profiles (UUID, user_id, tenant_id, name, role, avatar_url, phone, active, timestamps)
- subscriptions (UUID, tenant_id, plan, status, amount, trial dates, approved_by, timestamps)
- roles (UUID, name, description, created_at)
- permissions (UUID, name, resource, action, description, created_at)
- role_permissions (UUID, role_id, permission_id, created_at)
```

**Functions:**
```sql
- current_tenant_id() RETURNS UUID
- is_super_admin() RETURNS BOOLEAN
```

**RLS:**
```sql
- Policies por tabela
- Isolamento por tenant_id
```

### 6. Storage Buckets 🔄

**Criar no Supabase:**
- [ ] `companies` (logos)
- [ ] `avatars` (fotos usuários)
- [ ] `vehicles` (fotos veículos)
- [ ] `os-before` (fotos OS antes)
- [ ] `os-during` (fotos OS durante)
- [ ] `os-after` (fotos OS depois)
- [ ] `payment-proofs` (comprovantes PIX)
- [ ] `documents` (documentos gerais)

**Políticas:**
- Isolamento por tenant_id
- Upload apenas autenticados
- Read público (com token)

---

## 📊 Estatísticas Sprint 0

### Arquivos Criados (Até Agora)

| Categoria | Arquivos | Status |
|-----------|----------|--------|
| Estrutura | 13 pastas | ✅ |
| Supabase | 3 arquivos | ✅ |
| Providers | 2 arquivos | ✅ |
| Types | 1 arquivo | ✅ |
| Middleware | 1 arquivo | ✅ |
| **Total** | **20 items** | **✅** |

### Dependências Instaladas

| Pacote | Versão | Uso |
|--------|--------|-----|
| @supabase/ssr | latest | Cliente Supabase SSR |
| @supabase/supabase-js | latest | Cliente Supabase JS |
| zustand | latest | State management |
| react-hook-form | latest | Gerenciamento formulários |
| @hookform/resolvers | latest | Integração Zod + RHF |
| zod | latest | Validação schemas |

**Total:** 15 pacotes novos

---

## 🎯 Objetivos Sprint 0

### Completados ✅
- [x] ✅ Estrutura profissional src/
- [x] ✅ Supabase integração (client, server, middleware)
- [x] ✅ Providers (Auth, Tenant)
- [x] ✅ Types database completos
- [x] ✅ Middleware principal
- [x] ✅ Dependências instaladas

### Pendentes ⏳
- [ ] ⏳ Páginas autenticação (login, register, forgot-password)
- [ ] ⏳ Server actions autenticação
- [ ] ⏳ Layout dashboard (sidebar, header)
- [ ] ⏳ Dashboard inicial (KPIs mockados)
- [ ] ⏳ Design system implementado (tela login 2 colunas)
- [ ] ⏳ Migrações database SQL
- [ ] ⏳ Storage buckets criados

---

## 📈 Progresso Sprint 0

```
Completado:   ████████░░░░░░░░░░░░  40%
Pendente:     ████████████░░░░░░░░  60%
```

**Estimativa:** 
- ✅ Fundação (40%) - 4 horas
- ⏳ Autenticação (20%) - 2 horas
- ⏳ Layout (15%) - 1.5 horas
- ⏳ Dashboard (10%) - 1 hora
- ⏳ Design (10%) - 1 hora
- ⏳ Database (5%) - 0.5 horas

**Total Estimado:** 10 horas

---

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
npm run dev
# Servidor em http://localhost:3000
```

### Build
```bash
npm run build
# Validar estrutura
```

### Supabase Local (Futuro)
```bash
npx supabase init
npx supabase start
npx supabase migration new initial_schema
```

---

## 📞 Próximos Passos

### Imediato
1. ⏳ Criar páginas autenticação (login, register)
2. ⏳ Implementar server actions
3. ⏳ Criar tela login 2 colunas (design system)

### Depois
4. ⏳ Criar layout dashboard
5. ⏳ Implementar dashboard inicial
6. ⏳ Criar migrações SQL
7. ⏳ Configurar storage buckets

### Sprint 1
8. 🔜 CRUD Clientes
9. 🔜 CRUD Veículos
10. 🔜 Dashboard funcional

---

**Documento:** SPRINT_0_STATUS.md  
**Data:** Junho 2026  
**Status:** ⏳ **40% COMPLETO - FUNDAÇÃO PRONTA**

**Estrutura profissional criada! Pronto para implementar autenticação. 🚀**
