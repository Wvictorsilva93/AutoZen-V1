-- Recorrência automática: ao finalizar uma OS, incrementa as visitas do cliente,
-- atualiza last_visit e marca is_recurrent quando tiver mais de 1 visita.

CREATE OR REPLACE FUNCTION public.on_order_finalized()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'finalizada'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'finalizada')
     AND NEW.client_id IS NOT NULL THEN
    UPDATE public.clients
      SET total_visits = COALESCE(total_visits, 0) + 1,
          last_visit = NOW(),
          is_recurrent = (COALESCE(total_visits, 0) + 1) > 1,
          updated_at = NOW()
      WHERE id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_finalized ON public.orders;
CREATE TRIGGER trg_order_finalized
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.on_order_finalized();
