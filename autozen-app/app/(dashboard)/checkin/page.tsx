'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ClipboardCheck, Car, User, Loader2, Search, Camera, Upload,
  Check, X, ChevronRight, AlertCircle, Calendar, Clock, MessageSquare,
  Trash2, ImageIcon, FileCheck
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { listRows, updateRow, insertRow, deleteRow } from '@/lib/db';
import { uploadOsPhoto, deleteStorageByUrl } from '@/lib/storage';
import { useProfile } from '@/hooks/useProfile';

interface OrderRow {
  id: string; number: number; client_id: string; vehicle_id: string;
  kanban_status: string; created_at: string; notes?: string;
  checklist?: Record<string, boolean>; photos_before?: string[];
}
interface ClientOpt { id: string; name?: string; phone?: string | null }
interface VehicleOpt { id: string; plate?: string; model?: string; brand?: string; color?: string }
interface PhotoRow { id: string; os_id: string; company_id: string; photo_url: string; photo_type: string }

const CHECKLIST_ITEMS = [
  { key: 'farois', label: 'Faróis e lanternas' },
  { key: 'pneus', label: 'Pneus (estado e calibragem)' },
  { key: 'lataria', label: 'Lataria (amassados/riscos)' },
  { key: 'vidros', label: 'Vidros e retrovisores' },
  { key: 'interior', label: 'Interior (bancos/tapetes)' },
  { key: 'portas', label: 'Portas e fechaduras' },
  { key: 'capo', label: 'Capô e porta-malas' },
  { key: 'suspensao', label: 'Suspensão' },
  { key: 'escapamento', label: 'Escapamento' },
  { key: 'bateria', label: 'Bateria' },
];

