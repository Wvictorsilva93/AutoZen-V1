'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Car, Loader2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listRows, updateRow } from '@/lib/db';

interface Order {
  id: string; number: number; client_id: string; vehicle_id: string; kanban_status: string;
}
interface Opt { id: string; name?: string; plate?: string }

const columns: { id: string; title: string; color: string; next: string | null }[] = [
  { id: 'aguardando', title: 'Aguardando', color: 'border-t-amber-500', next: 'lavando' },
  { id: 'lavando', title: 'Lavando', color: 'border-t-blue-500', next: 'finalizando' },
  { id: 'finalizando', title: 'Finalizando', color: 'border-t-violet-500', next: 'pronto' },
  { id: 'pronto', title: 'Pronto', color: 'border-t-emerald-500', next: null },
];

export default function KanbanPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Opt[]>([]);
  const [vehicles, setVehicles] = useState<Opt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, c, v] = await Promise.all([
      listRows<Order>('orders', { orderBy: 'created_at' }),
      listRows<Opt>('clients', { orderBy: 'name', ascending: true }),
      listRows<Opt>('vehicles', { orderBy: 'plate', ascending: true }),
    ]);
    if (o.error) toast.error('Erro ao carregar kanban: ' + o.error);
    else setOrders(o.data ?? []);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? '—';
  const vehiclePlate = (id: string) => vehicles.find((v) => v.id === id)?.plate ?? '';

  async function move(order: Order, next: string) {
    const prev = orders;
    setOrders((cur) => cur.map((o) => (o.id === order.id ? { ...o, kanban_status: next } : o)));
    const { error } = await updateRow('orders', order.id, { kanban_status: next });
    if (error) { toast.error('Erro ao mover: ' + error); setOrders(prev); }
    else toast.success(`OS #${order.number} → ${next}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Kanban</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
          {columns.map((col) => {
            const cards = orders.filter((o) => o.kanban_status === col.id);
            return (
              <div key={col.id} className={`flex flex-col bg-slate-900/50 rounded-xl border border-border border-t-4 ${col.color} p-3`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-medium text-white">{col.title}</h3>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{cards.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {cards.map((card) => (
                    <Card key={card.id} className="bg-card border-border hover:border-blue-500/30 transition-all">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-slate-500">#{card.number}</span>
                          <Car className="w-3 h-3 text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-white">{clientName(card.client_id)}</p>
                        <p className="text-xs text-slate-400">{vehiclePlate(card.vehicle_id)}</p>
                        {col.next && (
                          <Button size="sm" variant="ghost" className="mt-2 h-7 w-full text-xs text-blue-400 hover:bg-blue-500/10"
                            onClick={() => move(card, col.next!)}>
                            Avançar <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {cards.length === 0 && <p className="text-xs text-slate-600 text-center py-4">Vazio</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
