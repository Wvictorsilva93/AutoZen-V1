'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ClipboardList, Loader2, Search, Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows } from '@/lib/db';

interface AuditLog {
  id: string; company_id: string | null; user_id: string | null;
  action: string; entity: string; entity_id: string | null;
  details: Record<string, unknown>; created_at: string;
}

const actionColors: Record<string, string> = {
  create: 'bg-emerald-500/10 text-emerald-400',
  update: 'bg-blue-500/10 text-blue-400',
  delete: 'bg-red-500/10 text-red-400',
  block: 'bg-amber-500/10 text-amber-400',
  unblock: 'bg-emerald-500/10 text-emerald-400',
  login: 'bg-violet-500/10 text-violet-400',
};

export function AuditTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<AuditLog>('audit_logs', { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar logs: ' + error);
    else setLogs(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const actions = [...new Set(logs.map((l) => l.action))];

  const filtered = logs.filter((l) => {
    const m = l.action?.toLowerCase().includes(search.toLowerCase()) || l.entity?.toLowerCase().includes(search.toLowerCase());
    if (!m) return false;
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Buscar no log..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
        </div>
        <Select value={actionFilter} onValueChange={(v) => setActionFilter(v ?? 'all')}>
          <SelectTrigger className="w-36 bg-slate-800/50 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas ações</SelectItem>
            {actions.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5" /> {filtered.length} registros
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-sm text-white">Registro de Auditoria</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">Nenhum registro.</p>
          ) : filtered.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30 text-sm">
              <Badge variant="secondary" className={`${actionColors[log.action] ?? 'bg-slate-500/10 text-slate-400'} shrink-0`}>
                {log.action}
              </Badge>
              <span className="text-slate-300 min-w-0 truncate">{log.entity}</span>
              {log.entity_id && <span className="text-xs text-slate-600 font-mono truncate">{log.entity_id.slice(0, 8)}...</span>}
              <span className="text-xs text-slate-600 ml-auto shrink-0">
                {new Date(log.created_at).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
