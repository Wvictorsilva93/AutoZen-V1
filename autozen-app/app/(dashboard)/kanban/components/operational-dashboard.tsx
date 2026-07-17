'use client';

import { Car, Clock, CircleDollarSign, CheckCircle2, Warehouse, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    { icon: Clock, label: 'OS Hoje', value: stats.osHoje, color: 'text-indigo-400', bg: 'bg-indigo-500/10', glow: 'hover:shadow-indigo-500/10' },
    { icon: Car, label: 'Em Andamento', value: stats.emAtendimento, color: 'text-violet-400', bg: 'bg-violet-500/10', glow: 'hover:shadow-violet-500/10' },
    { icon: CheckCircle2, label: 'Finalizadas', value: stats.finalizadas, color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'hover:shadow-emerald-500/10' },
    { icon: CircleDollarSign, label: 'Faturamento Hoje', value: `R$ ${stats.faturamentoDia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'hover:shadow-emerald-500/10' },
    { icon: Warehouse, label: 'Veículos no Pátio', value: stats.veiculosPatio, color: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'hover:shadow-amber-500/10' },
    { icon: TrendingUp, label: 'Ticket Médio', value: `R$ ${stats.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-primary', bg: 'bg-primary/10', glow: 'hover:shadow-primary/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
      {cards.map((card, i) => (
        <div 
          key={card.label} 
          className={cn(
            "rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-3.5",
            "transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80",
            "animate-fade-in-up",
            card.glow
          )}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className={cn(`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`, card.bg)}>
              <card.icon className={cn(`w-3.5 h-3.5`, card.color)} />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{card.label}</span>
          </div>
          <p className={cn(`text-lg font-bold mt-1 tracking-tight tabular-nums`, card.color)}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
