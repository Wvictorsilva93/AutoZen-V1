# 🔐 Autenticação - AutoZen V4

## ✅ O que foi implementado

### 🔑 Sistema de Autenticação Completo
- ✅ Login com Supabase Auth
- ✅ Cadastro de empresa com trial de 7 dias
- ✅ Server Actions para auth
- ✅ Middleware de proteção de rotas
- ✅ Hook useAuth() para cliente
- ✅ Gestão de sessão automática

### 🏢 Multi-Tenant
- ✅ Isolamento total por company_id
- ✅ RLS no Supabase
- ✅ Validação de empresa em todas as rotas
- ✅ Verificação de status (trial/active/expired/blocked)

### 📊 Dashboard Funcional
- ✅ Layout com sidebar responsiva
- ✅ Cards de métricas (dados reais do banco)
- ✅ Navegação entre módulos
- ✅ Perfil de usuário e empresa
- ✅ Logout funcional

### 📄 Páginas Criadas
- ✅ `/` - Login/Cadastro premium
- ✅ `/dashboard` - Dashboard com métricas
- ✅ `/dashboard/clientes` - Placeholder
- ✅ `/dashboard/veiculos` - Placeholder
- ✅ `/dashboard/servicos` - Placeholder
- ✅ `/dashboard/os` - Placeholder
- ✅ `/dashboard/kanban` - Placeholder
- ✅ `/dashboard/financeiro` - Placeholder
- ✅ `/dashboard/estoque` - Placeholder
- ✅ `/dashboard/funcionarios` - Placeholder
- ✅ `/dashboard/agendamentos` - Placeholder
- ✅ `/dashboard/relatorios` - Placeholder
- ✅ `/billing` - Assinatura (com planos)

## 🚀 Como Testar

### 1. Aplicar Schema no Supabase

**⚠️ CRUCIAL: Faça isso primeiro!**

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: **rpakyjmdijhmpqsnnjke**
3. Vá em **SQL Editor** → **New Query**
4. Cole todo o conteúdo de `supabase/schema.sql`
5. Clique em **Run** (Ctrl+Enter)
6. Aguarde: "Success. No rows returned"

### 2. Iniciar o Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

### 3. Testar Cadastro

1. Vá para a tab **"Criar Empresa"**
2. Preencha:
   - **Nome da Empresa:** Lava Jato Teste
   - **Responsável:** João Silva
   - **WhatsApp:** (11) 99999-9999
   - **Email:** seu@email.com
   - **Senha:** senha123
3. Clique em **"Criar Minha Empresa"**

**O que acontece:**
- ✅ Cria conta no Supabase Auth
- ✅ Cria empresa na tabela `companies` (status: trial, 7 dias)
- ✅ Cria usuário na tabela `users` (role: admin_empresa)
- ✅ Faz login automático
- ✅ Redireciona para `/dashboard`

### 4. Verificar Dashboard

Após login, você verá:
- ✅ Header com nome e empresa
- ✅ Sidebar com todos os módulos
- ✅ Cards de métricas (inicialmente zerados)
- ✅ Mensagem de boas-vindas
- ✅ Banner de trial (7 dias)

### 5. Testar Login

1. Faça logout (botão no sidebar)
2. Vá para a tab **"Entrar"**
3. Use o email e senha cadastrados
4. Clique em **"Entrar no AutoZen"**

**O que acontece:**
- ✅ Valida credenciais no Supabase
- ✅ Busca dados do usuário e empresa
- ✅ Verifica status da empresa
- ✅ Redireciona para dashboard ou billing

## 🔒 Fluxo de Segurança

### Middleware
```
1. Verifica se há sessão ativa
2. Se SIM e rota pública → redireciona para dashboard
3. Se NÃO e rota protegida → redireciona para login
4. Verifica status da empresa
5. Se expired/blocked → redireciona para billing
```

### RLS (Row Level Security)
```sql
-- Toda query é automaticamente filtrada por:
WHERE company_id = (
  SELECT company_id FROM users 
  WHERE auth_id = auth.uid()
)
```

### Roles
- **super_admin:** Gerencia todo SaaS (futuro)
- **admin_empresa:** Dono da empresa (pode tudo)
- **funcionario:** Operação diária (futuro)

## 📊 Métricas do Dashboard

O dashboard busca dados REAIS do banco:

