'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, DollarSign, Users, Activity,
  UserPlus, AlertTriangle, Clock
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
  const growth = data.companies.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 86400000)).length

  const dailyRev = (days: number) => {
    const revs = data.financials.filter(f => f.type === 'revenue')
    const result: number[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      result.push(revs.filter(r => r.date.slice(0, 10) === d).reduce((a, r) => a + r.amount, 0))
    }
    return result
  }
  const sparkRev = dailyRev(14)

  const dailyActive = (days: number) => {
    const result: number[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      result.push(data.companies.filter(c => c.active && !c.blocked && new Date(c.created_at) <= d).length)
    }
    return result
  }
  const sparkActive = dailyActive(14)

  const sparkTrials = (() => {
    const result: number[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      result.push(data.companies.filter(c => c.trial_end && new Date(c.trial_end) > d && new Date(c.trial_end) < new Date(d.getTime() + 86400000)).length)
    }
    return result
  })()

  const cards: CardDef[] = [
    { title: 'Receita Mensal', value: monthly, prefix: 'R$', icon: DollarSign, color: 'emerald', format: 'currency', subtitle: 'últimos 30 dias', sparkline: sparkRev.slice(-7) },
    { title: 'Receita Anual', value: annual, prefix: 'R$', icon: TrendingUp, color: 'blue', format: 'currency', subtitle: 'total acumulado', sparkline: sparkRev },
    { title: 'Empresas Ativas', value: data.companies.filter(c => c.active && !c.blocked).length, icon: Activity, color: 'cyan', format: 'number', subtitle: 'em operação', sparkline: sparkActive },
    { title: 'Usuários na Plataforma', value: data.profiles.filter(p => p.last_sign_in && Date.now() - new Date(p.last_sign_in).getTime() < 300_000).length, icon: Users, color: 'violet', format: 'number', subtitle: 'agora', sparkline: [] },
    { title: 'Trial Ativos', value: trials, icon: UserPlus, color: 'amber', format: 'number', subtitle: 'em período de teste', sparkline: sparkTrials },
    { title: 'Inadimplentes', value: delinquents, icon: AlertTriangle, color: 'red', format: 'number', subtitle: 'com assinatura vencida', sparkline: [] },
    { title: 'Novas Empresas', value: growth, icon: Clock, color: 'slate', format: 'number', subtitle: 'últimos 30 dias', sparkline: [] },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {cards.map((card, i) => {
        const c = colorMap[card.color]
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 group cursor-default hover:border-white/10 transition-all duration-300"
          >
            <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full ${c.glow} blur-xl group-hover:blur-2xl transition-all duration-500`} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_right,${c.spark}15,transparent_60%)]" />
            <div className="relative p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg ${c.icon} flex items-center justify-center`}>
                  <card.icon className="w-4 h-4" />
                </div>
                {card.sparkline.length > 1 && (
                  <SparklineSVG data={card.sparkline} color={c.spark} />
                )}
              </div>
              <div>
                <p className={`text-base lg:text-lg font-bold text-white tracking-tight ${card.prefix === 'R$' ? 'font-mono' : ''}`}>
                  <AnimatedNumber value={card.value} prefix={card.prefix} suffix={card.suffix} />
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{card.title}</p>
                <p className="text-[10px] text-slate-600 mt-px">{card.subtitle}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
