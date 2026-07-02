'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Car, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { listRows, insertRow, updateRow, deleteRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';
import { maskPlate } from '@/lib/masks';

interface Vehicle {
  id: string;
  company_id: string;
  client_id: string | null;
  plate: string;
  type: string;
  brand: string;
  model: string;
  color: string;
  status: string;
}
interface ClientOption { id: string; name: string }

const TABLE = 'vehicles';
const emptyForm = { plate: '', brand: '', model: '', color: '', type: 'carro', client_id: '' };

export default function VeiculosPage() {
  const { profile, isAdmin } = useProfile();
  const [items, setItems] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [v, c] = await Promise.all([
      listRows<Vehicle>(TABLE, { orderBy: 'created_at' }),
      listRows<ClientOption>('clients', { orderBy: 'name', ascending: true }),
    ]);
    if (v.error) toast.error('Erro ao carregar veículos: ' + v.error);
    else setItems(v.data ?? []);
    setClients(c.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? '—';
  const filtered = items.filter((v) =>
    [v.plate, v.model, v.brand].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
  );

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(v: Vehicle) {
    setEditing(v);
    setForm({ plate: v.plate ?? '', brand: v.brand ?? '', model: v.model ?? '', color: v.color ?? '', type: v.type ?? 'carro', client_id: v.client_id ?? '' });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.plate.trim()) { toast.error('Placa é obrigatória'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);
    const payload = {
      plate: form.plate, brand: form.brand, model: form.model, color: form.color,
      type: form.type, client_id: form.client_id || null,
    };
    if (editing) {
      const { error } = await updateRow<Vehicle>(TABLE, editing.id, payload);
      if (error) toast.error('Erro ao atualizar: ' + error);
      else { toast.success('Veículo atualizado'); setDialogOpen(false); await load(); }
    } else {
      const { error } = await insertRow<Vehicle>(TABLE, { company_id: profile.company_id, status: 'fila', ...payload });
      if (error) toast.error('Erro ao criar: ' + error);
      else { toast.success('Veículo criado'); setDialogOpen(false); await load(); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteRow(TABLE, deleteTarget.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('Veículo excluído'); setDeleteTarget(null); await load(); }
    setDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Veículos</h1>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Novo Veículo
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Buscar por placa, modelo ou marca..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500"><p>Nenhum veículo encontrado.</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <Card key={vehicle.id} className="bg-card border-border hover:border-blue-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-400" /> {vehicle.plate}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 capitalize">{vehicle.type}</Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-400" onClick={() => openEdit(vehicle)} aria-label="Editar"><Pencil className="w-4 h-4" /></Button>
                    {isAdmin && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteTarget(vehicle)} aria-label="Excluir"><Trash2 className="w-4 h-4" /></Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white font-medium">{vehicle.brand} {vehicle.model}</p>
                <p className="text-xs text-slate-400 mt-1">Cor: {vehicle.color || '—'}</p>
                <p className="text-xs text-slate-500 mt-1">Dono: {clientName(vehicle.client_id)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">{editing ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Placa *</Label>
              <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: maskPlate(e.target.value) })} className="bg-slate-800/50 border-slate-700 text-white" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Marca</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Modelo</Label>
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Cor</Label>
                <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v ?? '' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Cliente</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v ?? '' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue placeholder="Selecione o cliente">{clients.find(c => c.id === form.client_id)?.name}</SelectValue></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
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
          <DialogHeader><DialogTitle className="text-white">Excluir veículo</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">Excluir o veículo <span className="text-white font-medium">{deleteTarget?.plate}</span>?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-300">Cancelar</Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-500 text-white">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
