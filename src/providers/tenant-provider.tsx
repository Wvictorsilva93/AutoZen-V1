'use client';

// AutoZen - Tenant Provider
// Provider para gerenciar contexto de tenant (multi-tenant)

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import type { Database } from '@/src/types/database';

type Company = Database['public']['Tables']['companies']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface TenantContextType {
  tenantId: string | null;
  company: Company | null;
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  company: null,
  profile: null,
  loading: true,
  refresh: async () => {},
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const supabase = createClient();
      
      // Verificar usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setTenantId(null);
        setCompany(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Buscar profile com tenant_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Erro ao buscar profile:', profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setTenantId(profileData.tenant_id);
      setCompany(profileData.companies as Company);
      
    } catch (error) {
      console.error('Erro no TenantProvider:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <TenantContext.Provider value={{ tenantId, company, profile, loading, refresh }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
