'use client';

export const dynamic = 'force-dynamic';

import { Plus, Search, FileText } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types';

interface OrderDisplay {
  id: string;
  number: number;
  customer: string;
  vehicle: string;
  services: string[];
  status: OrderStatus;
  total: number;
  createdAt: string;
}

const mockOrders: OrderDisplay[] = [
  { id: '1', number: 1001, customer: 'Carlos Silva', vehicle: 'Corolla - ABC-1234', services: ['Lavagem Completa', 'Polimento'], status: 'lavando', total: 330, createdAt: '2025-06-10' },
  { id: '2', number: 1002, customer: 'Maria Santos', vehicle: 'Civic - DEF-5678', services: ['Higienização'], status: 'aguardando', total: 150, createdAt: '2025-06-10' },
  { id: '3', number: 1003, customer: 'João Oliveira', vehicle: 'MT-07 - GHI-9012', services: ['Lavagem Moto'], status: 'pronto', total: 40, createdAt: '2025-06-09' },
  { id: '4', number: 1004, customer: 'Ana Costa', vehicle: 'HRV - JKL-3456', services: ['Vitrificação'], status: 'finalizando', total: 800, createdAt: '2025-06-10' },
];

const statusColors: Record<OrderStatus, string> = {
  aguardando: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  lavando: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  finalizando: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  pronto: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function OrdensPage() {
  const [search, setSearch] = useState('');
  const filtered = mockOrders.filter((o) =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.number.toString().includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Ordens de Serviço</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova OS
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar por número ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((order) => (
          <Card key={order.id} className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  OS #{order.number}
                </CardTitle>
                <Badge variant="secondary" className={statusColors[order.status]}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-white">{order.customer}</p>
                  <p className="text-xs text-slate-500">{order.vehicle}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {order.services.map((s) => (
                      <span key={s} className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-lg font-bold text-emerald-400">
                  R$ {order.total.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
