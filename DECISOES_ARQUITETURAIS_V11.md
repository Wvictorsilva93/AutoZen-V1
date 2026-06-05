# 🎯 AutoZen V11 - Decisões Arquiteturais Finais MVP

## 📌 Informações do Documento

| Campo | Valor |
|-------|-------|
| **Versão** | 11.0 FINAL |
| **Data** | Junho 2026 |
| **Status** | ✅ Decisões Aprovadas |
| **Tipo** | Arquitetura Definitiva MVP |
| **Objetivo** | Simplificar e Acelerar Lançamento |

---

## 🌐 DOMÍNIO E ESTRUTURA

### Estrutura Oficial Definida

```
Domínio Principal: autozen.com.br

├── www.autozen.com.br (futuro)
│   └── Landing page pública
│
└── app.autozen.com.br (MVP)
    └── Aplicação completa
```

### URLs da Aplicação

```
https://app.autozen.com.br/login
https://app.autozen.com.br/dashboard
https://app.autozen.com.br/clientes
https://app.autozen.com.br/veiculos
https://app.autozen.com.br/agendamentos
https://app.autozen.com.br/ordens-servico
https://app.autozen.com.br/financeiro
https://app.autozen.com.br/configuracoes
https://app.autozen.com.br/assinatura
https://app.autozen.com.br/super-admin (admin)
```

### ❌ NÃO Usar Subdomínios por Empresa

**Decisão:** Não utilizar subdomínios customizados no MVP.

**Motivo:**
- Simplicidade técnica
- Menor custo
- Lançamento mais rápido
- Complexidade de SSL/DNS

**Rejeitado:**
```
❌ empresa1.autozen.com.br
❌ empresa2.autozen.com.br
```

**Aprovado:**
```
✅ app.autozen.com.br (para TODAS as empresas)
```

### Identificação de Empresas

**Método:** `tenant_id` via autenticação Supabase

```typescript
// Usuário faz login
const { user } = await supabase.auth.getUser();

// Buscar tenant_id
const { data: profile } = await supabase
  .from('profiles')
  .select('tenant_id, companies(*)')
  .eq('user_id', user.id)
  .single();

// Todas as queries usam tenant_id
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('tenant_id', profile.tenant_id);
```

---

## 💰 COBRANÇA E ASSINATURA

### Modelo Inicial: PIX Manual

**Decisão:** Iniciar com PIX manual (sem gateway automático).

**Motivo:**
- ✅ Zero custo de integração
- ✅ Lançamento imediato
- ✅ Simplicidade operacional
- ✅ Validação rápida do modelo

**Futuro:** Integração Asaas/Mercado Pago após validação.

### Fluxo Completo de Assinatura

```
1. Cadastro de Empresa
   ↓
2. Trial de 14 dias AUTOMÁTICO
   ↓
3. Usar sistema gratuitamente
   ↓
4. Trial expira (14 dias)
   ↓
5. Sistema exibe tela "Renovar Assinatura"
   ↓
6. Cliente vê:
   - QR Code PIX (R$ 97,00)
   - Chave PIX: pix@autozen.com.br
   - Botão "Enviar Comprovante"
   ↓
7. Cliente realiza PIX
   ↓
8. Cliente faz upload do comprovante
   ↓
9. Status muda para "pending_payment"
   ↓
10. Super Admin recebe notificação
   ↓
11. Super Admin verifica pagamento
   ↓
12. Super Admin aprova
   ↓
13. Assinatura ativada
   ↓
14. Cliente volta a acessar sistema
```

### Tabela: subscriptions

**Schema Atualizado:**

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES companies NOT NULL,
  
  -- Plano
  plan TEXT DEFAULT 'autozen',
  amount DECIMAL(10,2) DEFAULT 97.00,
  
  -- Status
  status TEXT DEFAULT 'trial',
  -- trial, pending_payment, active, suspended, cancelled
  
  -- Trial
  trial_starts_at DATE DEFAULT CURRENT_DATE,
  trial_ends_at DATE DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  
  -- Período atual
  current_period_start DATE,
  current_period_end DATE,
  
  -- Comprovante PIX (NOVO)
  payment_proof_url TEXT,
  payment_date DATE,
  payment_notes TEXT,
  
  -- Aprovação (NOVO)
  approved_by UUID REFERENCES profiles,
  approved_at TIMESTAMPTZ,
  
  -- Cancelamento
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Status da Assinatura

