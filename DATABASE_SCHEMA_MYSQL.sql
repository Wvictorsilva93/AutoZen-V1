-- ============================================
-- AutoZen - Database Schema MySQL 8.0+
-- Multi-Tenant SaaS Architecture
-- ============================================
-- Data: Junho 2026
-- Versão: MySQL 1.0  
-- Compatível: MySQL 8.0+, MariaDB 10.5+
-- Total: 24 tabelas
-- ============================================

-- Configurações iniciais
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. COMPANIES (Tenants)
-- ============================================

CREATE TABLE `companies` (
  `id` CHAR(36) PRIMARY KEY,
  `razao_social` VARCHAR(255) NOT NULL,
  `nome_fantasia` VARCHAR(255) NOT NULL,
  `cnpj` VARCHAR(18) UNIQUE NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(20),
  `whatsapp` VARCHAR(20),
  `cep` VARCHAR(10),
  `logradouro` VARCHAR(255),
  `numero` VARCHAR(20),
  `complemento` VARCHAR(100),
  `bairro` VARCHAR(100),
  `cidade` VARCHAR(100),
  `estado` CHAR(2),
  `logo_url` VARCHAR(500),
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cnpj` (`cnpj`),
  INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. PROFILES (Users)
-- ============================================

CREATE TABLE `profiles` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) NOT NULL,
  `external_user_id` VARCHAR(255) UNIQUE NOT NULL COMMENT 'Supabase Auth UID',
  `email` VARCHAR(255) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(500),
  `telefone` VARCHAR(20),
  `role` ENUM('super_admin','admin','gerente','atendente','operador') DEFAULT 'atendente',
  `active` TINYINT(1) DEFAULT 1,
  `ultimo_acesso` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  INDEX `idx_company` (`company_id`),
  INDEX `idx_role` (`role`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- 3. SUBSCRIPTIONS (Assinaturas)
-- ============================================

CREATE TABLE `subscriptions` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) UNIQUE NOT NULL,
  `plan` VARCHAR(50) DEFAULT 'autozen',
  `status` ENUM('trial','pending_payment','active','suspended','cancelled') DEFAULT 'trial',
  `amount` DECIMAL(10,2) DEFAULT 97.00,
  `trial_starts_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `trial_ends_at` TIMESTAMP NULL,
  `current_period_start` TIMESTAMP NULL,
  `current_period_end` TIMESTAMP NULL,
  `payment_proof_url` VARCHAR(500),
  `approved_by` CHAR(36),
  `approved_at` TIMESTAMP NULL,
  `cancelled_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  INDEX `idx_status` (`status`),
  INDEX `idx_trial_ends` (`trial_ends_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. CLIENTS (Clientes)
-- ============================================

CREATE TABLE `clients` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) NOT NULL,
  `tipo` ENUM('PF','PJ') DEFAULT 'PF',
  `nome` VARCHAR(255) NOT NULL,
  `cpf` VARCHAR(14),
  `cnpj` VARCHAR(18),
  `email` VARCHAR(255),
  `telefone` VARCHAR(20) NOT NULL,
  `whatsapp` VARCHAR(20) NOT NULL,
  `data_nascimento` DATE,
  `cep` VARCHAR(10),
  `logradouro` VARCHAR(255),
  `numero` VARCHAR(20),
  `complemento` VARCHAR(100),
  `bairro` VARCHAR(100),
  `cidade` VARCHAR(100),
  `estado` CHAR(2),
  `observacoes` TEXT,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` CHAR(36),
  `created_by` CHAR(36),
  `updated_by` CHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`deleted_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uk_company_cpf` (`company_id`, `cpf`),
  UNIQUE KEY `uk_company_cnpj` (`company_id`, `cnpj`),
  INDEX `idx_company` (`company_id`),
  INDEX `idx_nome` (`nome`),
  INDEX `idx_telefone` (`telefone`),
  INDEX `idx_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- 5. VEHICLES (Veículos)
-- ============================================

CREATE TABLE `vehicles` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) NOT NULL,
  `client_id` CHAR(36) NOT NULL,
  `placa` VARCHAR(10) NOT NULL,
  `marca` VARCHAR(100) NOT NULL,
  `modelo` VARCHAR(100) NOT NULL,
  `ano` INT NOT NULL,
  `cor` VARCHAR(50) NOT NULL,
  `km` DECIMAL(10,2),
  `chassi` VARCHAR(17),
  `combustivel` ENUM('GASOLINA','ETANOL','DIESEL','FLEX','ELETRICO','HIBRIDO'),
  `observacoes` TEXT,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` CHAR(36),
  `created_by` CHAR(36),
  `updated_by` CHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`deleted_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uk_company_placa` (`company_id`, `placa`),
  INDEX `idx_company` (`company_id`),
  INDEX `idx_client` (`client_id`),
  INDEX `idx_placa` (`placa`),
  INDEX `idx_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. SERVICES (Serviços)
