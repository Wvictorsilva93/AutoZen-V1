'use client'

import { motion } from 'framer-motion'
import { Shield, Activity, MapPin, Users, TrendingUp, Bell } from 'lucide-react'
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

export function HeroSection({ data, profile }: HeroSectionProps) {
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
                  {getGreeting()}, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{profile?.name ?? 'Admin'}</span>
                </h1>
                <p className="text-sm text-slate-500">Command Center — super administrador</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <StatBadge icon={Activity} value={String(activeCompanies(data))} label="Empresas ativas" />
            <StatBadge icon={Users} value={String(onlineUsers(data))} label="Usuários online" />
            <StatBadge icon={TrendingUp} value={`R$ ${(totalRevenue(data) / 100).toFixed(1)}k`} label="Receita total" />
            <StatBadge icon={Bell} value={String(data.tickets.filter(t => t.status === 'open').length)} label="Tickets abertos" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickStat label="Total empresas" value={String(data.companies.length)} />
          <QuickStat label="Planos ativos" value={String(data.plans.filter(p => p.active).length)} />
          <QuickStat label="Auditoria (7d)" value={String(data.auditLogs.filter(a => {
            const diff = Date.now() - new Date(a.created_at).getTime()
            return diff < 604_800_000
          }).length)} />
          <QuickStat label="Financeiro" value={`${data.financials.length} registros`} />
        </div>
      </div>
    </motion.div>
  )
}

function StatBadge({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
      <Icon className="w-4 h-4 text-blue-400" />
      <span className="text-sm font-semibold text-white">{value}</span>
      <span className="text-xs text-slate-500 hidden sm:inline">{label}</span>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
      <p className="text-xs text-slate-600">{label}</p>
      <p className="text-sm font-semibold text-slate-300">{value}</p>
    </div>
  )
}
