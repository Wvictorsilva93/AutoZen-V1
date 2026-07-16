'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import {
  DollarSign, TrendingUp, Car, Users, Calendar, BarChart3,
  Activity, ArrowUpRight, ArrowDownRight, List, Sparkles,
  Clock, Wallet, Target, RefreshCw,
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

/* ── Types ─────────────────────────────────── */
interface Order {
  id: string; total: number; status: string; kanban_status: string;
  created_at: string; updated_at: string; client_id?: string; vehicle_id?: string;
}
interface Tx { id: string; type: 'income' | 'expense'; amount: number; created_at: string }
interface Schedule {
  id: string; client_id: string; vehicle_id: string; service_id: string;
  scheduled_date: string; time: string; status: string;
}
interface Customer { id: string; name: string; phone?: string }
interface Service  { id: string; name: string }

/* ── Helpers ─────────────────────────────── */
function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}
function isThisMonth(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
}
const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

/* ── Skeleton component ──────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-7 w-7 rounded-lg" />
      </div>
      <div className="skeleton h-6 w-32 rounded" />
      <div className="skeleton h-2.5 w-16 rounded" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card p-5 space-y-4">
      <div className="skeleton h-4 w-40 rounded" />
      <div className="skeleton h-52 w-full rounded-xl" />
    </div>
  );
}

/* ── Main Component ─────────────────────── */
export default function DashboardPage() {
  const { profile } = useProfile();
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [txs,       setTxs]       = useState<Tx[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services,  setServices]  = useState<Service[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const [o, t, s, c, sv] = await Promise.all([
      listRows<Order>('orders',                { orderBy: 'created_at' }),
      listRows<Tx>('financial_transactions',   { orderBy: 'created_at' }),
      listRows<Schedule>('schedules',          { orderBy: 'scheduled_date', ascending: true }),
      listRows<Customer>('clients'),
      listRows<Service>('services'),
    ]);
    setOrders(o.data ?? []);
    setTxs(t.data ?? []);
    setSchedules(s.data ?? []);
    setCustomers(c.data ?? []);
    setServices(sv.data ?? []);

    if (!silent) setLoading(false);
    else setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Derived metrics ── */
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  })();

  const fatHoje        = orders.filter((o) => isToday(o.created_at)).reduce((a, o) => a + Number(o.total || 0), 0);
  const fatMes         = orders.filter((o) => isThisMonth(o.created_at)).reduce((a, o) => a + Number(o.total || 0), 0);
  const entradasMes    = txs.filter((t) => t.type === 'income' && isThisMonth(t.created_at)).reduce((a, t) => a + Number(t.amount || 0), 0);
  const saidasMes      = txs.filter((t) => t.type === 'expense' && isThisMonth(t.created_at)).reduce((a, t) => a + Number(t.amount || 0), 0);
  const lucro          = (fatMes + entradasMes) - saidasMes;
  const ativos         = orders.filter((o) => o.kanban_status && o.kanban_status !== 'pronto' && o.status !== 'finalizada' && o.status !== 'cancelada').length;
  const fila           = orders.filter((o) => o.kanban_status === 'aguardando').length;
  const finalizadasMes = orders.filter((o) => o.status === 'finalizada' && isThisMonth(o.created_at)).length;
  const ticket         = finalizadasMes > 0 ? fatMes / finalizadasMes : 0;
  const agHoje         = schedules.filter((s) => {
    const d = new Date(s.scheduled_date + 'T00:00:00'), n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }).length;

  /* ── Chart data ── */
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayTotal = orders
      .filter((o) => { const od = new Date(o.created_at); return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate(); })
      .reduce((a, o) => a + Number(o.total || 0), 0);
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    return { label: label.charAt(0).toUpperCase() + label.slice(1), value: dayTotal };
  });

  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const monthTotal = orders
      .filter((o) => { const od = new Date(o.created_at); return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth(); })
      .reduce((a, o) => a + Number(o.total || 0), 0);
    const label = d.toLocaleDateString('pt-BR', { month: 'short' });
    return { label: label.charAt(0).toUpperCase() + label.slice(1), value: monthTotal };
  });

  const kanbanCounts = {
    aguardando: orders.filter((o) => o.kanban_status === 'aguardando').length,
    lavando:    orders.filter((o) => o.kanban_status === 'lavando').length,
    finalizando:orders.filter((o) => o.kanban_status === 'finalizando').length,
    pronto:     orders.filter((o) => o.kanban_status === 'pronto').length,
  };
  const maxCount = Math.max(...Object.values(kanbanCounts), 1);

  const todaySchedules = schedules.filter((s) => {
    const d = new Date(s.scheduled_date + 'T00:00:00'), n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }).slice(0, 5);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? '—';
  const serviceName  = (id: string) => services.find((s) => s.id === id)?.name ?? '—';

  /* ── KPI config ── */
  const kpis = [
    {
      title: 'Faturamento Hoje', value: `R$ ${fmt(fatHoje)}`, icon: DollarSign,
      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
      glow: 'glow-emerald', sub: null,
    },
    {
      title: 'Faturamento Mês', value: `R$ ${fmt(fatMes)}`, icon: TrendingUp,
      color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20',
      glow: 'glow-indigo', sub: `${finalizadasMes} OS finalizadas`,
    },
    {
      title: 'Lucro do Mês', value: `R$ ${fmt(lucro)}`, icon: Wallet,
      color: lucro >= 0 ? 'text-emerald-400' : 'text-rose-400',
      bg: lucro >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10',
      border: lucro >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20',
      glow: lucro >= 0 ? 'glow-emerald' : 'glow-rose', sub: null,
    },
    {
      title: 'Ticket Médio', value: `R$ ${fmt(ticket)}`, icon: Target,
      color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20',
      glow: 'glow-violet', sub: null,
    },
    {
      title: 'OS Ativas', value: String(ativos), icon: Car,
      color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20',
      glow: '', sub: `${fila} aguardando`,
    },
    {
      title: 'Agendamentos', value: String(agHoje), icon: Calendar,
      color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20',
      glow: '', sub: 'hoje',
    },
  ];

  const kanbanMeta = [
    { id: 'aguardando',  label: 'Aguardando',  count: kanbanCounts.aguardando,  color: 'text-amber-400',  bar: 'bg-amber-500',   dot: 'bg-amber-500'  },
    { id: 'lavando',     label: 'Em andamento',count: kanbanCounts.lavando,     color: 'text-indigo-400', bar: 'bg-indigo-500',  dot: 'bg-indigo-500' },
    { id: 'finalizando', label: 'Finalizando', count: kanbanCounts.finalizando, color: 'text-violet-400', bar: 'bg-violet-500',  dot: 'bg-violet-500' },
    { id: 'pronto',      label: 'Pronto',      count: kanbanCounts.pronto,      color: 'text-emerald-400',bar: 'bg-emerald-500', dot: 'bg-emerald-500'},
  ];

  const scheduleBadgeClass: Record<string, string> = {
    agendado:  'bg-indigo-500/15 text-indigo-400 border-0',
    confirmado:'bg-emerald-500/15 text-emerald-400 border-0',
    cancelado: 'bg-rose-500/15 text-rose-400 border-0',
    concluido: 'bg-slate-500/15 text-slate-400 border-0',
  };

  /* ── Tooltip style ── */
  const tooltipStyle = {
    background: 'oklch(0.115 0.018 264)',
    border: '1px solid oklch(0.22 0.018 264 / 0.5)',
    borderRadius: 12,
    fontSize: 12,
    boxShadow: '0 8px 32px oklch(0 0 0 / 0.4)',
  };

  /* ──────────────────────────────────────── */
  return (
    <div className="space-y-6 animate-fade-in-up pb-8">

      {/* ── Header greeting ── */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-600/8 via-card to-card p-6 lg:p-7">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse, oklch(0.60 0.22 272 / 0.1) 0%, transparent 70%)' }}
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                {greeting}{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
              </h1>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
              <span>Faturamento hoje: <strong className="text-emerald-400">R$ {fmt(fatHoje)}</strong></span>
              <span className="hidden sm:inline text-border">·</span>
              <span>{ativos} veículo{ativos !== 1 ? 's' : ''} em atendimento</span>
              <span className="hidden sm:inline text-border">·</span>
              <span>{orders.length} OS registradas</span>
            </p>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/70 bg-card/50 hover:bg-card transition-all duration-200 flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>
      </div>

      {/* ── Loading state (skeletons) ── */}
      {loading ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SkeletonChart /><SkeletonChart />
          </div>
        </>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpis.map((kpi, i) => (
              <Card
                key={kpi.title}
                className={`bg-card border ${kpi.border} card-hover animate-fade-in-up stagger-${Math.min(i + 1, 6)} cursor-default group overflow-hidden relative`}
              >
                {/* Subtle background glow on hover */}
                <div className={`absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl ${kpi.bg}`} />

                <CardHeader className="relative flex flex-row items-center justify-between pb-2 pt-4 px-4">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-1.5 rounded-lg ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative pb-4 px-4">
                  <p className={`text-lg font-bold tracking-tight ${kpi.color} animate-number-pop`}>
                    {kpi.value}
                  </p>
                  {kpi.sub && (
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">{kpi.sub}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Bar chart — last 7 days */}
            <Card className="bg-card border border-border/40 card-hover animate-fade-in-up stagger-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Receita — últimos 7 dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'oklch(0.52 0.018 262)' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: 'oklch(0.52 0.018 262)' }}
                        formatter={(v) => [`R$ ${fmt(Number(v))}`, 'Receita']}
                      />
                      <Bar dataKey="value" fill="oklch(0.60 0.22 272)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Area chart — monthly */}
            <Card className="bg-card border border-border/40 card-hover animate-fade-in-up stagger-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Faturamento — últimos 6 meses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="oklch(0.65 0.18 160)" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="oklch(0.65 0.18 160)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.018 264 / 0.3)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'oklch(0.52 0.018 262)' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ ...tooltipStyle, border: '1px solid oklch(0.65 0.18 160 / 0.3)' }}
                        labelStyle={{ color: 'oklch(0.52 0.018 262)' }}
                        formatter={(v) => [`R$ ${fmt(Number(v))}`, 'Faturamento']}
                      />
                      <Area type="monotone" dataKey="value" stroke="oklch(0.65 0.18 160)" fill="url(#revGrad)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Bottom row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Kanban summary */}
            <Card className="bg-card border border-border/40 card-hover animate-fade-in-up stagger-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <List className="w-4 h-4 text-amber-400" />
                  Pipeline de OS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {kanbanMeta.map((col) => (
                  <div key={col.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${col.dot} ring-2 ring-offset-1 ring-offset-card ${col.dot}/30`} />
                        <span className="text-xs text-muted-foreground">{col.label}</span>
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${col.color}`}>{col.count}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${col.bar} transition-all duration-700 ease-out`}
                        style={{ width: `${(col.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 mt-1 border border-border/30">
                  <span className="text-xs font-semibold text-foreground">Total de OS</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">{orders.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Today's schedule */}
            <Card className="bg-card border border-border/40 card-hover animate-fade-in-up stagger-5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-400" />
                  Agenda de Hoje
                  {agHoje > 0 && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-500/15 text-pink-400">
                      {agHoje}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaySchedules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="w-10 h-10 mb-3 opacity-20" />
                    <span className="text-xs">Nenhum agendamento hoje</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {todaySchedules.map((s) => (
                      <div key={s.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground min-w-[44px] mt-0.5">
                          <Clock className="w-3 h-3" />
                          {s.time || '--:--'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{customerName(s.client_id)}</p>
                          <p className="text-[11px] text-muted-foreground/70 truncate">{serviceName(s.service_id)}</p>
                        </div>
                        <Badge className={scheduleBadgeClass[s.status] ?? 'bg-slate-500/15 text-slate-400 border-0'}>
                          {s.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial summary */}
            <Card className="bg-card border border-border/40 card-hover animate-fade-in-up stagger-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-emerald-500/10">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    Entradas
                  </span>
                  <span className="text-sm font-bold text-emerald-400 tabular-nums">R$ {fmt(entradasMes)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-rose-500/10">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                    Saídas
                  </span>
                  <span className="text-sm font-bold text-rose-400 tabular-nums">R$ {fmt(saidasMes)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-indigo-500/10">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    Faturamento OS
                  </span>
                  <span className="text-sm font-bold text-indigo-400 tabular-nums">R$ {fmt(fatMes)}</span>
                </div>
                <Separator className="bg-border/30 my-1" />
                <div className={`flex items-center justify-between p-3 rounded-xl border ${lucro >= 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Wallet className={`w-3.5 h-3.5 ${lucro >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
                    Saldo do mês
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${lucro >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
