-- Super admin enxerga TODAS as empresas e perfis.
-- Sem recursão: a subconsulta em profiles usa o RLS direto (user_id=auth.uid()),
-- retornando apenas o próprio perfil, então checar role='super_admin' é seguro.

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

DROP POLICY IF EXISTS companies_superadmin ON public.companies;
CREATE POLICY companies_superadmin ON public.companies FOR ALL TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

NOTIFY pgrst, 'reload schema';
