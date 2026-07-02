'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Package, AlertTriangle, Pencil, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { listRows, insertRow, updateRow, deleteRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Product {
  id: string; company_id: string; name: string; category: string | null;
  quantity: number; min_quantity: number; unit: string; unit_price: number;
}

const TABLE = 'inventory_products';
const emptyForm = { name: '', category: '', quantity: '', min_quantity: '', unit: 'un', unit_price: '' };

export default function EstoquePage() {
  const { profile, isAdmin } = useProfile();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Product>(TABLE, { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar estoque: ' + error);
    else setItems(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));
  const totalValue = filtered.reduce((a, p) => a + (Number(p.quantity) || 0) * (Number(p.unit_price) || 0), 0);
  const lowStockCount = filtered.filter((p) => p.quantity <= p.min_quantity).length;

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({ name: p.name ?? '', category: p.category ?? '', quantity: String(p.quantity ?? ''), min_quantity: String(p.min_quantity ?? ''), unit: p.unit ?? 'un', unit_price: String(p.unit_price ?? '') });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Nome é obrigatório'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);
    const payload = {
      name: form.name, category: form.category || null,
      quantity: Number(form.quantity) || 0, min_quantity: Number(form.min_quantity) || 0,
      unit: form.unit || 'un', unit_price: Number(form.unit_price) || 0,
    };
    if (editing) {
      const { error } = await updateRow<Product>(TABLE, editing.id, payload);
      if (error) toast.error('Erro ao atualizar: ' + error);
      else { toast.success('Produto atualizado'); setDialogOpen(false); await load(); }
    } else {
      const { error } = await insertRow<Product>(TABLE, { company_id: profile.company_id, ...payload });
      if (error) toast.error('Erro ao criar: ' + error);
      else { toast.success('Produto criado'); setDialogOpen(false); await load(); }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteRow(TABLE, deleteTarget.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('Produto excluído'); setDeleteTarget(null); await load(); }
    setDeleting(false);
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Estoque"
        subtitle={`${filtered.length} produto${filtered.length !== 1 ? 's' : ''} cadastrado${filtered.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Novo Produto
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Valor Total em Estoque</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-400">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Produtos Cadastrados</CardTitle>
            <Package className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Estoque Baixo</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input/50 border-border text-foreground" />
      </div>

      {loading ? (
        <LoadingState text="Carregando estoque..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhum produto no estoque"
          description={search ? 'Tente outro termo de busca.' : 'Clique em "Novo Produto" para cadastrar.'}
          action={!search ? (
            <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Novo Produto
            </Button>
          ) : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const lowStock = item.quantity <= item.min_quantity;
            return (
              <Card key={item.id} className={`bg-card border-border hover:border-primary/30 transition-colors ${lowStock ? 'border-amber-500/30' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" /> {item.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {lowStock && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(item)} aria-label="Editar"><Pencil className="w-4 h-4" /></Button>
                      {isAdmin && <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteTarget(item)} aria-label="Excluir"><Trash2 className="w-4 h-4" /></Button>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xl font-bold ${lowStock ? 'text-amber-400' : 'text-foreground'}`}>{item.quantity} {item.unit}</p>
                      <p className="text-xs text-muted-foreground">Mín: {item.min_quantity} {item.unit}</p>
                    </div>
                    {item.category && <Badge variant="secondary" className="bg-muted text-muted-foreground">{item.category}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Custo: R$ {Number(item.unit_price ?? 0).toFixed(2)}/{item.unit}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">{editing ? 'Editar Produto' : 'Novo Produto'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-input/50 border-border text-foreground" required />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Qtd</Label>
                <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="bg-input/50 border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Mínimo</Label>
                <Input type="number" value={form.min_quantity} onChange={(e) => setForm({ ...form, min_quantity: e.target.value })} className="bg-input/50 border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Unid.</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="bg-input/50 border-border text-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Categoria</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-input/50 border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Custo unit. (R$)</Label>
                <Input type="number" step="0.01" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} className="bg-input/50 border-border text-foreground" />
              </div>
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
        title="Excluir produto"
        description={`Excluir "${deleteTarget?.name}" do estoque?`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