### Cards Implementados:
1. **Faturamento Hoje** - Sum de `financial_entries` tipo "receita" de hoje
2. **Faturamento Mês** - Sum de "receita" do mês atual
3. **Lucro** - Receita - Despesas do mês
4. **Ticket Médio** - Média de `orders.total_amount` entregues
5. **Veículos Ativos** - Count de orders em "lavando" ou "finalizando"
6. **Fila Atual** - Count de orders em "aguardando"
7. **Agendamentos** - Count de appointments de hoje
8. **OS Abertas** - Count de orders não entregues

## 🧪 Testando com Dados

Para ver as métricas funcionando, adicione dados de teste via SQL:

```sql
-- Inserir serviço de teste
INSERT INTO services (company_id, name, price)
VALUES (
  (SELECT id FROM companies WHERE email = 'seu@email.com'),
  'Lavagem Completa',
  50.00
);

-- Inserir cliente de teste
INSERT INTO customers (company_id, name, phone)
VALUES (
  (SELECT id FROM companies WHERE email = 'seu@email.com'),
  'Cliente Teste',
  '11999999999'
);

-- Inserir veículo
INSERT INTO vehicles (company_id, customer_id, plate, type)
VALUES (
  (SELECT id FROM companies WHERE email = 'seu@email.com'),
  (SELECT id FROM customers WHERE name = 'Cliente Teste' LIMIT 1),
  'ABC1234',
  'carro'
);

-- Inserir OS
INSERT INTO orders (company_id, order_number, customer_id, vehicle_id, status, total_amount)
VALUES (
  (SELECT id FROM companies WHERE email = 'seu@email.com'),
  'OS-000001',
  (SELECT id FROM customers WHERE name = 'Cliente Teste' LIMIT 1),
  (SELECT id FROM vehicles WHERE plate = 'ABC1234' LIMIT 1),
  'aguardando',
  50.00
);

-- Inserir faturamento
INSERT INTO financial_entries (company_id, type, category, description, amount, payment_method)
VALUES (
  (SELECT id FROM companies WHERE email = 'seu@email.com'),
  'receita',
  'Serviço',
  'Lavagem Completa',
  50.00,
  'pix'
);
```

Após inserir, recarregue o dashboard e verá as métricas atualizadas!

## 🎯 Status da Empresa

### Trial (7 dias)
- ✅ Acesso completo ao sistema
- ✅ Banner informativo no dashboard
- ✅ Expira em 7 dias

### Active
- ✅ Assinatura ativa
- ✅ Acesso total

### Expired
- ❌ Redireciona para `/billing`
- ❌ Não acessa dashboard

### Blocked
- ❌ Redireciona para `/billing`
- ❌ Mensagem de bloqueio

## 🔄 Próximos Passos

### Fase 5: Módulos Core (Próxima)
- [ ] CRUD de Clientes completo
- [ ] CRUD de Veículos completo
- [ ] CRUD de Serviços completo
- [ ] Sistema de OS funcional
- [ ] Kanban drag and drop

### Fase 6: Avançado
- [ ] Integração de pagamento
- [ ] WhatsApp automático
- [ ] Upload de fotos
- [ ] Relatórios com gráficos
- [ ] PWA offline sync

## 🆘 Troubleshooting

### "Email ou senha incorretos"
- Verifique se cadastrou primeiro
- Email e senha são case-sensitive

### "Usuário não cadastrado no sistema"
- O usuário existe no Auth mas não na tabela `users`
- Execute o schema SQL novamente

### "Empresa não encontrada"
- Verificar se a tabela `companies` tem dados
- Execute: `SELECT * FROM companies;`

### Métricas zeradas
- Normal em conta nova
- Adicione dados de teste via SQL (veja seção acima)

### Erro "RLS" ou "permission denied"
- Execute o schema SQL completo
- Verifique se RLS está habilitado: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`

## 📱 Testando Mobile

1. Abra o navegador mobile
2. Acesse via IP local: `http://192.168.x.x:3000`
3. Login e dashboard são responsivos

## 🎉 Sistema Pronto!

Você agora tem:
- ✅ Autenticação funcional
- ✅ Dashboard com dados reais
- ✅ Multi-tenant com RLS
- ✅ Middleware de proteção
- ✅ Gestão de trial/assinatura
- ✅ UX premium
- ✅ Build funcionando
- ✅ Pronto para desenvolvimento dos módulos!

**Próxima etapa: Implementar CRUD de Clientes, Veículos e OS! 🚀**
