'use client';

import { useEffect, useState } from 'react';
import {
  Building2, TrendingUp, Users, DollarSign, Activity, Loader2,
  ShieldCheck, Ban, BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listRows } from '@/lib/db';

interface Company { id: string; name: string; status: string; active: boolean; blocked: boolean; created_at: string; plan: string }
interface Profile { id: string; role: string }
interface Financial { id: string; amount: number; type: string; date: string }

export function OverviewTab() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listRows<Company>('companies', { orderBy: 'created_at' }),
      listRows<Profile>('profiles'),
      listRows<Financial>('financial_entries', { orderBy: 'date' }),
    ]).then(([c, p, f]) => {
      setCompanies(c.data ?? []);
      setProfiles(p.data ?? []);
      setFinancials(f.data ?? []);
      setLoading(false);
    });
  }, []);

  const total = companies.length;
  const ativas = companies.filter((c) => c.status === 'active' && !c.blocked).length;
  const trial = companies.filter((c) => c.status === 'trial').length;
  const bloqueadas = companies.filter((c) => c.blocked).length;
  const totalUsers = profiles.length;
  const superAdmins = profiles.filter((p) => p.role === 'super_admin').length;

  const receitaTotal = financials.filter((f) => f.type === 'entrada').reduce((a, f) => a + Number(f.amount), 0);

  const last30 = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const dayStr = d.toISOString().slice(0, 10);
    const count = companies.filter((c) => c.created_at?.slice(0, 10) === dayStr).length;
    const receita = financials
      .filter((f) => f.type === 'entrada' && f.date?.slice(0, 10) === dayStr)
      .reduce((a, f) => a + Number(f.amount), 0);
    return { label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), empresas: count, receita };
  });

  const maxCount = Math.max(1, ...last30.map((d) => d.empresas));
  const maxReceita = Math.max(1, ...last30.map((d) => d.receita));

  const kpis = [
    { title: 'Empresas', value: total, icon: Building2, color: 'text-blue-400', sub: `${ativas} ativas` },
    { title: 'Usuários', value: totalUsers, icon: Users, color: 'text-violet-400', sub: `${superAdmins} super admins` },
    { title: 'Receita Total', value: `R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-400', sub: 'todas as empresas' },
    { title: 'Trial', value: trial, icon: Activity, color: 'text-amber-400', sub: `${((trial / Math.max(1, total)) * 100).toFixed(0)}% do total` },
    { title: 'Bloqueadas', value: bloqueadas, icon: Ban, color: 'text-red-400', sub: `${((bloqueadas / Math.max(1, total)) * 100).toFixed(0)}% do total` },
    { title: 'Planos Pro/Enterprise', value: companies.filter((c) => c.plan === 'pro' || c.plan === 'enterprise').length, icon: ShieldCheck, color: 'text-cyan-400', sub: 'planos pagos' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <Card key={k.title} className="bg-card border-border hover:border-blue-500/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{k.title}</CardTitle>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-white truncate">{k.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm font-medium text-white">Cadastros de Empresas (30 dias)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-[2px] h-40">
              {last30.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center h-32">
                    <div
                      className="w-full max-w-[8px] rounded-t-sm bg-gradient-to-t from-blue-600 to-cyan-400 transition-all"
                      style={{ height: `${Math.max(3, (d.empresas / maxCount) * 100)}%` }}
                      title={`${d.empresas} empresas`}
                    />
                  </div>
                  {i % 5 === 0 && <span className="text-[8px] text-slate-600">{d.label}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm font-medium text-white">Receita Plataforma (30 dias)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-[2px] h-40">
              {last30.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center h-32">
                    <div
                      className="w-full max-w-[8px] rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all"
                      style={{ height: `${Math.max(3, (d.receita / maxReceita) * 100)}%` }}
                      title={`R$ ${d.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </div>
                  {i % 5 === 0 && <span className="text-[8px] text-slate-600">{d.label}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
