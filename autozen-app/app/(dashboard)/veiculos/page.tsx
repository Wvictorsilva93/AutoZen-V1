'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Plus, Search, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VehicleDisplay {
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  owner: string;
}

const mockVehicles: VehicleDisplay[] = [
  { id: '1', plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla', color: 'Prata', type: 'carro', owner: 'Carlos Silva' },
  { id: '2', plate: 'DEF-5678', brand: 'Honda', model: 'Civic', color: 'Preto', type: 'carro', owner: 'Maria Santos' },
  { id: '3', plate: 'GHI-9012', brand: 'Yamaha', model: 'MT-07', color: 'Azul', type: 'moto', owner: 'João Oliveira' },
];

export default function VeiculosPage() {
  const [search, setSearch] = useState('');
  const filtered = mockVehicles.filter((v) =>
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Veículos</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar por placa, modelo ou dono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vehicle) => (
          <Card key={vehicle.id} className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-400" />
                  {vehicle.plate}
                </CardTitle>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300 capitalize">
                  {vehicle.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white font-medium">{vehicle.brand} {vehicle.model}</p>
              <p className="text-xs text-slate-400 mt-1">Cor: {vehicle.color}</p>
              <p className="text-xs text-slate-500 mt-1">Dono: {vehicle.owner}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
