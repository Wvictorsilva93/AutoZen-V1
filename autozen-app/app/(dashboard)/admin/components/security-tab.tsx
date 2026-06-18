'use client';

import { useState } from 'react';
import {
  Shield, ShieldCheck, AlertTriangle, Key, Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SecurityTab() {
  const [settings] = useState({
    requireEmailConfirmation: true,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    allowRegistration: true,
  });

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <CardTitle className="text-sm text-white">Segurança da Plataforma</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-sm text-white">Confirmação de Email</p>
                <p className="text-xs text-slate-500">Usuários precisam confirmar email ao cadastrar</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${settings.requireEmailConfirmation ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
              {settings.requireEmailConfirmation ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-sm text-white">Tentativas de Login</p>
                <p className="text-xs text-slate-500">Máximo de {settings.maxLoginAttempts} tentativas antes de bloquear</p>
              </div>
            </div>
            <span className="text-xs text-white font-mono bg-slate-700 px-2 py-1 rounded">{settings.maxLoginAttempts}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm text-white">Timeout de Sessão</p>
                <p className="text-xs text-slate-500">Sessão expira após {settings.sessionTimeout} minutos de inatividade</p>
              </div>
            </div>
            <span className="text-xs text-white font-mono bg-slate-700 px-2 py-1 rounded">{settings.sessionTimeout}min</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-violet-400" />
              <div>
                <p className="text-sm text-white">Registro Aberto</p>
                <p className="text-xs text-slate-500">Novos usuários podem se registrar na plataforma</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${settings.allowRegistration ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
              {settings.allowRegistration ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <CardTitle className="text-sm text-white">Ações de Risco</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div>
              <p className="text-sm text-white">Forçar Logout de Todos</p>
              <p className="text-xs text-slate-500">Encerra todas as sessões ativas da plataforma</p>
            </div>
            <Button variant="ghost" className="text-red-400 hover:bg-red-500/10" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
              Executar
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div>
              <p className="text-sm text-white">Exportar Logs de Auditoria</p>
              <p className="text-xs text-slate-500">Baixa relatório completo de auditoria do sistema</p>
            </div>
            <Button variant="ghost" className="text-blue-400 hover:bg-blue-500/10" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
