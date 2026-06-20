'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import {
  DollarSign, TrendingUp, Car, Users, Calendar, BarChart3, Activity, Loader2,
  ArrowUpRight, ArrowDownRight, List, Sparkles, Clock, Wallet, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { listRows } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from 'recharts';

interface Order {
  id: string; total: number; status: string; kanban_status: string;
  created_at: string; updated_at: string; client_id?: string; vehicle_id?: string;
}
interface Tx { id: string; type: 'income' | 'expense'; amount: number; created_at: string }
interface Schedule {
  id: string; client_id: string; vehicle_id: string; service_id: string;
  scheduled_date: string; time: string; status: string
}
interface Customer { id: string; name: string; phone?: string }
interface Vehicle { id: string; client_id: string; plate: string; brand: string; model: string }
interface Service { id: string; name: string }

function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}
function isThisMonth(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
}

export default function DashboardPage() {
  const { profile } = useProfile();
  const [orders, setOrders] = useState<Order[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, t, s, c, v, sv] = await Promise.all([
      listRows<Order>('orders', { orderBy: 'created_at' }),
      listRows<Tx>('financial_transactions', { orderBy: 'created_at' }),
      listRows<Schedule>('schedules', { orderBy: 'scheduled_date', ascending: true }),
      listRows<Customer>('clients'),
      listRows<Vehicle>('vehicles'),
      listRows<Service>('services'),
    ]);
    setOrders(o.data ?? []);
    setTxs(t.data ?? []);
    setSchedules(s.data ?? []);
    setCustomers(c.data ?? []);
    setVehicles(v.data ?? []);
    setServices(sv.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  })();

  const fatHoje = orders.filter((o) => isToday(o.created_at)).reduce((a, o) => a + Number(o.total || 0), 0);
  const fatMes = orders.filter((o) => isThisMonth(o.created_at)).reduce((a, o) => a + Number(o.total || 0), 0);
  const entradasMes = txs.filter((t) => t.type === 'income' && isThisMonth(t.created_at)).reduce((a, t) => a + Number(t.amount || 0), 0);
  const saidasMes = txs.filter((t) => t.type === 'expense' && isThisMonth(t.created_at)).reduce((a, t) => a + Number(t.amount || 0), 0);
  const lucro = (fatMes + entradasMes) - saidasMes;
  const ativos = orders.filter(
    (o) => o.kanban_status && o.kanban_status !== 'pronto' && o.status !== 'finalizada' && o.status !== 'cancelada'
  ).length;
  const fila = orders.filter((o) => o.kanban_status === 'aguardando').length;
  const finalizadasMes = orders.filter((o) => o.status === 'finalizada' && isThisMonth(o.created_at)).length;
  const ticket = finalizadasMes > 0 ? fatMes / finalizadasMes : 0;
  const agHoje = schedules.filter((s) => {
    const d = new Date(s.scheduled_date + 'T00:00:00');
    const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }).length;
  const totalOS = orders.length;

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayTotal = orders
      .filter((o) => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate();
      })
      .reduce((a, o) => a + Number(o.total || 0), 0);
    return { label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').charAt(0).toUpperCase() + d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(1), value: dayTotal };
  });

  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthTotal = orders
      .filter((o) => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
      })
      .reduce((a, o) => a + Number(o.total || 0), 0);
    return { label: d.toLocaleDateString('pt-BR', { month: 'short' }).charAt(0).toUpperCase() + d.toLocaleDateString('pt-BR', { month: 'short' }).slice(1), value: monthTotal };
  });

  const kanbanCounts = {
    aguardando: orders.filter((o) => o.kanban_status === 'aguardando').length,
    lavando: orders.filter((o) => o.kanban_status === 'lavando').length,
    finalizando: orders.filter((o) => o.kanban_status === 'finalizando').length,
    pronto: orders.filter((o) => o.kanban_status === 'pronto').length,
  };

  const maxCount = Math.max(...Object.values(kanbanCounts), 1);

  const todaySchedules = schedules.filter((s) => {
    const d = new Date(s.scheduled_date + 'T00:00:00');
    const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }).slice(0, 5);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? '—';
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? '—';

  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const kpis = [
    { title: 'Faturamento Hoje', value: `R$ ${fmt(fatHoje)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', change: null },
    { title: 'Faturamento Mês', value: `R$ ${fmt(fatMes)}`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', change: `${finalizadasMes} OS` },
    { title: 'Lucro', value: `R$ ${fmt(lucro)}`, icon: Wallet, color: lucro >= 0 ? 'text-emerald-400' : 'text-red-400', bg: lucro >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10', border: lucro >= 0 ? 'border-emerald-500/20' : 'border-red-500/20', change: null },
    { title: 'Ticket Médio', value: `R$ ${fmt(ticket)}`, icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', change: null },
    { title: 'OS Ativas', value: String(ativos), icon: Car, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', change: `${fila} na fila` },
    { title: 'Agendamentos', value: String(agHoje), icon: Calendar, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', change: 'hoje' },
  ];

  const kanbanMeta = [
    { id: 'aguardando', label: 'Aguardando', count: kanbanCounts.aguardando, color: 'text-amber-400', bar: 'bg-amber-500', dot: 'bg-amber-500' },
    { id: 'lavando', label: 'Lavando', count: kanbanCounts.lavando, color: 'text-blue-400', bar: 'bg-blue-500', dot: 'bg-blue-500' },
    { id: 'finalizando', label: 'Finalizando', count: kanbanCounts.finalizando, color: 'text-violet-400', bar: 'bg-violet-500', dot: 'bg-violet-500' },
    { id: 'pronto', label: 'Pronto', count: kanbanCounts.pronto, color: 'text-emerald-400', bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  ];

  const scheduleBadge: Record<string, string> = {
    agendado: 'bg-blue-500/15 text-blue-400 border-0',
    confirmado: 'bg-emerald-500/15 text-emerald-400 border-0',
    cancelado: 'bg-red-500/15 text-red-400 border-0',
    concluido: 'bg-slate-500/15 text-slate-400 border-0',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/10 via-card to-card border border-border/50 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              {greeting}{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
            </h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground/80 mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>Faturamento hoje: <strong className="text-emerald-400">R$ {fmt(fatHoje)}</strong></span>
            <span className="hidden sm:inline">·</span>
            <span>{ativos} veículo{ativos !== 1 ? 's' : ''} em atendimento</span>
            <span className="hidden sm:inline">·</span>
            <span>{totalOS} OS registrada{totalOS !== 1 ? 's' : ''}</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm">Carregando dashboard...</span>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpis.map((kpi) => (
              <Card
                key={kpi.title}
                className={`bg-card border ${kpi.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-${kpi.color.replace('text-', '')}/5 cursor-default group`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-1.5 rounded-lg ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-foreground tracking-tight">{kpi.value}</p>
                  {kpi.change && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.change}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border border-border/50 rounded-xl shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Receita — últimos 7 dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8896a6' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#161F2E', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(v) => [`R$ ${fmt(Number(v))}`, 'Receita']}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border/50 rounded-xl shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Faturamento Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8896a6' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#161F2E', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(v) => [`R$ ${fmt(Number(v))}`, 'Faturamento']}
                      />
                      <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kanban Summary */}
            <Card className="bg-card border border-border/50 rounded-xl shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <List className="w-4 h-4 text-amber-400" /> Kanban — Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {kanbanMeta.map((col) => (
                  <div key={col.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-sm text-muted-foreground">{col.label}</span>
                      </div>
                      <span className={`text-sm font-bold ${col.color}`}>{col.count}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${col.bar} transition-all duration-500`}
                        style={{ width: `${(col.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 mt-2">
                  <span className="text-sm font-semibold text-foreground">Total de OS</span>
                  <span className="text-sm font-bold text-foreground">{orders.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="bg-card border border-border/50 rounded-xl shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-400" /> Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaySchedules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="w-10 h-10 mb-3 opacity-30" />
                    <span className="text-sm">Nenhum agendamento hoje</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todaySchedules.map((s) => (
                      <div key={s.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground min-w-[48px] mt-0.5">
                          <Clock className="w-3 h-3" />
                          {s.time || '--:--'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{customerName(s.client_id)}</p>
                          <p className="text-xs text-muted-foreground truncate">{serviceName(s.service_id)}</p>
                        </div>
                        <Badge className={scheduleBadge[s.status] ?? 'bg-slate-500/15 text-slate-400 border-0'}>
                          {s.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="bg-card border border-border/50 rounded-xl shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Resumo Financeiro (mês)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Entradas
                  </span>
                  <span className="text-sm font-bold text-emerald-400">R$ {fmt(entradasMes)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-400" /> Saídas
                  </span>
                  <span className="text-sm font-bold text-red-400">R$ {fmt(saidasMes)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" /> Faturamento OS
                  </span>
                  <span className="text-sm font-bold text-blue-400">R$ {fmt(fatMes)}</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/60 border border-border/40">
                  <span className="text-sm font-semibold text-foreground">Saldo</span>
                  <span className={`text-sm font-bold ${lucro >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    R$ {fmt(lucro)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
