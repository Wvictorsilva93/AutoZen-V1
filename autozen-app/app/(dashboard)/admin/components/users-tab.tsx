'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Users, Shield, UserCog, Loader2, Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows } from '@/lib/db';

interface Profile {
  user_id: string; company_id: string | null; name: string; role: string; email: string | null;
}

const roleColors: Record<string, string> = {
  super_admin: 'bg-red-500/10 text-red-400 border-red-500/20',
  admin_empresa: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  funcionario: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin_empresa: 'Admin Empresa',
  funcionario: 'Funcionário',
};

export function UsersTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<Profile>('profiles', { orderBy: 'created_at' });
    if (error) toast.error('Erro ao carregar usuários: ' + error);
    else setProfiles(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = profiles.filter((p) => {
    const m = p.name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase());
    if (!m) return false;
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    return true;
  });

  const total = profiles.length;
  const superAdmins = profiles.filter((p) => p.role === 'super_admin').length;
  const admins = profiles.filter((p) => p.role === 'admin_empresa').length;
  const funcionarios = profiles.filter((p) => p.role === 'funcionario').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: 'Total', v: total, i: Users, c: 'text-blue-400' },
          { t: 'Super Admins', v: superAdmins, i: Shield, c: 'text-red-400' },
          { t: 'Admin Empresa', v: admins, i: UserCog, c: 'text-blue-400' },
          { t: 'Funcionários', v: funcionarios, i: Users, c: 'text-slate-400' },
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

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Buscar usuário..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? 'all')}>
          <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin_empresa">Admin Empresa</SelectItem>
            <SelectItem value="funcionario">Funcionário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-sm text-white">Usuários do Sistema ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">Nenhum usuário.</p>
          ) : filtered.map((p) => (
            <div key={p.user_id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-400">{p.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.email ?? 'sem email'}</p>
                </div>
              </div>
              <Badge variant="secondary" className={roleColors[p.role] ?? ''}>
                {roleLabels[p.role] ?? p.role}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
