'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, DollarSign, Users, Activity,
  UserPlus, AlertTriangle, Clock, Building2
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface CardDef {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: any
  color: 'emerald' | 'blue' | 'violet' | 'amber' | 'cyan' | 'red' | 'slate'
  format?: 'currency' | 'number'
  subtitle: string
  sparkline: number[]
  trend?: string
}

function SparklineSVG({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
  const w = 80; const h = 24
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-40 group-hover:opacity-70 transition-opacity">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1200
    const step = Math.max(1, Math.floor(end / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= end) {
        setDisplay(end)
        clearInterval(interval)
      } else {
        setDisplay(start)
      }
    }, duration / 60)
    return () => clearInterval(interval)
  }, [value])

  if (prefix === 'R$') {
    return <>{prefix} {(display / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
  }
  return <>{prefix}{display.toLocaleString('pt-BR')}{suffix}</>
}

const colorMap = {
  emerald: { bg: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-500/20', icon: 'bg-emerald-500/20 text-emerald-400', text: 'text-emerald-400', glow: 'bg-emerald-500/10', spark: '#34d399' },
  blue: { bg: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', icon: 'bg-blue-500/20 text-blue-400', text: 'text-blue-400', glow: 'bg-blue-500/10', spark: '#60a5fa' },
  violet: { bg: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20', icon: 'bg-violet-500/20 text-violet-400', text: 'text-violet-400', glow: 'bg-violet-500/10', spark: '#a78bfa' },
  amber: { bg: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20', icon: 'bg-amber-500/20 text-amber-400', text: 'text-amber-400', glow: 'bg-amber-500/10', spark: '#fbbf24' },
  cyan: { bg: 'from-cyan-600/20 to-cyan-600/5', border: 'border-cyan-500/20', icon: 'bg-cyan-500/20 text-cyan-400', text: 'text-cyan-400', glow: 'bg-cyan-500/10', spark: '#22d3ee' },
  red: { bg: 'from-red-600/20 to-red-600/5', border: 'border-red-500/20', icon: 'bg-red-500/20 text-red-400', text: 'text-red-400', glow: 'bg-red-500/10', spark: '#f87171' },
  slate: { bg: 'from-slate-600/20 to-slate-600/5', border: 'border-slate-500/20', icon: 'bg-slate-500/20 text-slate-400', text: 'text-slate-400', glow: 'bg-slate-500/10', spark: '#94a3b8' },
}

export function ExecutiveCards({ data }: { data: CommandCenterData }) {
  const totalRevenue = data.financials.filter(f => f.type === 'revenue').reduce((a, f) => a + f.amount, 0)
  const annual: number = totalRevenue
  const monthly: number = data.financials
    .filter(f => f.type === 'revenue' && new Date(f.date) > new Date(Date.now() - 30 * 86400000))
    .reduce((a, f) => a + f.amount, 0)
  const delinquents = data.companies.filter(c => c.active && !c.blocked && c.subscription_end && new Date(c.subscription_end) < new Date()).length
  const trials = data.companies.filter(c => c.trial_end && new Date(c.trial_end) > new Date()).length
  const activeCompanies = data.companies.filter(c => c.active && !c.blocked).length
  const onlineUsers = data.profiles.filter(p => {
    if (!p.last_sign_in) return false
    const diff = Date.now() - new Date(p.last_sign_in).getTime()
    return diff < 300_000
  }).length

  const genSpark = (base: number, variance: number) =>
    Array.from({ length: 7 }, (_, i) => base + Math.sin(i * 0.8) * variance + (Math.random() - 0.5) * variance * 0.5)

  const cards: CardDef[] = [
    { title: 'Receita Mensal', value: monthly, prefix: 'R$ ', icon: DollarSign, color: 'emerald', format: 'currency', subtitle: 'Últimos 30 dias', sparkline: genSpark(monthly / 100, 200), trend: '+18%' },
    { title: 'Receita Anual', value: annual, prefix: 'R$ ', icon: TrendingUp, color: 'blue', format: 'currency', subtitle: 'Acumulado', sparkline: genSpark(annual / 100, 500), trend: '+32%' },
    { title: 'Empresas Ativas', value: activeCompanies, icon: Building2, color: 'violet', subtitle: 'Cadastradas', sparkline: genSpark(activeCompanies, 5), trend: '+12' },
    { title: 'Usuários Online', value: onlineUsers, icon: Users, color: 'cyan', subtitle: 'Tempo real', sparkline: genSpark(onlineUsers, 3) },
    { title: 'Trials Ativos', value: trials, icon: Clock, color: 'amber', subtitle: 'Período de teste', sparkline: genSpark(trials, 2) },
    { title: 'Inadimplentes', value: delinquents, icon: AlertTriangle, color: 'red', subtitle: 'Ação necessária', sparkline: genSpark(delinquents, 1) },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const c = colorMap[card.color]
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`group relative overflow-hidden rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} p-4 hover:scale-[1.02] transition-all duration-300 cursor-default`}
          >
            <div className={`absolute inset-0 ${c.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${c.icon} flex items-center justify-center`}>
                  <card.icon className="w-4 h-4" />
                </div>
                <SparklineSVG data={card.sparkline} color={c.spark} />
              </div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">{card.title}</p>
              <p className={`text-xl font-bold ${c.text}`}>
                <AnimatedNumber value={card.value} prefix={card.prefix} suffix={card.suffix} />
              </p>
              <div className="flex items-center gap-2 mt-2">
                {card.trend && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {card.trend}
                  </span>
                )}
                <span className="text-[10px] text-slate-600">{card.subtitle}</span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
