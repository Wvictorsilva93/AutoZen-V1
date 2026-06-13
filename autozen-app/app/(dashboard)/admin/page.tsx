'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import {
  Shield, Building2, DollarSign, TrendingUp, Clock, Loader2, Ban, CheckCircle, Pencil, Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, updateRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';

interface Company {
  id: string; name: string; responsible_name: string | null; cnpj: string | null; phone: string | null;
  plan: string | null; status: string | null; active: boolean; blocked: boolean;
  trial_end: string | null; subscription_end: string | null; created_at: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  trial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  expired: 'bg-red-500/10 text-red-400 border-red-500/20',
  blocked: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

type Form = {
  name: string; responsible_name: string; cnpj: string; phone: string;
  plan: string; status: string; trial_end: string; subscription_end: string;
};

export default function AdminPage() {
  const { isSuperAdmin, loading: profileLoading } = useProfile();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<Form>({ name: '', responsible_name: '', cnpj: '', phone: '', plan: 'basic', status: 'active', trial_end: '', subscription_end: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Company>('companies', { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar empresas: ' + error);
    else setCompanies(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = companies.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));

  function openEdit(c: Company) {
    setEditing(c);
    setForm({
      name: c.name ?? '', responsible_name: c.responsible_name ?? '', cnpj: c.cnpj ?? '', phone: c.phone ?? '',
      plan: c.plan ?? 'basic', status: c.status ?? 'active',
      trial_end: c.trial_end ? c.trial_end.slice(0, 10) : '',
      subscription_end: c.subscription_end ? c.subscription_end.slice(0, 10) : '',
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const { error } = await updateRow('companies', editing.id, {
      name: form.name, responsible_name: form.responsible_name || null, cnpj: form.cnpj || null,
      phone: form.phone || null, plan: form.plan, status: form.status,
      trial_end: form.trial_end || null, subscription_end: form.subscription_end || null,
    });
    if (error) toast.error('Erro ao salvar: ' + error);
    else { toast.success('Empresa atualizada'); setEditing(null); await load(); }
    setSaving(false);
  }

  async function toggleBlock(c: Company) {
    const { error } = await updateRow('companies', c.id, { blocked: !c.blocked });
    if (error) toast.error('Erro: ' + error);
    else { toast.success(c.blocked ? 'Empresa desbloqueada' : 'Empresa bloqueada'); await load(); }
  }

  async function setStatus(c: Company, status: string) {
    const { error } = await updateRow('companies', c.id, { status });
    if (error) toast.error('Erro: ' + error);
    else { toast.success(`Status: ${status}`); await load(); }
  }

  if (!profileLoading && !isSuperAdmin) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-white font-medium">Acesso restrito</p>
        <p className="text-sm">Esta área é exclusiva do super administrador do sistema.</p>
      </div>
    );
  }

  const total = companies.length;
  const ativas = companies.filter((c) => c.status === 'active' && !c.blocked).length;
  const trial = companies.filter((c) => c.status === 'trial').length;
  const bloqueadas = companies.filter((c) => c.blocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
          <p className="text-sm text-slate-400">Gestão completa das empresas do SaaS</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: 'Empresas', v: total, i: Building2, c: 'text-blue-400' },
          { t: 'Ativas', v: ativas, i: TrendingUp, c: 'text-emerald-400' },
          { t: 'Trial', v: trial, i: Clock, c: 'text-blue-400' },
          { t: 'Bloqueadas', v: bloqueadas, i: Ban, c: 'text-amber-400' },
        ].map((s) => (
          <Card key={s.t} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.t}</CardTitle>
              <s.i className={`w-4 h-4 ${s.c}`} />
            </CardHeader>
            <CardContent><p className="text-2xl font-bold text-white">{s.v}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input placeholder="Buscar empresa..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-sm text-white">Empresas Cadastradas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">Nenhuma empresa.</p>
          ) : filtered.map((company) => (
            <div key={company.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center"><Building2 className="w-4 h-4 text-blue-400" /></div>
                <div>
                  <p className="text-sm font-medium text-white">{company.name}</p>
                  <p className="text-xs text-slate-500">{company.responsible_name ?? '—'} · {company.phone ?? 'sem telefone'} · plano {company.plan ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={statusColors[company.blocked ? 'blocked' : (company.status ?? 'active')] ?? 'bg-slate-700 text-slate-300'}>
                  {company.blocked ? 'bloqueada' : (company.status ?? 'ativa')}
                </Badge>
                <Select value={company.status ?? 'active'} onValueChange={(v) => setStatus(company, v ?? 'active')}>
                  <SelectTrigger className="h-8 w-32 bg-slate-800/50 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                    <SelectItem value="blocked">Bloqueada</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="ghost" onClick={() => openEdit(company)} className="text-blue-400 hover:bg-blue-500/10">
                  <Pencil className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleBlock(company)}
                  className={company.blocked ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-red-400 hover:bg-red-500/10'}>
                  {company.blocked ? <><CheckCircle className="w-4 h-4 mr-1" /> Desbloquear</> : <><Ban className="w-4 h-4 mr-1" /> Bloquear</>}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Editar Empresa</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Responsável</Label>
                <Input value={form.responsible_name} onChange={(e) => setForm({ ...form, responsible_name: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Telefone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">CNPJ</Label>
                <Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Plano</Label>
                <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v ?? 'basic' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? 'active' })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                    <SelectItem value="blocked">Bloqueada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Fim do Trial</Label>
                <Input type="date" value={form.trial_end} onChange={(e) => setForm({ ...form, trial_end: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Fim da Assinatura</Label>
              <Input type="date" value={form.subscription_end} onChange={(e) => setForm({ ...form, subscription_end: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)} className="text-slate-300">Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
