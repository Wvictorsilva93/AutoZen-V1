-- ============================================================
-- AutoZen - CORREÇÃO NÃO-DESTRUTIVA do schema existente
-- Cole TODO este script no Supabase SQL Editor e execute uma vez.
-- NÃO apaga dados nem tabelas. Apenas:
--   1) Concede GRANTs às roles do Supabase (corrige "permission denied")
--   2) Torna o trigger de profiles robusto (lê company_id do metadata
--      e nunca bloqueia a criação de usuário)
--   3) Garante RLS com isolamento por empresa em companies/profiles
-- ============================================================

-- ------------------------------------------------------------
-- 1) GRANTS (corrige "permission denied for table ...")
-- ------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ------------------------------------------------------------
-- 2) TRIGGER de profiles robusto
--    Lê name/role/company_id/phone do user_metadata e nunca
--    derruba a criação do usuário (auth.users).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, company_id, name, role, email, phone)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data->>'company_id', '')::uuid,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Em qualquer falha, não bloquear a criação do usuário
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Permitir company_id nulo (funcionário sem empresa ainda não quebra)
ALTER TABLE public.profiles ALTER COLUMN company_id DROP NOT NULL;

-- ------------------------------------------------------------
-- 3) RLS - isolamento por empresa
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companies_select ON public.companies;
CREATE POLICY companies_select ON public.companies FOR SELECT
  USING (id = public.current_company_id());

DROP POLICY IF EXISTS companies_update ON public.companies;
CREATE POLICY companies_update ON public.companies FOR UPDATE
  USING (id = public.current_company_id());

DROP POLICY IF EXISTS profiles_self ON public.profiles;
CREATE POLICY profiles_self ON public.profiles FOR SELECT
  USING (user_id = auth.uid() OR company_id = public.current_company_id());

DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Recarrega o cache de schema do PostgREST
NOTIFY pgrst, 'reload schema';
