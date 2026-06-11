'use client';

export const dynamic = 'force-dynamic';

import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InventoryDisplay {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  cost: number;
  category: string;
}

const mockInventory: InventoryDisplay[] = [
  { id: '1', name: 'Shampoo Automotivo 5L', quantity: 8, minQuantity: 5, unit: 'un', cost: 45, category: 'Carro' },
  { id: '2', name: 'Cera Líquida Premium', quantity: 3, minQuantity: 5, unit: 'un', cost: 89, category: 'Carro' },
  { id: '3', name: 'Desengraxante 5L', quantity: 12, minQuantity: 4, unit: 'un', cost: 35, category: 'Carro' },
  { id: '4', name: 'Shampoo Moto 1L', quantity: 15, minQuantity: 8, unit: 'un', cost: 22, category: 'Moto' },
  { id: '5', name: 'Silicone Líquido', quantity: 2, minQuantity: 5, unit: 'un', cost: 18, category: 'Carro' },
  { id: '6', name: 'Microfibra 40x40', quantity: 25, minQuantity: 10, unit: 'un', cost: 12, category: 'Acessório' },
];

export default function EstoquePage() {
  const [search, setSearch] = useState('');
  const filtered = mockInventory.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Estoque</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const lowStock = item.quantity <= item.minQuantity;
          return (
            <Card key={item.id} className={`bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer ${lowStock ? 'border-amber-500/30' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    {item.name}
                  </CardTitle>
                  {lowStock && (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xl font-bold ${lowStock ? 'text-amber-400' : 'text-white'}`}>
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-slate-500">Mín: {item.minQuantity} {item.unit}</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Custo: R$ {item.cost.toFixed(2)}/{item.unit}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
