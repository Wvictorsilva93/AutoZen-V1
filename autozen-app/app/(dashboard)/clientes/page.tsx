'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Phone, Mail, MessageSquare, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { listRows, insertRow, updateRow, deleteRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';
import { maskPhone } from '@/lib/masks';

interface Client {
  id: string;
  company_id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  total_visits: number;
  is_recurrent: boolean;
  last_visit: string | null;
}

const TABLE = 'clients';
const emptyForm = { name: '', phone: '', email: '', notes: '' };

export default function ClientesPage() {
  const { profile, isAdmin } = useProfile();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Client>(TABLE, { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar clientes: ' + error);
    else setClients(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const filtered = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setForm({ name: c.name ?? '', phone: c.phone ?? '', email: c.email ?? '', notes: c.notes ?? '' });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Nome é obrigatório'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);

    if (editing) {
      const { error } = await updateRow<Client>(TABLE, editing.id, {
        name: form.name, phone: form.phone, email: form.email || null, notes: form.notes || null,
      });
      if (error) toast.error('Erro ao atualizar: ' + error);
      else { toast.success('Cliente atualizado'); setDialogOpen(false); await load(); }
    } else {
      const { error } = await insertRow<Client>(TABLE, {
        company_id: profile.company_id,
        name: form.name, phone: form.phone, email: form.email || null, notes: form.notes || null,
      });
      if (error) toast.error('Erro ao criar: ' + error);
      else { toast.success('Cliente criado'); setDialogOpen(false); await load(); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteRow(TABLE, deleteTarget.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('Cliente excluído'); setDeleteTarget(null); await load(); }
    setDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Clientes</h1>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p>Nenhum cliente encontrado.</p>
          <p className="text-xs text-slate-600 mt-1">Clique em &quot;Novo Cliente&quot; para começar.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pageItems.map((cliente) => (
            <Card key={cliente.id} className="bg-card border-border hover:border-blue-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white">{cliente.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {cliente.is_recurrent && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        recorrente
                      </Badge>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-400"
                      onClick={() => openEdit(cliente)} aria-label="Editar">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-400"
                        onClick={() => setDeleteTarget(cliente)} aria-label="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  {cliente.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {cliente.phone}</span>
                  )}
                  {cliente.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {cliente.email}</span>
                  )}
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {cliente.total_visits ?? 0} visitas</span>
                </div>
                {cliente.notes && <p className="text-xs text-slate-500 mt-2">{cliente.notes}</p>}
              </CardContent>
            </Card>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-slate-300">Anterior</Button>
              <span className="text-xs text-slate-400">Página {page} de {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="text-slate-300">Próxima</Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white" required />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Telefone / WhatsApp</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Observações</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmar exclusão */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-white">Excluir cliente</DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 text-sm">
            Tem certeza que deseja excluir <span className="text-white font-medium">{deleteTarget?.name}</span>? Esta ação não pode ser desfeita.
          </p>
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