export default function CheckinPage() {
  const { profile } = useProfile();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOpt[]>([]);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [checkinNotes, setCheckinNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, c, v] = await Promise.all([
      listRows<OrderRow>('orders', { orderBy: 'created_at' }),
      listRows<ClientOpt>('clients', { orderBy: 'name', ascending: true }),
      listRows<VehicleOpt>('vehicles', { orderBy: 'plate', ascending: true }),
    ]);
    setOrders(o.data ?? []);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    const { data: ph } = await listRows<PhotoRow>('os_photos');
    setPhotos(ph ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const awaiting = orders.filter((o) => o.kanban_status === 'aguardando')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const filtered = awaiting.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const cName = clients.find((cl) => cl.id === o.client_id)?.name?.toLowerCase() ?? '';
    const vPlate = vehicles.find((v) => v.id === o.vehicle_id)?.plate?.toLowerCase() ?? '';
    return cName.includes(q) || vPlate.includes(q) || `#${o.number}`.includes(q);
  });

  function startCheckin(order: OrderRow) {
    setSelectedOrder(order);
    setChecklist(order.checklist ?? {});
    setCheckinNotes(order.notes ?? '');
  }

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? '—';
  const vehicleFull = (id: string) => {
    const v = vehicles.find((v) => v.id === id);
    if (!v) return '—';
    return `${v.brand ?? ''} ${v.model ?? ''} ${v.plate ?? ''}`.trim();
  };

  const selectedPhotos = photos.filter((p) => p.os_id === selectedOrder?.id && p.photo_type === 'before');

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !selectedOrder || !profile?.company_id) { toast.error('Selecione uma imagem'); return; }
    setUploading(true);
    const { url, error } = await uploadOsPhoto(profile.company_id, selectedOrder.id, 'before', file);
    if (error || !url) { toast.error('Erro no upload: ' + (error ?? '')); setUploading(false); return; }
    const { error: insErr } = await insertRow('os_photos', {
      company_id: profile.company_id, os_id: selectedOrder.id, photo_url: url, photo_type: 'before',
    });
    if (insErr) toast.error('Erro ao salvar: ' + insErr);
    else { toast.success('Foto registrada'); if (fileRef.current) fileRef.current.value = ''; load(); }
    setUploading(false);
  }

  async function removePhoto(p: PhotoRow) {
    const { error } = await deleteRow('os_photos', p.id);
    if (error) { toast.error('Erro ao excluir: ' + error); return; }
    await deleteStorageByUrl(p.photo_url);
    toast.success('Foto excluída');
    load();
  }

  async function saveAndAdvance() {
    if (!selectedOrder || !profile?.company_id) return;
    setSaving(true);
    const checkedCount = Object.values(checklist).filter(Boolean).length;
    if (checkedCount === 0) {
      toast.error('Preencha pelo menos um item do checklist');
      setSaving(false);
      return;
    }
    const { error } = await updateRow('orders', selectedOrder.id, {
      checklist,
      notes: checkinNotes || null,
      kanban_status: 'lavando',
    });
    if (error) { toast.error('Erro ao salvar: ' + error); setSaving(false); return; }
    toast.success(`Check-in #${selectedOrder.number} concluído! OS enviada para lavagem.`);
    setSelectedOrder(null);
    load();
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-blue-400" />
            Check-in do Veículo
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Inspecione o veículo e registre o estado antes do serviço
          </p>
        </div>
        {selectedOrder && (
          <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="text-slate-400">
            Voltar à lista
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : !selectedOrder ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="Buscar por cliente, placa ou #OS..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum veículo aguardando check-in.</p>
              <p className="text-xs text-slate-600 mt-1">Quando uma OS for criada com status &quot;Aguardando&quot;, aparecerá aqui.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((order) => (
                <Card key={order.id}
                  className="bg-card border-border hover:border-blue-500/30 transition-all duration-200 cursor-pointer hover:scale-[1.005]"
                  onClick={() => startCheckin(order)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Car className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            #{order.number} — {clientName(order.client_id)}
                          </p>
                          <p className="text-xs text-slate-400">{vehicleFull(order.vehicle_id)}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Checklist - lado esquerdo */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  Checklist de Inspeção — OS #{selectedOrder.number}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {CHECKLIST_ITEMS.map((item) => {
                  const checked = checklist[item.key] ?? false;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                        checked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="text-sm">{item.label}</span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                      }`}>
                        {checked && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white">Observações do Check-in</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={checkinNotes}
                  onChange={(e) => setCheckinNotes(e.target.value)}
                  placeholder="Anote observações sobre o estado do veículo..."
                  className="bg-slate-800/50 border-slate-700 text-white min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Button onClick={saveAndAdvance} disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 text-sm font-medium">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              {saving ? 'Salvando...' : 'Concluir Check-in e Enviar para Lavagem'}
            </Button>
          </div>

          {/* Fotos e Info - lado direito */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" /> Fotos (Antes)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input ref={fileRef} type="file" accept="image/*"
                    className="bg-slate-800 border-slate-700 text-white h-9 text-xs flex-1 file:text-xs" />
                  <Button onClick={handleUpload} disabled={uploading} size="sm" className="bg-blue-600 hover:bg-blue-500 h-9">
                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  </Button>
                </div>
                {selectedPhotos.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-sm flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40" /> Nenhuma foto
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPhotos.map((p) => (
                      <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800/50 group">
                        <Image src={p.photo_url} alt="Check-in" fill className="object-cover" unoptimized />
                        <button onClick={() => removePhoto(p)}
                          className="absolute top-1 right-1 h-6 w-6 bg-black/60 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity"
                          aria-label="Excluir">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-white">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-slate-800/30 p-3 space-y-1">
                  <p className="text-xs text-slate-400 flex items-center gap-1"><User className="w-3 h-3" /> Cliente</p>
                  <p className="text-sm text-white">{clientName(selectedOrder.client_id)}</p>
                </div>
                <div className="rounded-lg bg-slate-800/30 p-3 space-y-1">
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Car className="w-3 h-3" /> Veículo</p>
                  <p className="text-sm text-white">{vehicleFull(selectedOrder.vehicle_id)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
