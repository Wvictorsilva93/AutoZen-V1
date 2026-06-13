'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';

interface Client { id: string; name: string; phone: string | null }
interface Vehicle { id: string; client_id: string | null; plate: string }
interface Company { id: string; name: string }

const templates = [
  { id: 'pronto', name: 'Veículo Pronto', text: 'Olá {cliente}! Seu veículo placa {placa} está pronto para retirada na {empresa}. Obrigado pela preferência! 🚗✨' },
  { id: 'lembrete', name: 'Lembrete Agendamento', text: 'Olá {cliente}! Lembrando do seu agendamento na {empresa}. Veículo: {placa}. Confirma presença? 📅' },
  { id: 'cobranca', name: 'Cobrança', text: 'Olá {cliente}! Informamos que há um valor pendente referente ao serviço do veículo {placa} na {empresa}. Entre em contato para regularizar. 💰' },
];

function onlyDigits(s: string) { return (s ?? '').replace(/\D/g, ''); }

export default function WhatsAppPage() {
  const { profile } = useProfile();
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const [clientId, setClientId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [templateId, setTemplateId] = useState('pronto');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [c, v, co] = await Promise.all([
      listRows<Client>('clients', { orderBy: 'name', ascending: true }),
      listRows<Vehicle>('vehicles', { orderBy: 'plate', ascending: true }),
      listRows<Company>('companies', { orderBy: 'created_at' }),
    ]);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setCompany((co.data ?? [])[0] ?? null);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
  const clientVehicles = vehicles.filter((v) => !clientId || v.client_id === clientId);

  const buildMessage = useCallback(() => {
    const tpl = templates.find((t) => t.id === templateId)?.text ?? '';
    return tpl
      .replaceAll('{cliente}', selectedClient?.name ?? '{cliente}')
      .replaceAll('{empresa}', company?.name ?? '{empresa}')
      .replaceAll('{placa}', selectedVehicle?.plate ?? '{placa}');
  }, [templateId, selectedClient, selectedVehicle, company]);

  useEffect(() => { setMessage(buildMessage()); }, [buildMessage]);

  function sendWhatsApp() {
    if (!selectedClient) { toast.error('Selecione um cliente'); return; }
    const phone = onlyDigits(selectedClient.phone ?? '');
    if (!phone) { toast.error('Cliente sem telefone cadastrado'); return; }
    const intl = phone.startsWith('55') ? phone : '55' + phone;
    const url = `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.success('Abrindo WhatsApp...');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">WhatsApp</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-sm text-white flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-400" /> Enviar Mensagem</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Cliente</Label>
                <Select value={clientId} onValueChange={(v) => { setClientId(v ?? ''); setVehicleId(''); }}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Veículo</Label>
                <Select value={vehicleId} onValueChange={(v) => setVehicleId(v ?? '')}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{clientVehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.plate}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Template</Label>
                <Select value={templateId} onValueChange={(v) => setTemplateId(v ?? 'pronto')}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Mensagem</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <Button onClick={sendWhatsApp} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                <Send className="w-4 h-4 mr-2" /> Abrir no WhatsApp
              </Button>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-sm font-medium text-slate-400 mb-3">Templates disponíveis</h2>
            <div className="space-y-3">
              {templates.map((tpl) => (
                <Card key={tpl.id} className="bg-card border-border hover:border-emerald-500/30 transition-colors cursor-pointer"
                  onClick={() => setTemplateId(tpl.id)}>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-white flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-400" /> {tpl.name}</CardTitle></CardHeader>
                  <CardContent><p className="text-xs text-slate-400">{tpl.text}</p></CardContent>
                </Card>
              ))}
              <p className="text-xs text-slate-600">Variáveis: <span className="text-slate-400">{'{cliente}'}</span>, <span className="text-slate-400">{'{empresa}'}</span>, <span className="text-slate-400">{'{placa}'}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
