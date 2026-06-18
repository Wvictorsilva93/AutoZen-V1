'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bell, AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import type { CommandCenterData } from './command-center'

export function AlertCenter({ data }: { data: CommandCenterData }) {
  const alerts = useMemo(() => {
    const result: { id: string; type: 'critical' | 'warning' | 'info'; message: string; time: string }[] = []

    const delinquents = data.companies.filter(c => c.active && !c.blocked && c.subscription_end && new Date(c.subscription_end) < new Date())
    delinquents.forEach(c => {
      result.push({
        id: `del-${c.id}`,
        type: 'critical',
        message: `${c.name} — assinatura vencida em ${new Date(c.subscription_end!).toLocaleDateString('pt-BR')}`,
        time: c.subscription_end!,
      })
    })

    const highPriority = data.tickets.filter(t => t.priority === 'high' && t.status === 'open')
    highPriority.forEach(t => {
      result.push({
        id: `ticket-${t.id}`,
        type: 'warning',
        message: `Ticket prioritário: ${t.subject}`,
        time: t.created_at,
      })
    })

    const recentBlocks = data.companies.filter(c => c.blocked && new Date(c.updated_at) > new Date(Date.now() - 86400000 * 7))
    recentBlocks.forEach(c => {
      result.push({
        id: `block-${c.id}`,
        type: 'warning',
        message: `${c.name} foi bloqueada recentemente`,
        time: c.updated_at,
      })
    })

    result.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    return result.slice(0, 8)
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Central de Alertas</h2>
            <p className="text-xs text-slate-500">{alerts.length} notificações ativas</p>
          </div>
        </div>
        {alerts.filter(a => a.type === 'critical').length > 0 && (
          <div className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-xs font-medium text-red-400">{alerts.filter(a => a.type === 'critical').length} críticos</span>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-500/50 mb-2" />
            <p className="text-sm text-slate-600">Nenhum alerta no momento</p>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                alert.type === 'critical' ? 'bg-red-500/5 border-red-500/15' :
                alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/15' :
                'bg-blue-500/5 border-blue-500/15'
              }`}
            >
              {alert.type === 'critical' ? <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /> :
               alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" /> :
               <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300">{alert.message}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {new Date(alert.time).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
