'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Plus, Search, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServiceDisplay {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
}

const mockServices: ServiceDisplay[] = [
  { id: '1', name: 'Lavagem Completa', price: 80, duration: 45, category: 'Lavagem', active: true },
  { id: '2', name: 'Polimento Técnico', price: 250, duration: 120, category: 'Polimento', active: true },
  { id: '3', name: 'Higienização Interna', price: 150, duration: 90, category: 'Higienização', active: true },
  { id: '4', name: 'Vitrificação', price: 800, duration: 240, category: 'Vitrificação', active: true },
  { id: '5', name: 'Lavagem Moto', price: 40, duration: 20, category: 'Motos', active: true },
  { id: '6', name: 'Lavagem Simples', price: 45, duration: 25, category: 'Lavagem', active: true },
];

export default function ServicosPage() {
  const [search, setSearch] = useState('');
  const filtered = mockServices.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Serviços</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <Card key={service.id} className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  {service.name}
                </CardTitle>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {service.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-emerald-400">
                  R$ {service.price.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500">{service.duration} min</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
