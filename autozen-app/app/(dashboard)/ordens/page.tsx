'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, FileText, Pencil, Trash2, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, insertRow, updateRow, deleteRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';
import { OsPhotosDialog } from '@/components/os-photos-dialog';

interface Order {
  id: string; company_id: string; number: number; client_id: string; vehicle_id: string;
  description: string | null; status: string; total: number; payment_method: string | null;
  service_ids: string[] | null;
}
interface Opt { id: string; name?: string; plate?: string }
interface ServiceOpt { id: string; name: string; price: number; estimated_time: number | null }

const TABLE = 'orders';
const statusColors: Record<string, string> = {
  aberta: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  andamento: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  finalizada: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelada: 'bg-red-500/10 text-red-400 border-red-500/20',
};

type OrderForm = {
  client_id: string; vehicle_id: string; description: string; total: string;
  status: string; payment_method: string; service_ids: string[];
};
const emptyForm: OrderForm = { client_id: '', vehicle_id: '', description: '', total: '', status: 'aberta', payment_method: 'pix', service_ids: [] };

function fmtTime(min: number) {
  if (!min) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export default function OrdensPage() {
  const { profile, isAdmin } = useProfile();
  const [items, setItems] = useState<Order[]>([]);
  const [clients, setClients] = useState<Opt[]>([]);
  const [vehicles, setVehicles] = useState<Opt[]>([]);
  const [services, setServices] = useState<ServiceOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [photosOs, setPhotosOs] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, c, v, s] = await Promise.all([
      listRows<Order>(TABLE, { orderBy: 'created_at' }),
      listRows<Opt>('clients', { orderBy: 'name', ascending: true }),
      listRows<Opt>('vehicles', { orderBy: 'plate', ascending: true }),
      listRows<ServiceOpt>('services', { orderBy: 'name', ascending: true }),
    ]);
    if (o.error) toast.error('Erro ao carregar OS: ' + o.error);
    else setItems(o.data ?? []);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setServices(s.data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? '—';
  const vehiclePlate = (id: string) => vehicles.find((v) => v.id === id)?.plate ?? '—';
  const filtered = items.filter((o) =>
    String(o.number).includes(search) || clientName(o.client_id).toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search]);

  function toggleService(id: string) {
    setForm((f) => {
      const has = f.service_ids.includes(id);
      const next = has ? f.service_ids.filter((x) => x !== id) : [...f.service_ids, id];
      const sum = next.reduce((a, sid) => a + Number(services.find((s) => s.id === sid)?.price ?? 0), 0);
      return { ...f, service_ids: next, total: sum ? String(sum) : f.total };
    });
  }
  const selectedTime = form.service_ids.reduce((a, sid) => a + Number(services.find((s) => s.id === sid)?.estimated_time ?? 0), 0);

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(o: Order) {
    setEditing(o);
    setForm({ client_id: o.client_id, vehicle_id: o.vehicle_id, description: o.description ?? '', total: String(o.total ?? ''), status: o.status, payment_method: o.payment_method ?? 'pix', service_ids: o.service_ids ?? [] });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_id || !form.vehicle_id) { toast.error('Cliente e veículo são obrigatórios'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);
    const base = {
      client_id: form.client_id, vehicle_id: form.vehicle_id, description: form.description || null,
      total: Number(form.total) || 0, status: form.status, payment_method: form.payment_method,
      service_ids: form.service_ids,
    };
    if (editing) {
      const { error } = await updateRow<Order>(TABLE, editing.id, base);
      if (error) toast.error('Erro ao atualizar: ' + error);
      else { toast.success('OS atualizada'); setDialogOpen(false); await load(); }
    } else {
      const nextNumber = items.reduce((m, o) => Math.max(m, o.number ?? 0), 1000) + 1;
      const { error } = await insertRow<Order>(TABLE, { company_id: profile.company_id, number: nextNumber, kanban_status: 'aguardando', payment_status: 'pendente', ...base });
      if (error) toast.error('Erro ao criar: ' + error);
      else { toast.success('OS criada'); setDialogOpen(false); await load(); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteRow(TABLE, deleteTarget.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('OS excluída'); setDeleteTarget(null); await load(); }
    setDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Ordens de Serviço</h1>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Nova OS
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Buscar por número ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500"><p>Nenhuma ordem de serviço.</p></div>
      ) : (
        <>
        <div className="grid gap-4">
          {pageItems.map((order) => (
            <Card key={order.id} className="bg-card border-border hover:border-blue-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" /> OS #{order.number}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className={statusColors[order.status] ?? 'bg-slate-700 text-slate-300'}>{order.status}</Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-cyan-400" onClick={() => setPhotosOs(order)} aria-label="Fotos"><Camera className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-400" onClick={() => openEdit(order)} aria-label="Editar"><Pencil className="w-4 h-4" /></Button>
                    {isAdmin && <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteTarget(order)} aria-label="Excluir"><Trash2 className="w-4 h-4" /></Button>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-white">{clientName(order.client_id)}</p>
                    <p className="text-xs text-slate-500">{vehiclePlate(order.vehicle_id)}{order.description ? ' · ' + order.description : ''}</p>
                    {(order.service_ids?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {order.service_ids!.map((sid) => {
                          const s = services.find((x) => x.id === sid);
                          return s ? <span key={sid} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{s.name}</span> : null;
                        })}
                      </div>
                    )}
                  </div>
                  <p className="text-lg font-bold text-emerald-400">R$ {Number(order.total ?? 0).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-slate-300">Anterior</Button>
            <span className="text-xs text-slate-400">Página {page} de {totalPages}</span>
            <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="text-slate-300">Próxima</Button>
          </div>
        )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">{editing ? `Editar OS #${editing.number}` : 'Nova OS'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Cliente *</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v ?? '' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Veículo *</Label>
              <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v ?? '' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Serviços</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                {services.length === 0 ? (
                  <span className="text-xs text-slate-500">Nenhum serviço cadastrado.</span>
                ) : services.map((s) => {
                  const sel = form.service_ids.includes(s.id);
                  return (
                    <button type="button" key={s.id} onClick={() => toggleService(s.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${sel ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-blue-500/50'}`}>
                      {s.name} · R$ {Number(s.price ?? 0).toFixed(0)}
                    </button>
                  );
                })}
              </div>
              {form.service_ids.length > 0 && (
                <p className="text-xs text-slate-500">{form.service_ids.length} serviço(s){selectedTime ? ` · tempo estimado ${fmtTime(selectedTime)}` : ''}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Descrição</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Total (R$)</Label>
                <Input type="number" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? '' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberta">Aberta</SelectItem>
                    <SelectItem value="andamento">Andamento</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Pagamento</Label>
                <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v ?? '' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">Excluir OS</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">Excluir a OS <span className="text-white font-medium">#{deleteTarget?.number}</span>?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-300">Cancelar</Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-500 text-white">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OsPhotosDialog
        open={!!photosOs}
        onOpenChange={(o) => !o && setPhotosOs(null)}
        osId={photosOs?.id ?? null}
        osNumber={photosOs?.number ?? null}
        companyId={profile?.company_id ?? null}
      />
    </div>
  );
}
