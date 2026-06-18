'use client';

import { Car, Clock, CircleDollarSign, CheckCircle2, Warehouse, TrendingUp } from 'lucide-react';

interface Stats {
  osHoje: number;
  emAtendimento: number;
  finalizadas: number;
  faturamentoDia: number;
  veiculosPatio: number;
  ticketMedio: number;
}

interface OperationalDashboardProps {
  stats: Stats;
}

export default function OperationalDashboard({ stats }: OperationalDashboardProps) {
  const cards = [
    { icon: Clock, label: 'OS Hoje', value: stats.osHoje, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Car, label: 'Em Andamento', value: stats.emAtendimento, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { icon: CheckCircle2, label: 'Finalizadas', value: stats.finalizadas, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: CircleDollarSign, label: 'Faturamento Hoje', value: `R$ ${stats.faturamentoDia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Warehouse, label: 'Veículos no Pátio', value: stats.veiculosPatio, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: TrendingUp, label: 'Ticket Médio', value: `R$ ${stats.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{card.label}</span>
          </div>
          <p className={`text-lg font-bold mt-1 ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
