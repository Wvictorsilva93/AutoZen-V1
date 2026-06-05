# 📝 AutoZen V11 - Changelog

## 📌 Informações do Documento

| Campo | Valor |
|-------|-------|
| **Versão** | 11.0 FINAL |
| **Data** | Junho 2026 |
| **Status** | ✅ Completo |
| **Tipo** | Histórico de Mudanças |
| **Documento Base** | [DECISOES_ARQUITETURAIS_V11.md](./DECISOES_ARQUITETURAIS_V11.md) |

---

## 🎯 O que mudou na V11?

A V11 representa **decisões arquiteturais definitivas para o MVP**, focando em **simplicidade, pragmatismo e velocidade de lançamento**.

---

## 🆕 Novidades Principais

### 1. 🌐 Estrutura de Domínio Definida

**Adicionado:**
- ✅ Domínio único: `app.autozen.com.br` para todas as empresas
- ✅ Identificação via `tenant_id` (Supabase Auth)
- ✅ Decisão de NÃO usar subdomínios customizados no MVP

**Motivo:**
- Reduzir complexidade técnica
- Eliminar custos com múltiplos certificados SSL
- Acelerar lançamento
- Simplificar DNS

**Referência:** Seção "DOMÍNIO E ESTRUTURA" em DECISOES_ARQUITETURAIS_V11.md

---

### 2. 💰 Modelo de Cobrança Simplificado

**Adicionado:**
- ✅ PIX Manual como método inicial
- ✅ Fluxo completo de cobrança (12 passos)
- ✅ Status: trial → pending_payment → active
- ✅ Integração Asaas/Mercado Pago movida para futuro

**Fluxo Novo:**
```
Cadastro → Trial 14 dias → Expira → Cliente faz PIX 
→ Envia comprovante → Admin aprova → Ativo
```

**Benefícios:**
- Zero custo de integração
- Lançamento imediato
- Validação rápida do modelo

**Referência:** Seção "COBRANÇA E ASSINATURA" em DECISOES_ARQUITETURAIS_V11.md

---

### 3. 👑 Painel Super Admin

**Adicionado:**
- ✅ Nova rota: `/super-admin/subscriptions`
- ✅ Listagem de todas as assinaturas
- ✅ Filtros (status, data, busca)
- ✅ Ação: Aprovar pagamento
- ✅ Ação: Rejeitar pagamento
- ✅ Ação: Suspender empresa
- ✅ Ação: Reativar empresa
- ✅ Ver histórico de pagamentos
- ✅ Dashboard com métricas (MRR, churn, empresas ativas)

**Funcionalidades:**
```typescript
- approvePayment(subscriptionId, adminId)
- rejectPayment(subscriptionId, reason)
- suspendCompany(tenantId, reason)
- reactivateCompany(tenantId)
- viewPaymentHistory(tenantId)
```

**Acesso:** Restrito a `super_admin` role

**Referência:** Seção "SUPER ADMIN" em DECISOES_ARQUITETURAIS_V11.md

---

### 4. 📦 Storage Atualizado

**Adicionado:**
- ✅ Novo bucket: `payment-proofs`

**Estrutura:**
```
payment-proofs/
└── {tenant_id}/
    └── {subscription_id}_proof.jpg
```

**Função:**
- Armazenar comprovantes de pagamento PIX
- Permitir visualização pelo super admin
- Manter histórico de comprovantes

**Total de Buckets:** 8 (7 existentes + 1 novo)

**Referência:** Seção "STORAGE ATUALIZADO" em DECISOES_ARQUITETURAIS_V11.md

---

### 5. 💳 Tabela `subscriptions` Atualizada

**Campos Adicionados:**

```sql
-- Comprovante PIX
payment_proof_url TEXT,
payment_date DATE,
payment_notes TEXT,

-- Aprovação
approved_by UUID REFERENCES profiles,
approved_at TIMESTAMPTZ,
```

