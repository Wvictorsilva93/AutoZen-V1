'use client';

export const dynamic = 'force-dynamic';

import { Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { OrderStatus } from '@/types';

interface KanbanCard {
  id: string;
  number: number;
  customer: string;
  vehicle: string;
  service: string;
  status: OrderStatus;
}

const mockCards: KanbanCard[] = [
  { id: '1', number: 1002, customer: 'Maria Santos', vehicle: 'Civic', service: 'Higienização', status: 'aguardando' },
  { id: '2', number: 1005, customer: 'Pedro Lima', vehicle: 'Onix', service: 'Lavagem', status: 'aguardando' },
  { id: '3', number: 1001, customer: 'Carlos Silva', vehicle: 'Corolla', service: 'Polimento', status: 'lavando' },
  { id: '4', number: 1006, customer: 'Ana Paula', vehicle: 'SW4', service: 'Lavagem Completa', status: 'lavando' },
  { id: '5', number: 1004, customer: 'Ana Costa', vehicle: 'HRV', service: 'Vitrificação', status: 'finalizando' },
  { id: '6', number: 1003, customer: 'João Oliveira', vehicle: 'MT-07', service: 'Lavagem Moto', status: 'pronto' },
];

const columns: { id: OrderStatus; title: string; color: string }[] = [
  { id: 'aguardando', title: 'Aguardando', color: 'border-t-amber-500' },
  { id: 'lavando', title: 'Lavando', color: 'border-t-blue-500' },
  { id: 'finalizando', title: 'Finalizando', color: 'border-t-violet-500' },
  { id: 'pronto', title: 'Pronto', color: 'border-t-emerald-500' },
];

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Kanban</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
        {columns.map((col) => {
          const cards = mockCards.filter((c) => c.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col bg-slate-900/50 rounded-xl border border-border border-t-4 ${col.color} p-3`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-medium text-white">{col.title}</h3>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  {cards.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    className="bg-card border-border hover:border-blue-500/30 transition-all cursor-grab active:cursor-grabbing hover:scale-[1.02]"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-slate-500">#{card.number}</span>
                        <Car className="w-3 h-3 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-white">{card.customer}</p>
                      <p className="text-xs text-slate-400">{card.vehicle} · {card.service}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
