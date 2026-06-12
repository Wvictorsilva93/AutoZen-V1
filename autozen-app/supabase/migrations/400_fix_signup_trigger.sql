-- Corrige "Database error creating new user"
-- O trigger em auth.users insere em profiles. Tornamos robusto:
--  - lê company_id/name/role/phone do metadata
--  - permite company_id nulo
--  - NUNCA bloqueia a criação do usuário (EXCEPTION -> RETURN NEW)

ALTER TABLE public.profiles ALTER COLUMN company_id DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, company_id, name, role, email, phone)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data->>'company_id', '')::uuid,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin_empresa'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Nunca derrubar a criação do usuário por causa do profile
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
