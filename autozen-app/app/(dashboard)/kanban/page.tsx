'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Car, Loader2, MessageSquare, Clock, GripVertical, User, Phone,
  Tag, CircleDollarSign, History, Camera, ChevronRight, ImageIcon,
  Upload, Trash2, CalendarDays, Palette
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, updateRow, insertRow, deleteRow } from '@/lib/db';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { uploadOsPhoto, deleteStorageByUrl } from '@/lib/storage';
import { useProfile } from '@/hooks/useProfile';

interface OrderRow {
  id: string; number: number; client_id: string; vehicle_id: string;
  kanban_status: string; created_at: string; updated_at: string;
  description?: string; total?: number; payment_method?: string; status?: string;
}
interface ClientOpt { id: string; name?: string; phone?: string | null }
interface VehicleOpt { id: string; plate?: string; model?: string; brand?: string; color?: string; year?: string }
interface OrderServiceRow { id: string; order_id: string; service_id: string; quantity: number; price: number }
interface ServiceRow { id: string; name: string; price: number }
interface PhotoRow { id: string; os_id: string; company_id: string; photo_url: string; photo_type: string }
interface TimelineEntry { id: string; from_status?: string; to_status: string; timestamp: string }

const columns: { id: string; title: string; color: string; border: string }[] = [
  { id: 'aguardando', title: 'Aguardando', color: 'border-t-amber-500', border: 'border-amber-500/30' },
  { id: 'lavando', title: 'Lavando', color: 'border-t-blue-500', border: 'border-blue-500/30' },
  { id: 'finalizando', title: 'Finalizando', color: 'border-t-violet-500', border: 'border-violet-500/30' },
  { id: 'pronto', title: 'Pronto', color: 'border-t-emerald-500', border: 'border-emerald-500/30' },
];

const stageLabel: Record<string, string> = {
  aguardando: 'Aguardando',
  lavando: 'Em lavagem',
  finalizando: 'Finalizando',
  pronto: 'Pronto',
};

