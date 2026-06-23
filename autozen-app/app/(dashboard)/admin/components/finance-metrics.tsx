'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, TrendingUp, TrendingDown, Users, CreditCard,
  BarChart3, PieChart, Activity, Target, Zap
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

export function FinanceMetrics({ data }: { data: CommandCenterData }) {
  const metrics = useMemo(() => {
    const revenue = data.financials.filter(f => f.type === 'revenue')
    const expenses = data.financials.filter(f => f.type === 'expense')
    const totalRevenue = revenue.reduce((a, f) => a + f.amount, 0)
    const totalExpenses = expenses.reduce((a, f) => a + f.amount, 0)
    const activeCompanies = data.companies.filter(c => c.active && !c.blocked).length || 1
    const monthlyRevenue = revenue
      .filter(f => new Date(f.date) > new Date(Date.now() - 30 * 86400000))
      .reduce((a, f) => a + f.amount, 0)
    const last30DaysCompanies = data.companies.filter(c =>
      new Date(c.created_at) > new Date(Date.now() - 30 * 86400000)
    ).length
    const avgTicket = monthlyRevenue / (activeCompanies || 1)
    const churnRate = data.companies.filter(c => !c.active || c.blocked).length / (data.companies.length || 1) * 100
    const ltv = avgTicket * 12 * (1 - churnRate / 100)
    const cac = totalExpenses / (last30DaysCompanies || 1)
    const conversionRate = last30DaysCompanies / (data.profiles.length || 1) * 100

    return {
      mrr: monthlyRevenue,
      arr: monthlyRevenue * 12,
      ltv,
      cac,
      churnRate,
      avgTicket,
      conversionRate,
      totalRevenue,
      totalExpenses,
      profit: totalRevenue - totalExpenses,
      activeCompanies,
    }
  }, [data])

  const saasMetrics = [
    { label: 'MRR', value: `R$ ${(metrics.mrr / 100).toFixed(0)}`, icon: DollarSign, color: 'emerald', trend: '+18%', desc: 'Receita Mensal Recorrente' },
    { label: 'ARR', value: `R$ ${(metrics.arr / 100).toFixed(0)}`, icon: TrendingUp, color: 'blue', trend: '+24%', desc: 'Receita Anual Projetada' },
    { label: 'LTV', value: `R$ ${(metrics.ltv / 100).toFixed(0)}`, icon: Target, color: 'violet', desc: 'Lifetime Value por cliente' },
    { label: 'CAC', value: `R$ ${(metrics.cac / 100).toFixed(0)}`, icon: Users, color: 'cyan', desc: 'Custo de Aquisição' },
    { label: 'Churn', value: `${metrics.churnRate.toFixed(1)}%`, icon: TrendingDown, color: 'red', desc: 'Taxa de cancelamento' },
    { label: 'Ticket Médio', value: `R$ ${(metrics.avgTicket / 100).toFixed(0)}`, icon: CreditCard, color: 'amber', desc: 'Receita por empresa' },
    { label: 'Conversão', value: `${metrics.conversionRate.toFixed(1)}%`, icon: Zap, color: 'emerald', desc: 'Perfis / Total empresas' },
    { label: 'Lucro', value: `R$ ${(metrics.profit / 100).toFixed(0)}`, icon: BarChart3, color: metrics.profit >= 0 ? 'emerald' : 'red', desc: 'Receita - Despesas' },
  ]

  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        Métricas Financeiras SaaS
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {saasMetrics.map((m, i) => {
          const Icon = m.icon
          const colorClass = colorClasses[m.color] || colorClasses.blue
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={`p-3 rounded-xl border ${colorClass}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider opacity-70">{m.label}</span>
              </div>
              <p className="text-lg font-bold">{m.value}</p>
              {m.trend && (
                <span className="text-[10px] font-medium text-emerald-400">{m.trend}</span>
              )}
              <p className="text-[10px] opacity-50 mt-1">{m.desc}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="grid grid-cols-3 gap-3">
          <MiniBar label="Receitas" value={metrics.totalRevenue} max={metrics.totalRevenue + metrics.totalExpenses} color="emerald" />
          <MiniBar label="Despesas" value={metrics.totalExpenses} max={metrics.totalRevenue + metrics.totalExpenses} color="red" />
          <MiniBar label="Lucro" value={Math.max(0, metrics.profit)} max={metrics.totalRevenue + metrics.totalExpenses} color={metrics.profit >= 0 ? 'blue' : 'red'} />
        </div>
      </div>
    </motion.div>
  )
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500', red: 'bg-red-500', blue: 'bg-blue-500',
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-slate-500">{label}</span>
        <span className="text-[10px] text-slate-400">R$ {(value / 100).toFixed(0)}</span>
      </div>
      <div className="w-full bg-white/[0.05] rounded-full h-1.5">
        <div className={`h-full rounded-full ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
