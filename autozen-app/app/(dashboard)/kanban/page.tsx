'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Car, Loader2, MessageSquare, Clock, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listRows, updateRow } from '@/lib/db';

interface Order {
  id: string; number: number; client_id: string; vehicle_id: string;
  kanban_status: string; created_at: string; updated_at: string;
}
interface ClientOpt { id: string; name?: string; phone?: string | null }
interface VehicleOpt { id: string; plate?: string }
interface Company { id: string; name: string }

const columns: { id: string; title: string; color: string }[] = [
  { id: 'aguardando', title: 'Aguardando', color: 'border-t-amber-500' },
  { id: 'lavando', title: 'Lavando', color: 'border-t-blue-500' },
  { id: 'finalizando', title: 'Finalizando', color: 'border-t-violet-500' },
  { id: 'pronto', title: 'Pronto', color: 'border-t-emerald-500' },
];

const stageMsg: Record<string, string> = {
  aguardando: 'recebemos seu veículo {placa} e ele está na fila de atendimento',
  lavando: 'seu veículo {placa} já está em atendimento',
  finalizando: 'estamos finalizando o serviço do seu veículo {placa}',
  pronto: 'seu veículo {placa} está pronto para retirada',
};

function onlyDigits(s: string) { return (s ?? '').replace(/\D/g, ''); }
function elapsed(fromIso: string) {
  const ms = Date.now() - new Date(fromIso).getTime();
  if (ms < 0 || isNaN(ms)) return '—';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export default function KanbanPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOpt[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

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

  function notify(order: Order, stage: string) {
    const c = client(order.client_id);
    const phone = onlyDigits(c?.phone ?? '');
    if (!phone) { toast.error('Cliente sem telefone cadastrado'); return; }
    const intl = phone.startsWith('55') ? phone : '55' + phone;
    const body = (stageMsg[stage] ?? '').replace('{placa}', vehiclePlate(order.vehicle_id));
    const msg = `Olá ${c?.name ?? ''}! Informamos que ${body}, aqui na ${company?.name ?? 'nossa empresa'}. 🚗✨`;
    window.open(`https://wa.me/${intl}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function moveTo(order: Order, next: string) {
    if (order.kanban_status === next) return;
    const prev = orders;
    setOrders((cur) => cur.map((o) => (o.id === order.id ? { ...o, kanban_status: next, updated_at: new Date().toISOString() } : o)));
    const { error } = await updateRow('orders', order.id, { kanban_status: next });
    if (error) { toast.error('Erro ao mover: ' + error); setOrders(prev); return; }
    const c = client(order.client_id);
    toast.success(`OS #${order.number} → ${next}`, {
      description: c?.phone ? 'Avisar o cliente no WhatsApp?' : undefined,
      action: c?.phone ? { label: 'Avisar', onClick: () => notify(order, next) } : undefined,
    });
  }

  function onDrop(colId: string) {
    setOverCol(null);
    const order = orders.find((o) => o.id === dragId);
    setDragId(null);
    if (order) moveTo(order, colId);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Kanban</h1>
        <span className="text-xs text-slate-500 hidden sm:block">Arraste os cards entre as colunas para mudar o status</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
          {columns.map((col) => {
            const cards = orders.filter((o) => o.kanban_status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
                onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
                onDrop={() => onDrop(col.id)}
                className={`flex flex-col rounded-xl border border-border border-t-4 ${col.color} p-3 transition-colors ${overCol === col.id ? 'bg-blue-500/10' : 'bg-slate-900/50'}`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-medium text-white">{col.title}</h3>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{cards.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {cards.map((card) => (
                    <Card
                      key={card.id}
                      draggable
                      onDragStart={() => setDragId(card.id)}
                      onDragEnd={() => { setDragId(null); setOverCol(null); }}
                      className={`bg-card border-border hover:border-blue-500/30 transition-all cursor-grab active:cursor-grabbing ${dragId === card.id ? 'opacity-50' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-600" /> #{card.number}
                          </span>
                          <Car className="w-3 h-3 text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-white">{client(card.client_id)?.name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{vehiclePlate(card.vehicle_id)}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {elapsed(card.created_at)} em serviço
                        </p>
                        <Button size="sm" variant="ghost"
                          className="mt-2 h-7 w-full text-xs text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => notify(card, card.kanban_status)}>
                          <MessageSquare className="w-3 h-3 mr-1" /> Avisar cliente
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {cards.length === 0 && <p className="text-xs text-slate-600 text-center py-4">Solte um card aqui</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
