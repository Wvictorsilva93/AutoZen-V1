'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import {
  DollarSign, TrendingUp, Car, Users, Calendar, BarChart3, Activity, Loader2,
  Clock, ArrowUpRight, ArrowDownRight, Sparkles, List
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
  created_at: string; updated_at: string; customer_id?: string; vehicle_id?: string;
}
interface Tx { id: string; type: 'income' | 'expense'; amount: number; created_at: string }
interface Schedule {
  id: string; customer_id: string; vehicle_id: string; service_id: string;
  scheduled_date: string; time: string; status: string
}
interface Customer { id: string; name: string; phone?: string }
interface Vehicle { id: string; customer_id: string; plate: string; brand: string; model: string }
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
      listRows<Customer>('customers'),
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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

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

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayTotal = orders
      .filter((o) => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate();
      })
      .reduce((a, o) => a + Number(o.total || 0), 0);
    return { label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''), value: dayTotal };
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
    return { label: d.toLocaleDateString('pt-BR', { month: 'short' }), value: monthTotal };
  });

  const kanbanCounts = {
    aguardando: orders.filter((o) => o.kanban_status === 'aguardando').length,
    lavando: orders.filter((o) => o.kanban_status === 'lavando').length,
    finalizando: orders.filter((o) => o.kanban_status === 'finalizando').length,
    pronto: orders.filter((o) => o.kanban_status === 'pronto').length,
  };

  const todaySchedules = schedules.filter((s) => {
    const d = new Date(s.scheduled_date + 'T00:00:00');
    const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }).slice(0, 5);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? '—';
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? '—';

  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const kpis = [
    { title: 'Faturamento Hoje', value: `R$ ${fmt(fatHoje)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: null },
    { title: 'Faturamento Mês', value: `R$ ${fmt(fatMes)}`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', change: `${finalizadasMes} OS` },
    { title: 'Lucro', value: `R$ ${fmt(lucro)}`, icon: BarChart3, color: 'text-green-400', bg: 'bg-green-500/10', change: null },
    { title: 'Ticket Médio', value: `R$ ${fmt(ticket)}`, icon: Activity, color: 'text-violet-400', bg: 'bg-violet-500/10', change: null },
    { title: 'Veículos Ativos', value: String(ativos), icon: Car, color: 'text-cyan-400', bg: 'bg-cyan-500/10', change: `${fila} na fila` },
    { title: 'Agendamentos', value: String(agHoje), icon: Calendar, color: 'text-pink-400', bg: 'bg-pink-500/10', change: 'hoje' },
  ];

  const kanbanCols = [
    { id: 'aguardando', label: 'Aguardando', count: kanbanCounts.aguardando, bar: 'bg-amber-500', text: 'text-amber-400' },
    { id: 'lavando', label: 'Lavando', count: kanbanCounts.lavando, bar: 'bg-blue-500', text: 'text-blue-400' },
    { id: 'finalizando', label: 'Finalizando', count: kanbanCounts.finalizando, bar: 'bg-violet-500', text: 'text-violet-400' },
    { id: 'pronto', label: 'Pronto', count: kanbanCounts.pronto, bar: 'bg-emerald-500', text: 'text-emerald-400' },
  ];

  const scheduleBadge: Record<string, string> = {
    agendado: 'bg-blue-500/20 text-blue-400 border-0',
    confirmado: 'bg-emerald-500/20 text-emerald-400 border-0',
    cancelado: 'bg-red-500/20 text-red-400 border-0',
    concluido: 'bg-slate-500/20 text-slate-400 border-0',
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-xl lg:text-2xl font-semibold text-white flex items-center gap-3">
            {greeting}{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
            <Sparkles className="w-5 h-5 text-blue-400" />
          </h1>
          <p className="text-slate-400 mt-1">
            Faturamento hoje: <span className="text-emerald-400 font-medium">R$ {fmt(fatHoje)}</span>
            {' · '}{ativos} veículos em atendimento
            {' · '}{agHoje} agendamento{agHoje !== 1 ? 's' : ''} hoje
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpis.map((kpi) => (
              <Card
                key={kpi.title}
                className="bg-card border-border hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5 cursor-default group"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  <div className={`p-1.5 rounded-lg ${kpi.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-white">{kpi.value}</p>
                  {kpi.change && <p className="text-[10px] text-slate-500 mt-0.5">{kpi.change}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border hover:border-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Receita dos últimos 7 dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(v) => [`R$ ${fmt(Number(v))}`, 'Receita']}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Faturamento Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(v) => [`R$ ${fmt(Number(v))}`, 'Faturamento']}
                      />
                      <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:border-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <List className="w-4 h-4 text-amber-400" /> Kanban - Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {kanbanCols.map((col) => (
                  <div key={col.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.bar}`} />
                      <span className="text-sm text-slate-300">{col.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${col.text}`}>{col.count}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700 mt-1">
                  <span className="text-sm font-medium text-white">Total</span>
                  <span className="text-sm font-bold text-white">{orders.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-400" /> Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaySchedules.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-sm">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Nenhum agendamento hoje
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todaySchedules.map((s) => (
                      <div key={s.id} className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/30">
                        <div className="text-xs font-mono text-slate-400 mt-0.5 min-w-[40px]">{s.time || '--:--'}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{customerName(s.customer_id)}</p>
                          <p className="text-xs text-slate-400 truncate">{serviceName(s.service_id)}</p>
                        </div>
                        <Badge className={scheduleBadge[s.status] ?? 'bg-slate-500/20 text-slate-400 border-0'}>
                          {s.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Resumo Financeiro (mês)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400 flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Entradas
                  </span>
                  <span className="text-sm font-bold text-emerald-400">R$ {fmt(entradasMes)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400 flex items-center gap-1.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-400" /> Saídas
                  </span>
                  <span className="text-sm font-bold text-red-400">R$ {fmt(saidasMes)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" /> Faturamento OS
                  </span>
                  <span className="text-sm font-bold text-blue-400">R$ {fmt(fatMes)}</span>
                </div>
                <Separator className="bg-slate-700" />
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <span className="text-sm font-medium text-white">Saldo</span>
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
