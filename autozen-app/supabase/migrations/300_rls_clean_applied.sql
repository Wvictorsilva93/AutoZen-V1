-- ============================================================
-- RLS LIMPO E SEM RECURSÃO
-- - profiles: políticas DIRETAS (user_id = auth.uid()) — base de tudo
-- - companies e demais tabelas: subconsulta em profiles (sem função
--   recursiva). A subconsulta usa o RLS direto de profiles.
-- ============================================================

-- 1) Remove TODAS as políticas existentes das tabelas-alvo (limpa duplicadas/legadas)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- 2) profiles: políticas diretas (NUNCA chamar função que consulta profiles)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_sel ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY profiles_ins ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY profiles_upd ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY profiles_del ON public.profiles FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 3) companies: empresa(s) do usuário via subconsulta em profiles
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY companies_rw ON public.companies FOR ALL TO authenticated
  USING (id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

-- 4) Demais tabelas com company_id: isolamento por empresa via subconsulta
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables tb
      ON tb.table_schema = c.table_schema AND tb.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND c.column_name = 'company_id'
      AND tb.table_type = 'BASE TABLE'
      AND c.table_name <> 'profiles'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated
         USING (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()))
         WITH CHECK (company_id IN (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));',
      t || '_tenant', t
    );
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
