'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabaseClient';

/**
 * Bloqueia o acesso ao dashboard se a empresa estiver bloqueada/expirada.
 * super_admin sempre tem acesso. Empresas em trial/active passam.
 */
export function AccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) { if (active) setChecking(false); return; }

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { if (active) setChecking(false); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, company_id')
        .eq('user_id', auth.user.id)
        .single();

      // Super admin sempre passa
      if (profile?.role === 'super_admin') { if (active) setChecking(false); return; }

      if (!profile?.company_id) { if (active) setChecking(false); return; }

      const { data: company } = await supabase
        .from('companies')
        .select('blocked, status, trial_end, subscription_end')
        .eq('id', profile.company_id)
        .single();

      const now = new Date();
      const trialEnd = company?.trial_end ? new Date(company.trial_end) : null;
      const subEnd = company?.subscription_end ? new Date(company.subscription_end) : null;
      const expiredByDate =
        (company?.status === 'trial' && trialEnd && trialEnd < now) ||
        (company?.status === 'active' && subEnd && subEnd < now);

      const blocked =
        company?.blocked === true ||
        company?.status === 'blocked' ||
        company?.status === 'expired' ||
        expiredByDate;

      if (blocked) {
        router.replace('/bloqueado');
        return;
      }
      if (active) setChecking(false);
    })();
    return () => { active = false; };
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  return <>{children}</>;
}
