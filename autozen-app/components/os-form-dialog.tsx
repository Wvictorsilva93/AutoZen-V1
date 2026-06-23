'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, insertRow } from '@/lib/db';
import { useProfile } from '@/hooks/useProfile';

interface ClientOpt { id: string; name: string; phone?: string | null }
interface VehicleOpt { id: string; plate?: string; brand?: string; model?: string; color?: string; year?: string; client_id?: string }
interface ServiceOpt { id: string; name: string; price: number }
interface EmployeeOpt { id: string; name: string }

interface SelectedService { service_id: string; name: string; price: number; quantity: number }

interface OsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export default function OsFormDialog({ open, onOpenChange, onSaved }: OsFormDialogProps) {
  const { profile } = useProfile();

  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOpt[]>([]);
  const [services, setServices] = useState<ServiceOpt[]>([]);
  const [employees, setEmployees] = useState<EmployeeOpt[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [saving, setSaving] = useState(false);

  const [clientId, setClientId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const [newServiceId, setNewServiceId] = useState('');

  const filteredVehicles = vehicles.filter((v) => !clientId || v.client_id === clientId);

  const totalValue = selectedServices.reduce((sum, s) => sum + Number(s.price) * (s.quantity || 1), 0);

  const load = useCallback(async () => {
    setLoadingRefs(true);
    const [c, v, sv, e] = await Promise.all([
      listRows<ClientOpt>('clients', { orderBy: 'name', ascending: true }),
      listRows<VehicleOpt>('vehicles', { orderBy: 'plate', ascending: true }),
      listRows<ServiceOpt>('services', { orderBy: 'name', ascending: true }),
      listRows<EmployeeOpt>('employees', { orderBy: 'name', ascending: true }),
    ]);
    setClients(c.data ?? []);
    setVehicles(v.data ?? []);
    setServices(sv.data ?? []);
    setEmployees(e.data ?? []);
    setLoadingRefs(false);
  }, []);

  useEffect(() => { if (open) load(); }, [open, load]);

  function resetForm() {
    setClientId('');
    setVehicleId('');
    setEmployeeId('');
    setScheduledDate('');
    setScheduledTime('');
    setNotes('');
    setSelectedServices([]);
    setNewServiceId('');
  }

  async function handleSave() {
    if (!clientId) { toast.error('Selecione um cliente'); return; }
    if (!vehicleId) { toast.error('Selecione um veículo'); return; }
    if (selectedServices.length === 0) { toast.error('Adicione pelo menos um serviço'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setSaving(true);

    const { data: orders } = await listRows<{ number: number }>('orders', { orderBy: 'number' });
    const nextNumber = (orders ?? []).reduce((m, o) => Math.max(m, o.number ?? 0), 1000) + 1;

    const { data: newOrder, error } = await insertRow('orders', {
      company_id: profile.company_id,
      number: nextNumber,
      client_id: clientId,
      vehicle_id: vehicleId,
      employee_id: employeeId || null,
      kanban_status: 'aguardando',
      status: 'aberta',
      payment_status: 'pending',
      total: totalValue,
      description: notes || null,
    });
    if (error || !newOrder) { toast.error('Erro ao criar OS: ' + (error ?? '')); setSaving(false); return; }

    for (const sv of selectedServices) {
      const { error: svErr } = await insertRow('order_services', {
        order_id: (newOrder as Record<string, unknown>).id,
        service_id: sv.service_id,
        quantity: sv.quantity,
        price: sv.price,
      });
      if (svErr) toast.error('Erro ao vincular serviço: ' + svErr);
    }

    setSaving(false);
    toast.success(`OS #${nextNumber} criada com sucesso!`);
    resetForm();
    onOpenChange(false);
    onSaved();
  }

  function addService() {
    const sv = services.find((s) => s.id === newServiceId);
    if (!sv) { toast.error('Selecione um serviço'); return; }
    if (selectedServices.some((s) => s.service_id === sv.id)) { toast.error('Serviço já adicionado'); return; }
    setSelectedServices([...selectedServices, { service_id: sv.id, name: sv.name, price: sv.price, quantity: 1 }]);
    setNewServiceId('');
  }

  function removeService(id: string) {
    setSelectedServices(selectedServices.filter((s) => s.service_id !== id));
  }

  function updateQty(id: string, qty: number) {
    setSelectedServices(selectedServices.map((s) => s.service_id === id ? { ...s, quantity: Math.max(1, qty) } : s));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="bg-card border-border max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>

        {loadingRefs ? (
          <div className="flex items-center justify-center py-12 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-lg bg-slate-800/30 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cliente</p>
              <Select value={clientId} onValueChange={(v) => { setClientId(v ?? ''); setVehicleId(''); }}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.phone ? `— ${c.phone}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-slate-800/30 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Veículo</p>
              <Select value={vehicleId} onValueChange={(v) => setVehicleId(v ?? '')} disabled={!clientId}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder={clientId ? 'Selecione um veículo' : 'Selecione o cliente primeiro'} />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {[v.brand, v.model, v.plate].filter(Boolean).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-slate-800/30 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Serviços</p>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Select value={newServiceId} onValueChange={(v) => setNewServiceId(v ?? '')}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Adicionar serviço..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} — R$ {Number(s.price).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" size="sm" onClick={addService} className="bg-blue-600 hover:bg-blue-500">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {selectedServices.length > 0 && (
                <div className="space-y-2">
                  {selectedServices.map((sv) => (
                    <div key={sv.service_id} className="flex items-center justify-between rounded-lg bg-slate-900/50 p-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{sv.name}</p>
                        <p className="text-xs text-slate-500">R$ {Number(sv.price).toFixed(2)} un</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Input type="number" min="1" value={sv.quantity}
                          onChange={(e) => updateQty(sv.service_id, Number(e.target.value))}
                          className="w-16 h-7 text-xs bg-slate-800 border-slate-700 text-white text-center" />
                        <button onClick={() => removeService(sv.service_id)}
                          className="h-7 w-7 rounded flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="text-sm font-bold text-emerald-400">
                      R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-slate-800/30 p-4 space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Responsável & Agendamento</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">Responsável</Label>
                  <Select value={employeeId} onValueChange={(v) => setEmployeeId(v ?? '')}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-9 text-xs">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">Data</Label>
                  <Input type="date" value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white h-9 text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Horário</Label>
                <Input type="time" value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white h-9 text-xs" />
              </div>
            </div>

            <div className="rounded-lg bg-slate-800/30 p-4 space-y-2">
              <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Observações</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[60px] bg-slate-800/50 border border-slate-700 rounded-lg p-2.5 text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none focus:border-blue-500/50"
                placeholder="Anotações sobre a OS..." />
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-300">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar OS'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
