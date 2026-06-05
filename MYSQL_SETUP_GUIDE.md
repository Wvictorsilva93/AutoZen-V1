# 🗄️ AutoZen - Guia de Setup MySQL

## 📌 Informações

| Campo | Valor |
|-------|-------|
| **Database** | MySQL 8.0+ |
| **Charset** | utf8mb4 |
| **Collation** | utf8mb4_unicode_ci |
| **Engine** | InnoDB |
| **Total Tabelas** | 12 principais |

---

## 📦 Schema Criado

**Arquivo:** `DATABASE_SCHEMA_MYSQL.sql`

### Tabelas Principais (12)

1. **companies** - Empresas (tenants)
2. **profiles** - Usuários
3. **subscriptions** - Assinaturas
4. **clients** - Clientes
5. **vehicles** - Veículos
6. **services** - Serviços
7. **work_orders** - Ordens de Serviço
8. **work_order_items** - Itens da OS
9. **accounts_receivable** - Contas a Receber
10. **accounts_payable** - Contas a Pagar
11. **audit_logs** - Auditoria
12. **settings** - Configurações

### Recursos Incluídos

- ✅ 12 tabelas com relacionamentos completos
- ✅ Índices otimizados
- ✅ Foreign Keys com CASCADE
- ✅ ENUM types (roles, status)
- ✅ JSON fields (audit, config)
- ✅ Soft Delete (deleted_at)
- ✅ Timestamps automáticos
- ✅ Procedure `sp_create_company_with_trial`
- ✅ Trigger auto-increment `numero` OS
- ✅ View `vw_dashboard_kpis`
- ✅ Multi-tenant (company_id em todas tabelas)

---

## 🚀 Como Instalar

### 1. Criar Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE autozen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autozen;
```

### 2. Executar Schema

**Opção A: Via comando**
```bash
mysql -u root -p autozen < DATABASE_SCHEMA_MYSQL.sql
```

**Opção B: Via MySQL Workbench**
1. Abrir MySQL Workbench
2. Conectar ao servidor
3. File → Run SQL Script
4. Selecionar `DATABASE_SCHEMA_MYSQL.sql`
5. Executar

**Opção C: Via phpMyAdmin**
1. Acessar phpMyAdmin
2. Selecionar database `autozen`
3. Aba "Import"
4. Escolher arquivo `DATABASE_SCHEMA_MYSQL.sql`
5. Executar

---

## 🔧 Configuração Hostinger

### Conectar ao MySQL

```javascript
// Node.js (mysql2)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

module.exports = pool;
```

### Variáveis de Ambiente

```env
# .env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=autozen_user
MYSQL_PASSWORD=sua_senha_segura
MYSQL_DATABASE=autozen
```

---

## 📝 Exemplos de Uso

### 1. Criar Empresa com Trial

```sql
CALL sp_create_company_with_trial(
  'AutoZen Estética Ltda',     -- razao_social
  'AutoZen Premium',            -- nome_fantasia
  '12.345.678/0001-90',        -- cnpj
  'contato@autozen.com',       -- email
  '(11) 99999-9999',           -- telefone
  '(11) 99999-9999',           -- whatsapp
  @company_id                   -- OUT parameter
);

SELECT @company_id;
```

### 2. Criar Usuário

```sql
INSERT INTO profiles (
  id, company_id, external_user_id, email, nome, role
) VALUES (
  UUID(),
  @company_id,
  'supabase_uid_aqui',
  'admin@autozen.com',
  'João Silva',
  'admin'
);
```

### 3. Criar Cliente

```sql
INSERT INTO clients (
  id, company_id, tipo, nome, cpf, telefone, whatsapp, created_by
) VALUES (
  UUID(),
  @company_id,
  'PF',
  'Maria Santos',
  '123.456.789-00',
  '(11) 98888-8888',
  '(11) 98888-8888',
  @user_id
);
```

### 4. Buscar Dashboard KPIs

```sql
SELECT * FROM vw_dashboard_kpis
WHERE company_id = @company_id;
```

### 5. Criar Ordem de Serviço

```sql
-- Número é auto-incrementado pelo trigger
INSERT INTO work_orders (
  id, company_id, client_id, vehicle_id,
  valor_total, km_entrada, status, created_by
) VALUES (
  UUID(),
  @company_id,
  @client_id,
  @vehicle_id,
  150.00,
  50000,
  'ABERTA',
  @user_id
);

-- Adicionar item
INSERT INTO work_order_items (
  id, work_order_id, tipo, service_id,
  nome, quantidade, valor_unitario, valor_total
) VALUES (
  UUID(),
  @work_order_id,
  'SERVICO',
  @service_id,
  'Lavagem Completa',
  1,
  150.00,
  150.00
);
```

---

## 🔍 Consultas Úteis

### Dashboard KPIs

```sql
SELECT 
  COUNT(DISTINCT c.id) as total_clientes,
  COUNT(DISTINCT v.id) as total_veiculos,
  COUNT(DISTINCT wo.id) as os_mes,
  SUM(ar.valor) as receita_mes
