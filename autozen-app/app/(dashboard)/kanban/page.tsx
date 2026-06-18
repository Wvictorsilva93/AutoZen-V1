'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import {
  Car, Loader2, MessageSquare, Clock, User, Phone,
  Tag, CircleDollarSign, Camera, ChevronRight, ImageIcon,
  Upload, Trash2, Palette, Plus,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { listRows, updateRow, insertRow, deleteRow } from '@/lib/db';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { uploadOsPhoto, deleteStorageByUrl } from '@/lib/storage';
import { useProfile } from '@/hooks/useProfile';
import OsFormDialog from '@/components/os-form-dialog';
import OperationalDashboard from './components/operational-dashboard';
import KanbanBoard from './components/kanban-board';

interface OrderRow {
  id: string; number: number; client_id: string; vehicle_id: string; employee_id?: string;
  kanban_status: string; status?: string; payment_status?: string; payment_method?: string;
  created_at: string; updated_at: string; description?: string; total?: number;
}
interface ClientOpt { id: string; name?: string; phone?: string | null }
interface VehicleOpt { id: string; plate?: string; model?: string; brand?: string; color?: string; year?: string }
interface OrderServiceRow { id: string; order_id: string; service_id: string; quantity: number; price: number }
interface ServiceRow { id: string; name: string; price: number }
interface PhotoRow { id: string; os_id: string; company_id: string; photo_url: string; photo_type: string }
interface EmployeeRow { id: string; name: string }

const stageLabel: Record<string, string> = {
  aguardando: 'Aguardando', lavando: 'Em lavagem', finalizando: 'Finalizando', pronto: 'Pronto',
};
const stageMsg: Record<string, string> = {
  aguardando: 'recebemos seu veículo e ele está na fila de atendimento',
  lavando: 'seu veículo já está em atendimento',
  finalizando: 'estamos finalizando o serviço do seu veículo',
  pronto: 'seu veículo está pronto para retirada',
};

function onlyDigits(s: string | null | undefined) { return (s ?? '').replace(/\D/g, ''); }

