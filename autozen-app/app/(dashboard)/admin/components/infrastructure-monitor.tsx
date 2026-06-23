'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Server, Database, Globe, Shield, Cpu, HardDrive,
  Wifi, Cloud, Activity, RefreshCw, Zap
} from 'lucide-react'

interface ServiceStatus {
  name: string
  icon: any
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  latency: number
  uptime: number
  description: string
}

const initialServices: ServiceStatus[] = [
  { name: 'API Principal', icon: Globe, status: 'operational', latency: 45, uptime: 99.98, description: 'Endpoints REST' },
  { name: 'Banco de Dados', icon: Database, status: 'operational', latency: 12, uptime: 99.99, description: 'PostgreSQL' },
  { name: 'Autenticação', icon: Shield, status: 'operational', latency: 38, uptime: 99.97, description: 'Supabase Auth' },
  { name: 'Storage', icon: HardDrive, status: 'operational', latency: 62, uptime: 99.95, description: 'Arquivos e imagens' },
  { name: 'CDN', icon: Cloud, status: 'operational', latency: 8, uptime: 99.99, description: 'Assets estáticos' },
  { name: 'Webhooks', icon: Zap, status: 'degraded', latency: 180, uptime: 99.80, description: 'Eventos externos' },
  { name: 'Cache', icon: Cpu, status: 'operational', latency: 3, uptime: 99.99, description: 'Redis' },
  { name: 'Email', icon: Server, status: 'operational', latency: 250, uptime: 99.90, description: 'Transacional' },
  { name: 'Monitoramento', icon: Activity, status: 'maintenance', latency: 0, uptime: 99.70, description: 'Logs e métricas' },
]

const statusConfig: Record<string, { color: string; bg: string; label: string; pulse: string }> = {
  operational: { color: 'text-emerald-400', bg: 'bg-emerald-400', label: 'Operacional', pulse: '' },
  degraded: { color: 'text-amber-400', bg: 'bg-amber-400', label: 'Degradado', pulse: 'animate-pulse' },
  outage: { color: 'text-red-400', bg: 'bg-red-400', label: 'Fora do ar', pulse: 'animate-pulse' },
  maintenance: { color: 'text-blue-400', bg: 'bg-blue-400', label: 'Manutenção', pulse: '' },
}

export function InfrastructureMonitor() {
  const [services, setServices] = useState(initialServices)
  const [lastCheck, setLastCheck] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        latency: s.status === 'maintenance' ? 0 : s.latency + Math.round((Math.random() - 0.5) * 10),
      })))
      setLastCheck(new Date())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const operational = services.filter(s => s.status === 'operational').length
  const overallStatus = operational === services.length ? 'operational' :
    services.some(s => s.status === 'outage') ? 'outage' : 'degraded'

  const overall = statusConfig[overallStatus]

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
            <Server className="w-5 h-5 text-emerald-400" />
            Infraestrutura
          </h3>
          <p className="text-sm text-slate-500">
            <span className={`inline-flex items-center gap-1 ${overall.color}`}>
              <span className={`w-2 h-2 rounded-full ${overall.bg} ${overall.pulse}`} />
              {overall.label}
            </span>
            {' · '}{operational}/{services.length} serviços
          </p>
        </div>
        <button
          onClick={() => { setServices([...initialServices]); setLastCheck(new Date()) }}
          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {services.map((service, i) => {
          const sc = statusConfig[service.status]
          const Icon = service.icon
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${sc.bg} ${sc.pulse} shrink-0`} />
              <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{service.name}</span>
                  <span className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</span>
                </div>
                <p className="text-[10px] text-slate-600">{service.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono text-slate-400">
                  {service.latency > 0 ? `${service.latency}ms` : '—'}
                </p>
                <p className="text-[10px] text-slate-600">{service.uptime}%</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-slate-600">
          Última verificação: {lastCheck.toLocaleTimeString('pt-BR')}
        </p>
        <p className="text-[10px] text-slate-600">Uptime geral: 99.93%</p>
      </div>
    </motion.div>
  )
}
