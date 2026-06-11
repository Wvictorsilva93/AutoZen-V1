'use client';

export const dynamic = 'force-dynamic';

import { Plus, Search, Trophy, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EmployeeDisplay {
  id: string;
  name: string;
  role: string;
  phone: string;
  commission: number;
  servicesThisMonth: number;
  revenueThisMonth: number;
  active: boolean;
}

const mockEmployees: EmployeeDisplay[] = [
  { id: '1', name: 'Ricardo Souza', role: 'Lavador Senior', phone: '(11) 98765-1234', commission: 15, servicesThisMonth: 85, revenueThisMonth: 4250, active: true },
  { id: '2', name: 'Felipe Santos', role: 'Polidor', phone: '(11) 99876-5432', commission: 20, servicesThisMonth: 42, revenueThisMonth: 6300, active: true },
  { id: '3', name: 'Lucas Oliveira', role: 'Lavador', phone: '(11) 91234-5678', commission: 12, servicesThisMonth: 67, revenueThisMonth: 3015, active: true },
  { id: '4', name: 'Diego Costa', role: 'Detalhamento', phone: '(11) 99123-4567', commission: 18, servicesThisMonth: 28, revenueThisMonth: 5600, active: true },
];

export default function FuncionariosPage() {
  const [search, setSearch] = useState('');
  const filtered = mockEmployees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => b.revenueThisMonth - a.revenueThisMonth);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Funcionários</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar funcionário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
        />
      </div>

      {/* Ranking */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Ranking do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sorted.map((emp, index) => (
            <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-amber-500/20 text-amber-400' :
                  index === 1 ? 'bg-slate-400/20 text-slate-300' :
                  index === 2 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.role} · {emp.commission}% comissão</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  R$ {emp.revenueThisMonth.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-500">{emp.servicesThisMonth} serviços</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
