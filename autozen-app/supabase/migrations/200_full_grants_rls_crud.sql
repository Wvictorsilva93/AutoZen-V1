-- ============================================================
-- AutoZen - GRANTS + RLS CRUD COMPLETO (não-destrutivo)
-- Cole TODO este script no Supabase SQL Editor e execute uma vez.
--
-- Corrige de uma vez:
--   - "permission denied for table ..." (GRANTs ausentes)
--   - Não conseguir editar/excluir (RLS sem políticas de UPDATE/DELETE)
--
-- Estratégia:
--   * Concede privilégios às roles do Supabase
--   * Para TODA tabela do schema public que tiver coluna company_id,
--     habilita RLS e cria política de CRUD isolada por empresa
--   * companies/profiles tratadas à parte (não têm company_id próprio)
--   * Não apaga dados nem tabelas
-- ============================================================

-- 1) GRANTS gerais
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 2) Função helper: company_id do usuário logado (via profiles)
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 3) RLS por empresa para TODA tabela com coluna company_id
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT c.table_name
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.column_name = 'company_id'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', t || '_tenant_rw', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated
         USING (company_id = public.current_company_id())
         WITH CHECK (company_id = public.current_company_id());',
      t || '_tenant_rw', t
    );
  END LOOP;
END $$;

-- 4) companies: usuário enxerga/edita a própria empresa
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS companies_rw ON public.companies;
CREATE POLICY companies_rw ON public.companies FOR ALL TO authenticated
  USING (id = public.current_company_id())
  WITH CHECK (id = public.current_company_id());

-- 5) profiles: usuário enxerga a si e aos colegas da mesma empresa; edita o próprio
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR company_id = public.current_company_id());
DROP POLICY IF EXISTS profiles_write ON public.profiles;
CREATE POLICY profiles_write ON public.profiles FOR ALL TO authenticated
  USING (company_id = public.current_company_id())
  WITH CHECK (company_id = public.current_company_id());

-- 6) Recarrega o cache de schema do PostgREST
NOTIFY pgrst, 'reload schema';
