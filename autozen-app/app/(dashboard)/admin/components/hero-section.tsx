'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Activity, MapPin, Users, TrendingUp, Bell, Zap } from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface HeroSectionProps {
  data: CommandCenterData
  profile: { name?: string; role?: string } | null
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const activeCompanies = (d: CommandCenterData) => d.companies.filter(c => c.active && !c.blocked).length
const onlineUsers = (d: CommandCenterData) => d.profiles.filter(p => {
  if (!p.last_sign_in) return false
  const diff = Date.now() - new Date(p.last_sign_in).getTime()
  return diff < 300_000
}).length

const totalRevenue = (d: CommandCenterData) =>
  d.financials.filter(f => f.type === 'revenue').reduce((a, f) => a + f.amount, 0)

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])
  return <span className="font-mono text-xs text-slate-500">{time}</span>
}

export function HeroSection({ data, profile }: HeroSectionProps) {
  const openTickets = data.tickets.filter(t => t.status === 'open').length
  const trials = data.companies.filter(c => c.trial_end && new Date(c.trial_end) > new Date()).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-950/40"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full" />

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {getGreeting()}, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{profile?.name ?? 'Admin'}</span> 👋
                </h1>
                <p className="text-sm text-slate-500">AutoZen Command Center — Gestão global da plataforma</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatBadge icon={TrendingUp} value={`R$ ${(totalRevenue(data) / 100).toFixed(1)}k`} label="Receita" color="emerald" />
            <StatBadge icon={Users} value={String(activeCompanies(data))} label="Empresas" color="blue" />
            <StatBadge icon={Activity} value={String(onlineUsers(data))} label="Online" color="cyan" />
            <StatBadge icon={Bell} value={String(openTickets)} label="Alertas" color={openTickets > 0 ? 'amber' : 'slate'} />
            <StatBadge icon={Zap} value={String(trials)} label="Trials" color="violet" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <QuickStat label="Total empresas" value={String(data.companies.length)} />
            <QuickStat label="Planos ativos" value={String(data.plans.filter(p => p.active).length)} />
            <QuickStat label="Auditoria (7d)" value={String(data.auditLogs.filter(a => {
              const diff = Date.now() - new Date(a.created_at).getTime()
              return diff < 604_800_000
            }).length)} />
            <QuickStat label="Financeiro" value={`${data.financials.length} registros`} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <LiveClock />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function StatBadge({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colors[color] || colors.slate}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs opacity-60 hidden sm:inline">{label}</span>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
      <p className="text-[10px] text-slate-600">{label}</p>
      <p className="text-xs font-semibold text-slate-400">{value}</p>
    </div>
  )
}