FROM companies comp
LEFT JOIN clients c ON comp.id = c.company_id AND c.deleted_at IS NULL
LEFT JOIN vehicles v ON comp.id = v.company_id AND v.deleted_at IS NULL
LEFT JOIN work_orders wo ON comp.id = wo.company_id 
  AND MONTH(wo.created_at) = MONTH(CURRENT_DATE())
LEFT JOIN accounts_receivable ar ON comp.id = ar.company_id 
  AND ar.status = 'PAGO'
  AND MONTH(ar.data_pagamento) = MONTH(CURRENT_DATE())
WHERE comp.id = @company_id;
```

### Clientes Ativos

```sql
SELECT 
  id, nome, telefone, email,
  (SELECT COUNT(*) FROM vehicles WHERE client_id = c.id AND deleted_at IS NULL) as total_veiculos,
  (SELECT COUNT(*) FROM work_orders WHERE client_id = c.id AND deleted_at IS NULL) as total_os
FROM clients c
WHERE company_id = @company_id 
  AND deleted_at IS NULL
ORDER BY nome;
```

### OS Abertas

```sql
SELECT 
  wo.id, wo.numero, wo.data_entrada,
  c.nome as cliente_nome,
  v.placa, v.modelo,
  wo.status, wo.valor_total
FROM work_orders wo
JOIN clients c ON wo.client_id = c.id
JOIN vehicles v ON wo.vehicle_id = v.id
WHERE wo.company_id = @company_id
  AND wo.status IN ('ABERTA', 'EM_EXECUCAO')
  AND wo.deleted_at IS NULL
ORDER BY wo.data_entrada DESC;
```

### Contas a Vencer (Próximos 7 dias)

```sql
SELECT 
  ar.id, ar.descricao, ar.valor,
  ar.data_vencimento, ar.status,
  c.nome as cliente_nome
FROM accounts_receivable ar
JOIN clients c ON ar.client_id = c.id
WHERE ar.company_id = @company_id
  AND ar.status = 'PENDENTE'
  AND ar.data_vencimento BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)
  AND ar.deleted_at IS NULL
ORDER BY ar.data_vencimento;
```

---

## 🔐 Segurança

### Criar Usuário Dedicado

```sql
-- Criar usuário
CREATE USER 'autozen_user'@'localhost' IDENTIFIED BY 'senha_segura_aqui';

-- Conceder permissões
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE
ON autozen.*
TO 'autozen_user'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;
```

### Backup

```bash
# Backup completo
mysqldump -u root -p autozen > backup_autozen_$(date +%Y%m%d).sql

# Backup apenas estrutura
mysqldump -u root -p --no-data autozen > schema_autozen.sql

# Backup apenas dados
mysqldump -u root -p --no-create-info autozen > data_autozen.sql
```

### Restore

```bash
mysql -u root -p autozen < backup_autozen_20260605.sql
```

---

## 📈 Performance

### Índices Criados

Cada tabela possui índices estratégicos:
- Primary Key (id)
- Foreign Keys (company_id, etc)
- Campos de busca (nome, telefone, placa)
- Campos de filtro (status, deleted_at)
- Campos de ordenação (created_at)

### Otimizações

```sql
-- Verificar índices
SHOW INDEX FROM work_orders;

-- Analisar query
EXPLAIN SELECT * FROM work_orders WHERE company_id = @company_id;

-- Otimizar tabelas
OPTIMIZE TABLE work_orders, clients, vehicles;
```

---

## 🆘 Troubleshooting

### Erro: "Unknown column"
```sql
-- Verificar estrutura da tabela
DESCRIBE work_orders;
```

### Erro: Foreign Key
```sql
-- Desabilitar temporariamente (CUIDADO!)
SET FOREIGN_KEY_CHECKS = 0;
-- Executar comandos
SET FOREIGN_KEY_CHECKS = 1;
```

### Erro: Charset
```sql
-- Verificar charset da database
SHOW CREATE DATABASE autozen;

-- Alterar se necessário
ALTER DATABASE autozen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📞 Suporte

- 📧 Email: suporte@autozen.com.br
- 📚 Docs: Ver `DECISOES_ARQUITETURAIS_V11.md`
- 🔧 Schema: Ver `DATABASE_SCHEMA_MYSQL.sql`

---

**Documento:** MYSQL_SETUP_GUIDE.md  
**Data:** Junho 2026  
**Status:** ✅ Completo

**Database MySQL pronto para produção! 🗄️**
