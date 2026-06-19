-- Fix payment_status constraint on orders table
-- Only 'pendente' was allowed, blocking 'pago', 'cancelado', etc.
-- Execute no Supabase SQL Editor se ainda não estiver aplicado

ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;

ALTER TABLE IF EXISTS orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status = ANY (ARRAY['pendente', 'pago', 'cancelado', 'reembolsado']));

-- Aplica também na tabela service_orders se existir
ALTER TABLE IF EXISTS service_orders DROP CONSTRAINT IF EXISTS service_orders_payment_status_check;
ALTER TABLE IF EXISTS service_orders ADD CONSTRAINT service_orders_payment_status_check
  CHECK (payment_status = ANY (ARRAY['pendente', 'pago', 'cancelado', 'reembolsado']));
