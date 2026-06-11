'use client';

export const dynamic = 'force-dynamic';

import { Plus, Clock, User, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppointmentDisplay {
  id: string;
  customer: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
}

const mockAppointments: AppointmentDisplay[] = [
  { id: '1', customer: 'Carlos Silva', vehicle: 'Corolla - ABC-1234', service: 'Lavagem Completa', date: '2025-06-10', time: '09:00', status: 'confirmado' },
  { id: '2', customer: 'Maria Santos', vehicle: 'Civic - DEF-5678', service: 'Polimento Técnico', date: '2025-06-10', time: '10:30', status: 'agendado' },
  { id: '3', customer: 'João Oliveira', vehicle: 'MT-07 - GHI-9012', service: 'Lavagem Moto', date: '2025-06-10', time: '11:00', status: 'agendado' },
  { id: '4', customer: 'Ana Costa', vehicle: 'HRV - JKL-3456', service: 'Higienização', date: '2025-06-10', time: '14:00', status: 'confirmado' },
];

const statusColors = {
  agendado: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  confirmado: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelado: 'bg-red-500/10 text-red-400 border-red-500/20',
  concluido: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function AgendamentoPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Agendamento</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="glass-card rounded-xl p-4">
        <h2 className="text-sm font-medium text-slate-400 mb-3">Hoje - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
        <div className="space-y-3">
          {mockAppointments.map((apt) => (
            <Card key={apt.id} className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{apt.time} - {apt.service}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <User className="w-3 h-3" /> {apt.customer}
                        <Car className="w-3 h-3 ml-1" /> {apt.vehicle}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={statusColors[apt.status]}>
                    {apt.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
