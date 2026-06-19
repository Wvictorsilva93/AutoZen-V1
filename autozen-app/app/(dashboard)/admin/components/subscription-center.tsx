'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Crown, Star, Zap, Shield, TrendingUp, Users,
  DollarSign, PieChart
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

const colorStyles = {
  slate: { bg: 'bg-slate-500/20', border: 'border-slate-500/20', text: 'text-slate-400', bar: 'bg-slate-500' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-500' },
  violet: { bg: 'bg-violet-500/20', border: 'border-violet-500/20', text: 'text-violet-400', bar: 'bg-violet-500' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/20', text: 'text-amber-400', bar: 'bg-amber-500' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/20', text: 'text-cyan-400', bar: 'bg-cyan-500' },
}

function PlanCard({ name, slug, icon: Icon, color, count, total, revenue }: {
  name: string; slug: string; icon: any; color: keyof typeof colorStyles; count: number; total: number; revenue: number
}) {
  const c = colorStyles[color]
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-4 group hover:border-white/10 transition-all duration-300">
      <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-white/5 blur-xl group-hover:blur-2xl transition-all duration-500" />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.border} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${c.text}`} />
          </div>
          <span className={`text-xs font-medium ${c.text}`}>{pct.toFixed(1)}%</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-slate-500 mt-0.5 capitalize">{slug}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Empresas</span>
            <span className="text-white font-medium">{count}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Receita</span>
            <span className="text-white font-mono font-medium">R$ {(revenue / 100).toFixed(2)}</span>
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full ${c.bar}`}
          />
        </div>
      </div>
    </div>
  )
}

export function SubscriptionCenter({ data }: { data: CommandCenterData }) {
  const { planStats, total, totalRevenue } = useMemo(() => {
    const companies = data.companies.filter(c => c.active && !c.blocked)
    const total = companies.length || 1
    const plans: Record<string, { count: number; revenue: number }> = {}
    for (const c of companies) {
      const p = c.plan || 'sem_plano'
      if (!plans[p]) plans[p] = { count: 0, revenue: 0 }
      plans[p].count++
    }
    const plansConfig = data.plans
    const planStats = plansConfig.map(p => ({
      name: p.name,
      slug: p.slug,
      count: plans[p.slug]?.count || 0,
      revenue: (plans[p.slug]?.count || 0) * p.price,
    }))
    const semPlano = plans['sem_plano']
    if (semPlano) {
      planStats.push({ name: 'Sem Plano', slug: 'sem_plano', count: semPlano.count, revenue: 0 })
    }
    const totalRevenue = planStats.reduce((a, p) => a + p.revenue, 0)
    return { planStats, total, totalRevenue }
  }, [data])

  const planColors: Record<string, keyof typeof colorStyles> = {
    basic: 'slate', pro: 'blue', premium: 'violet', enterprise: 'amber',
  }

  const planIcons: Record<string, any> = {
    basic: Zap, pro: Star, premium: Crown, enterprise: Shield,
  }

  const summaryCards = [
    { label: 'Total de Assinaturas', value: total, icon: Users, color: 'blue' as const },
    { label: 'Receita Recorrente', value: `R$ ${(totalRevenue / 100).toFixed(2)}`, icon: DollarSign, color: 'emerald' as const },
    { label: 'Ticket Médio', value: `R$ ${((totalRevenue / total) / 100).toFixed(2)}`, icon: TrendingUp, color: 'violet' as const },
    { label: 'Planos Ativos', value: planStats.filter(p => p.count > 0).length, icon: PieChart, color: 'cyan' as const },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 overflow-hidden"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600/20 to-violet-600/5 border border-violet-500/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Centro de Assinaturas</h2>
            <p className="text-xs text-slate-500">Distribuição de planos e receitas</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <card.icon className="w-3.5 h-3.5 text-slate-500" />
                <p className="text-[10px] uppercase tracking-wider text-slate-600">{card.label}</p>
              </div>
              <p className="text-lg font-bold text-white font-mono">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {planStats.map((plan, i) => {
            const slug = plan.slug as keyof typeof planColors
            const color = planColors[slug] || 'slate'
            const icon = planIcons[slug] || Users
            return (
              <motion.div
                key={plan.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <PlanCard
                  name={plan.name}
                  slug={plan.slug}
                  icon={icon}
                  color={color}
                  count={plan.count}
                  total={total}
                  revenue={plan.revenue}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
