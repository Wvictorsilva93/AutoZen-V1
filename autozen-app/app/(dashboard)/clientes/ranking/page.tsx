'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import {
  Trophy, Medal, Award, Crown, Star, Loader2, Search, ArrowUp,
  Phone, MessageSquare, Sparkles, Gem
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { listRows } from '@/lib/db';
import { maskPhone } from '@/lib/masks';

interface Client {
  id: string; name: string; phone: string; total_visits: number;
  is_recurrent: boolean; last_visit: string | null;
}

interface Order {
  id: string; client_id: string; total: number; created_at: string;
}

interface ClientRank extends Client {
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
  tier: 'gold' | 'silver' | 'bronze';
  rank: number;
}

function getTier(visits: number): { tier: 'gold' | 'silver' | 'bronze'; label: string; icon: any; color: string; bg: string } {
  if (visits >= 10) return { tier: 'gold', label: 'Ouro', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
  if (visits >= 5) return { tier: 'silver', label: 'Prata', icon: Medal, color: 'text-gray-300', bg: 'bg-gray-400/10' };
  return { tier: 'bronze', label: 'Bronze', icon: Award, color: 'text-amber-600', bg: 'bg-amber-600/10' };
}

export default function RankingPage() {
  const [clients, setClients] = useState<ClientRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data: clientData } = await listRows<Client>('clients', { orderBy: 'total_visits' });
    const { data: orderData } = await listRows<Order>('orders', { orderBy: 'created_at' });

    const orders = orderData ?? [];
    const orderMap = new Map<string, { count: number; total: number; lastDate: string | null }>();

    for (const o of orders) {
      const entry = orderMap.get(o.client_id) ?? { count: 0, total: 0, lastDate: null as string | null };
      entry.count++;
      entry.total += Number(o.total || 0);
      if (!entry.lastDate || o.created_at > entry.lastDate) entry.lastDate = o.created_at;
      orderMap.set(o.client_id, entry);
    }

    const ranked: ClientRank[] = (clientData ?? [])
      .map((c) => {
        const stats = orderMap.get(c.id) ?? { count: 0, total: 0, lastDate: null };
        const visits = c.total_visits || stats.count;
        const { tier } = getTier(visits);
        return {
          ...c,
          orderCount: stats.count,
          totalSpent: stats.total,
          lastOrderDate: stats.lastDate,
          tier,
          rank: 0,
        };
      })
      .sort((a, b) => (b.total_visits || b.orderCount) - (a.total_visits || a.orderCount))
      .map((c, i) => ({ ...c, rank: i + 1 }));

    setClients(ranked);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const tiers = [
    { key: 'gold' as const, label: 'Ouro', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', starBg: 'bg-yellow-500/20' },
    { key: 'silver' as const, label: 'Prata', icon: Medal, color: 'text-gray-300', bg: 'bg-gray-400/10', border: 'border-gray-400/20', starBg: 'bg-gray-400/20' },
    { key: 'bronze' as const, label: 'Bronze', icon: Award, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/20', starBg: 'bg-amber-600/20' },
  ];

  const getTop3 = (tier: 'gold' | 'silver' | 'bronze') => filtered.slice(0, 20).filter((c) => c.tier === tier);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Ranking de Clientes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Clientes mais fiéis e recorrentes do seu negócio
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar cliente no ranking..."
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
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum cliente encontrado.</p>
          <p className="text-xs text-slate-600 mt-1">Clientes aparecerão aqui conforme realizarem serviços.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const tierClients = getTop3(tier.key);
            return (
              <Card key={tier.key} className={`bg-card border-border ${tier.border} transition-all duration-300 hover:scale-[1.01]`}>
                <CardHeader className={`${tier.bg} rounded-t-xl -mx-0`}>
                  <CardTitle className={`flex items-center gap-2 text-base ${tier.color}`}>
                    <Icon className="w-5 h-5" />
                    {tier.label}
                    <Badge className={`ml-auto ${tier.starBg} ${tier.color} border-0 text-xs`}>
                      {clients.filter((c) => c.tier === tier.key).length} cliente{clients.filter((c) => c.tier === tier.key).length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {tierClients.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      Nenhum cliente nesta categoria
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-700/50">
                      {tierClients.map((c) => (
                        <div key={c.id} className="flex items-center gap-3 p-3 hover:bg-slate-800/30 transition-colors">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${tier.starBg} ${tier.color} text-sm font-bold`}>
                            {c.rank <= 3 ? <Crown className="w-4 h-4" /> : `#${c.rank}`}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate font-medium">{c.name}</p>
                            <p className="text-xs text-slate-400">
                              {(c.total_visits || c.orderCount)} visita{(c.total_visits || c.orderCount) !== 1 ? 's' : ''}
                              {c.totalSpent > 0 && ` · R$ ${c.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            </p>
                          </div>
                          {c.phone && (
                            <a
                              href={`https://wa.me/55${c.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
                              aria-label="WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lista completa */}
      {filtered.length > 20 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-400" />
              Classificação Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-700/50">
              {filtered.slice(20).map((c) => {
                const t = getTier(c.total_visits || c.orderCount);
                const Icon = t.icon;
                return (
                  <div key={c.id} className="flex items-center gap-3 py-2.5 hover:bg-slate-800/30 transition-colors rounded-lg px-2">
                    <span className="text-xs font-mono text-slate-500 w-6 text-right">#{c.rank}</span>
                    <Icon className={`w-4 h-4 ${t.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{c.name}</p>
                    </div>
                    <span className="text-xs text-slate-400">{(c.total_visits || c.orderCount)} visitas</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
