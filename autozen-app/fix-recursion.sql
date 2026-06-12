-- Corrige recursão de RLS na tabela profiles.
-- As políticas de profiles NÃO podem chamar current_company_id()
-- (que consulta profiles). Usamos comparação direta com auth.uid().

DROP POLICY IF EXISTS profiles_select ON public.profiles;
DROP POLICY IF EXISTS profiles_write ON public.profiles;
DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
DROP POLICY IF EXISTS profiles_self ON public.profiles;

CREATE POLICY profiles_self_select ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY profiles_self_insert ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY profiles_self_update ON public.profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY profiles_self_delete ON public.profiles FOR DELETE TO authenticated
  USING (user_id = auth.uid());

NOTIFY pgrst, 'reload schema';
