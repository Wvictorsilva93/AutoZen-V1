'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  History, User, Building2, Shield, Settings, CreditCard,
  Trash2, Edit3, Eye, LogIn, Filter
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

const actionIcons: Record<string, any> = {
  login: LogIn, create: Edit3, update: Settings, delete: Trash2,
  view: Eye, payment: CreditCard, block: Shield, default: User,
}

const actionColors: Record<string, string> = {
  login: 'text-blue-400 bg-blue-500/10',
  create: 'text-emerald-400 bg-emerald-500/10',
  update: 'text-amber-400 bg-amber-500/10',
  delete: 'text-red-400 bg-red-500/10',
  view: 'text-slate-400 bg-slate-500/10',
  payment: 'text-violet-400 bg-violet-500/10',
  block: 'text-red-400 bg-red-500/10',
  default: 'text-cyan-400 bg-cyan-500/10',
}

function getActionType(action: string): string {
  const a = action.toLowerCase()
  if (a.includes('login') || a.includes('sign')) return 'login'
  if (a.includes('creat') || a.includes('nov') || a.includes('added')) return 'create'
  if (a.includes('updat') || a.includes('edit') || a.includes('alter')) return 'update'
  if (a.includes('delet') || a.includes('remov') || a.includes('exclu')) return 'delete'
  if (a.includes('view') || a.includes('visuali')) return 'view'
  if (a.includes('pay') || a.includes('pag') || a.includes('cobr')) return 'payment'
  if (a.includes('block') || a.includes('suspend')) return 'block'
  return 'default'
}

export function GlobalAudit({ data }: { data: CommandCenterData }) {
  const [filterAction, setFilterAction] = useState('all')

  const logs = useMemo(() => {
    let items = data.auditLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    if (filterAction !== 'all') {
      items = items.filter(l => getActionType(l.action) === filterAction)
    }
    return items.slice(0, 30)
  }, [data.auditLogs, filterAction])

  const groupedByDay = useMemo(() => {
    const groups: Record<string, typeof logs> = {}
    logs.forEach(log => {
      const day = new Date(log.created_at).toLocaleDateString('pt-BR')
      if (!groups[day]) groups[day] = []
      groups[day].push(log)
    })
    return groups
  }, [logs])

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
            <History className="w-5 h-5 text-cyan-400" />
            Auditoria Global
          </h3>
          <p className="text-sm text-slate-500">{data.auditLogs.length} registros no sistema</p>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/5">
          {['all', 'login', 'create', 'update', 'delete'].map(action => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                filterAction === action
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {action === 'all' ? 'Todos' : action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {Object.entries(groupedByDay).map(([day, dayLogs]) => (
          <div key={day}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] text-slate-600 uppercase tracking-wider shrink-0">{day}</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="space-y-1.5">
              {dayLogs.map((log, i) => {
                const actionType = getActionType(log.action)
                const Icon = actionIcons[actionType] || actionIcons.default
                const colorClass = actionColors[actionType] || actionColors.default
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white">
                        <span className="font-medium">{log.user_name}</span>
                        {' · '}
                        <span className="text-slate-400">{log.action}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {log.company_name && (
                          <span className="text-[10px] text-slate-600 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />{log.company_name}
                          </span>
                        )}
                        {log.ip && <span className="text-[10px] text-slate-600">{log.ip}</span>}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 shrink-0">
                      {new Date(log.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-8">
            <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Nenhum registro encontrado</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
