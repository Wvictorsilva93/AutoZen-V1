# 🗄️ Database Setup - AutoZen V4

## 📋 Como aplicar o schema no Supabase

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto: **rpakyjmdijhmpqsnnjke**

### 2. Abra o SQL Editor
- No menu lateral, clique em **SQL Editor**
- Clique em **New Query**

### 3. Cole o schema
- Abra o arquivo `schema.sql`
- Copie TODO o conteúdo
- Cole no editor SQL do Supabase

### 4. Execute
- Clique em **Run** (ou pressione Ctrl+Enter)
- Aguarde a confirmação: "Success. No rows returned"

## ✅ O que será criado

### Tabelas (Multi-tenant)
- ✅ `companies` - Empresas cadastradas
- ✅ `users` - Usuários do sistema
- ✅ `customers` - Clientes
- ✅ `vehicles` - Veículos
- ✅ `services` - Serviços/Produtos
- ✅ `orders` - Ordens de Serviço
- ✅ `order_items` - Itens da OS
- ✅ `financial_entries` - Lançamentos Financeiros
- ✅ `inventory` - Estoque
- ✅ `employees` - Funcionários
- ✅ `appointments` - Agendamentos

### Segurança (RLS)
- ✅ Row Level Security habilitado em TODAS as tabelas
- ✅ Isolamento total por `company_id`
- ✅ Nenhuma empresa visualiza dados de outra

### Functions
- ✅ `generate_order_number()` - Gera número de OS automático
- ✅ `update_updated_at_column()` - Atualiza timestamp automaticamente

### Views
- ✅ `v_revenue_by_period` - Faturamento por período

### Triggers
- ✅ Auto-update de `updated_at` em todas as tabelas

## 🔒 Segurança Multi-Tenant

Todas as queries são automaticamente filtradas por:
```sql
WHERE company_id = (SELECT company_id FROM users WHERE auth_id = auth.uid())
```

**Resultado:** Isolamento total entre empresas! 🔐

## 🧪 Dados de Teste

O schema cria automaticamente uma empresa de exemplo:
- **Email:** admin@exemplo.com
- **Nome:** Lava Jato Exemplo
- **Status:** active

## 📊 Próximos Passos

Após aplicar o schema:
1. ✅ Testar cadastro de empresa
2. ✅ Testar login
3. ✅ Verificar isolamento de dados
4. ✅ Criar dados de teste

## 🆘 Suporte

Em caso de erro:
1. Verifique se há tabelas com o mesmo nome
2. Use `DROP TABLE IF EXISTS nome_tabela CASCADE;` se necessário
3. Execute o schema novamente
