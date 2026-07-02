'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Clock, User, Car, Pencil, Trash2, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, insertRow, updateRow, deleteRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';

interface Schedule {
  id: string; company_id: string; client_id: string | null; vehicle_id: string | null;
  scheduled_date: string; scheduled_time: string | null; notes: string | null; status: string;
}
interface Opt { id: string; name?: string; plate?: string; brand?: string; model?: string }

const TABLE = 'schedules';
const statusColors: Record<string, string> = {
  scheduled: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  in_service: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};
const statusLabel: Record<string, string> = {
  scheduled: 'agendado', confirmed: 'confirmado', in_service: 'em atendimento', completed: 'concluído', cancelled: 'cancelado',
};
type SchedForm = { client_id: string; vehicle_id: string; scheduled_date: string; scheduled_time: string; notes: string; status: string };
const emptyForm: SchedForm = { client_id: '', vehicle_id: '', scheduled_date: '', scheduled_time: '', notes: '', status: 'scheduled' };

export default function AgendamentoPage() {
  const { profile, isAdmin } = useProfile();
  const [items, setItems] = useState<Schedule[]>([]);
  const [clients, setClients] = useState<Opt[]>([]);
  const [vehicles, setVehicles] = useState<Opt[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, c, v] = await Promise.all([
      listRows<Schedule>(TABLE, { orderBy: 'scheduled_date', ascending: true }),
      listRows<Opt>('clients', { orderBy: 'name', ascending: true }),
      listRows<Opt>('vehicles', { orderBy: 'plate', ascending: true }),
    ]);
    if (s.error) toast.error('Erro ao carregar agendamentos: ' + s.error);
    else setItems(s.data ?? []);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? '—';
  const vehiclePlate = (id: string | null) => vehicles.find((v) => v.id === id)?.plate ?? '';

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(s: Schedule) {
    setEditing(s);
    setForm({ client_id: s.client_id ?? '', vehicle_id: s.vehicle_id ?? '', scheduled_date: s.scheduled_date ?? '', scheduled_time: s.scheduled_time ?? '', notes: s.notes ?? '', status: s.status });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.scheduled_date) { toast.error('Data é obrigatória'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);
    const payload = {
      client_id: form.client_id || null, vehicle_id: form.vehicle_id || null,
      scheduled_date: form.scheduled_date, scheduled_time: form.scheduled_time || null,
      notes: form.notes || null, status: form.status,
    };
    if (editing) {
      const { error } = await updateRow<Schedule>(TABLE, editing.id, payload);
      if (error) toast.error('Erro ao atualizar: ' + error);
      else { toast.success('Agendamento atualizado'); setDialogOpen(false); await load(); }
    } else {
      const { error } = await insertRow<Schedule>(TABLE, { company_id: profile.company_id, ...payload });
      if (error) toast.error('Erro ao criar: ' + error);
      else { toast.success('Agendamento criado'); setDialogOpen(false); await load(); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteRow(TABLE, deleteTarget.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('Agendamento excluído'); setDeleteTarget(null); await load(); }
    setDeleting(false);
  }

  async function generateOS(s: Schedule) {
    if (!profile?.company_id) { toast.error('Empresa não identificada.'); return; }
    if (!s.client_id || !s.vehicle_id) { toast.error('Agendamento precisa de cliente e veículo'); return; }
    const { data: orders } = await listRows<{ number: number }>('orders', { orderBy: 'number' });
    const nextNumber = (orders ?? []).reduce((m, o) => Math.max(m, o.number ?? 0), 1000) + 1;
    const { error } = await insertRow('orders', {
      company_id: profile.company_id, number: nextNumber, client_id: s.client_id, vehicle_id: s.vehicle_id,
      kanban_status: 'aguardando', status: 'aberta', payment_status: 'pending', total: 0,
    });
    if (error) { toast.error('Erro ao gerar OS: ' + error); return; }
    await updateRow(TABLE, s.id, { status: 'in_service' });
    toast.success(`OS #${nextNumber} gerada a partir do agendamento`);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Agendamento</h1>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-500"><p>Nenhum agendamento.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((apt) => (
            <Card key={apt.id} className="bg-card border-border hover:border-blue-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {new Date(apt.scheduled_date + 'T00:00:00').toLocaleDateString('pt-BR')} {apt.scheduled_time ? '· ' + apt.scheduled_time.slice(0, 5) : ''}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <User className="w-3 h-3" /> {clientName(apt.client_id)}
                        {vehiclePlate(apt.vehicle_id) && (<><Car className="w-3 h-3 ml-1" /> {vehiclePlate(apt.vehicle_id)}</>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className={statusColors[apt.status] ?? 'bg-slate-700 text-slate-300'}>{statusLabel[apt.status] ?? apt.status}</Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-emerald-400" onClick={() => generateOS(apt)} aria-label="Gerar OS" title="Gerar OS"><FileText className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-400" onClick={() => openEdit(apt)} aria-label="Editar"><Pencil className="w-4 h-4" /></Button>
                    {isAdmin && <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteTarget(apt)} aria-label="Excluir"><Trash2 className="w-4 h-4" /></Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">{editing ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Data *</Label>
                <Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Hora</Label>
                <Input type="time" value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Cliente</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v ?? '' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue placeholder="Selecione">{clients.find(c => c.id === form.client_id)?.name}</SelectValue></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Veículo</Label>
              <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v ?? '' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione">
                    {(() => {
                      const v = vehicles.find(v => v.id === form.vehicle_id);
                      return v ? [v.brand, v.model, v.plate].filter(Boolean).join(' ') : null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>{vehicles.map((v) => <SelectItem key={v.id} value={v.id}>{[v.brand, v.model, v.plate].filter(Boolean).join(' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? '' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_service">Em atendimento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Observações</Label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
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
          <DialogHeader><DialogTitle className="text-white">Excluir agendamento</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">Excluir este agendamento?</p>
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
