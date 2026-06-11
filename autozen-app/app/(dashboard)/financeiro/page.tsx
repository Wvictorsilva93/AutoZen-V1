'use client';

export const dynamic = 'force-dynamic';

import { TrendingUp, TrendingDown, DollarSign, CreditCard, Banknote, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TransactionDisplay {
  id: string;
  type: 'entrada' | 'saida';
  description: string;
  amount: number;
  method: 'pix' | 'dinheiro' | 'cartao';
  date: string;
  category: string;
}

const mockTransactions: TransactionDisplay[] = [
  { id: '1', type: 'entrada', description: 'Lavagem Completa - Carlos Silva', amount: 80, method: 'pix', date: '2025-06-10', category: 'Serviço' },
  { id: '2', type: 'entrada', description: 'Polimento - Carlos Silva', amount: 250, method: 'cartao', date: '2025-06-10', category: 'Serviço' },
  { id: '3', type: 'saida', description: 'Compra Shampoo Automotivo', amount: 120, method: 'pix', date: '2025-06-10', category: 'Estoque' },
  { id: '4', type: 'entrada', description: 'Higienização - Maria Santos', amount: 150, method: 'dinheiro', date: '2025-06-10', category: 'Serviço' },
  { id: '5', type: 'saida', description: 'Energia Elétrica', amount: 350, method: 'pix', date: '2025-06-09', category: 'Despesa' },
  { id: '6', type: 'entrada', description: 'Vitrificação - Ana Costa', amount: 800, method: 'cartao', date: '2025-06-10', category: 'Serviço' },
];

const methodIcons = {
  pix: QrCode,
  dinheiro: Banknote,
  cartao: CreditCard,
};

export default function FinanceiroPage() {
  const entradas = mockTransactions.filter((t) => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
  const saidas = mockTransactions.filter((t) => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
  const saldo = entradas - saidas;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Financeiro</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Entradas</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-400">R$ {entradas.toLocaleString('pt-BR')}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Saídas</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">R$ {saidas.toLocaleString('pt-BR')}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Saldo</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              R$ {saldo.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-white">Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockTransactions.map((tx) => {
            const MethodIcon = methodIcons[tx.method];
            return (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'entrada' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {tx.type === 'entrada' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MethodIcon className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{tx.method} · {tx.category}</span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm font-bold ${tx.type === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'entrada' ? '+' : '-'}R$ {tx.amount.toFixed(2)}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