function elapsed(fromIso: string) {
  const ms = Date.now() - new Date(fromIso).getTime();
  if (ms < 0 || isNaN(ms)) return '—';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function statusBadge(s: string) {
  const map: Record<string, string> = {
    aguardando: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    lavando: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    finalizando: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    pronto: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return map[s] ?? 'bg-slate-500/20 text-slate-400';
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export default function KanbanPage() {
  const { profile } = useProfile();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOpt[]>([]);
  const [orderServices, setOrderServices] = useState<OrderServiceRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [timelines, setTimelines] = useState<Record<string, { id: string; from_status?: string; to_status: string; timestamp: string }[]>>({});
  const [loading, setLoading] = useState(true);

  const [showNewOs, setShowNewOs] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [photoTab, setPhotoTab] = useState<'before' | 'after'>('before');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPayment, setShowPayment] = useState<OrderRow | null>(null);
  const [payMethod, setPayMethod] = useState('pix');
  const [paying, setPaying] = useState(false);
  const [showCancel, setShowCancel] = useState<OrderRow | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedId);
  const selectedClient = clients.find((c) => c.id === selectedOrder?.client_id);
  const selectedVehicle = vehicles.find((v) => v.id === selectedOrder?.vehicle_id);
  const selectedServices = orderServices.filter((os) => os.order_id === selectedId);
  const selectedPhotos = photos.filter((p) => p.os_id === selectedId);
  const selectedTimeline = timelines[selectedId ?? ''] ?? [];

  const totalOS = selectedServices.reduce((sum, s) => sum + Number(s.price) * (s.quantity || 1), 0);

  const computeTimeline = useCallback((order: OrderRow) => {
    const entries: { id: string; from_status?: string; to_status: string; timestamp: string }[] = [
      { id: `init-${order.id}`, to_status: 'criado', timestamp: order.created_at },
    ];
    if (order.updated_at !== order.created_at) {
      entries.push({ id: `move-${order.id}`, from_status: undefined, to_status: order.kanban_status, timestamp: order.updated_at });
    }
    return entries;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, c, v, osv, sv, ph, e] = await Promise.all([
      listRows<OrderRow>('orders', { orderBy: 'created_at' }),
      listRows<ClientOpt>('clients', { orderBy: 'name', ascending: true }),
      listRows<VehicleOpt>('vehicles', { orderBy: 'plate', ascending: true }),
      listRows<OrderServiceRow>('order_services'),
      listRows<ServiceRow>('services', { orderBy: 'name', ascending: true }),
      listRows<PhotoRow>('os_photos'),
      listRows<EmployeeRow>('employees', { orderBy: 'name', ascending: true }),
    ]);
    const ordersData = o.data ?? [];
    setOrders(ordersData);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setOrderServices(osv.data ?? []);
    setServices(sv.data ?? []);
    setPhotos(ph.data ?? []);
    setEmployees(e.data ?? []);
    setTimelines(Object.fromEntries(ordersData.map((ord) => [ord.id, computeTimeline(ord)])));
    setLoading(false);
  }, [computeTimeline]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel('kanban-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => { load(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const stats = {
    osHoje: orders.filter((o) => isToday(o.created_at)).length,
    emAtendimento: orders.filter((o) => ['aguardando', 'lavando', 'finalizando'].includes(o.kanban_status)).length,
    finalizadas: orders.filter((o) => o.kanban_status === 'pronto').length,
    faturamentoDia: orders
      .filter((o) => o.payment_status === 'pago' && isToday(o.updated_at))
      .reduce((sum, o) => sum + Number(o.total ?? 0), 0),
    veiculosPatio: orders.filter((o) => o.kanban_status !== 'pronto').length,
    ticketMedio: (() => {
      const withTotal = orders.filter((o) => Number(o.total) > 0);
      return withTotal.length > 0
        ? withTotal.reduce((sum, o) => sum + Number(o.total ?? 0), 0) / withTotal.length
        : 0;
    })(),
  };

  function notify(order: OrderRow) {
    const c = clients.find((cl) => cl.id === order.client_id);
    const phone = onlyDigits(c?.phone ?? '');
    if (!phone) { toast.error('Cliente sem telefone cadastrado'); return; }
    const intl = phone.startsWith('55') ? phone : '55' + phone;
    const plate = vehicles.find((v) => v.id === order.vehicle_id)?.plate ?? '';
    const body = (stageMsg[order.kanban_status] ?? '').replace('{placa}', plate);
    const msg = `Olá ${c?.name ?? ''}! Informamos que ${body}. 🚗✨`;
    window.open(`https://wa.me/${intl}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function moveTo(order: OrderRow, next: string) {
    if (order.kanban_status === next) return;
    const prevOrders = [...orders];
    const now = new Date().toISOString();
    setOrders((cur) => cur.map((o) => (o.id === order.id ? { ...o, kanban_status: next, updated_at: now } : o)));
    setTimelines((cur) => ({
      ...cur,
      [order.id]: [...(cur[order.id] ?? []), { id: `move-${order.id}-${Date.now()}`, from_status: order.kanban_status, to_status: next, timestamp: now }],
    }));
    const { error } = await updateRow('orders', order.id, { kanban_status: next, updated_at: now });
    if (error) { toast.error('Erro ao mover: ' + error); setOrders(prevOrders); return; }
    const c = clients.find((cl) => cl.id === order.client_id);
    toast.success(`OS #${order.number} → ${stageLabel[next] ?? next}`, {
      description: c?.phone ? 'Avisar o cliente no WhatsApp?' : undefined,
      action: c?.phone ? { label: 'Avisar', onClick: () => notify({ ...order, kanban_status: next }) } : undefined,
    });
  }

  async function handlePayment() {
    if (!showPayment) return;
    setPaying(true);
    const { error } = await updateRow('orders', showPayment.id, {
      payment_status: 'pago', payment_method: payMethod,
    });
    if (error) { toast.error('Erro ao processar pagamento: ' + error); setPaying(false); return; }
    toast.success(`Pagamento registrado — OS #${showPayment.number}`);
    setShowPayment(null);
    setPaying(false);
    load();
  }

  async function handleCancel() {
    if (!showCancel) return;
    const { error } = await updateRow('orders', showCancel.id, { status: 'cancelled' });
    if (error) { toast.error('Erro ao cancelar: ' + error); return; }
    toast.success(`OS #${showCancel.number} cancelada`);
    setShowCancel(null);
    load();
  }

  async function handleUploadPhoto(e: React.FormEvent) {
    e.preventDefault();
    const input = document.getElementById('photo-upload-input') as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) { toast.error('Selecione uma imagem'); return; }
    if (!selectedId || !profile?.company_id) { toast.error('OS inválida'); return; }
    setUploadingPhoto(true);
    const { url, error } = await uploadOsPhoto(profile.company_id, selectedId, photoTab, file);
    if (error || !url) { toast.error('Erro no upload: ' + (error ?? '')); setUploadingPhoto(false); return; }
    const { error: insErr } = await insertRow('os_photos', {
      company_id: profile.company_id, os_id: selectedId, photo_url: url, photo_type: photoTab,
    });
    if (insErr) toast.error('Erro ao salvar: ' + insErr);
    else { toast.success('Foto enviada'); if (input) input.value = ''; load(); }
    setUploadingPhoto(false);
  }

  async function removePhoto(p: PhotoRow) {
    const { error } = await deleteRow('os_photos', p.id);
    if (error) { toast.error('Erro ao excluir: ' + error); return; }
    await deleteStorageByUrl(p.photo_url);
    toast.success('Foto excluída');
    load();
  }

  function handlePrint(order: OrderRow) {
    const c = clients.find((cl) => cl.id === order.client_id);
    const v = vehicles.find((ve) => ve.id === order.vehicle_id);
    const osList = orderServices.filter((os) => os.order_id === order.id);
    const svList = osList.map((os) => {
      const s = services.find((sv) => sv.id === os.service_id);
      return `${s?.name ?? '—'} — R$ ${Number(os.price).toFixed(2)} x${os.quantity ?? 1}`;
    }).join('\n');
    const win = window.open('', '_blank');
    if (!win) { toast.error('Popup bloqueado'); return; }
    win.document.write(`
      <html><head><title>OS #${order.number}</title>
      <style>body{font-family:monospace;padding:40px;color:#222}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px 10px;text-align:left}h1{font-size:20px}</style>
      </head><body>
      <h1>ORDEM DE SERVIÇO #${order.number}</h1>
      <p><strong>Cliente:</strong> ${c?.name ?? '—'}</p>
      <p><strong>Veículo:</strong> ${v ? [v.brand, v.model, v.plate, v.year].filter(Boolean).join(' ') : '—'}</p>
      <p><strong>Status:</strong> ${stageLabel[order.kanban_status] ?? order.kanban_status}</p>
      ${order.description ? `<p><strong>Obs:</strong> ${order.description}</p>` : ''}
      <hr style="margin:20px 0"/>
      <h2>Serviços</h2>
      <pre>${svList || 'Nenhum'}</pre>
      <hr style="margin:20px 0"/>
      <p><strong>Total:</strong> R$ ${Number(order.total ?? 0).toFixed(2)}</p>
      <p><strong>Pagamento:</strong> ${order.payment_status === 'pago' ? 'Pago' : 'Pendente'}</p>
      <script>window.print();window.close();</script>
      </body></html>
    `);
    win.document.close();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Kanban</h1>
        <Button onClick={() => setShowNewOs(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-1" /> Nova OS
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <>
          <OperationalDashboard stats={stats} />

          <KanbanBoard
            orders={orders}
            clients={clients}
            vehicles={vehicles}
            elapsed={elapsed}
            onMove={(orderId, toStatus) => {
              const order = orders.find((o) => o.id === orderId);
              if (order) moveTo(order, toStatus);
            }}
            onView={(id) => setSelectedId(id)}
            onEdit={(order) => setSelectedId(order.id)}
            onPayment={(order) => { setPayMethod('pix'); setShowPayment(order); }}
            onPhotos={(id) => { setPhotoTab('before'); setSelectedId(id); }}
            onPrint={handlePrint}
            onCancel={(order) => setShowCancel(order)}
            onNotify={notify}
          />
        </>
      )}

      <OsFormDialog open={showNewOs} onOpenChange={setShowNewOs} onSaved={load} />

      {/* Payment dialog */}
      <Dialog open={!!showPayment} onOpenChange={(o) => { if (!o) setShowPayment(null); }}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Receber Pagamento — OS #{showPayment?.number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-slate-800/30 p-3 text-center">
              <p className="text-xs text-slate-400">Valor</p>
              <p className="text-2xl font-bold text-emerald-400">
                R$ {Number(showPayment?.total ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Forma de Pagamento</Label>
              <Select value={payMethod} onValueChange={(v) => setPayMethod(v ?? 'pix')}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="debito">Cartão de Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowPayment(null)} className="text-slate-300">Cancelar</Button>
            <Button onClick={handlePayment} disabled={paying} className="bg-emerald-600 hover:bg-emerald-500">
              {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Pagamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation */}
      <Dialog open={!!showCancel} onOpenChange={(o) => { if (!o) setShowCancel(null); }}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Cancelar OS #{showCancel?.number}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-400">Esta ação não pode ser desfeita. A OS será arquivada.</p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowCancel(null)} className="text-slate-300">Voltar</Button>
            <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-500 text-white">Confirmar Cancelamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent className="w-full sm:max-w-lg border-l border-border bg-slate-950 text-white overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="pb-2 border-b border-border">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-white text-lg font-semibold">OS #{selectedOrder.number}</SheetTitle>
                  <Badge className={`${statusBadge(selectedOrder.kanban_status)} border text-xs`}>
                    {stageLabel[selectedOrder.kanban_status] ?? selectedOrder.kanban_status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">Criada em {formatDate(selectedOrder.created_at)}</p>
              </SheetHeader>

              <Tabs defaultValue="dados" className="flex-1 flex flex-col mt-3">
                <TabsList className="bg-slate-800/50 border border-border mb-3">
                  <TabsTrigger value="dados" className="text-xs data-[state=active]:bg-slate-700">Dados</TabsTrigger>
                  <TabsTrigger value="servicos" className="text-xs data-[state=active]:bg-slate-700">Serviços</TabsTrigger>
                  <TabsTrigger value="fotos" className="text-xs data-[state=active]:bg-slate-700">Fotos</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-xs data-[state=active]:bg-slate-700">Histórico</TabsTrigger>
                </TabsList>

                <div className="flex-1 space-y-4">
                  <TabsContent value="dados" className="space-y-4 mt-0">
                    {selectedClient && (
                      <div className="rounded-lg bg-slate-800/30 p-3 space-y-2">
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                          <User className="w-3 h-3" /> Cliente
                        </p>
                        <p className="text-sm text-white">{selectedClient.name}</p>
                        {selectedClient.phone && (
                          <a href={`https://wa.me/55${onlyDigits(selectedClient.phone)}`} target="_blank"
                            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {selectedClient.phone}
                          </a>
                        )}
                      </div>
                    )}

                    {selectedVehicle && (
                      <div className="rounded-lg bg-slate-800/30 p-3 space-y-2">
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                          <Car className="w-3 h-3" /> Veículo
                        </p>
                        <p className="text-sm text-white">
                          {[selectedVehicle.brand, selectedVehicle.model, selectedVehicle.year].filter(Boolean).join(' ')}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {selectedVehicle.plate}
                        </p>
                        {selectedVehicle.color && (
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Palette className="w-3 h-3" /> {selectedVehicle.color}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedOrder.description && (
                      <div className="rounded-lg bg-slate-800/30 p-3">
                        <p className="text-xs font-medium text-slate-400 mb-1">Observações</p>
                        <p className="text-sm text-slate-300">{selectedOrder.description}</p>
                      </div>
                    )}

                    {selectedOrder.total && Number(selectedOrder.total) > 0 && (
                      <div className="rounded-lg bg-slate-800/30 p-3">
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                          <CircleDollarSign className="w-3 h-3" /> Financeiro
                        </p>
                        <p className="text-lg font-bold text-emerald-400 mt-1">
                          R$ {Number(selectedOrder.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        {selectedOrder.payment_method && (
                          <p className="text-xs text-slate-400 mt-1">
                            Pagamento: {selectedOrder.payment_method}
                          </p>
                        )}
                        <Badge className={`mt-1 text-xs ${selectedOrder.payment_status === 'pago' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {selectedOrder.payment_status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {['aguardando', 'lavando', 'finalizando', 'pronto'].map((col) => {
                        if (col === selectedOrder.kanban_status) return null;
                        return (
                          <Button key={col} size="sm" variant="outline"
                            className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                            onClick={() => { moveTo(selectedOrder, col); }}>
                            <ChevronRight className="w-3 h-3 mr-1" /> {stageLabel[col]}
                          </Button>
                        );
                      })}
                      <Button size="sm" variant="outline"
                        className="text-xs border-emerald-700 text-emerald-400 hover:bg-emerald-900/30 ml-auto"
                        onClick={() => notify(selectedOrder)}>
                        <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="servicos" className="space-y-3 mt-0">
                    {selectedServices.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-6">Nenhum serviço vinculado</p>
                    ) : (
                      selectedServices.map((s) => {
                        const name = services.find((sv) => sv.id === s.service_id)?.name ?? '—';
                        const subtotal = Number(s.price) * (s.quantity || 1);
                        return (
                          <div key={s.id} className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3">
                            <div>
                              <p className="text-sm text-white">{name}</p>
                              {s.quantity > 1 && <p className="text-xs text-slate-500">Qtd: {s.quantity}</p>}
                            </div>
                            <p className="text-sm font-medium text-emerald-400">
                              R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        );
                      })
                    )}
                    {selectedServices.length > 0 && (
                      <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 border border-slate-700">
                        <p className="text-sm font-medium text-white">Total</p>
                        <p className="text-base font-bold text-emerald-400">
                          R$ {totalOS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="fotos" className="space-y-4 mt-0">
                    <form onSubmit={handleUploadPhoto} className="flex flex-col gap-3 p-3 rounded-lg bg-slate-800/30">
                      <div className="flex items-end gap-3">
                        <div className="space-y-1.5 flex-1">
                          <Label className="text-xs text-slate-400">Tipo</Label>
                          <Select value={photoTab} onValueChange={(v) => setPhotoTab(v as 'before' | 'after')}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="before">Antes</SelectItem>
                              <SelectItem value="after">Depois</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5 flex-[2]">
                          <Label className="text-xs text-slate-400">Imagem</Label>
                          <Input id="photo-upload-input" type="file" accept="image/*"
                            className="bg-slate-800 border-slate-700 text-white h-8 text-xs file:text-xs file:text-slate-300" />
                        </div>
                        <Button type="submit" disabled={uploadingPhoto} size="sm"
                          className="bg-blue-600 hover:bg-blue-500 h-8 text-xs">
                          {uploadingPhoto ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        </Button>
                      </div>
                    </form>

                    {selectedPhotos.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-sm flex flex-col items-center gap-2">
                        <Camera className="w-8 h-8 opacity-40" /> Nenhuma foto
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {[{ label: 'Antes', list: selectedPhotos.filter((p) => p.photo_type === 'before'), color: 'text-amber-400' },
                          { label: 'Depois', list: selectedPhotos.filter((p) => p.photo_type === 'after'), color: 'text-emerald-400' },
                        ].map((col) => (
                          <div key={col.label}>
                            <p className={`text-xs font-medium mb-2 ${col.color}`}>{col.label}</p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {col.list.map((p) => (
                                <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800/50 group">
                                  <Image src={p.photo_url} alt={col.label} fill className="object-cover" unoptimized />
                                  <button onClick={() => removePhoto(p)}
                                    className="absolute top-1 right-1 h-5 w-5 bg-black/60 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                                    aria-label="Excluir">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              {col.list.length === 0 && <p className="text-xs text-slate-600 col-span-2">—</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-0 mt-0">
                    {selectedTimeline.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-6">Nenhum registro</p>
                    ) : (
                      <div className="relative pl-6 border-l-2 border-slate-700 space-y-4 ml-2">
                        {selectedTimeline.map((entry, i) => (
                          <div key={entry.id} className="relative">
                            <div className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 ${i === selectedTimeline.length - 1 ? 'bg-blue-500 border-blue-400' : 'bg-slate-800 border-slate-600'}`} />
                            <p className="text-sm text-white">
                              {entry.to_status === 'criado' ? 'OS criada' : entry.from_status
                                ? `${stageLabel[entry.from_status] ?? entry.from_status} → ${stageLabel[entry.to_status] ?? entry.to_status}`
                                : `Movido para ${stageLabel[entry.to_status] ?? entry.to_status}`}
                            </p>
                            <p className="text-xs text-slate-500">{formatDate(entry.timestamp)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
