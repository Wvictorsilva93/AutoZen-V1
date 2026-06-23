'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle2,
  Clock, Shield, TrendingDown, CreditCard, Users
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface Alert {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  icon: any
  timestamp: Date
  company?: string
}

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  success: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
}

export function AlertCenter({ data }: { data: CommandCenterData }) {
  const alerts = useMemo<Alert[]>(() => {
    const result: Alert[] = []

    // Critical: delinquent companies
    data.companies
      .filter(c => c.active && !c.blocked && c.subscription_end && new Date(c.subscription_end) < new Date())
      .forEach(c => result.push({
        id: `del-${c.id}`,
        title: 'Assinatura expirada',
        description: `${c.name} — pagamento atrasado`,
        severity: 'critical',
        icon: CreditCard,
        timestamp: new Date(c.subscription_end!),
        company: c.name,
      }))

    // Warning: trials ending soon
    data.companies
      .filter(c => c.trial_end && new Date(c.trial_end) > new Date() && new Date(c.trial_end).getTime() - Date.now() < 3 * 86400000)
      .forEach(c => result.push({
        id: `trial-${c.id}`,
        title: 'Trial expirando',
        description: `${c.name} — termina em ${Math.ceil((new Date(c.trial_end!).getTime() - Date.now()) / 86400000)} dias`,
        severity: 'warning',
        icon: Clock,
        timestamp: new Date(c.trial_end!),
        company: c.name,
      }))

    // Warning: blocked companies
    data.companies
      .filter(c => c.blocked)
      .forEach(c => result.push({
        id: `block-${c.id}`,
        title: 'Empresa bloqueada',
        description: `${c.name} — acesso suspenso`,
        severity: 'warning',
        icon: Shield,
        timestamp: new Date(c.updated_at),
        company: c.name,
      }))

    // Info: recent audit entries
    data.auditLogs.slice(0, 5).forEach(a => result.push({
      id: `audit-${a.id}`,
      title: a.action,
      description: `${a.user_name} → ${a.target}`,
      severity: 'info',
      icon: Info,
      timestamp: new Date(a.created_at),
      company: a.company_name,
    }))

    // Success: new companies this week
    const weekAgo = Date.now() - 7 * 86400000
    data.companies
      .filter(c => new Date(c.created_at).getTime() > weekAgo)
      .forEach(c => result.push({
        id: `new-${c.id}`,
        title: 'Nova empresa',
        description: `${c.name} cadastrada`,
        severity: 'success',
        icon: CheckCircle2,
        timestamp: new Date(c.created_at),
        company: c.name,
      }))

    return result.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2, success: 3 }
      return (order[a.severity] - order[b.severity]) || b.timestamp.getTime() - a.timestamp.getTime()
    })
  }, [data])

  const criticals = alerts.filter(a => a.severity === 'critical').length
  const warnings = alerts.filter(a => a.severity === 'warning').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Central de Alertas
          </h3>
          <p className="text-sm text-slate-500">
            {criticals > 0 && <span className="text-red-400">{criticals} críticos</span>}
            {criticals > 0 && warnings > 0 && ' · '}
            {warnings > 0 && <span className="text-amber-400">{warnings} avisos</span>}
            {!criticals && !warnings && <span className="text-emerald-400">Tudo normal</span>}
          </p>
        </div>
        <span className="text-xs text-slate-600">{alerts.length} alertas</span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
        {alerts.slice(0, 15).map((alert, i) => {
          const sev = severityConfig[alert.severity]
          const Icon = alert.icon
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`p-3 rounded-xl border ${sev.border} ${sev.bg} hover:bg-white/[0.04] transition-colors`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${sev.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{alert.description}</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    {alert.timestamp.toLocaleDateString('pt-BR')} {alert.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Nenhum alerta no momento</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
