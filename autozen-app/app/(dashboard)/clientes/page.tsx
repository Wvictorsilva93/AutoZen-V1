'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Phone, Mail, MessageSquare, Pencil, Trash2 } from 'lucide-react';
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
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

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

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });
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
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Clientes"
        subtitle={`${filtered.length} cliente${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, telefone ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input/50 border-border text-foreground"
        />
      </div>

      {loading ? (
        <LoadingState text="Carregando clientes..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description={search ? 'Tente outro termo de busca.' : 'Clique em "Novo Cliente" para começar.'}
          action={!search ? (
            <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Novo Cliente
            </Button>
          ) : undefined}
        />
      ) : (
        <div className="grid gap-4">
          {pageItems.map((cliente) => (
            <Card key={cliente.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-foreground">{cliente.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {cliente.is_recurrent && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        recorrente
                      </Badge>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(cliente)} aria-label="Editar">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(cliente)} aria-label="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {cliente.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {cliente.phone}</span>
                  )}
                  {cliente.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {cliente.email}</span>
                  )}
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {cliente.total_visits ?? 0} visitas</span>
                </div>
                {cliente.notes && <p className="text-xs text-muted-foreground/60 mt-2">{cliente.notes}</p>}
              </CardContent>
            </Card>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-muted-foreground">Anterior</Button>
              <span className="text-xs text-muted-foreground">Página {page} de {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="text-muted-foreground">Próxima</Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-input/50 border-border text-foreground" required />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Telefone / WhatsApp</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                className="bg-input/50 border-border text-foreground" placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-input/50 border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Observações</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="bg-input/50 border-border text-foreground" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {saving ? <span className="animate-spin">⏳</span> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Excluir cliente"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
