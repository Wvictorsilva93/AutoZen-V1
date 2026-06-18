'use client';

import { useEffect, useState } from 'react';
import {
  DollarSign, TrendingUp, CreditCard, Loader2, BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listRows } from '@/lib/db';

interface Company {
  id: string; name: string; plan: string | null; status: string | null;
  subscription_end: string | null; active: boolean; blocked: boolean;
}

export function FinanceTab() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRows<Company>('companies', { orderBy: 'created_at' }).then(({ data }) => {
      setCompanies(data ?? []);
      setLoading(false);
    });
  }, []);

  const planBreakdown: Record<string, number> = {};
  companies.forEach((c) => {
    const plan = c.plan ?? 'sem plano';
    planBreakdown[plan] = (planBreakdown[plan] || 0) + 1;
  });

  const planPrices: Record<string, number> = { basic: 97, pro: 197, enterprise: 497 };
  const activeCompanies = companies.filter((c) => c.status === 'active' && !c.blocked);
  const mrr = activeCompanies.reduce((a, c) => a + (planPrices[c.plan ?? ''] ?? 0), 0);

  const expiringSoon = companies.filter((c) => {
    if (!c.subscription_end) return false;
    const end = new Date(c.subscription_end);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  }).length;

  const totalCompanies = companies.length;
  const payingCompanies = activeCompanies.filter((c) => c.plan && c.plan !== 'basic').length;
  const trialCompanies = companies.filter((c) => c.status === 'trial').length;

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'MRR', value: `R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-400', sub: 'receita mensal recorrente' },
          { title: 'Pagantes', value: payingCompanies, icon: CreditCard, color: 'text-blue-400', sub: `${((payingCompanies / Math.max(1, totalCompanies)) * 100).toFixed(0)}% do total` },
          { title: 'Em Trial', value: trialCompanies, icon: TrendingUp, color: 'text-amber-400', sub: 'potencial conversão' },
          { title: 'Vencendo em 30d', value: expiringSoon, icon: BarChart3, color: 'text-red-400', sub: 'atenção necessária' },
        ].map((s) => (
          <Card key={s.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm font-medium text-white">Distribuição por Plano</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(planBreakdown).map(([plan, count]) => {
              const pct = ((count / Math.max(1, totalCompanies)) * 100).toFixed(1);
              return (
                <div key={plan} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 capitalize">{plan === 'sem plano' ? 'Sem plano' : plan}</span>
                    <span className="text-white font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm font-medium text-white">Receita por Plano</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(planBreakdown).map(([plan, count]) => {
              const pricePerPlan = planPrices[plan] ?? 0;
              const receita = pricePerPlan * count;
              if (receita === 0 && plan !== 'sem plano') return null;
              const maxReceita = Math.max(1, ...Object.entries(planBreakdown).map(([p, c]) => (planPrices[p] ?? 0) * c));
              const pct = ((receita / maxReceita) * 100);
              return (
                <div key={plan} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 capitalize">{plan === 'sem plano' ? 'Sem plano' : plan}</span>
                    <span className="text-emerald-400 font-medium">
                      R$ {receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white">Empresas com Assinatura Próxima ao Vencimento</CardTitle>
        </CardHeader>
        <CardContent>
          {companies.filter((c) => {
            if (!c.subscription_end) return false;
            const end = new Date(c.subscription_end);
            const now = new Date();
            return end.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000 && end > now;
          }).length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Nenhuma assinatura próxima do vencimento.</p>
          ) : (
            <div className="space-y-2">
              {companies.filter((c) => {
                if (!c.subscription_end) return false;
                const end = new Date(c.subscription_end);
                const now = new Date();
                return end.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000 && end > now;
              }).map((c) => {
                const end = new Date(c.subscription_end!);
                const dias = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                    <span className="text-sm text-white">{c.name}</span>
                    <span className={`text-xs font-medium ${dias <= 7 ? 'text-red-400' : 'text-amber-400'}`}>
                      {dias} dias restantes
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