| Status | Descrição | Acesso ao Sistema |
|--------|-----------|-------------------|
| **trial** | Trial de 14 dias | ✅ Liberado |
| **pending_payment** | Aguardando aprovação do pagamento | ❌ Bloqueado |
| **active** | Pagamento aprovado | ✅ Liberado |
| **suspended** | Suspenso por falta de pagamento | ❌ Bloqueado |
| **cancelled** | Cancelado pelo cliente | ❌ Bloqueado |

---

## 👑 SUPER ADMIN

### Nova Área: /super-admin

**Rota:** `https://app.autozen.com.br/super-admin`

**Acesso:** Apenas usuários com role `super_admin`

### Funcionalidades

#### 1. Gestão de Assinaturas

**Rota:** `/super-admin/subscriptions`

**Listagem:**
```typescript
interface SubscriptionListItem {
  company_name: string;
  company_email: string;
  status: string;
  trial_ends_at: Date;
  payment_proof_url?: string;
  amount: number;
  created_at: Date;
}
```

**Filtros:**
- Status (todos, trial, pending, active, suspended)
- Data (últimos 7/30/90 dias)
- Busca (nome empresa, email)

**Ações:**
- ✅ Visualizar detalhes
- ✅ Aprovar pagamento
- ✅ Rejeitar pagamento
- ✅ Suspender empresa
- ✅ Reativar empresa
- ✅ Ver histórico

#### 2. Aprovar Pagamento

**Fluxo:**
```typescript
async function approvePayment(subscriptionId: string, adminId: string) {
  // 1. Ver comprovante
  const proof = await getPaymentProof(subscriptionId);
  
  // 2. Aprovar
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_start: new Date(),
      current_period_end: addMonths(new Date(), 1),
      approved_by: adminId,
      approved_at: new Date(),
    })
    .eq('id', subscriptionId);
  
  // 3. Notificar cliente (email/WhatsApp)
  await sendNotification(tenant_id, 'Pagamento aprovado!');
  
  // 4. Registrar auditoria
  await logAudit('approve_payment', subscriptionId, adminId);
}
```

#### 3. Suspender Empresa

```typescript
async function suspendCompany(tenantId: string, reason: string) {
  await supabase
    .from('subscriptions')
    .update({
      status: 'suspended',
      cancellation_reason: reason,
    })
    .eq('tenant_id', tenantId);
}
```

#### 4. Dashboard Super Admin

**Métricas:**
- Total de empresas
- Empresas em trial
- Empresas ativas (pagando)
- Pagamentos pendentes
- MRR (Monthly Recurring Revenue)
- Churn rate

---

## 📦 STORAGE ATUALIZADO

### Buckets Definitivos

```typescript
const STORAGE_BUCKETS = {
  // Existentes
  companies: 'companies',           // Logos empresas
  avatars: 'avatars',               // Avatares usuários
  vehicles: 'vehicles',             // Fotos veículos
  osBefore: 'os-before',            // Fotos OS antes
  osDuring: 'os-during',            // Fotos OS durante
  osAfter: 'os-after',              // Fotos OS depois
  documents: 'documents',           // Documentos gerais
  
  // NOVO
  paymentProofs: 'payment-proofs', // Comprovantes PIX
};
```

### Estrutura de Pastas

```
payment-proofs/
└── {tenant_id}/
    └── {subscription_id}_proof.jpg
    
Exemplo:
payment-proofs/abc123-def456/sub789_proof.jpg
```

### Upload de Comprovante

```typescript
async function uploadPaymentProof(
  tenantId: string,
  subscriptionId: string,
  file: File
) {
  const fileName = `${subscriptionId}_proof.${file.name.split('.').pop()}`;
  const filePath = `${tenantId}/${fileName}`;
  
  // Upload
  const { data, error } = await supabase.storage
    .from('payment-proofs')
    .upload(filePath, file);
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(filePath);
  
  // Atualizar subscription
  await supabase
    .from('subscriptions')
    .update({
      payment_proof_url: publicUrl,
      payment_date: new Date(),
      status: 'pending_payment',
    })
    .eq('id', subscriptionId);
  
  return publicUrl;
}
```

---

## 🖥️ HOSPEDAGEM

### Plataforma: Hostinger Node.js

**Decisão:** Usar plano Node.js da Hostinger (não PHP).

**Stack de Produção:**
```
Next.js 16+ (standalone)
Node.js 22+
PM2 (process manager)
Nginx (reverse proxy)
SSL (Let's Encrypt)
```

### Arquitetura Simplificada

```
Browser
  ↓
Nginx (porta 80/443)
  ↓ (proxy_pass)
Next.js (porta 3000)
  ↓
Supabase (PostgreSQL + Auth + Storage)
```

