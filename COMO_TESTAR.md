# 🧪 Como Testar o AutoZen V4

## ✅ Pré-requisitos

- Node.js 22+ instalado
- NPM instalado
- Conta no Supabase

## 📋 Passo a Passo Completo

### 1️⃣ Aplicar Schema no Supabase

**⚠️ IMPORTANTE: Faça isso PRIMEIRO!**

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: **rpakyjmdijhmpqsnnjke**
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Abra o arquivo: `supabase/schema.sql`
6. Copie TODO o conteúdo
7. Cole no editor SQL
8. Clique em **Run** (ou pressione Ctrl+Enter)
9. Aguarde a mensagem: **"Success. No rows returned"**

**O que foi criado:**
- ✅ 11 tabelas (companies, users, customers, vehicles, etc.)
- ✅ RLS habilitado em todas
- ✅ 44 policies de segurança
- ✅ Triggers automáticos
- ✅ Functions (generate_order_number)
- ✅ Views (v_revenue_by_period)
- ✅ Indexes otimizados

### 2️⃣ Verificar Variáveis de Ambiente

O arquivo `.env.local` já está configurado com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rpakyjmdijhmpqsnnjke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Não precisa alterar nada!

### 3️⃣ Instalar Dependências

```bash
npm install
```

Aguarde a instalação (~1 minuto).

### 4️⃣ Testar Build

```bash
npm run build
```

**Esperado:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ 14 pages generated
✓ Build completed
```

Se der erro, verifique se o schema foi aplicado no Supabase.

### 5️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 6️⃣ Cadastrar Nova Empresa

1. Na tela inicial, clique na tab **"Criar Empresa"**
2. Preencha os dados:
   - **Nome da Empresa:** Lava Jato Teste
   - **Responsável:** João Silva
   - **WhatsApp:** (11) 99999-9999
   - **Email:** teste@email.com *(use um email único)*
   - **Senha:** senha123
3. Clique em **"Criar Minha Empresa"**

**O que acontece:**
- ✅ Cria conta no Supabase Auth
- ✅ Cria empresa na tabela `companies` (status: **trial**, 7 dias)
- ✅ Cria usuário na tabela `users` (role: **admin_empresa**)
- ✅ Faz login automático
- ✅ Redireciona para `/dashboard`

**Se der erro "Email já cadastrado":**
Use outro email ou delete o anterior no Supabase:
```sql
DELETE FROM auth.users WHERE email = 'teste@email.com';
```

### 7️⃣ Explorar o Dashboard

Após o login, você verá:

**Header:**
- Seu nome e role
- Nome da empresa

**Sidebar:**
- Logo AutoZen
- 11 módulos disponíveis
- Status da empresa
- Botão de logout

**Dashboard:**
- 8 cards de métricas (inicialmente zerados)
- Mensagem de boas-vindas
- Banner de trial (7 dias restantes)
- Placeholders para gráficos

### 8️⃣ Testar CRUD de Clientes

1. No sidebar, clique em **"Clientes"**
2. Clique em **"Novo Cliente"**
3. Preencha:
   - **Nome:** Maria Silva
   - **Telefone:** (11) 98888-8888
   - **Email:** maria@exemplo.com
   - **Observações:** Cliente VIP
4. Clique em **"Salvar"**

**Você verá:**
- ✅ Cliente aparece na tabela
- ✅ Estatísticas atualizadas (Total de Clientes: 1)
- ✅ Busca funcional

**Testar busca:**
- Digite "Maria" na busca
- Cliente é filtrado em tempo real

**Testar edição:**
- Clique no ícone de lápis (Edit)
- Altere o telefone
- Clique em "Atualizar"

**Testar exclusão:**
- Clique no ícone de lixeira (Delete)
- Confirme a exclusão

### 9️⃣ Testar CRUD de Veículos

1. **Adicione um cliente primeiro** (se não tiver)
2. No sidebar, clique em **"Veículos"**
3. Clique em **"Novo Veículo"**
4. Preencha:
   - **Cliente:** Maria Silva
   - **Placa:** ABC1234
   - **Marca:** Toyota
   - **Modelo:** Corolla
   - **Cor:** Preto
   - **Tipo:** Carro
5. Clique em **"Salvar"**

**Você verá:**
- ✅ Veículo aparece na tabela
- ✅ Placa formatada automaticamente
- ✅ Estatísticas por tipo (Carro: 1)

**Testar busca:**
- Digite "ABC" ou "Toyota"
- Veículo é filtrado

**Testar placa duplicada:**
- Tente cadastrar outro veículo com a mesma placa
- Deve aparecer erro: "Placa já cadastrada"

### 🔟 Verificar Isolamento Multi-Tenant

**Teste 1: Criar outra empresa**

1. Faça logout
2. Cadastre outra empresa com email diferente
3. Faça login com a nova empresa
4. Vá em Clientes e Veículos
5. **Resultado:** Não deve ver os dados da primeira empresa

**Teste 2: Via SQL (avançado)**

```sql
-- Ver todas as empresas
SELECT id, name, email, status FROM companies;

-- Ver usuários de uma empresa
SELECT * FROM users WHERE company_id = 'uuid-da-empresa';

-- Verificar RLS funcionando
-- (Deve retornar apenas dados da sua empresa atual)
SELECT * FROM customers;
```

### 1️⃣1️⃣ Testar Sistema de Billing

**Simular Trial Expirado:**

```sql
-- Mudar status da empresa para expired
UPDATE companies 
SET status = 'expired', 
    trial_ends_at = NOW() - INTERVAL '1 day'