**Novos Status:**
- `pending_payment` - Aguardando aprovação do comprovante

**Status Completos:**
1. `trial` - Trial de 14 dias (acesso liberado)
2. `pending_payment` - Aguardando aprovação (bloqueado) ⭐ NOVO
3. `active` - Pagamento aprovado (liberado)
4. `suspended` - Suspenso (bloqueado)
5. `cancelled` - Cancelado (bloqueado)

**Referência:** Seção "COBRANÇA E ASSINATURA" em DECISOES_ARQUITETURAIS_V11.md

---

### 6. 🛡️ Middleware de Assinatura

**Adicionado:**
- ✅ Verificação de assinatura em cascade
- ✅ Bloqueio de acesso para status inválidos
- ✅ Redirecionamento para `/assinatura`
- ✅ Banner de aviso (trial expirando em ≤3 dias)

**Lógica:**
```typescript
1. Verificar sessão autenticada
2. Buscar tenant + assinatura
3. Verificar status (trial | active = OK)
4. Bloquear se pending_payment | suspended | cancelled
5. Mostrar aviso se trial expirando
```

**Rotas Protegidas:**
- Todas exceto: `/login`, `/register`, `/assinatura`

**Referência:** Seção "MIDDLEWARE DE ASSINATURA" em DECISOES_ARQUITETURAIS_V11.md

---

### 7. 💳 Tela de Assinatura

**Adicionado:**
- ✅ 5 estados diferentes da assinatura
- ✅ QR Code PIX
- ✅ Chave PIX: `pix@autozen.com.br`
- ✅ Upload de comprovante
- ✅ Feedback visual por estado

**Estados:**

| Estado | Visual | Acesso |
|--------|--------|--------|
| Trial Ativo | ✅ Verde | Liberado |
| Trial Expirado | ⚠️ Amarelo | Bloqueado |
| Aguardando Aprovação | ⏳ Azul | Bloqueado |
| Ativo | ✅ Verde | Liberado |
| Suspenso | ❌ Vermelho | Bloqueado |

**Componentes Novos:**
- `SubscriptionCard` - Card principal
- `PaymentProofUpload` - Upload de comprovante
- `PIXQRCode` - QR Code gerado
- `SubscriptionStatus` - Badge de status

**Referência:** Seção "TELA DE ASSINATURA" em DECISOES_ARQUITETURAIS_V11.md

---

### 8. 🖥️ Hospedagem Definida

**Adicionado:**
- ✅ Plataforma: Hostinger Node.js (NÃO PHP)
- ✅ Stack: Next.js + Node.js 22+ + PM2 + Nginx
- ✅ Configs PM2 (ecosystem.config.js)
- ✅ Comandos PM2 documentados
- ✅ Arquitetura simplificada (Browser → Nginx → Next.js → Supabase)

**Decisão Importante:**
- ❌ NÃO usar PHP no MVP
- ✅ Next.js já é full-stack
- ✅ Supabase é o backend

**PM2 Comandos:**
```bash
pm2 start npm --name "autozen" -- start
pm2 restart autozen
pm2 logs autozen
pm2 monit
```

**Referência:** Seção "HOSPEDAGEM" em DECISOES_ARQUITETURAIS_V11.md

---

### 9. 🔐 Variáveis de Ambiente

**Adicionado:**
- ✅ Variável: `PIX_KEY=pix@autozen.com.br`
- ✅ Separação clara: Frontend (público) vs Servidor (privado)
- ✅ Alertas de segurança (NUNCA expor SERVICE_ROLE_KEY)

**Públicas (Frontend):**
```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
```

**Privadas (Servidor):**
```env
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
PIX_KEY ⭐ NOVO
```

**Referência:** Seção "VARIÁVEIS DE AMBIENTE" em DECISOES_ARQUITETURAIS_V11.md

---

### 10. 🚀 Estratégia de Lançamento

