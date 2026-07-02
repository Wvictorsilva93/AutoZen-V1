'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Download, CalendarDays } from 'lucide-react';
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
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface Tx {
  id: string; company_id: string; type: 'income' | 'expense'; description: string;
  amount: number; payment_method: string | null; transaction_date: string | null; created_at?: string;
}

const TABLE = 'financial_transactions';
const methodLabel: Record<string, string> = { pix: 'PIX', cash: 'Dinheiro', credit: 'Crédito', debit: 'Débito', other: 'Outro' };
const emptyForm = { type: 'income', description: '', amount: '', payment_method: 'pix' };

type PeriodKey = '30d' | 'mes' | 'tudo';
const periodLabels: Record<PeriodKey, string> = { '30d': 'Últimos 30 dias', 'mes': 'Mês atual', 'tudo': 'Tudo' };

function isThisMonth(iso?: string | null) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
}

function isLast30Days(iso?: string | null) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return d >= cutoff && d <= now;
}

export default function FinanceiroPage() {
  const { profile, isAdmin } = useProfile();
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodKey>('30d');
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

  const filtered = useMemo(() => {
    if (period === 'tudo') return items;
    return items.filter((t) => {
      const date = t.transaction_date ?? t.created_at;
      return period === 'mes' ? isThisMonth(date) : isLast30Days(date);
    });
  }, [items, period]);

  const entradas = filtered.filter((t) => t.type === 'income').reduce((a, t) => a + Number(t.amount || 0), 0);
  const saidas = filtered.filter((t) => t.type === 'expense').reduce((a, t) => a + Number(t.amount || 0), 0);
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
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        title="Financeiro"
        subtitle={`${filtered.length} lançamento${filtered.length !== 1 ? 's' : ''} no período`}
        action={
          <>
            <Button variant="ghost" onClick={() => {
              const rows = filtered.map((t) => ({ tipo: t.type === 'income' ? 'entrada' : 'saída', descricao: t.description, valor: Number(t.amount || 0).toFixed(2), metodo: t.payment_method ?? '', data: t.created_at ? new Date(t.created_at).toLocaleString('pt-BR') : '' }));
              if (rows.length) exportCSV('autozen-financeiro', rows); else toast.error('Nada para exportar');
            }} className="text-emerald-400 hover:bg-emerald-500/10">
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Novo Lançamento
            </Button>
          </>
        }
      />

      {/* Period Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
        {(['30d', 'mes', 'tudo'] as PeriodKey[]).map((p) => (
          <Button
            key={p}
            variant={period === p ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPeriod(p)}
            className={period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
          >
            {periodLabels[p]}
          </Button>
        ))}
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
        <CardHeader><CardTitle className="text-sm text-foreground">Movimentações</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <LoadingState text="Carregando..." />
          ) : filtered.length === 0 ? (
            <EmptyState title="Nenhum lançamento neste período." />
          ) : filtered.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {tx.type === 'income' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                </div>
                <div>
                  <p className="text-sm text-foreground">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <span>{methodLabel[tx.payment_method ?? 'other'] ?? tx.payment_method}</span>
                    {tx.transaction_date && (
                      <>
                        <span>·</span>
                        <span>{new Date(tx.transaction_date).toLocaleDateString('pt-BR')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}R$ {Number(tx.amount ?? 0).toFixed(2)}
                </p>
                {isAdmin && <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteTarget(tx)} aria-label="Excluir"><Trash2 className="w-4 h-4" /></Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Novo Lançamento</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v ?? '' })}>
                  <SelectTrigger className="bg-input/50 border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Valor (R$)</Label>
                <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-input/50 border-border text-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Descrição *</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-input/50 border-border text-foreground" required />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Forma de pagamento</Label>
              <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v ?? '' })}>
                <SelectTrigger className="bg-input/50 border-border text-foreground"><SelectValue /></SelectTrigger>
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
        title="Excluir lançamento"
        description={`Excluir "${deleteTarget?.description}"?`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
