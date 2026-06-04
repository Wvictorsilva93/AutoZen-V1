# 🏗️ Arquitetura do AutoZen

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                      AUTOZEN FRONTEND                        │
│                    (Next.js 16 + React 19)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌────────┐          ┌──────────┐          ┌──────────┐
   │  AUTH  │          │   DASH   │          │  GESTÃO  │
   │ SCREEN │          │  BOARD   │          │  MODULES │
   └────────┘          └──────────┘          └──────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   SUPABASE API   │
                    │   (PHP LAYER)    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   POSTGRESQL     │
                    │  (Multi-Tenant)  │
                    └──────────────────┘
```

---

## 🗂️ Estrutura de Pastas Detalhada

```
AutoZen/
│
├── 📁 app/                          # Next.js App Router
│   ├── layout.tsx                   # Layout raiz (provider, fonts)
│   ├── page.tsx                     # Página inicial → AuthScreen
│   ├── globals.css                  # Estilos globais + Tailwind
│   │
│   ├── (auth)/                      # Grupo de rotas de auth
│   │   ├── login/                   # [Futuro] Rota /login
│   │   └── signup/                  # [Futuro] Rota /signup
│   │
│   └── (dashboard)/                 # Grupo de rotas protegidas
│       ├── dashboard/               # [Futuro] /dashboard
│       ├── clientes/                # [Futuro] /clientes
│       ├── veiculos/                # [Futuro] /veiculos
│       ├── servicos/                # [Futuro] /servicos
│       ├── financeiro/              # [Futuro] /financeiro
│       └── agendamentos/            # [Futuro] /agendamentos
│
├── 📁 components/                   # Componentes React
│   │
│   ├── 📁 auth/                     # ✅ Componentes de autenticação
│   │   ├── AuthScreen.tsx           # ✅ Tela principal (2 colunas)
│   │   ├── LoginForm.tsx            # ✅ Formulário de login
│   │   ├── SignupForm.tsx           # ✅ Formulário de cadastro
│   │   ├── FloatingCard.tsx         # ✅ Cards animados de métricas
│   │   └── AuthScreen.alternative.tsx # ✅ Versão sem logo
│   │
│   ├── 📁 effects/                  # ✅ Efeitos visuais
│   │   └── ParticleField.tsx        # ✅ Canvas com partículas animadas
│   │
│   ├── 📁 ui/                       # ✅ Componentes base (Design System)
│   │   ├── button.tsx               # ✅ Botão premium
│   │   ├── input.tsx                # ✅ Input glassmorphism
│   │   ├── checkbox.tsx             # ✅ Checkbox custom
│   │   └── tabs.tsx                 # ✅ Tabs animadas
│   │
│   ├── 📁 dashboard/                # [Futuro] Componentes do dashboard
│   ├── 📁 clientes/                 # [Futuro] Gestão de clientes
│   ├── 📁 veiculos/                 # [Futuro] Gestão de veículos
│   └── 📁 layout/                   # [Futuro] Header, Sidebar, etc
│
├── 📁 lib/                          # Utilitários e helpers
│   ├── utils.ts                     # ✅ Função cn (classnames merge)
│   ├── supabase.ts                  # [Futuro] Cliente Supabase
│   ├── api.ts                       # [Futuro] API helpers
│   └── validations.ts               # [Futuro] Schemas Zod
│
├── 📁 hooks/                        # [Futuro] Custom React Hooks
│   ├── useAuth.ts                   # [Futuro] Hook de autenticação
│   ├── useUser.ts                   # [Futuro] Hook de usuário
│   └── useTenant.ts                 # [Futuro] Hook multi-tenant
│
├── 📁 types/                        # [Futuro] TypeScript types
│   ├── auth.ts                      # [Futuro] Types de autenticação
│   ├── user.ts                      # [Futuro] Types de usuário
│   └── database.ts                  # [Futuro] Types do banco
│
├── 📁 public/                       # Arquivos estáticos
│   ├── logo-autozen.png            # ⚠️ Logo (adicionar manualmente)
│   ├── favicon.ico                  # [Futuro] Favicon
│   └── images/                      # [Futuro] Outras imagens
│
├── 📁 styles/                       # [Opcional] Estilos adicionais
│
└── 📁 docs/                         # [Opcional] Documentação interna

```

---

## 🎯 Fluxo de Autenticação

```
┌────────────┐
│   USUÁRIO  │
└──────┬─────┘
       │
       ▼