**Adicionado:**
- ✅ Timeline de 3 semanas
- ✅ Metas claras por semana
- ✅ Metas financeiras (inicial, validação, expansão)
- ✅ Breakeven: 16 empresas

**Timeline:**

| Semana | Meta |
|--------|------|
| 1 | Sistema funcional + Deploy |
| 2 | 5 empresas teste |
| 3 | 10 empresas pagantes |

**Metas Financeiras:**
- Mês 1: 10 empresas = R$ 970/mês
- Mês 6: 50 empresas = R$ 4.850/mês
- Mês 12: 100 empresas = R$ 9.700/mês (ARR: R$ 116.400)

**Referência:** Seção "ESTRATÉGIA DE LANÇAMENTO" em DECISOES_ARQUITETURAIS_V11.md

---

## 🔄 Mudanças em Relação à V10

### V10 (Prompt Mestre)
- Foco: Gerar projeto do zero
- Cobrança: Asaas direto (R$ 97/mês)
- Super Admin: Não mencionado
- Hospedagem: VPS genérico

### V11 (Decisões Finais)
- Foco: Decisões arquiteturais MVP
- Cobrança: PIX manual → Asaas futuro ✅ MUDOU
- Super Admin: Painel completo ✅ ADICIONADO
- Hospedagem: Hostinger Node.js + PM2 ✅ ESPECIFICADO

---

## 📊 Estatísticas de Mudanças

### Arquivos Criados
- ✅ `DECISOES_ARQUITETURAIS_V11.md` (~35KB)
- ✅ `RESUMO_V11.md` (~15KB)
- ✅ `CHANGELOG_V11.md` (este arquivo)
- ✅ `STATUS_V11.txt` (próximo)
- ✅ `INDICE.md` atualizado

### Database
- ✅ 2 novos campos em `subscriptions`
- ✅ 1 novo status: `pending_payment`
- ✅ 1 novo bucket: `payment-proofs`

### Frontend
- ✅ 1 nova rota: `/super-admin/subscriptions`
- ✅ 1 tela atualizada: `/assinatura` (5 estados)
- ✅ 4 novos componentes (SubscriptionCard, PaymentProofUpload, etc)
- ✅ 1 middleware atualizado: verificação de assinatura

### Backend
- ✅ 1 nova função: `uploadPaymentProof()`
- ✅ 1 nova função: `approvePayment()`
- ✅ 1 nova função: `suspendCompany()`
- ✅ 1 nova API: `/api/subscriptions/approve`
- ✅ 1 nova API: `/api/subscriptions/upload-proof`

### Infra
- ✅ Configs PM2 documentadas
- ✅ Nginx config atualizada
- ✅ Variáveis de ambiente definidas
- ✅ Estratégia de deploy definida

---

## ✅ Checklist de Implementação V11

### Database (SQL)
- [ ] Adicionar campos em `subscriptions` (payment_proof_url, approved_by, etc)
- [ ] Criar bucket `payment-proofs` no Supabase Storage
- [ ] Criar policies para `payment-proofs` (RLS)
- [ ] Atualizar seed data (testar novos campos)

### Backend (Server)
- [ ] Criar função `uploadPaymentProof()`
- [ ] Criar função `approvePayment()`
- [ ] Criar função `rejectPayment()`
- [ ] Criar função `suspendCompany()`
- [ ] Criar função `reactivateCompany()`
- [ ] Criar API `/api/subscriptions/approve`
- [ ] Criar API `/api/subscriptions/upload-proof`
- [ ] Criar API `/api/subscriptions/list` (super-admin)
- [ ] Atualizar middleware de assinatura

### Frontend (Client)
- [ ] Criar tela `/super-admin/subscriptions`
- [ ] Criar componente `SubscriptionCard`
- [ ] Criar componente `PaymentProofUpload`
- [ ] Criar componente `PIXQRCode`
- [ ] Criar componente `SubscriptionStatus`
- [ ] Atualizar tela `/assinatura` (5 estados)
- [ ] Adicionar filtros no painel super-admin
- [ ] Adicionar dashboard no super-admin (MRR, empresas)

