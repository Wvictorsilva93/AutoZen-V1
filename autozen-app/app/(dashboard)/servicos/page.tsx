'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Wrench, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import OsFormDialog from '@/components/os-form-dialog';

interface Service {
  id: string; company_id: string; name: string; description: string | null;
  price: number; estimated_time: number | null; vehicle_type: string; active: boolean; category: string | null;
}

const TABLE = 'services';
const emptyForm = { name: '', price: '', hours: '', minutes: '', category: '', vehicle_type: 'ambos' };

function fmtTime(min?: number | null) {
  const t = Number(min ?? 0);
  if (!t) return '—';
  const h = Math.floor(t / 60), m = t % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export default function ServicosPage() {
  const { profile, isAdmin } = useProfile();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showNewOs, setShowNewOs] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Service>(TABLE, { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar serviços: ' + error);
    else setItems(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((s) =>
    [s.name, s.category].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
  );

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(s: Service) {
    setEditing(s);
    const t = Number(s.estimated_time ?? 0);
    setForm({ name: s.name ?? '', price: String(s.price ?? ''), hours: String(Math.floor(t / 60) || ''), minutes: String(t % 60 || ''), category: s.category ?? '', vehicle_type: s.vehicle_type ?? 'ambos' });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Nome é obrigatório'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);
    const totalMin = (Number(form.hours) || 0) * 60 + (Number(form.minutes) || 0);
    const payload = {
      name: form.name, price: Number(form.price) || 0,
      estimated_time: totalMin || null,
      category: form.category || null, vehicle_type: form.vehicle_type,
    };
    if (editing) {
      const { error } = await updateRow<Service>(TABLE, editing.id, payload);
      if (error) toast.error('Erro ao atualizar: ' + error);
      else { toast.success('Serviço atualizado'); setDialogOpen(false); await load(); }
    } else {
      const { error } = await insertRow<Service>(TABLE, { company_id: profile.company_id, active: true, ...payload });
      if (error) toast.error('Erro ao criar: ' + error);
      else { toast.success('Serviço criado'); setDialogOpen(false); await load(); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteRow(TABLE, deleteTarget.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('Serviço excluído'); setDeleteTarget(null); await load(); }
    setDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Serviços</h1>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> Novo Serviço
          </Button>
          <Button onClick={() => setShowNewOs(true)} variant="outline" className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10">
            <Plus className="w-4 h-4 mr-2" /> Nova OS
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Buscar serviço..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500"><p>Nenhum serviço encontrado.</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <Card key={service.id} className="bg-card border-border hover:border-blue-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-400" /> {service.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {service.category && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{service.category}</Badge>}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-400" onClick={() => openEdit(service)} aria-label="Editar"><Pencil className="w-4 h-4" /></Button>
                    {isAdmin && <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteTarget(service)} aria-label="Excluir"><Trash2 className="w-4 h-4" /></Button>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-emerald-400">R$ {Number(service.price ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{fmtTime(service.estimated_time)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">{editing ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Preço (R$)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Tempo estimado</Label>
                <div className="flex gap-2">
                  <Input type="number" min="0" placeholder="h" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
                  <Input type="number" min="0" max="59" placeholder="min" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Categoria</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Tipo</Label>
                <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v ?? '' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
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
          <DialogHeader><DialogTitle className="text-white">Excluir serviço</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">Excluir o serviço <span className="text-white font-medium">{deleteTarget?.name}</span>?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-300">Cancelar</Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-500 text-white">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OsFormDialog open={showNewOs} onOpenChange={setShowNewOs} onSaved={() => {}} />
    </div>
  );
}
