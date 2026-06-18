'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, ShieldCheck, ShieldAlert, Fingerprint, Key, LogIn, Globe, Smartphone, Laptop } from 'lucide-react'
import type { CommandCenterData } from './command-center'

export function SecurityPanel({ data }: { data: CommandCenterData }) {
  const recentLogins = useMemo(() =>
    data.auditLogs
      .filter(l => l.action === 'login')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
  [data])

  const securityAlerts = useMemo(() =>
    data.auditLogs
      .filter(l => l.action === 'security_alert')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  [data])

  const totalLogins = data.auditLogs.filter(l => l.action === 'login').length
  const uniqueUsers = new Set(data.auditLogs.filter(l => l.action === 'login').map(l => l.user_name)).size

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Módulo de Segurança</h2>
            <p className="text-xs text-slate-500">Monitoramento de acesso e ameaças</p>
          </div>
        </div>
        {securityAlerts.length > 0 ? (
          <div className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-xs font-medium text-red-400">{securityAlerts.length} alertas</span>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-medium text-emerald-400">Sem alertas</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <SecurityStat icon={LogIn} value={String(totalLogins)} label="Logins" />
        <SecurityStat icon={Fingerprint} value={String(uniqueUsers)} label="Usuários" />
        <SecurityStat icon={ShieldCheck} value={securityAlerts.length === 0 ? 'OK' : String(securityAlerts.length)} label="Alertas" color={securityAlerts.length > 0 ? 'text-amber-400' : 'text-emerald-400'} />
      </div>

      {recentLogins.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Últimos acessos</p>
          <div className="space-y-2">
            {recentLogins.map((log, i) => (
              <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">{log.user_name}</p>
                  <p className="text-xs text-slate-600">
                    {new Date(log.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {log.ip && ` · ${log.ip}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Autenticação em dois fatores ativa · Criptografia TLS 1.3</span>
        </div>
      </div>
    </motion.div>
  )
}

function SecurityStat({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color?: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color || 'text-blue-400'}`} />
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  )
}
