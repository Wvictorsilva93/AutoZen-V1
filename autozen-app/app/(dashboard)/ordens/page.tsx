'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Loader2, ExternalLink, XCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { listRows, updateRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';
import OsFormDialog from '@/components/os-form-dialog';

interface OrderRow {
  id: string; number: number; client_id: string; vehicle_id: string; employee_id?: string;
  kanban_status: string; status?: string; payment_status?: string; payment_method?: string;
  created_at: string; updated_at: string; description?: string; total?: number;
}
interface ClientRow { id: string; name: string; phone?: string; }
interface VehicleRow { id: string; plate: string; brand: string; model: string; color?: string; }

const STATUS_LABELS: Record<string, string> = {
  aguardando: 'Aguardando', lavando: 'Lavando', finalizando: 'Finalizando', pronto: 'Pronto',
};
const STATUS_COLORS: Record<string, string> = {
  aguardando: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  lavando: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  finalizando: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  pronto: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};
const PAYMENT_COLORS: Record<string, string> = {
  pendente: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  pago: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function OrdensPage() {
  const { profile } = useProfile();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNewOs, setShowNewOs] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<OrderRow | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [oRes, cRes, vRes] = await Promise.all([
      listRows<OrderRow>('orders', { orderBy: 'created_at' }),
      listRows<ClientRow>('customers'),
      listRows<VehicleRow>('vehicles'),
    ]);
    if (oRes.error) toast.error('Erro ao carregar ordens: ' + oRes.error);
    else setOrders(oRes.data ?? []);
    if (cRes.error) toast.error('Erro ao carregar clientes: ' + cRes.error);
    else setClients(cRes.data ?? []);
    if (vRes.error) toast.error('Erro ao carregar veículos: ' + vRes.error);
    else setVehicles(vRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function getClientName(id: string) { return clients.find((c) => c.id === id)?.name ?? '—'; }
  function getVehicleLabel(id: string) {
    const v = vehicles.find((v) => v.id === id);
    if (!v) return '—';
    return [v.brand, v.model, v.plate].filter(Boolean).join(' ');
  }

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (String(o.number).includes(q)) return true;
    const cName = getClientName(o.client_id).toLowerCase();
    if (cName.includes(q)) return true;
    const vLabel = getVehicleLabel(o.vehicle_id).toLowerCase();
    if (vLabel.includes(q)) return true;
    if (STATUS_LABELS[o.kanban_status]?.toLowerCase().includes(q)) return true;
    return false;
  });

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    const { error } = await updateRow('orders', cancelTarget.id, { status: 'cancelled' });
    if (error) toast.error('Erro ao cancelar: ' + error);
    else { toast.success('OS cancelada'); setCancelTarget(null); await load(); }
    setCancelling(false);
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Ordens de Serviço</h1>
        <Button onClick={() => setShowNewOs(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Nova OS
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Buscar por nº, cliente, placa..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{filtered.length} ordem(ns) encontrada(s)</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p>Nenhuma ordem de serviço encontrada.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((order) => (
            <Card key={order.id} className="bg-card border-border hover:border-blue-500/30 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">#{order.number}</p>
                    <p className="text-sm text-slate-300 truncate max-w-[200px]">{getClientName(order.client_id)}</p>
                  </div>
                  <Badge className={`text-xs border ${STATUS_COLORS[order.kanban_status] ?? 'bg-slate-500/20 text-slate-400'}`}>
                    {STATUS_LABELS[order.kanban_status] ?? order.kanban_status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <p className="truncate">{getVehicleLabel(order.vehicle_id)}</p>
                  <div className="flex items-center justify-between">
                    <span>
                      {order.total != null ? `R$ ${Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                    </span>
                    <span>{fmtDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge className={`text-[10px] border ${order.payment_method ? PAYMENT_COLORS.pago : PAYMENT_COLORS.pendente}`}>
                      {order.payment_method ? 'Pago' : 'Pendente'}
                    </Badge>
                    <div className="flex-1" />
                    <Link href="/kanban" className="text-blue-400 hover:text-blue-300 transition-colors" title="Ver no Kanban">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    {(!order.status || order.status !== 'cancelled') && (
                      <button onClick={() => setCancelTarget(order)}
                        className="text-slate-500 hover:text-red-400 transition-colors" title="Cancelar OS">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <OsFormDialog open={showNewOs} onOpenChange={setShowNewOs} onSaved={load} />

      <Dialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">Cancelar OS</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">
            Cancelar a ordem de serviço <span className="text-white font-medium">#{cancelTarget?.number}</span>?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelTarget(null)} className="text-slate-300">Voltar</Button>
            <Button onClick={handleCancel} disabled={cancelling} className="bg-red-600 hover:bg-red-500 text-white">
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Cancelamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
