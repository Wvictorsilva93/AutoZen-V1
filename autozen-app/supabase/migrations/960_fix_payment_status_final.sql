-- ============================================================
-- AutoZen - FIX DEFINITIVO: payment_status na tabela orders
-- ============================================================
-- PROBLEMA: o frontend envia: 'pending', 'paid', 'partial', 'cancelled'
-- A constraint atual pode ter sido criada com valores em português
-- ou com valores diferentes. Este script remove a constraint antiga
-- e adiciona a correta com os valores em inglês usados pelo frontend.
--
-- COMO APLICAR:
--   1. Acesse o Supabase → SQL Editor
--   2. Cole TODO este script e execute
-- ============================================================

-- Passo 1: Remover constraint antiga (qualquer versão)
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;

-- Passo 2: Adicionar a coluna se não existir (caso a tabela seja antiga)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending';
  END IF;
END $$;

-- Passo 3: Normalizar valores existentes (português → inglês) para não quebrar
UPDATE orders SET payment_status = 'pending'   WHERE payment_status IN ('pendente', 'Pendente', 'PENDENTE');
UPDATE orders SET payment_status = 'paid'      WHERE payment_status IN ('pago', 'Pago', 'PAGO');
UPDATE orders SET payment_status = 'partial'   WHERE payment_status IN ('parcial', 'Parcial', 'PARCIAL');
UPDATE orders SET payment_status = 'cancelled' WHERE payment_status IN ('cancelado', 'Cancelado', 'CANCELADO', 'cancelled');
UPDATE orders SET payment_status = 'pending'   WHERE payment_status NOT IN ('pending', 'paid', 'partial', 'cancelled');

-- Passo 4: Adicionar a constraint definitiva com os valores corretos (inglês)
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'partial', 'cancelled'));

-- Passo 5: Remover e recriar constraint de payment_method se necessário
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;

-- Passo 6: Adicionar a coluna payment_method se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method TEXT;
  END IF;
END $$;

-- Confirmar resultado
SELECT
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%orders_payment%';
