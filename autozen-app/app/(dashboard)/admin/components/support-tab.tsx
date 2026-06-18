'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  MessageSquare, Loader2, Search, Clock, CheckCircle, ArrowUpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { listRows, insertRow, updateRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';

interface Ticket {
  id: string; company_id: string; user_id: string;
  subject: string; message: string; status: string; priority: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const priorityColors: Record<string, string> = {
  low: 'bg-slate-500/10 text-slate-400',
  medium: 'bg-blue-500/10 text-blue-400',
  high: 'bg-orange-500/10 text-orange-400',
  urgent: 'bg-red-500/10 text-red-400',
};

export function SupportTab() {
  const { profile } = useProfile();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null);
  const [form, setForm] = useState({ subject: '', message: '', priority: 'medium' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Ticket>('support_tickets', { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar tickets: ' + error);
    else setTickets(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = tickets.filter((t) => {
    const m = t.subject?.toLowerCase().includes(search.toLowerCase());
    if (!m) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await insertRow('support_tickets', {
      subject: form.subject, message: form.message,
      priority: form.priority, status: 'open',
    });
    if (error) toast.error('Erro ao criar ticket: ' + error);
    else { toast.success('Ticket criado'); setCreating(false); setForm({ subject: '', message: '', priority: 'medium' }); await load(); }
    setSaving(false);
  }

  async function updateStatus(ticket: Ticket, status: string) {
    const { error } = await updateRow('support_tickets', ticket.id, { status });
    if (error) toast.error('Erro: ' + error);
    else { toast.success(`Status: ${status}`); setViewTicket(null); await load(); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{tickets.length} tickets</p>
        <Button onClick={() => setCreating(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
          <MessageSquare className="w-4 h-4 mr-1" /> Novo Ticket
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Buscar ticket..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-36 bg-slate-800/50 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="open">Aberto</SelectItem>
            <SelectItem value="in_progress">Em andamento</SelectItem>
            <SelectItem value="resolved">Resolvido</SelectItem>
            <SelectItem value="closed">Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-sm text-white">Tickets de Suporte</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">Nenhum ticket.</p>
          ) : filtered.map((t) => (
            <button key={t.id} onClick={() => setViewTicket(t)}
              className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.subject}</p>
                  <p className="text-xs text-slate-500 truncate">{t.message.slice(0, 80)}{t.message.length > 80 ? '...' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="secondary" className={priorityColors[t.priority] ?? ''}>{t.priority}</Badge>
                <Badge variant="secondary" className={statusColors[t.status] ?? ''}>{t.status}</Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={(o) => { if (!o) setCreating(false); }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Novo Ticket</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Assunto *</label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="bg-slate-800/50 border-slate-700 text-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Mensagem *</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full min-h-[120px] rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm p-3 resize-y" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Prioridade</label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v ?? 'medium' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setCreating(false)} className="text-slate-300">Cancelar</Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewTicket} onOpenChange={(o) => { if (!o) setViewTicket(null); }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{viewTicket?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={priorityColors[viewTicket?.priority ?? 'medium'] ?? ''}>
                {viewTicket?.priority}
              </Badge>
              <Badge variant="secondary" className={statusColors[viewTicket?.status ?? 'open'] ?? ''}>
                {viewTicket?.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{viewTicket?.message}</p>
            <p className="text-xs text-slate-500">
              {viewTicket?.created_at ? new Date(viewTicket.created_at).toLocaleString('pt-BR') : ''}
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            {viewTicket?.status === 'open' && (
              <Button onClick={() => updateStatus(viewTicket, 'in_progress')} className="bg-amber-600 hover:bg-amber-500 text-white">
                <ArrowUpCircle className="w-4 h-4 mr-1" /> Iniciar
              </Button>
            )}
            {viewTicket?.status === 'in_progress' && (
              <Button onClick={() => updateStatus(viewTicket, 'resolved')} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <CheckCircle className="w-4 h-4 mr-1" /> Resolver
              </Button>
            )}
            {viewTicket && viewTicket.status !== 'closed' && (
              <Button variant="ghost" onClick={() => updateStatus(viewTicket, 'closed')} className="text-slate-400">
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
