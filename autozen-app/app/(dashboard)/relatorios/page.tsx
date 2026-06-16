'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { BarChart3, TrendingUp, Users, Wrench, DollarSign, FileText, Loader2, Download, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listRows } from '@/lib/db';
import { exportCSV, printReport } from '@/lib/export';

interface Order { id: string; number: number; total: number; status: string; service_ids: string[]; created_at: string }
interface Service { id: string; name: string }
interface Client { id: string; name: string; total_visits: number; is_recurrent: boolean }

function isThisMonth(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso); const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
}

export default function RelatoriosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, s, c] = await Promise.all([
      listRows<Order>('orders', { orderBy: 'created_at' }),
      listRows<Service>('services', { orderBy: 'name', ascending: true }),
      listRows<Client>('clients', { orderBy: 'total_visits' }),
    ]);
    setOrders(o.data ?? []);
    setServices(s.data ?? []);
    setClients(c.data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const fatTotal = orders.reduce((a, o) => a + Number(o.total || 0), 0);
  const fatMes = orders.filter((o) => isThisMonth(o.created_at)).reduce((a, o) => a + Number(o.total || 0), 0);
  const finalizadas = orders.filter((o) => o.status === 'finalizada');
  const ticket = finalizadas.length > 0 ? finalizadas.reduce((a, o) => a + Number(o.total || 0), 0) / finalizadas.length : 0;
  const recorrentes = clients.filter((c) => c.is_recurrent || (c.total_visits ?? 0) > 1);

  // serviços mais vendidos (contagem em service_ids das OS)
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? 'Serviço';
  const counts = new Map<string, number>();
  orders.forEach((o) => (o.service_ids ?? []).forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)));
  const topServices = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topClients = [...clients].sort((a, b) => (b.total_visits ?? 0) - (a.total_visits ?? 0)).slice(0, 5);

  function handleCSV() {
    const rows = orders.map((o) => ({
      OS: o.number, status: o.status, total: Number(o.total || 0).toFixed(2),
      data: new Date(o.created_at).toLocaleString('pt-BR'),
    }));
    if (!rows.length) return;
    exportCSV('autozen-relatorio-os', rows);
  }

  function handlePDF() {
    const body = `
      <table><thead><tr><th>Indicador</th><th>Valor</th></tr></thead><tbody>
        <tr><td>Faturamento Total</td><td>R$ ${fatTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>
        <tr><td>Faturamento do Mês</td><td>R$ ${fatMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>
        <tr><td>Ticket Médio</td><td>R$ ${ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>
        <tr><td>Total de OS</td><td>${orders.length}</td></tr>
        <tr><td>Clientes Recorrentes</td><td>${recorrentes.length}</td></tr>
      </tbody></table>
      <p class="tot">Serviços mais vendidos</p>
      <table><tbody>${topServices.map(([id, n]) => `<tr><td>${serviceName(id)}</td><td>${n}x</td></tr>`).join('')}</tbody></table>`;
    printReport('Relatório AutoZen', body);
  }

  const summary = [
    { title: 'Faturamento Total', value: `R$ ${fatTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Faturamento Mês', value: `R$ ${fatMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-blue-400' },
    { title: 'Ticket Médio', value: `R$ ${ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: BarChart3, color: 'text-violet-400' },
    { title: 'Total de OS', value: String(orders.length), icon: FileText, color: 'text-cyan-400' },
    { title: 'Clientes Recorrentes', value: String(recorrentes.length), icon: Users, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Relatórios</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleCSV} className="text-emerald-400 hover:bg-emerald-500/10">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button variant="ghost" onClick={handlePDF} className="text-blue-400 hover:bg-blue-500/10">
            <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {summary.map((s) => (
              <Card key={s.title} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{s.title}</CardTitle>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </CardHeader>
                <CardContent><p className="text-lg font-bold text-white">{s.value}</p></CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-sm text-white flex items-center gap-2"><Wrench className="w-4 h-4 text-cyan-400" /> Serviços Mais Vendidos</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {topServices.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Sem dados ainda.</p>
                ) : topServices.map(([id, n]) => (
                  <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                    <span className="text-sm text-white">{serviceName(id)}</span>
                    <span className="text-sm font-bold text-cyan-400">{n}x</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-sm text-white flex items-center gap-2"><Users className="w-4 h-4 text-amber-400" /> Clientes Mais Frequentes</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {topClients.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Sem dados ainda.</p>
                ) : topClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                    <span className="text-sm text-white">{c.name}</span>
                    <span className="text-sm font-bold text-amber-400">{c.total_visits ?? 0} visitas</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
