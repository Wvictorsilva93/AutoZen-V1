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