┌─────────────────────────────────────┐
│      AuthScreen Component           │
│  ┌───────────┐    ┌──────────────┐  │
│  │   Hero    │    │  Auth Card   │  │
│  │ (esquerda)│    │   (direita)  │  │
│  └───────────┘    └──────┬───────┘  │
└─────────────────────────┼───────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
         ┌─────────────┐    ┌──────────────┐
         │ LoginForm   │    │ SignupForm   │
         └──────┬──────┘    └──────┬───────┘
                │                  │
                └────────┬─────────┘
                         │
                         ▼
                ┌────────────────┐
                │ Validação Form │
                └────────┬───────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Supabase Auth  │
                └────────┬────────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
           ┌────────┐       ┌─────────┐
           │ Success│       │  Error  │
           └────┬───┘       └────┬────┘
                │                │
                ▼                ▼
         ┌───────────┐    ┌───────────┐
         │ Dashboard │    │ Mensagem  │
         └───────────┘    └───────────┘
```

---

## 🎨 Design System - Hierarquia

```
┌─────────────────────────────────────────────────────┐
│               TAILWIND CONFIG                        │
│  (Cores, Fontes, Animações, Breakpoints)           │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│               GLOBALS.CSS                            │
│  (Utilitários customizados: glass-card, glow, etc)  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│           COMPONENTES BASE (ui/)                     │
│  Button, Input, Checkbox, Tabs                      │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│      COMPONENTES COMPOSTOS (auth/, effects/)         │
│  AuthScreen, FloatingCard, ParticleField            │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│               PÁGINAS (app/)                         │
│  Layout → Page → Components                         │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados (Estado)

### Estado Atual (Client-Side)

```
┌──────────────────┐
│  React useState  │  ← Formulários (email, senha, etc)
└──────────────────┘

┌──────────────────┐
│ Framer Motion    │  ← Animações (variants, controls)
└──────────────────┘
```

### Estado Futuro (Recomendado)

```
┌──────────────────────────────────────────────┐
│              SUPABASE AUTH                    │
│         (Session Management)                  │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│         ZUSTAND / REDUX TOOLKIT              │
│    (Global State: user, tenant, etc)         │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│          REACT QUERY / SWR                   │
│   (Server State: cache, mutations)           │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│            COMPONENTES                        │
│         (Consume state)                       │
└──────────────────────────────────────────────┘
```

---

## 🗄️ Arquitetura do Banco (Multi-Tenant)

```sql
-- ESTRATÉGIA: Shared Schema (coluna tenant_id em todas tabelas)

┌─────────────────────────────────────────┐
│           POSTGRESQL                     │
└─────────────────────────────────────────┘
             │
             ├── 📊 public.tenants
             │     ├── id (PK)
             │     ├── company_name
             │     ├── subdomain
             │     └── created_at
             │
             ├── 📊 public.users
             │     ├── id (PK)
             │     ├── tenant_id (FK)
             │     ├── email
             │     ├── password_hash
             │     └── role
             │
             ├── 📊 public.clientes
             │     ├── id (PK)
             │     ├── tenant_id (FK) ← Isolamento
             │     ├── nome
             │     └── ...
             │
             ├── 📊 public.veiculos
             │     ├── id (PK)
             │     ├── tenant_id (FK) ← Isolamento
             │     ├── cliente_id (FK)
             │     ├── placa
             │     └── ...
             │
             ├── 📊 public.servicos
             │     ├── id (PK)
             │     ├── tenant_id (FK) ← Isolamento
             │     └── ...
             │
             └── 📊 public.ordens_servico
                   ├── id (PK)
                   ├── tenant_id (FK) ← Isolamento
                   ├── veiculo_id (FK)
                   └── ...

-- Índices importantes em TODAS as tabelas:
CREATE INDEX idx_tenant_id ON public.clientes(tenant_id);
CREATE INDEX idx_tenant_id ON public.veiculos(tenant_id);
-- etc...

-- Row Level Security (RLS) no Supabase:
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON public.clientes
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

---

## 🔐 Segurança

```
┌─────────────────────────────────────────────┐
│          CAMADAS DE SEGURANÇA               │
└─────────────────────────────────────────────┘

1. ┌───────────────────────────────────┐
   │   FRONTEND (Next.js)              │
   │   ✓ Client-side validation        │
   │   ✓ Input sanitization            │
   │   ✓ HTTPS only                    │
   └───────────────────────────────────┘

2. ┌───────────────────────────────────┐
   │   SUPABASE AUTH                   │
   │   ✓ JWT tokens                    │
   │   ✓ Email verification            │
   │   ✓ Password hashing (bcrypt)     │
   │   ✓ Rate limiting                 │
   └───────────────────────────────────┘

3. ┌───────────────────────────────────┐
   │   API LAYER (PHP)                 │
   │   ✓ Request validation            │
   │   ✓ Authorization checks          │
   │   ✓ SQL injection prevention      │
   └───────────────────────────────────┘

4. ┌───────────────────────────────────┐
   │   DATABASE (PostgreSQL)           │
   │   ✓ Row Level Security (RLS)      │
   │   ✓ Tenant isolation              │
   │   ✓ Encrypted at rest             │
   └───────────────────────────────────┘
