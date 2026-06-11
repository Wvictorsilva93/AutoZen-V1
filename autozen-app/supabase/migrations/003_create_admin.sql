-- AutoZen - Criar Admin de Teste
-- NOTA: Execute APÓS criar o usuário via Auth no Supabase Dashboard
-- Ou use a API de signup e depois execute este script

-- 1. Primeiro, crie uma empresa de teste
INSERT INTO companies (id, name, responsible, whatsapp, email, subscription_status, trial_ends_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'AutoZen Demo',
  'Admin Teste',
  '(11) 99999-9999',
  'admin@autozen.com.br',
  'active',
  NOW() + INTERVAL '365 days'
);

-- 2. Após o signup do usuário via Auth, insira na tabela users
-- Substitua 'USER_AUTH_ID' pelo UUID retornado do auth.users
-- INSERT INTO users (id, company_id, email, name, role)
-- VALUES (
--   'USER_AUTH_ID',
--   'a0000000-0000-0000-0000-000000000001',
--   'admin@autozen.com.br',
--   'Admin Teste',
--   'super_admin'
-- );

-- 3. Dados de exemplo para a empresa demo
INSERT INTO services (company_id, name, price, duration_minutes, category) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Lavagem Completa', 80, 45, 'Lavagem'),
  ('a0000000-0000-0000-0000-000000000001', 'Lavagem Simples', 45, 25, 'Lavagem'),
  ('a0000000-0000-0000-0000-000000000001', 'Polimento Técnico', 250, 120, 'Polimento'),
  ('a0000000-0000-0000-0000-000000000001', 'Higienização Interna', 150, 90, 'Higienização'),
  ('a0000000-0000-0000-0000-000000000001', 'Vitrificação', 800, 240, 'Vitrificação'),
  ('a0000000-0000-0000-0000-000000000001', 'Lavagem Moto', 40, 20, 'Motos');

INSERT INTO employees (company_id, name, phone, role, commission_rate) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Ricardo Souza', '(11) 98765-1234', 'Lavador Senior', 15),
  ('a0000000-0000-0000-0000-000000000001', 'Felipe Santos', '(11) 99876-5432', 'Polidor', 20),
  ('a0000000-0000-0000-0000-000000000001', 'Lucas Oliveira', '(11) 91234-5678', 'Lavador', 12);
