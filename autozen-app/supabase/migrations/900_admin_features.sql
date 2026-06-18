-- AutoZen - Admin/Owner Dashboard Features
-- Add plans, support_tickets, audit_logs tables

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_company ON support_tickets(company_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS support_tickets_superadmin ON public.support_tickets;
CREATE POLICY support_tickets_superadmin ON public.support_tickets FOR ALL TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS audit_logs_superadmin ON public.audit_logs;
CREATE POLICY audit_logs_superadmin ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_super_admin());

INSERT INTO plans (name, slug, description, price, features, active) VALUES
  ('Basic', 'basic', 'Para pequenas empresas', 97, '["Até 200 OS/mês", "2 funcionários", "Relatórios básicos", "Suporte por email"]', true),
  ('Pro', 'pro', 'Para empresas em crescimento', 197, '["OS ilimitadas", "10 funcionários", "Relatórios avançados", "Suporte prioritário", "Kanban", "Agenda"]', true),
  ('Enterprise', 'enterprise', 'Para operações de grande porte', 497, '["Tudo do Pro", "Funcionários ilimitados", "API pública", "Suporte 24/7", "Onboarding dedicado", "Personalizações"]', true)
ON CONFLICT (slug) DO NOTHING;

NOTIFY pgrst, 'reload schema';
