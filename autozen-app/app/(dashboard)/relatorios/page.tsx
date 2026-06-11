'use client';

export const dynamic = 'force-dynamic';

import { BarChart3, TrendingUp, Users, Wrench, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RelatoriosPage() {
  const reports = [
    { title: 'Faturamento', description: 'Receita por período, comparativos e projeções', icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Ticket Médio', description: 'Valor médio por atendimento e evolução', icon: TrendingUp, color: 'text-blue-400' },
    { title: 'Clientes Recorrentes', description: 'Taxa de retorno e fidelidade', icon: Users, color: 'text-violet-400' },
    { title: 'Serviços Mais Vendidos', description: 'Ranking de serviços por volume e receita', icon: Wrench, color: 'text-cyan-400' },
    { title: 'Produtividade', description: 'Desempenho por funcionário e período', icon: BarChart3, color: 'text-amber-400' },
    { title: 'Agenda', description: 'Taxa de ocupação e horários de pico', icon: Calendar, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Relatórios</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title} className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <report.icon className={`w-5 h-5 ${report.color}`} />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">{report.description}</p>
              <div className="mt-4 h-24 rounded-lg bg-slate-800/30 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-slate-600 group-hover:text-blue-500/50 transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