WHERE email = 'teste@email.com';
```

Recarregue a página → Deve redirecionar para `/billing`

**Ver página de billing:**
- Plano Mensal: R$ 97/mês
- Plano Anual: R$ 970/ano (2 meses grátis)
- Status da empresa
- Botões de assinatura (placeholder)

**Restaurar acesso:**

```sql
UPDATE companies 
SET status = 'active'
WHERE email = 'teste@email.com';
```

### 1️⃣2️⃣ Testar Métricas do Dashboard

Para ver as métricas funcionando, adicione dados de teste:

```sql
-- Inserir faturamento
INSERT INTO financial_entries (company_id, type, category, description, amount, payment_method, date)
VALUES (
  (SELECT id FROM companies WHERE email = 'teste@email.com'),
  'receita',
  'Serviço',
  'Lavagem Completa',
  150.00,
  'pix',
  NOW()
);

-- Inserir mais 2 faturamentos
INSERT INTO financial_entries (company_id, type, category, description, amount, payment_method, date)
VALUES 
  ((SELECT id FROM companies WHERE email = 'teste@email.com'), 'receita', 'Serviço', 'Polimento', 200.00, 'cartao_credito', NOW()),
  ((SELECT id FROM companies WHERE email = 'teste@email.com'), 'receita', 'Serviço', 'Higienização', 100.00, 'dinheiro', NOW());
```

Recarregue o dashboard → Verá:
- ✅ Faturamento Hoje: R$ 450,00
- ✅ Faturamento Mês: R$ 450,00
- ✅ Mensagem atualizada

### 1️⃣3️⃣ Testar Responsividade

**Desktop:**
- Sidebar visível
- Layout 2 colunas

**Mobile:**
- Abra DevTools (F12)
- Ative modo mobile
- Sidebar vira hamburger menu
- Layout adapta para 1 coluna

**Tablet:**
- Layout intermediário
- Sidebar adaptável

### 1️⃣4️⃣ Testar Segurança

**Teste 1: Acessar rota protegida sem login**

1. Faça logout
2. Tente acessar: http://localhost:3000/dashboard
3. **Resultado:** Redireciona para `/` (login)

**Teste 2: RLS**

```sql
-- Tentar acessar dados de outra empresa (deve falhar)
SELECT * FROM customers 
WHERE company_id != (SELECT company_id FROM users WHERE auth_id = auth.uid());
```

**Resultado:** Retorna vazio (RLS bloqueou)

### 1️⃣5️⃣ Testar Build de Produção

```bash
# Build
npm run build

# Iniciar em produção
npm start
```

Acesse: http://localhost:3000

**Verificar:**
- ✅ Mais rápido que dev
- ✅ Assets otimizados
- ✅ Tudo funcionando

## 📊 Checklist de Testes

### Autenticação
- [ ] Cadastro de empresa
- [ ] Login com email/senha
- [ ] Logout
- [ ] Redirect após login
- [ ] Middleware protegendo rotas

### Multi-Tenant
- [ ] Dados isolados por empresa
- [ ] RLS funcionando
- [ ] Não ver dados de outras empresas

### CRUD Clientes
- [ ] Listar clientes
- [ ] Adicionar cliente
- [ ] Editar cliente
- [ ] Excluir cliente
- [ ] Buscar cliente
- [ ] Estatísticas

### CRUD Veículos
- [ ] Listar veículos
- [ ] Adicionar veículo
- [ ] Editar veículo
- [ ] Excluir veículo
- [ ] Buscar veículo
- [ ] Validação de placa
- [ ] Estatísticas por tipo

### Dashboard
- [ ] Métricas carregando
- [ ] Mensagem dinâmica
- [ ] Banner de trial
- [ ] Sidebar responsiva
- [ ] Perfil do usuário

### Billing
- [ ] Exibir status correto
- [ ] Redirecionar se expirado
- [ ] Mostrar planos
- [ ] Cálculo correto

### UX
- [ ] Loading states
- [ ] Error handling
- [ ] Confirmações
- [ ] Feedback visual
- [ ] Responsivo

## 🆘 Problemas Comuns

### "Cannot connect to Supabase"
- Verificar se o schema foi aplicado
- Verificar variáveis de ambiente
- Verificar conexão com internet

### "Email já cadastrado"
- Use outro email
- Ou delete no Supabase Auth

### "Empresa não encontrada"
- Schema não foi aplicado
- Executar SQL novamente

### Métricas zeradas
- Normal em conta nova
- Adicionar dados de teste via SQL

### Build lento
- Normal na primeira vez
- Próximos builds são mais rápidos

## 🎉 Testes Concluídos!

Se todos os testes passaram, o sistema está **100% funcional** e pronto para:

✅ **Deploy em produção**  
✅ **Primeiros clientes**  
✅ **Desenvolvimento dos módulos restantes**

**Próximos passos:**
1. Deploy na Hostinger (ver `DEPLOY.md`)
2. Implementar módulos restantes (OS, Kanban, Financeiro)
3. Integrar pagamentos
4. Marketing e vendas!

---

**Dúvidas?** Consulte:
- `README.md` - Overview geral
- `AUTH_SETUP.md` - Detalhes de autenticação
- `DEPLOY.md` - Instruções de deploy
- `FINAL.md` - Visão completa do projeto