### ❌ NÃO Usar PHP no MVP

**Motivo:**
- Next.js já é full-stack
- Supabase é o backend
- Sem necessidade de PHP

---

## 🔧 PROCESS MANAGER: PM2

### Comandos Essenciais

```bash
# Iniciar
pm2 start npm --name "autozen" -- start

# Reiniciar
pm2 restart autozen

# Parar
pm2 stop autozen

# Logs
pm2 logs autozen

# Monitorar
pm2 monit

# Salvar configuração
pm2 save

# Startup (reiniciar após reboot)
pm2 startup
```

### Configuração PM2

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'autozen',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    }
  }]
};
```

---

## 🔐 VARIÁVEIS DE AMBIENTE

### Frontend (Públicas)

```env
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://rpakyjmdijhmpqsnnjke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://app.autozen.com.br
```

### Servidor (Privadas)

```env
# .env.local (NUNCA commitar)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=seu_jwt_secret_aqui
APP_URL=https://app.autozen.com.br
NODE_ENV=production

# PIX
PIX_KEY=pix@autozen.com.br
```

### ⚠️ NUNCA Expor

```
❌ SUPABASE_SERVICE_ROLE_KEY
❌ JWT_SECRET
❌ Database credentials
```

Apenas usar server-side:
```typescript
// ✅ Server Component ou API Route
import { createServerClient } from '@/lib/supabase/server';

// ❌ Client Component
// Usar apenas NEXT_PUBLIC_* vars
```

---

## 💳 TELA DE ASSINATURA

### Rota: /assinatura

**Exibir:**

```typescript
interface SubscriptionInfo {
  // Plano
  plan_name: 'AutoZen';
  price: 'R$ 97,00/mês';
  
  // Status
  status: 'trial' | 'pending_payment' | 'active' | 'suspended';
  
  // Trial
  trial_ends_at?: Date;
  days_left?: number;
  
  // Pagamento
  payment_proof_url?: string;
  approved_at?: Date;
  
  // Período
  current_period_start?: Date;
  current_period_end?: Date;
}
```

**UI States:**

#### Estado 1: Trial Ativo
```
✅ Trial Ativo
Você tem 12 dias restantes de teste grátis.

Após o trial, o valor é R$ 97,00/mês.

[Informações do Plano]
```

#### Estado 2: Trial Expirado
```
⚠️ Trial Expirado
Seu período de teste terminou.

Para continuar usando o AutoZen, renove sua assinatura.

Plano AutoZen: R$ 97,00/mês

[QR Code PIX]
Chave PIX: pix@autozen.com.br

[Botão: Enviar Comprovante]
```

#### Estado 3: Aguardando Aprovação
```
⏳ Pagamento em Análise
Recebemos seu comprovante e estamos verificando o pagamento.

Você será notificado em breve.

[Ver Comprovante Enviado]
```

#### Estado 4: Ativo
```
✅ Assinatura Ativa
Seu plano está ativo até 15/07/2026.

Próximo vencimento: R$ 97,00 em 15/07/2026

[Histórico de Pagamentos]
[Cancelar Assinatura]
```

#### Estado 5: Suspenso
```
❌ Assinatura Suspensa
Seu acesso foi suspenso por falta de pagamento.

Para reativar, entre em contato:
suporte@autozen.com.br
```

---

## 🛡️ MIDDLEWARE DE ASSINATURA

### Verificação em Cascade

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // 1. Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && !isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (session) {
    // 2. Buscar tenant e assinatura
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, subscriptions(*)')
      .eq('user_id', session.user.id)
      .single();
    
    if (!profile) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
    
    // 3. Verificar assinatura
    const subscription = profile.subscriptions;
    const allowedStatuses = ['trial', 'active'];
    
    if (!allowedStatuses.includes(subscription.status)) {
      // Bloquear acesso
      if (req.nextUrl.pathname !== '/assinatura') {
        return NextResponse.redirect(new URL('/assinatura', req.url));
      }
    }
    
    // 4. Trial expirando (aviso)
    if (subscription.status === 'trial') {
      const daysLeft = daysBetween(new Date(), subscription.trial_ends_at);
      if (daysLeft <= 3) {
        // Mostrar banner de aviso
        res.cookies.set('trial_warning', `${daysLeft}`);
      }
    }
  }
  
  return res;
}

// Rotas protegidas vs públicas
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  return publicRoutes.some(route => pathname.startsWith(route));
}
```

---

## 📋 MVP FINAL - CHECKLIST

### Módulos Implementados

