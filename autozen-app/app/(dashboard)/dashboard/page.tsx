'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import {
  DollarSign, TrendingUp, Car, Users, Calendar, BarChart3, Activity, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listRows } from '@/lib/db';

interface Order { id: string; total: number; status: string; kanban_status: string; created_at: string }
interface Tx { id: string; type: 'income' | 'expense'; amount: number; created_at: string }
interface Schedule { id: string; scheduled_date: string; status: string }

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [o, t, s] = await Promise.all([
      listRows<Order>('orders', { orderBy: 'created_at' }),
      listRows<Tx>('financial_transactions', { orderBy: 'created_at' }),
      listRows<Schedule>('schedules', { orderBy: 'scheduled_date', ascending: true }),
    ]);
    setOrders(o.data ?? []);
    setTxs(t.data ?? []);
    setSchedules(s.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite');
    load();
  }, [load]);

  const fatHoje = orders.filter((o) => isToday(o.created_at)).reduce((a, o) => a + Number(o.total || 0), 0);
  const fatMes = orders.filter((o) => isThisMonth(o.created_at)).reduce((a, o) => a + Number(o.total || 0), 0);
  const entradasMes = txs.filter((t) => t.type === 'income' && isThisMonth(t.created_at)).reduce((a, t) => a + Number(t.amount || 0), 0);
  const saidasMes = txs.filter((t) => t.type === 'expense' && isThisMonth(t.created_at)).reduce((a, t) => a + Number(t.amount || 0), 0);
  const lucro = (fatMes + entradasMes) - saidasMes;
  const ativos = orders.filter((o) => o.kanban_status && o.kanban_status !== 'pronto' && o.status !== 'finalizada' && o.status !== 'cancelada').length;
  const fila = orders.filter((o) => o.kanban_status === 'aguardando').length;
  const finalizadasMes = orders.filter((o) => o.status === 'finalizada' && isThisMonth(o.created_at)).length;
  const ticket = finalizadasMes > 0 ? fatMes / finalizadasMes : 0;
  const agHoje = schedules.filter((s) => {
    const d = new Date(s.scheduled_date + 'T00:00:00');
    const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }).length;

  const cards = [
    { title: 'Faturamento Hoje', value: `R$ ${fatHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Faturamento Mês', value: `R$ ${fatMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-blue-400' },
    { title: 'Lucro', value: `R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: BarChart3, color: 'text-green-400' },
    { title: 'Ticket Médio', value: `R$ ${ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: Activity, color: 'text-violet-400' },
    { title: 'Veículos Ativos', value: String(ativos), icon: Car, color: 'text-cyan-400' },
    { title: 'Fila Atual', value: String(fila), icon: Users, color: 'text-amber-400' },
    { title: 'Agendamentos', value: String(agHoje), icon: Calendar, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <h1 className="text-xl lg:text-2xl font-semibold text-white">{greeting}! 👋</h1>
        <p className="text-slate-400 mt-1">
          Hoje você faturou <span className="text-emerald-400 font-medium">R$ {fatHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> e possui{' '}
          <span className="text-blue-400 font-medium">{ativos} veículos</span> em atendimento.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {cards.map((card) => (
              <Card key={card.title} className="bg-card border-border hover:border-blue-500/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </CardHeader>
                <CardContent><p className="text-xl font-bold text-white">{card.value}</p></CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-sm font-medium text-white">Resumo Financeiro (mês)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400">Entradas</span>
                  <span className="text-sm font-bold text-emerald-400">R$ {entradasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400">Saídas</span>
                  <span className="text-sm font-bold text-red-400">R$ {saidasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400">Faturamento OS</span>
                  <span className="text-sm font-bold text-blue-400">R$ {fatMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-sm font-medium text-white">Operação</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400">OS finalizadas (mês)</span>
                  <span className="text-sm font-bold text-white">{finalizadasMes}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400">Em atendimento</span>
                  <span className="text-sm font-bold text-white">{ativos}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-400">Na fila</span>
                  <span className="text-sm font-bold text-white">{fila}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
