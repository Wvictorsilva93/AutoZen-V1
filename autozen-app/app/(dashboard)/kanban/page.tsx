'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Car, Loader2, ChevronRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listRows, updateRow } from '@/lib/db';

interface Order {
  id: string; number: number; client_id: string; vehicle_id: string; kanban_status: string;
}
interface ClientOpt { id: string; name?: string; phone?: string | null }
interface VehicleOpt { id: string; plate?: string }
interface Company { id: string; name: string }

const columns: { id: string; title: string; color: string; next: string | null }[] = [
  { id: 'aguardando', title: 'Aguardando', color: 'border-t-amber-500', next: 'lavando' },
  { id: 'lavando', title: 'Lavando', color: 'border-t-blue-500', next: 'finalizando' },
  { id: 'finalizando', title: 'Finalizando', color: 'border-t-violet-500', next: 'pronto' },
  { id: 'pronto', title: 'Pronto', color: 'border-t-emerald-500', next: null },
];

function onlyDigits(s: string) { return (s ?? '').replace(/\D/g, ''); }

export default function KanbanPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOpt[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, c, v, co] = await Promise.all([
      listRows<Order>('orders', { orderBy: 'created_at' }),
      listRows<ClientOpt>('clients', { orderBy: 'name', ascending: true }),
      listRows<VehicleOpt>('vehicles', { orderBy: 'plate', ascending: true }),
      listRows<Company>('companies', { orderBy: 'created_at' }),
    ]);
    if (o.error) toast.error('Erro ao carregar kanban: ' + o.error);
    else setOrders(o.data ?? []);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setCompany((co.data ?? [])[0] ?? null);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const client = (id: string) => clients.find((c) => c.id === id);
  const vehiclePlate = (id: string) => vehicles.find((v) => v.id === id)?.plate ?? '';

  function notifyWhatsApp(order: Order) {
    const c = client(order.client_id);
    const phone = onlyDigits(c?.phone ?? '');
    if (!phone) { toast.error('Cliente sem telefone cadastrado'); return; }
    const intl = phone.startsWith('55') ? phone : '55' + phone;
    const msg = `Olá ${c?.name ?? ''}! Seu veículo placa ${vehiclePlate(order.vehicle_id)} está pronto para retirada na ${company?.name ?? 'nossa empresa'}. Obrigado pela preferência! 🚗✨`;
    window.open(`https://wa.me/${intl}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function move(order: Order, next: string) {
    const prev = orders;
    setOrders((cur) => cur.map((o) => (o.id === order.id ? { ...o, kanban_status: next } : o)));
    const { error } = await updateRow('orders', order.id, { kanban_status: next });
    if (error) { toast.error('Erro ao mover: ' + error); setOrders(prev); return; }
    if (next === 'pronto') {
      const c = client(order.client_id);
      toast.success(`OS #${order.number} pronta!`, {
        description: c?.phone ? 'Clique para avisar o cliente no WhatsApp' : 'Cliente sem telefone',
        action: c?.phone ? { label: 'Avisar', onClick: () => notifyWhatsApp({ ...order, kanban_status: next }) } : undefined,
      });
    } else {
      toast.success(`OS #${order.number} → ${next}`);
    }
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
                        <p className="text-sm font-medium text-white">{client(card.client_id)?.name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{vehiclePlate(card.vehicle_id)}</p>
                        <div className="flex gap-1 mt-2">
                          {col.next && (
                            <Button size="sm" variant="ghost" className="h-7 flex-1 text-xs text-blue-400 hover:bg-blue-500/10"
                              onClick={() => move(card, col.next!)}>
                              Avançar <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                          {col.id === 'pronto' && (
                            <Button size="sm" variant="ghost" className="h-7 flex-1 text-xs text-emerald-400 hover:bg-emerald-500/10"
                              onClick={() => notifyWhatsApp(card)}>
                              <MessageSquare className="w-3 h-3 mr-1" /> Avisar
                            </Button>
                          )}
                        </div>
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
