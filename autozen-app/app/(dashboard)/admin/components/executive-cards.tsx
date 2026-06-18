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
  emerald: {
    bg: 'from-emerald-600/20 to-emerald-600/5', border: 'border-emerald-500/20',
    icon: 'bg-emerald-500/20 text-emerald-400', text: 'text-emerald-400',
    glow: 'bg-emerald-500/10',
  },
  blue: {
    bg: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20',
    icon: 'bg-blue-500/20 text-blue-400', text: 'text-blue-400',
    glow: 'bg-blue-500/10',
  },
  violet: {
    bg: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20',
    icon: 'bg-violet-500/20 text-violet-400', text: 'text-violet-400',
    glow: 'bg-violet-500/10',
  },
  amber: {
    bg: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20',
    icon: 'bg-amber-500/20 text-amber-400', text: 'text-amber-400',
    glow: 'bg-amber-500/10',
  },
  cyan: {
    bg: 'from-cyan-600/20 to-cyan-600/5', border: 'border-cyan-500/20',
    icon: 'bg-cyan-500/20 text-cyan-400', text: 'text-cyan-400',
    glow: 'bg-cyan-500/10',
  },
  red: {
    bg: 'from-red-600/20 to-red-600/5', border: 'border-red-500/20',
    icon: 'bg-red-500/20 text-red-400', text: 'text-red-400',
    glow: 'bg-red-500/10',
  },
  slate: {
    bg: 'from-slate-600/20 to-slate-600/5', border: 'border-slate-500/20',
    icon: 'bg-slate-500/20 text-slate-400', text: 'text-slate-400',
    glow: 'bg-slate-500/10',
  },
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

  const cards: CardDef[] = [
    { title: 'Receita Mensal', value: monthly, prefix: 'R$', icon: DollarSign, color: 'emerald', format: 'currency', subtitle: 'últimos 30 dias' },
    { title: 'Receita Anual', value: annual, prefix: 'R$', icon: TrendingUp, color: 'blue', format: 'currency', subtitle: 'total acumulado' },
    { title: 'Empresas Ativas', value: data.companies.filter(c => c.active && !c.blocked).length, icon: Activity, color: 'cyan', format: 'number', subtitle: 'em operação' },
    { title: 'Usuários na Plataforma', value: data.profiles.filter(p => p.last_sign_in && Date.now() - new Date(p.last_sign_in).getTime() < 300_000).length, icon: Users, color: 'violet', format: 'number', subtitle: 'agora' },
    { title: 'Trial Ativos', value: trials, icon: UserPlus, color: 'amber', format: 'number', subtitle: 'em período de teste' },
    { title: 'Inadimplentes', value: delinquents, icon: AlertTriangle, color: 'red', format: 'number', subtitle: 'com assinatura vencida' },
    { title: 'Novas Empresas', value: growth, icon: Clock, color: 'slate', format: 'number', subtitle: 'últimos 30 dias' },
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
            className={`relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} group cursor-default`}
          >
            <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full ${c.glow} blur-xl group-hover:blur-2xl transition-all duration-500`} />
            <div className="relative p-4 space-y-2">
              <div className={`w-8 h-8 rounded-lg ${c.icon} flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-base lg:text-lg font-bold text-white tracking-tight ${card.prefix === 'R$' ? 'font-mono' : ''}`}>
                  <AnimatedNumber value={card.value} prefix={card.prefix} suffix={card.suffix} />
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{card.title}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
