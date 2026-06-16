'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, insertRow, deleteRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';
import { exportCSV } from '@/lib/export';

interface Tx {
  id: string; company_id: string; type: 'income' | 'expense'; description: string;
  amount: number; payment_method: string | null; transaction_date: string | null; created_at?: string;
}

const TABLE = 'financial_transactions';
const methodLabel: Record<string, string> = { pix: 'PIX', cash: 'Dinheiro', credit: 'Crédito', debit: 'Débito', other: 'Outro' };
const emptyForm = { type: 'income', description: '', amount: '', payment_method: 'pix' };

export default function FinanceiroPage() {
  const { profile, isAdmin } = useProfile();
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tx | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Tx>(TABLE, { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar financeiro: ' + error);
    else setItems(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const entradas = items.filter((t) => t.type === 'income').reduce((a, t) => a + Number(t.amount || 0), 0);
  const saidas = items.filter((t) => t.type === 'expense').reduce((a, t) => a + Number(t.amount || 0), 0);
  const saldo = entradas - saidas;

  function openCreate() { setForm(emptyForm); setDialogOpen(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) { toast.error('Descrição é obrigatória'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);
    const { error } = await insertRow<Tx>(TABLE, {
      company_id: profile.company_id, type: form.type, description: form.description,
      amount: Number(form.amount) || 0, payment_method: form.payment_method,
    });
    if (error) toast.error('Erro ao lançar: ' + error);
    else { toast.success('Lançamento registrado'); setDialogOpen(false); await load(); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteRow(TABLE, deleteTarget.id);
    if (error) toast.error('Erro ao excluir: ' + error);
    else { toast.success('Lançamento excluído'); setDeleteTarget(null); await load(); }
    setDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => {
            const rows = items.map((t) => ({ tipo: t.type === 'income' ? 'entrada' : 'saída', descricao: t.description, valor: Number(t.amount || 0).toFixed(2), metodo: t.payment_method ?? '', data: t.created_at ? new Date(t.created_at).toLocaleString('pt-BR') : '' }));
            if (rows.length) exportCSV('autozen-financeiro', rows); else toast.error('Nada para exportar');
          }} className="text-emerald-400 hover:bg-emerald-500/10">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> Novo Lançamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Entradas</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-emerald-400">R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Saídas</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-400">R$ {saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Saldo</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent><p className={`text-2xl font-bold ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-sm text-white">Movimentações</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : items.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">Nenhum lançamento.</p>
          ) : items.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {tx.type === 'income' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                </div>
                <div>
                  <p className="text-sm text-white">{tx.description}</p>
                  <span className="text-xs text-slate-500">{methodLabel[tx.payment_method ?? 'other'] ?? tx.payment_method}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}R$ {Number(tx.amount ?? 0).toFixed(2)}
                </p>
                {isAdmin && <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={() => setDeleteTarget(tx)} aria-label="Excluir"><Trash2 className="w-4 h-4" /></Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">Novo Lançamento</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v ?? '' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Valor (R$)</Label>
                <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Descrição *</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" required />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Forma de pagamento</Label>
              <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v ?? '' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="credit">Crédito</SelectItem>
                  <SelectItem value="debit">Débito</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
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
          <DialogHeader><DialogTitle className="text-white">Excluir lançamento</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">Excluir <span className="text-white font-medium">{deleteTarget?.description}</span>?</p>
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
