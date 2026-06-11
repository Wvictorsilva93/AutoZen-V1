'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Car,
  Users,
  Calendar,
  BarChart3,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

const defaultStats: DashboardStats = {
  faturamento_hoje: 0,
  faturamento_mes: 0,
  lucro: 0,
  ticket_medio: 0,
  veiculos_ativos: 0,
  fila_atual: 0,
  agendamentos_hoje: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    // TODO: Fetch real stats from Supabase
    setStats({
      faturamento_hoje: 2450,
      faturamento_mes: 34500,
      lucro: 18200,
      ticket_medio: 85,
      veiculos_ativos: 4,
      fila_atual: 3,
      agendamentos_hoje: 8,
    });
  }, []);

  const cards = [
    { title: 'Faturamento Hoje', value: `R$ ${stats.faturamento_hoje.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Faturamento Mês', value: `R$ ${stats.faturamento_mes.toLocaleString('pt-BR')}`, icon: TrendingUp, color: 'text-blue-400' },
    { title: 'Lucro', value: `R$ ${stats.lucro.toLocaleString('pt-BR')}`, icon: BarChart3, color: 'text-green-400' },
    { title: 'Ticket Médio', value: `R$ ${stats.ticket_medio.toLocaleString('pt-BR')}`, icon: Activity, color: 'text-violet-400' },
    { title: 'Veículos Ativos', value: stats.veiculos_ativos.toString(), icon: Car, color: 'text-cyan-400' },
    { title: 'Fila Atual', value: stats.fila_atual.toString(), icon: Users, color: 'text-amber-400' },
    { title: 'Agendamentos', value: stats.agendamentos_hoje.toString(), icon: Calendar, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-xl lg:text-2xl font-semibold text-white">
          {greeting}! 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Hoje você faturou <span className="text-emerald-400 font-medium">R$ {stats.faturamento_hoje.toLocaleString('pt-BR')}</span> e possui{' '}
          <span className="text-blue-400 font-medium">{stats.veiculos_ativos} veículos</span> em atendimento.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="bg-card border-border hover:border-blue-500/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Receita Semanal</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Gráfico de receita</p>
              <p className="text-xs text-slate-600">Dados em tempo real do Supabase</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Serviços Realizados</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Gráfico de serviços</p>
              <p className="text-xs text-slate-600">Fluxo operacional</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