### Infra (Deploy)
- [ ] Configurar PM2 no servidor
- [ ] Criar ecosystem.config.js
- [ ] Configurar Nginx
- [ ] Configurar SSL (Let's Encrypt)
- [ ] Configurar variáveis de ambiente produção
- [ ] Configurar chave PIX (pix@autozen.com.br)
- [ ] Testar deploy completo

### Testes
- [ ] Testar fluxo completo: Trial → PIX → Aprovação
- [ ] Testar upload de comprovante
- [ ] Testar aprovação manual (super-admin)
- [ ] Testar middleware bloqueando acesso
- [ ] Testar todos os 5 estados da assinatura
- [ ] Testar multi-tenant (isolamento)
- [ ] Testar suspensão de empresa
- [ ] Testar reativação de empresa

### Documentação
- [x] ✅ `DECISOES_ARQUITETURAIS_V11.md` criado
- [x] ✅ `RESUMO_V11.md` criado
- [x] ✅ `CHANGELOG_V11.md` criado
- [ ] `STATUS_V11.txt` criar
- [ ] `INDICE.md` atualizar
- [ ] Atualizar README.md (mencionar V11)

---

## 🎯 Features por Módulo

### Módulo: Assinatura
**Status:** ⭐ Expandido

**Antes (V10):**
- Trial de 14 dias
- Cobrança Asaas

**Depois (V11):**
- ✅ Trial de 14 dias
- ✅ PIX manual
- ✅ Upload de comprovante
- ✅ 5 estados visuais
- ✅ QR Code PIX
- ✅ Chave PIX
- ✅ Middleware de verificação
- ✅ Banner de aviso (trial expirando)

---

### Módulo: Super Admin
**Status:** ⭐ Novo

**Adicionado:**
- ✅ Rota `/super-admin/subscriptions`
- ✅ Listagem de assinaturas
- ✅ Filtros (status, data, busca)
- ✅ Aprovar pagamento
- ✅ Rejeitar pagamento
- ✅ Suspender empresa
- ✅ Reativar empresa
- ✅ Ver histórico
- ✅ Dashboard (MRR, churn, empresas ativas, trials)

---

### Módulo: Storage
**Status:** ⭐ Expandido

**Antes (V10):**
- 7 buckets

**Depois (V11):**
- ✅ 8 buckets (+ payment-proofs)
- ✅ Estrutura definida por bucket
- ✅ Policies RLS por bucket
- ✅ Função de upload documentada

---

### Módulo: Hospedagem
**Status:** ⭐ Especificado

**Antes (V10):**
- VPS Hostinger (genérico)

**Depois (V11):**
- ✅ Hostinger Node.js (específico)
- ✅ PM2 documentado
- ✅ Configs prontas (ecosystem.config.js)
- ✅ Nginx configurado
- ✅ Arquitetura simplificada
- ✅ Comandos documentados

---

## 💡 Decisões Técnicas Importantes

### 1. ❌ Subdomínios Customizados
**Decisão:** NÃO implementar no MVP

**Motivo:**
- Complexidade técnica alta
- Custo de SSL múltiplos
- Tempo de desenvolvimento (2-3 semanas)

**Alternativa:** `app.autozen.com.br` para todos

---

### 2. ❌ Gateway de Pagamento Automático
**Decisão:** NÃO integrar Asaas/Mercado Pago no MVP

**Motivo:**
- Custo mensal (R$ 300-500)
- Taxas por transação (3-5%)
- Complexidade de webhooks
- Tempo de integração (2 semanas)

**Alternativa:** PIX manual com aprovação admin

---

### 3. ❌ PHP no Stack
**Decisão:** NÃO usar PHP no MVP

**Motivo:**
- Next.js já é full-stack
- Supabase é o backend
- Evitar stack dupla
- Simplificar deploy

**Alternativa:** Next.js + Node.js + PM2

---

### 4. ✅ Middleware de Assinatura
**Decisão:** Implementar verificação em cada request

**Motivo:**
- Garantir controle de acesso
- Bloquear empresas inadimplentes
- Avisar trial expirando
- Redirecionar para /assinatura

**Implementação:** `middleware.ts` global

---

### 5. ✅ Super Admin Manual
**Decisão:** Aprovação manual de pagamentos (inicial)

**Motivo:**
- Controle total no início
- Validar modelo de negócio
- Evitar fraudes
- Feedback direto com clientes

**Futuro:** Automação via webhooks (Asaas)

---

## 📈 Benefícios Quantificados

### Economia de Custo

| Item | Custo Complexo | Custo Simples | Economia |
|------|---------------|---------------|----------|
| Gateway pagamento | R$ 500/mês | R$ 0 | R$ 500 |
| Infraestrutura | R$ 800/mês | R$ 500/mês | R$ 300 |
| Serviços externos | R$ 200/mês | R$ 0 | R$ 200 |
| **Total** | **R$ 1.500/mês** | **R$ 500/mês** | **R$ 1.000** |

**Novo Breakeven:** 16 empresas (vs 42 empresas)

---

### Economia de Tempo

| Fase | Complexo | Simples | Economia |
|------|----------|---------|----------|
| Integração Gateway | 2 semanas | 0 | -2 sem |
| Subdomínios + SSL | 1 semana | 0 | -1 sem |
| Webhooks | 1 semana | 0 | -1 sem |
| Testes | 1 semana | 3 dias | -4 dias |
| **Total** | **12 semanas** | **8 semanas** | **-4 sem** |

---

## 🔄 Roadmap de Automação

### MVP (Mês 0-3) ⭐ V11
```
PIX Manual
├─ Cliente faz PIX
├─ Envia comprovante
├─ Admin aprova manualmente
└─ Assinatura ativa
```

### V1.1 (Mês 4-6)
```
Semi-Automação
├─ Asaas integrado
├─ PIX manual como opção
├─ Webhook confirmação
└─ Email automático
```

### V2.0 (Mês 7-12)
```
Automação Total
├─ PIX automático
├─ Cartão recorrente
├─ Retry pagamento
├─ Notificações
└─ Operação 100% automática
```

---

## 📞 Suporte

- 📧 Email: suporte@autozen.com.br
- 💬 Discord: (em breve)
- 📱 WhatsApp: (em breve)

---

## 📚 Arquivos Relacionados

### V11 (Junho 2026)
- **[DECISOES_ARQUITETURAIS_V11.md](./DECISOES_ARQUITETURAIS_V11.md)** ⭐ Documento principal
- **[RESUMO_V11.md](./RESUMO_V11.md)** ⭐ Resumo executivo
- **[CHANGELOG_V11.md](./CHANGELOG_V11.md)** ⭐ Este documento
- **[STATUS_V11.txt](./STATUS_V11.txt)** - Status visual (próximo)
- **[INDICE.md](./INDICE.md)** - Índice atualizado (próximo)

### Versões Anteriores
- **[PROMPT_MESTRE_V10.md](./PROMPT_MESTRE_V10.md)** - V10
- **[PLANO_DESENVOLVIMENTO_V9.md](./PLANO_DESENVOLVIMENTO_V9.md)** - V9
- **[PRD_V8.md](./PRD_V8.md)** - V8
- **[ESTRUTURA_CODIGO_V7.md](./ESTRUTURA_CODIGO_V7.md)** - V7

---

**Documento:** CHANGELOG_V11.md  
**Versão:** 11.0 FINAL  
**Data:** Junho 2026  
**Status:** ✅ Completo

**Todas as mudanças documentadas e prontas para implementação! 📝**
