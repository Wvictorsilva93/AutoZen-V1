'use client';

export const dynamic = 'force-dynamic';

import { Brain, Clock, UserCheck, Calendar, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const insights = [
  {
    icon: Clock,
    title: 'Previsão de Atraso',
    description: 'OS #1001 pode atrasar 15min baseado no histórico do serviço de polimento',
    type: 'warning',
    color: 'text-amber-400 bg-amber-500/10',
  },
  {
    icon: UserCheck,
    title: 'Melhor Funcionário',
    description: 'Ricardo Souza é o mais indicado para Polimento Técnico (92% satisfação)',
    type: 'success',
    color: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    icon: Calendar,
    title: 'Sugestão de Agenda',
    description: 'Terça e Quinta 14h-16h têm menor ocupação. Ideal para agendamentos complexos',
    type: 'info',
    color: 'text-blue-400 bg-blue-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Previsão de Faturamento',
    description: 'Baseado no padrão, semana que vem deve faturar ~R$ 8.500',
    type: 'success',
    color: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    icon: Target,
    title: 'Ticket Médio Ideal',
    description: 'Seu ticket médio está em R$ 85. O ideal para sua região seria R$ 110',
    type: 'info',
    color: 'text-violet-400 bg-violet-500/10',
  },
];

export default function IAPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">IA Operacional</h1>
          <p className="text-sm text-slate-400">Insights e previsões inteligentes</p>
        </div>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, i) => (
          <Card key={i} className="bg-card border-border hover:border-blue-500/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.color}`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{insight.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
