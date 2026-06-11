'use client';

export const dynamic = 'force-dynamic';

import { Shield, Building2, Users, DollarSign, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockCompanies = [
  { id: '1', name: 'Lava Jato Premium', responsible: 'Carlos Admin', status: 'active', plan: 'Profissional', revenue: 197, users: 5, createdAt: '2025-05-01' },
  { id: '2', name: 'Auto Brilho', responsible: 'Maria Owner', status: 'trial', plan: 'Trial', revenue: 0, users: 2, createdAt: '2025-06-05' },
  { id: '3', name: 'Moto Clean SP', responsible: 'João Dono', status: 'active', plan: 'Starter', revenue: 97, users: 3, createdAt: '2025-04-15' },
  { id: '4', name: 'Estética Total', responsible: 'Ana Gestora', status: 'expired', plan: 'Expired', revenue: 0, users: 4, createdAt: '2025-03-20' },
];

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  trial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  expired: 'bg-red-500/10 text-red-400 border-red-500/20',
  blocked: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function AdminPage() {
  const totalRevenue = mockCompanies.reduce((acc, c) => acc + c.revenue, 0);
  const activeCompanies = mockCompanies.filter((c) => c.status === 'active').length;
  const trialCompanies = mockCompanies.filter((c) => c.status === 'trial').length;

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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Empresas</CardTitle>
            <Building2 className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{mockCompanies.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Receita MRR</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-400">R$ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Ativas</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{activeCompanies}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Trial</CardTitle>
            <Clock className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{trialCompanies}</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies list */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-white">Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockCompanies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{company.name}</p>
                  <p className="text-xs text-slate-500">{company.responsible} · {company.users} usuários</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={statusColors[company.status]}>
                  {company.status}
                </Badge>
                {company.revenue > 0 && (
                  <span className="text-sm font-medium text-emerald-400">R$ {company.revenue}/mês</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