```

---

## 🚀 Pipeline de Deploy

```
┌─────────────┐
│  DEV LOCAL  │  ← npm run dev (localhost:3000)
└──────┬──────┘
       │ git push
       ▼
┌─────────────┐
│  GITHUB     │  ← Repositório Git
└──────┬──────┘
       │ webhook
       ▼
┌─────────────┐
│   VERCEL    │  ← Build automático
└──────┬──────┘
       │ deploy
       ▼
┌─────────────┐
│  PRODUCTION │  ← autozen.vercel.app
└─────────────┘

Conecta com:
┌──────────────┐      ┌──────────────┐
│  SUPABASE    │◄────►│ POSTGRESQL   │
│  (Hosted)    │      │  (Hosted)    │
└──────────────┘      └──────────────┘
```

---

## 📊 Performance

### Otimizações Implementadas

```
✅ Next.js Image Optimization
   - Lazy loading automático
   - Responsive images
   - WebP format

✅ Code Splitting
   - Dynamic imports
   - Route-based splitting
   - Component-level splitting

✅ CSS Optimization
   - Tailwind purging (remove unused)
   - Critical CSS inline
   - Minificação

✅ Bundle Size
   - Tree shaking
   - Compression (gzip/brotli)
   - Minimal dependencies

⚡ Lighthouse Score Esperado:
   - Performance: 95+
   - Accessibility: 100
   - Best Practices: 100
   - SEO: 100
```

---

## 🧪 Testes (Futuro)

```
┌─────────────────────────────────────────────┐
│           PIRÂMIDE DE TESTES                │
└─────────────────────────────────────────────┘

      ┌─────────────────┐
      │   E2E (Cypress) │  ← Poucos, críticos
      └────────┬────────┘
               │
       ┌───────┴────────┐
       │  Integration   │  ← Moderados
       │  (Testing Lib) │
       └───────┬────────┘
               │
        ┌──────┴───────┐
        │    Unit      │  ← Muitos, rápidos
        │    (Jest)    │
        └──────────────┘
```

---

## 🔮 Roadmap Técnico

### Fase 1: MVP ✅ (ATUAL)
- ✅ Tela de autenticação premium
- ✅ Design system base
- ✅ Componentes UI
- ✅ Animações e efeitos

### Fase 2: Autenticação Real
- [ ] Integração Supabase Auth
- [ ] Recuperação de senha
- [ ] Verificação de email
- [ ] Multi-tenant setup

### Fase 3: Dashboard
- [ ] Layout com sidebar
- [ ] Cards de métricas reais
- [ ] Gráficos (Recharts/Chart.js)
- [ ] Tabelas de dados

### Fase 4: Módulos de Gestão
- [ ] CRUD Clientes
- [ ] CRUD Veículos
- [ ] CRUD Serviços
- [ ] Ordens de Serviço
- [ ] Agendamentos
- [ ] Financeiro

### Fase 5: Features Avançadas
- [ ] Notificações real-time
- [ ] Chat interno
- [ ] Upload de fotos (antes/depois)
- [ ] Relatórios PDF
- [ ] Exportação de dados
- [ ] Integração WhatsApp

### Fase 6: Mobile
- [ ] Progressive Web App (PWA)
- [ ] App mobile (React Native/Expo)

---

## 🛠️ Ferramentas de Desenvolvimento

```
VSCode Extensions Recomendadas:
├── ES7+ React/Redux/React-Native snippets
├── Tailwind CSS IntelliSense
├── Prettier - Code formatter
├── ESLint
├── Error Lens
├── GitLens
├── Auto Rename Tag
└── Path Intellisense

Scripts Úteis:
├── npm run dev          → Desenvolvimento
├── npm run build        → Build produção
├── npm run start        → Rodar produção
├── npm run lint         → Verificar código
├── npm run type-check   → Verificar types (futuro)
└── npm run test         → Rodar testes (futuro)
```

---

## 📈 Métricas e Monitoramento (Futuro)

```
┌────────────────────┐
│   VERCEL ANALYTICS │  ← Web Vitals, Performance
└────────────────────┘

┌────────────────────┐
│  GOOGLE ANALYTICS  │  ← Usuários, Conversões
└────────────────────┘

┌────────────────────┐
│      SENTRY        │  ← Error Tracking
└────────────────────┘

┌────────────────────┐
│  SUPABASE LOGS     │  ← Database logs, Auth logs
└────────────────────┘
```

---

## 🎯 Conclusão

Esta arquitetura foi projetada para:

✅ **Escalabilidade** - Pode crescer de 10 a 10.000 tenants  
✅ **Manutenibilidade** - Código organizado e documentado  
✅ **Performance** - Otimizado para velocidade  
✅ **Segurança** - Multi-camadas de proteção  
✅ **Developer Experience** - Fácil de desenvolver  

**Status Atual:** Fundação sólida pronta para evoluir! 🚀