-- ============================================

CREATE TABLE `services` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `descricao` TEXT,
  `valor` DECIMAL(10,2) NOT NULL,
  `tempo_estimado` INT COMMENT 'Minutos',
  `comissao` DECIMAL(5,2) DEFAULT 0 COMMENT 'Porcentagem',
  `ativo` TINYINT(1) DEFAULT 1,
  `deleted_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_company_nome` (`company_id`, `nome`),
  INDEX `idx_company` (`company_id`),
  INDEX `idx_ativo` (`ativo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- 7. WORK ORDERS (Ordens de Serviço)
-- ============================================

CREATE TABLE `work_orders` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) NOT NULL,
  `client_id` CHAR(36) NOT NULL,
  `vehicle_id` CHAR(36) NOT NULL,
  `numero` INT NOT NULL,
  `data_entrada` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `data_prevista` TIMESTAMP NULL,
  `data_saida` TIMESTAMP NULL,
  `status` ENUM('ABERTA','AGUARDANDO','EM_EXECUCAO','FINALIZADA','ENTREGUE','CANCELADA') DEFAULT 'ABERTA',
  `valor_servicos` DECIMAL(10,2) DEFAULT 0,
  `valor_produtos` DECIMAL(10,2) DEFAULT 0,
  `desconto` DECIMAL(10,2) DEFAULT 0,
  `valor_total` DECIMAL(10,2) DEFAULT 0,
  `km_entrada` DECIMAL(10,2),
  `km_saida` DECIMAL(10,2),
  `observacoes` TEXT,
  `defeitos_relatados` TEXT,
  `servicos_executados` TEXT,
  `funcionario_id` CHAR(36),
  `assinatura_cliente` TEXT COMMENT 'Base64',
  `assinatura_funcionario` TEXT COMMENT 'Base64',
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` CHAR(36),
  `created_by` CHAR(36),
  `updated_by` CHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`funcionario_id`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`deleted_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uk_company_numero` (`company_id`, `numero`),
  INDEX `idx_company` (`company_id`),
  INDEX `idx_client` (`client_id`),
  INDEX `idx_vehicle` (`vehicle_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_numero` (`numero`),
  INDEX `idx_data_entrada` (`data_entrada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. WORK ORDER ITEMS (Itens da OS)
-- ============================================

CREATE TABLE `work_order_items` (
  `id` CHAR(36) PRIMARY KEY,
  `work_order_id` CHAR(36) NOT NULL,
  `tipo` ENUM('SERVICO','PRODUTO') NOT NULL,
  `service_id` CHAR(36),
  `product_id` CHAR(36),
  `nome` VARCHAR(255) NOT NULL,
  `descricao` TEXT,
  `quantidade` DECIMAL(10,2) DEFAULT 1,
  `valor_unitario` DECIMAL(10,2) NOT NULL,
  `desconto` DECIMAL(10,2) DEFAULT 0,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`work_order_id`) REFERENCES `work_orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL,
  INDEX `idx_work_order` (`work_order_id`),
  INDEX `idx_tipo` (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- 9. ACCOUNTS RECEIVABLE (Contas a Receber)
-- ============================================

CREATE TABLE `accounts_receivable` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) NOT NULL,
  `client_id` CHAR(36) NOT NULL,
  `work_order_id` CHAR(36),
  `descricao` VARCHAR(255) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `data_pagamento` DATE,
  `status` ENUM('PENDENTE','PAGO','ATRASADO','CANCELADO') DEFAULT 'PENDENTE',
  `forma_pagamento` VARCHAR(50),
  `observacoes` TEXT,
  `deleted_at` TIMESTAMP NULL,
  `created_by` CHAR(36),
  `updated_by` CHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`work_order_id`) REFERENCES `work_orders`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  INDEX `idx_company` (`company_id`),
  INDEX `idx_client` (`client_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_vencimento` (`data_vencimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. ACCOUNTS PAYABLE (Contas a Pagar)
-- ============================================

CREATE TABLE `accounts_payable` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `categoria` VARCHAR(100),
  `valor` DECIMAL(10,2) NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `data_pagamento` DATE,
  `status` ENUM('PENDENTE','PAGO','ATRASADO','CANCELADO') DEFAULT 'PENDENTE',
  `forma_pagamento` VARCHAR(50),
  `observacoes` TEXT,
  `deleted_at` TIMESTAMP NULL,
  `created_by` CHAR(36),
  `updated_by` CHAR(36),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`updated_by`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  INDEX `idx_company` (`company_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_vencimento` (`data_vencimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- 11. AUDIT LOGS (Auditoria)
-- ============================================

CREATE TABLE `audit_logs` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36),
  `user_id` CHAR(36),
  `user_email` VARCHAR(255),
  `user_name` VARCHAR(255),
  `action` VARCHAR(100) NOT NULL,
  `resource` VARCHAR(100) NOT NULL,
  `resource_id` CHAR(36),
  `old_data` JSON,
  `new_data` JSON,
  `changes` JSON,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON DELETE SET NULL,
  INDEX `idx_company` (`company_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_resource` (`resource`, `resource_id`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. SETTINGS (Configurações)
-- ============================================

CREATE TABLE `settings` (
  `id` CHAR(36) PRIMARY KEY,
  `company_id` CHAR(36) UNIQUE NOT NULL,
  `config` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PROCEDURES & FUNCTIONS
-- ============================================

-- Procedure para criar nova empresa com trial
DELIMITER $$

CREATE PROCEDURE sp_create_company_with_trial(
  IN p_razao_social VARCHAR(255),
  IN p_nome_fantasia VARCHAR(255),
  IN p_cnpj VARCHAR(18),
  IN p_email VARCHAR(255),
  IN p_telefone VARCHAR(20),
  IN p_whatsapp VARCHAR(20),
  OUT p_company_id CHAR(36)
)
BEGIN
  DECLARE v_company_id CHAR(36);
  DECLARE v_trial_ends TIMESTAMP;
  
  -- Gerar UUID
  SET v_company_id = UUID();
  SET v_trial_ends = DATE_ADD(NOW(), INTERVAL 14 DAY);
  
  -- Inserir empresa
  INSERT INTO companies (
    id, razao_social, nome_fantasia, cnpj, email, telefone, whatsapp, active
  ) VALUES (
    v_company_id, p_razao_social, p_nome_fantasia, p_cnpj, p_email, p_telefone, p_whatsapp, 1
  );
  
  -- Inserir assinatura trial
  INSERT INTO subscriptions (
    id, company_id, plan, status, amount, trial_starts_at, trial_ends_at
  ) VALUES (
    UUID(), v_company_id, 'autozen', 'trial', 97.00, NOW(), v_trial_ends
  );
  
  -- Inserir configurações padrão
  INSERT INTO settings (id, company_id, config) 
  VALUES (UUID(), v_company_id, '{}');
  
  SET p_company_id = v_company_id;
END$$

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Auto-incrementar número da OS
DELIMITER $$

CREATE TRIGGER trg_work_orders_before_insert
BEFORE INSERT ON work_orders
FOR EACH ROW
BEGIN
  DECLARE next_numero INT;
  
  -- Buscar próximo número para a empresa
  SELECT COALESCE(MAX(numero), 0) + 1 INTO next_numero
  FROM work_orders
  WHERE company_id = NEW.company_id;
  
  SET NEW.numero = next_numero;
END$$

DELIMITER ;

-- ============================================
-- VIEWS (Consultas úteis)
-- ============================================

-- View: Dashboard KPIs por empresa
CREATE VIEW vw_dashboard_kpis AS
SELECT 
  c.id as company_id,
  c.nome_fantasia,
  COUNT(DISTINCT cl.id) as total_clientes,
  COUNT(DISTINCT v.id) as total_veiculos,
  COUNT(DISTINCT CASE WHEN wo.status IN ('ABERTA','EM_EXECUCAO') THEN wo.id END) as os_abertas,
  SUM(CASE WHEN ar.status = 'PAGO' AND MONTH(ar.data_pagamento) = MONTH(CURRENT_DATE()) THEN ar.valor ELSE 0 END) as receita_mes
FROM companies c
LEFT JOIN clients cl ON c.id = cl.company_id AND cl.deleted_at IS NULL
LEFT JOIN vehicles v ON c.id = v.company_id AND v.deleted_at IS NULL
LEFT JOIN work_orders wo ON c.id = wo.company_id AND wo.deleted_at IS NULL
LEFT JOIN accounts_receivable ar ON c.id = ar.company_id AND ar.deleted_at IS NULL
WHERE c.active = 1
GROUP BY c.id, c.nome_fantasia;

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Habilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Total de tabelas: 12 principais
-- Engines: InnoDB (transações ACID)
-- Charset: utf8mb4 (suporta emoji)
-- Collation: utf8mb4_unicode_ci
-- 
-- Para executar: mysql -u root -p autozen < DATABASE_SCHEMA_MYSQL.sql
-- 
-- Criado: Junho 2026
-- Versão: MySQL 1.0
-- Compatível: MySQL 8.0+, MariaDB 10.5+
