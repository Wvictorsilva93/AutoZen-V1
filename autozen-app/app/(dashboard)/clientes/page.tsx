'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Plus, Search, Phone, Mail, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClienteDisplay {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  recurrence: number;
  lastVisit: string;
}

const mockClientes: ClienteDisplay[] = [
  { id: '1', name: 'Carlos Silva', phone: '(11) 98765-4321', email: 'carlos@email.com', whatsapp: '11987654321', recurrence: 12, lastVisit: '2025-06-08' },
  { id: '2', name: 'Maria Santos', phone: '(11) 91234-5678', email: 'maria@email.com', whatsapp: '11912345678', recurrence: 5, lastVisit: '2025-06-05' },
  { id: '3', name: 'João Oliveira', phone: '(11) 99876-5432', email: 'joao@email.com', whatsapp: '11998765432', recurrence: 23, lastVisit: '2025-06-09' },
];

export default function ClientesPage() {
  const [search, setSearch] = useState('');
  const filtered = mockClientes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Clientes</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((cliente) => (
          <Card key={cliente.id} className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white">{cliente.name}</CardTitle>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {cliente.recurrence}x recorrente
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {cliente.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {cliente.email}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Última visita: {new Date(cliente.lastVisit).toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
