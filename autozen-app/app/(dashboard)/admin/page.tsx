'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Shield, Building2, DollarSign, TrendingUp, Clock, Loader2, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { listRows, updateRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';

interface Company {
  id: string; name: string; responsible_name: string | null; phone: string | null;
  plan: string | null; status: string | null; active: boolean; blocked: boolean;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  trial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  expired: 'bg-red-500/10 text-red-400 border-red-500/20',
  blocked: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function AdminPage() {
  const { isSuperAdmin, loading: profileLoading } = useProfile();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Company>('companies', { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar empresas: ' + error);
    else setCompanies(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggleBlock(c: Company) {
    const { error } = await updateRow('companies', c.id, { blocked: !c.blocked });
    if (error) toast.error('Erro: ' + error);
    else { toast.success(c.blocked ? 'Empresa desbloqueada' : 'Empresa bloqueada'); await load(); }
  }

  if (!profileLoading && !isSuperAdmin) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-white font-medium">Acesso restrito</p>
        <p className="text-sm">Esta área é exclusiva do super administrador do sistema.</p>
      </div>
    );
  }

  const total = companies.length;
  const ativas = companies.filter((c) => c.status === 'active' && !c.blocked).length;
  const trial = companies.filter((c) => c.status === 'trial').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
          <p className="text-sm text-slate-400">Gerenciamento do SaaS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Empresas</CardTitle>
            <Building2 className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-white">{total}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Ativas</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-white">{ativas}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Trial</CardTitle>
            <Clock className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-white">{trial}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Bloqueadas</CardTitle>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-white">{companies.filter((c) => c.blocked).length}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-sm text-white">Empresas Cadastradas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : companies.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">Nenhuma empresa.</p>
          ) : companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center"><Building2 className="w-4 h-4 text-blue-400" /></div>
                <div>
                  <p className="text-sm font-medium text-white">{company.name}</p>
                  <p className="text-xs text-slate-500">{company.responsible_name ?? '—'} · {company.plan ?? 'sem plano'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={statusColors[company.blocked ? 'blocked' : (company.status ?? 'active')] ?? 'bg-slate-700 text-slate-300'}>
                  {company.blocked ? 'bloqueada' : (company.status ?? 'ativa')}
                </Badge>
                <Button size="sm" variant="ghost" onClick={() => toggleBlock(company)}
                  className={company.blocked ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-red-400 hover:bg-red-500/10'}>
                  {company.blocked ? <><CheckCircle className="w-4 h-4 mr-1" /> Desbloquear</> : <><Ban className="w-4 h-4 mr-1" /> Bloquear</>}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