const stageMsg: Record<string, string> = {
  aguardando: 'recebemos seu veículo e ele está na fila de atendimento',
  lavando: 'seu veículo já está em atendimento',
  finalizando: 'estamos finalizando o serviço do seu veículo',
  pronto: 'seu veículo está pronto para retirada',
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

function paymentLabel(m?: string) {
  const map: Record<string, string> = { pix: 'Pix', dinheiro: 'Dinheiro', cartao: 'Cartão', debito: 'Débito', credito: 'Crédito' };
  return map[m ?? ''] ?? m ?? '—';
}

export default function KanbanPage() {
  const { profile } = useProfile();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOpt[]>([]);
  const [orderServices, setOrderServices] = useState<OrderServiceRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [timelines, setTimelines] = useState<Record<string, TimelineEntry[]>>({});
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'before' | 'after'>('before');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedOrder = orders.find((o) => o.id === selectedId);
  const selectedClient = clients.find((c) => c.id === selectedOrder?.client_id);
  const selectedVehicle = vehicles.find((v) => v.id === selectedOrder?.vehicle_id);
  const selectedServices = orderServices.filter((os) => os.order_id === selectedId);
  const selectedPhotos = photos.filter((p) => p.os_id === selectedId);
  const selectedTimeline = timelines[selectedId ?? ''] ?? [];

  const computeTimeline = useCallback((order: OrderRow): TimelineEntry[] => {
    const entries: TimelineEntry[] = [
      { id: `init-${order.id}`, to_status: 'criado', timestamp: order.created_at },
    ];
    if (order.updated_at !== order.created_at) {
      entries.push({ id: `move-${order.id}`, from_status: undefined, to_status: order.kanban_status, timestamp: order.updated_at });
    }
    return entries;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, c, v, osv, sv] = await Promise.all([
      listRows<OrderRow>('orders', { orderBy: 'created_at' }),
      listRows<ClientOpt>('clients', { orderBy: 'name', ascending: true }),
      listRows<VehicleOpt>('vehicles', { orderBy: 'plate', ascending: true }),
      listRows<OrderServiceRow>('order_services'),
      listRows<ServiceRow>('services', { orderBy: 'name', ascending: true }),
    ]);
    const ordersData = o.data ?? [];
    setOrders(ordersData);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setOrderServices(osv.data ?? []);
    setServices(sv.data ?? []);
    setTimelines(Object.fromEntries(ordersData.map((ord) => [ord.id, computeTimeline(ord)])));
    const { data: ph } = await listRows<PhotoRow>('os_photos');
    setPhotos(ph ?? []);
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

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? '—';
  const vehiclePlate = (id: string) => vehicles.find((v) => v.id === id)?.plate ?? '';
  const vehicleFull = (id: string) => {
    const v = vehicles.find((v) => v.id === id);
    if (!v) return '—';
    return [v.brand, v.model, v.plate].filter(Boolean).join(' ');
  };
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? '—';

  function notify(order: OrderRow) {
    const c = clients.find((cl) => cl.id === order.client_id);
    const phone = onlyDigits(c?.phone ?? '');
    if (!phone) { toast.error('Cliente sem telefone cadastrado'); return; }
    const intl = phone.startsWith('55') ? phone : '55' + phone;
    const body = (stageMsg[order.kanban_status] ?? '').replace('{placa}', vehiclePlate(order.vehicle_id));
    const msg = `Olá ${c?.name ?? ''}! Informamos que ${body}. 🚗✨`;
    window.open(`https://wa.me/${intl}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function moveTo(order: OrderRow, next: string) {
    if (order.kanban_status === next) return;
    const prev = orders;
    const now = new Date().toISOString();
    setOrders((cur) => cur.map((o) => (o.id === order.id ? { ...o, kanban_status: next, updated_at: now } : o)));
    setTimelines((cur) => ({
      ...cur,
      [order.id]: [...(cur[order.id] ?? []), { id: `move-${order.id}-${Date.now()}`, from_status: order.kanban_status, to_status: next, timestamp: now }],
    }));
    const { error } = await updateRow('orders', order.id, { kanban_status: next });
    if (error) { toast.error('Erro ao mover: ' + error); setOrders(prev); return; }
    const c = clients.find((cl) => cl.id === order.client_id);
    toast.success(`OS #${order.number} → ${stageLabel[next] ?? next}`, {
      description: c?.phone ? 'Avisar o cliente no WhatsApp?' : undefined,
      action: c?.phone ? { label: 'Avisar', onClick: () => notify(order) } : undefined,
    });
  }

  function onDrop(colId: string) {
    setOverCol(null);
    const order = orders.find((o) => o.id === dragId);
    setDragId(null);
    if (order) moveTo(order, colId);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { toast.error('Selecione uma imagem'); return; }
    if (!selectedId || !profile?.company_id) { toast.error('OS inválida'); return; }
    setUploading(true);
    const { url, error } = await uploadOsPhoto(profile.company_id, selectedId, uploadType, file);
    if (error || !url) { toast.error('Erro no upload: ' + (error ?? '')); setUploading(false); return; }
    const { error: insErr } = await insertRow('os_photos', {
      company_id: profile.company_id, os_id: selectedId, photo_url: url, photo_type: uploadType,
    });
    if (insErr) toast.error('Erro ao salvar: ' + insErr);
    else { toast.success('Foto enviada'); if (fileRef.current) fileRef.current.value = ''; load(); }
    setUploading(false);
  }

  async function removePhoto(p: PhotoRow) {
    const { error } = await deleteRow('os_photos', p.id);
    if (error) { toast.error('Erro ao excluir: ' + error); return; }
    await deleteStorageByUrl(p.photo_url);
    toast.success('Foto excluída');
    load();
  }

  const totalOS = selectedServices.reduce((sum, s) => sum + Number(s.price) * (s.quantity || 1), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Kanban</h1>
        <span className="text-xs text-slate-500 hidden sm:block">Clique nos cards para ver detalhes</span>
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
                className={`flex flex-col rounded-xl border border-border border-t-4 ${col.color} p-3 transition-all duration-200 ${overCol === col.id ? 'bg-blue-500/10 scale-[1.01]' : 'bg-slate-900/50'}`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-medium text-white">{col.title}</h3>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{cards.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                  {cards.map((card) => (
                    <Card
                      key={card.id}
                      draggable
                      onDragStart={() => setDragId(card.id)}
                      onDragEnd={() => { setDragId(null); setOverCol(null); }}
                      onClick={() => setSelectedId(card.id)}
                      className={`bg-card border-border hover:border-blue-500/40 transition-all duration-200 cursor-pointer active:scale-[0.98] hover:translate-y-[-1px] hover:shadow-lg hover:shadow-blue-500/5 ${dragId === card.id ? 'opacity-50 scale-95' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-slate-600" /> #{card.number}
                          </span>
                          <Car className="w-3 h-3 text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-white truncate">{clientName(card.client_id)}</p>
                        <p className="text-xs text-slate-400 truncate">{vehiclePlate(card.vehicle_id)}</p>
                        {card.total && Number(card.total) > 0 ? (
                          <p className="text-xs text-emerald-400 font-medium mt-1">
                            R$ {Number(card.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        ) : null}
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {elapsed(card.updated_at || card.created_at)}
                        </p>
                        <Button size="sm" variant="ghost"
                          className="mt-2 h-7 w-full text-xs text-emerald-400 hover:bg-emerald-500/10"
                          onClick={(e) => { e.stopPropagation(); notify(card); }}>
                          <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {cards.length === 0 && <p className="text-xs text-slate-600 text-center py-4">Nenhum card</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer de detalhes da OS */}
      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent className="w-full sm:max-w-lg border-l border-border bg-slate-950 text-white">
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

                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
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
                            Pagamento: {paymentLabel(selectedOrder.payment_method)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {columns.map((col) => {
                        if (col.id === selectedOrder.kanban_status) return null;
                        return (
                          <Button key={col.id} size="sm" variant="outline"
                            className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                            onClick={() => { moveTo(selectedOrder, col.id); setSelectedId(null); }}>
                            <ChevronRight className="w-3 h-3 mr-1" /> {col.title}
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
                        const name = serviceName(s.service_id);
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
                    <form onSubmit={handleUpload} className="flex flex-col gap-3 p-3 rounded-lg bg-slate-800/30">
                      <div className="flex items-end gap-3">
                        <div className="space-y-1.5 flex-1">
                          <Label className="text-xs text-slate-400">Tipo</Label>
                          <Select value={uploadType} onValueChange={(v) => setUploadType(v as 'before' | 'after')}>
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
                          <Input ref={fileRef} type="file" accept="image/*"
                            className="bg-slate-800 border-slate-700 text-white h-8 text-xs file:text-xs file:text-slate-300" />
                        </div>
                        <Button type="submit" disabled={uploading} size="sm"
                          className="bg-blue-600 hover:bg-blue-500 h-8 text-xs">
                          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
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
