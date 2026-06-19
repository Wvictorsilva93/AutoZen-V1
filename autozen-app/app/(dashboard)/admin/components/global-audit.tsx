'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, UserPlus, LogIn, Settings, AlertTriangle, Shield, Edit, Trash2, Ban, CheckCircle2, Monitor, Globe } from 'lucide-react'
import type { CommandCenterData } from './command-center'

const actionIcons: Record<string, any> = {
  create_company: UserPlus, update_company: Edit, delete_company: Trash2,
  block_company: Ban, unblock_company: CheckCircle2,
  login: LogIn, update_settings: Settings, security_alert: Shield,
}

const actionColors: Record<string, string> = {
  create_company: 'text-emerald-400 bg-emerald-500/10',
  update_company: 'text-blue-400 bg-blue-500/10',
  delete_company: 'text-red-400 bg-red-500/10',
  block_company: 'text-red-400 bg-red-500/10',
  unblock_company: 'text-emerald-400 bg-emerald-500/10',
  login: 'text-cyan-400 bg-cyan-500/10',
  update_settings: 'text-violet-400 bg-violet-500/10',
  security_alert: 'text-amber-400 bg-amber-500/10',
}

function parseBrowser(ua: string | null) {
  if (!ua) return null
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE'
  return null
}

export function GlobalAudit({ data }: { data: CommandCenterData }) {
  const logs = useMemo(() =>
    data.auditLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20),
  [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Auditoria Global</h2>
          <p className="text-xs text-slate-500">{data.auditLogs.length} eventos registrados</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-blue-500/5 to-transparent" />

        <div className="space-y-1 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-600">Nenhum evento de auditoria</p>
            </div>
          ) : (
            logs.map((log, i) => {
              const Icon = actionIcons[log.action] || Shield
              const color = actionColors[log.action] || 'text-slate-400 bg-slate-500/10'
              const browser = parseBrowser(log.user_agent)
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-4 py-2.5 group"
                >
                  <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-white">{log.user_name}</span>
                      {' '}{formatAction(log.action)}{' '}
                      {log.target && <span className="text-blue-400">{log.target}</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-xs text-slate-600">
                        {new Date(log.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {log.ip && (
                        <div className="flex items-center gap-1 text-xs text-slate-600" title={log.ip}>
                          <Globe className="w-3 h-3" />
                          {log.ip}
                        </div>
                      )}
                      {browser && (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Monitor className="w-3 h-3" />
                          {browser}
                        </div>
                      )}
                      {log.company_name && (
                        <span className="text-xs text-slate-600">· {log.company_name}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </motion.div>
  )
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    create_company: 'criou a empresa',
    update_company: 'atualizou',
    delete_company: 'excluiu',
    block_company: 'bloqueou',
    unblock_company: 'desbloqueou',
    login: 'fez login em',
    update_settings: 'alterou configurações de',
    security_alert: 'gerou alerta de segurança em',
  }
  return map[action] || action
}