- [x] ✅ **Login** - Email/Senha
- [x] ✅ **Cadastro Empresa** - Onboarding completo
- [x] ✅ **Multi-Tenant** - RLS ativo, isolamento total
- [x] ✅ **Dashboard** - KPIs + Gráficos
- [x] ✅ **Clientes** - CRUD completo
- [x] ✅ **Veículos** - CRUD completo
- [x] ✅ **Agendamentos** - Criar, editar, cancelar
- [x] ✅ **Ordens de Serviço** - Core produto + PDF
- [x] ✅ **Financeiro** - Receber/Pagar/Fluxo
- [x] ✅ **Configurações** - Empresa + Usuários
- [x] ✅ **Assinatura** - Trial + PIX manual
- [x] ✅ **Upload Comprovante PIX** - Cliente envia
- [x] ✅ **Painel Super Admin** - Aprovar pagamentos

### Infraestrutura

- [x] ✅ Domínio: app.autozen.com.br
- [x] ✅ Hospedagem: Hostinger Node.js
- [x] ✅ SSL: Let's Encrypt
- [x] ✅ PM2: Process manager
- [x] ✅ Nginx: Reverse proxy
- [x] ✅ Supabase: Conectado e funcionando

---

## 🚀 ESTRATÉGIA DE LANÇAMENTO

### Timeline

| Semana | Atividade | Meta |
|--------|-----------|------|
| **1** | Sistema 100% funcional | Deploy produção |
| **2** | Cadastrar primeiros testes | 5 empresas teste |
| **3** | Primeiros clientes reais | 10 empresas pagantes |

### Metas Financeiras

#### Meta Inicial (Mês 1)
```
10 empresas × R$ 97 = R$ 970/mês
```

#### Meta Validação (Mês 6)
```
50 empresas × R$ 97 = R$ 4.850/mês
```

#### Meta Expansão (Mês 12)
```
100 empresas × R$ 97 = R$ 9.700/mês
R$ 116.400/ano (ARR)
```

#### Breakeven
```
Custos mensais estimados: R$ 1.500
Breakeven: 16 empresas
```

---

## 💡 BENEFÍCIOS DA ARQUITETURA SIMPLIFICADA

### 1. Menor Custo Operacional
- ✅ Sem gateway de pagamento (taxas 3-5%)
- ✅ Hospedagem simples (Node.js)
- ✅ Sem serviços externos

### 2. Menor Complexidade Técnica
- ✅ Sem subdomínios customizados
- ✅ Sem certificados SSL múltiplos
- ✅ Sem integração Asaas/Mercado Pago (inicial)
- ✅ Stack única (Next.js)

### 3. Lançamento Mais Rápido
- ✅ MVP pronto em 8 semanas
- ✅ Validação rápida do modelo
- ✅ Feedback real dos clientes

### 4. Escalabilidade Futura
- ✅ Estrutura preparada para Asaas
- ✅ Fácil adicionar PIX automático
- ✅ Fácil adicionar cobrança recorrente
- ✅ Fácil adicionar subdomínios

---

## 🔄 ROADMAP PÓS-MVP

### Fase 1: Validação (3 meses)
- ✅ Lançar com PIX manual
- ✅ Coletar feedback
- ✅ Ajustar produto

### Fase 2: Automação (6 meses)
- 🔷 Integrar Asaas
- 🔷 PIX automático
- 🔷 Cobrança recorrente
- 🔷 Boleto (opcional)

### Fase 3: Expansão (12 meses)
- 🚀 Subdomínios customizados
- 🚀 White label
- 🚀 API pública
- 🚀 Integrações (WhatsApp, Google Calendar)

---

## 🎯 RESULTADO FINAL

Arquitetura **simplificada e pragmática** para MVP com:

✅ **Lançamento Rápido** - 8 semanas  
✅ **Custo Baixo** - Sem taxas de gateway  
✅ **Operação Simples** - Aprovação manual inicial  
✅ **Escalável** - Pronta para crescer  
✅ **Validável** - Testar modelo rapidamente  
✅ **Sustentável** - Breakeven em 16 empresas  

O AutoZen inicia com o **essencial funcionando perfeitamente**, sem complexidade prematura, permitindo validação rápida do modelo de negócio e evolução baseada em feedback real dos clientes.

---

**Documento:** DECISOES_ARQUITETURAIS_V11.md  
**Versão:** 11.0 FINAL  
**Data:** Junho 2026  
**Status:** ✅ Decisões Aprovadas e Finalizadas

**Arquitetura simplificada, pragmática e pronta para lançamento! 🚀**
