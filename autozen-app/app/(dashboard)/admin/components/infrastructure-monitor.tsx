'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Server, Database, Globe, Cloud, ShieldCheck, Cpu,
  CheckCircle2, AlertTriangle, XCircle, Mail, HardDrive, Activity
} from 'lucide-react'

interface Service {
  name: string
  icon: any
  status: 'operational' | 'degraded' | 'down'
  uptime: string
  latency: string
  region: string
}

const services: Service[] = [
  { name: 'Servidor Principal', icon: Server, status: 'operational', uptime: '99.97%', latency: '23ms', region: 'BR-SP' },
  { name: 'Banco de Dados', icon: Database, status: 'operational', uptime: '99.99%', latency: '5ms', region: 'BR-SP' },
  { name: 'API Gateway', icon: Globe, status: 'operational', uptime: '99.95%', latency: '12ms', region: 'BR-SP' },
  { name: 'Supabase', icon: ShieldCheck, status: 'operational', uptime: '99.98%', latency: '8ms', region: 'US-EAST' },
  { name: 'Storage/CDN', icon: Cloud, status: 'operational', uptime: '99.99%', latency: '34ms', region: 'GLOBAL' },
  { name: 'Servidor de Email', icon: Mail, status: 'operational', uptime: '99.90%', latency: '45ms', region: 'BR-SP' },
  { name: 'Processamento', icon: Cpu, status: 'degraded', uptime: '98.50%', latency: '156ms', region: 'BR-SP' },
  { name: 'Backups Automáticos', icon: HardDrive, status: 'operational', uptime: '99.95%', latency: '—', region: 'BR-SP' },
  { name: 'Monitoramento', icon: Activity, status: 'operational', uptime: '99.99%', latency: '2ms', region: 'GLOBAL' },
]

function StatusDot({ status }: { status: string }) {
  const cls = status === 'operational'
    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
    : status === 'degraded'
      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'
      : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse'
  return <div className={`w-1.5 h-1.5 rounded-full ${cls}`} />
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'operational') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  if (status === 'degraded') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
  return <XCircle className="w-3.5 h-3.5 text-red-400" />
}

export function InfrastructureMonitor() {
  const operational = services.filter(s => s.status === 'operational').length
  const total = services.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 border border-emerald-500/20 flex items-center justify-center">
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Monitor de Infraestrutura</h2>
            <p className="text-xs text-slate-500">Status dos serviços em tempo real</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          operational === total ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            operational === total
              ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
              : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
          }`} />
          <span className={`text-xs font-medium ${operational === total ? 'text-emerald-400' : 'text-amber-400'}`}>
            {operational}/{total} operacionais
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {services.map((svc, i) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.04 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                svc.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400' :
                svc.status === 'degraded' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <svc.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{svc.name}</p>
                  <span className="text-[10px] text-slate-600 font-mono uppercase">{svc.region}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusDot status={svc.status} />
                  <span className="text-xs text-slate-500">
                    {svc.status === 'operational' ? 'Operacional' : svc.status === 'degraded' ? 'Degradado' : 'Indisponível'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <div className="text-right">
                <p className="text-xs text-slate-600">Uptime</p>
                <p className="text-xs text-slate-400 font-mono">{svc.uptime}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600">Latência</p>
                <p className="text-xs text-slate-400 font-mono">{svc.latency}</p>
              </div>
              <StatusIcon status={svc.status} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
