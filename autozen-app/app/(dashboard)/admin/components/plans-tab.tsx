'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Package, Plus, Loader2, Pencil, Trash2, Check, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { listRows, insertRow, updateRow, deleteRow } from '@/lib/db';

interface Plan {
  id: string; name: string; slug: string; description: string | null;
  price: number; features: string[]; active: boolean; created_at: string;
}

export function PlansTab() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', features: '', active: true });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Plan>('plans', { orderBy: 'created_at', ascending: true });
    if (error) toast.error('Erro ao carregar planos: ' + error);
    else setPlans(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({ name: '', slug: '', description: '', price: '', features: '', active: true });
  }

  function openCreate() {
    resetForm();
    setCreating(true);
    setEditing(null);
  }

  function openEdit(p: Plan) {
    setForm({
      name: p.name, slug: p.slug, description: p.description ?? '',
      price: String(p.price), features: Array.isArray(p.features) ? p.features.join('\n') : '',
      active: p.active,
    });
    setEditing(p);
    setCreating(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name, slug: form.slug, description: form.description || null,
      price: parseFloat(form.price) || 0,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      active: form.active,
    };

    if (creating) {
      const { error } = await insertRow('plans', payload);
      if (error) toast.error('Erro ao criar: ' + error);
      else { toast.success('Plano criado'); setCreating(false); await load(); }
    } else if (editing) {
      const { error } = await updateRow('plans', editing.id, payload);
      if (error) toast.error('Erro ao salvar: ' + error);
      else { toast.success('Plano atualizado'); setEditing(null); await load(); }
    }
    setSaving(false);
  }

  async function toggleActive(plan: Plan) {
    const { error } = await updateRow('plans', plan.id, { active: !plan.active });
    if (error) toast.error('Erro: ' + error);
    else { toast.success(plan.active ? 'Plano desativado' : 'Plano ativado'); await load(); }
  }

  async function handleDelete(plan: Plan) {
    const { error } = await deleteRow('plans', plan.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('Plano excluído'); await load(); }
  }

  const open = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{plans.length} planos cadastrados</p>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-1" /> Novo Plano
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : plans.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center text-slate-500">Nenhum plano cadastrado.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={`bg-card border-border ${!plan.active ? 'opacity-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <CardTitle className="text-sm text-white">{plan.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className={plan.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}>
                    {plan.active ? 'ativo' : 'inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-2xl font-bold text-white">R$ {Number(plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span className="text-sm text-slate-500 ml-1">/mês</span>
                </div>
                {plan.description && <p className="text-xs text-slate-500">{plan.description}</p>}
                <div className="space-y-1">
                  {Array.isArray(plan.features) && plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(plan)} className="text-blue-400 hover:bg-blue-500/10">
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(plan)} className="text-amber-400 hover:bg-amber-500/10">
                    {plan.active ? <X className="w-3.5 h-3.5 mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                    {plan.active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(plan)} className="text-red-400 hover:bg-red-500/10 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { if (!o) { setCreating(false); setEditing(null); } }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{creating ? 'Novo Plano' : 'Editar Plano'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Nome *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="bg-slate-800/50 border-slate-700 text-white" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Descrição</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Preço (R$) *</Label>
              <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" required />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Funcionalidades (uma por linha)</Label>
              <textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                className="w-full min-h-[100px] rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm p-3 resize-y"
                placeholder="Até 200 OS/mês&#10;2 funcionários&#10;Suporte por email"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => { setCreating(false); setEditing(null); }} className="text-slate-300">Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (creating ? 'Criar' : 'Salvar')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
