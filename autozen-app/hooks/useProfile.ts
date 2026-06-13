'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export interface CurrentProfile {
  user_id: string;
  company_id: string | null;
  name: string;
  role: 'super_admin' | 'admin_empresa' | 'funcionario';
  email: string | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<CurrentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('user_id, company_id, name, role, email')
        .eq('user_id', auth.user.id)
        .single();
      setProfile((data as CurrentProfile) ?? null);
      setLoading(false);
    })();
  }, []);

  const isAdmin = profile?.role === 'admin_empresa' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';

  return { profile, loading, isAdmin, isSuperAdmin };
}
