'use client';

export const dynamic = 'force-dynamic';

import { MessageSquare, Send, Clock, CheckCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const templates = [
  {
    id: '1',
    name: 'Veículo Pronto',
    message: 'Olá {cliente}! Seu veículo placa {placa} está pronto para retirada na {empresa}. Obrigado pela preferência! 🚗✨',
    trigger: 'Automático - Status "Pronto"',
  },
  {
    id: '2',
    name: 'Lembrete Agendamento',
    message: 'Olá {cliente}! Lembrando do seu agendamento amanhã na {empresa}. Veículo: {placa}. Confirma presença? 📅',
    trigger: 'Automático - 24h antes',
  },
  {
    id: '3',
    name: 'Cobrança',
    message: 'Olá {cliente}! Informamos que há um valor pendente referente ao serviço do veículo {placa}. Entre em contato para regularizar. 💰',
    trigger: 'Manual',
  },
];

const recentMessages = [
  { id: '1', customer: 'Carlos Silva', template: 'Veículo Pronto', status: 'sent', time: '14:30' },
  { id: '2', customer: 'Maria Santos', template: 'Lembrete Agendamento', status: 'delivered', time: '10:00' },
  { id: '3', customer: 'João Oliveira', template: 'Veículo Pronto', status: 'read', time: '09:15' },
];

export default function WhatsAppPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
          <MessageSquare className="w-4 h-4 mr-2" />
          Nova Mensagem
        </Button>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Templates de Mensagem</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="bg-card border-border hover:border-emerald-500/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  {tpl.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400 mb-2">{tpl.message}</p>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                  {tpl.trigger}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-white">Mensagens Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentMessages.map((msg) => (
            <div key={msg.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Send className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white">{msg.customer}</p>
                  <p className="text-xs text-slate-500">{msg.template}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{msg.time}</span>
                {msg.status === 'read' ? (
                  <CheckCheck className="w-4 h-4 text-blue-400" />
                ) : msg.status === 'delivered' ? (
                  <CheckCheck className="w-4 h-4 text-slate-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
