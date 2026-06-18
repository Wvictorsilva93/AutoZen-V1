'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, Target, BarChart3 } from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface Metric {
  label: string
  value: string
  change: number
  icon: any
  color: string
  format?: 'currency' | 'percent'
}

export function FinanceMetrics({ data }: { data: CommandCenterData }) {
  const metrics = useMemo((): Metric[] => {
    const revenues = data.financials.filter(f => f.type === 'revenue')
    const expenses = data.financials.filter(f => f.type === 'expense')
    const totalRev = revenues.reduce((a, f) => a + f.amount, 0)
    const totalExp = expenses.reduce((a, f) => a + f.amount, 0)

    const mrr = revenues.filter(r => new Date(r.date) > new Date(Date.now() - 30 * 86400000)).reduce((a, r) => a + r.amount, 0)
    const mrrPrev = revenues.filter(r => {
      const d = new Date(r.date)
      return d > new Date(Date.now() - 60 * 86400000) && d <= new Date(Date.now() - 30 * 86400000)
    }).reduce((a, r) => a + r.amount, 0)

    const activeCount = data.companies.filter(c => c.active && !c.blocked).length
    const newThisMonth = data.companies.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 86400000)).length

    const churnCount = data.companies.filter(c => !c.active && c.updated_at && new Date(c.updated_at) > new Date(Date.now() - 30 * 86400000)).length
    const churnRate = activeCount > 0 ? (churnCount / activeCount) * 100 : 0

    return [
      { label: 'MRR', value: String(mrr), change: mrrPrev > 0 ? ((mrr - mrrPrev) / mrrPrev) * 100 : 0, icon: DollarSign, color: 'emerald', format: 'currency' },
      { label: 'ARR', value: String(mrr * 12), change: 0, icon: CreditCard, color: 'blue', format: 'currency' },
      { label: 'LTV Médio', value: String(totalRev > 0 && activeCount > 0 ? totalRev / activeCount : 0), change: 0, icon: Target, color: 'violet', format: 'currency' },
      { label: 'CAC Estimado', value: String((totalExp * 0.3) / Math.max(newThisMonth, 1)), change: 0, icon: Users, color: 'amber', format: 'currency' },
      { label: 'Churn Rate', value: churnRate.toFixed(1), change: 0, icon: TrendingDown, color: 'red', format: 'percent' },
      { label: 'Margem Líquida', value: totalRev > 0 ? (((totalRev - totalExp) / totalRev) * 100).toFixed(1) : '0', change: 0, icon: BarChart3, color: 'cyan', format: 'percent' },
    ]
  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 border border-emerald-500/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Finance Center</h2>
          <p className="text-xs text-slate-500">Métricas de negócio em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <div key={m.label}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{m.label}</span>
              <m.icon className={`w-4 h-4 ${
                m.color === 'emerald' ? 'text-emerald-400' : m.color === 'blue' ? 'text-blue-400' :
                m.color === 'violet' ? 'text-violet-400' : m.color === 'amber' ? 'text-amber-400' :
                m.color === 'red' ? 'text-red-400' : 'text-cyan-400'
              }`} />
            </div>
            <p className={`text-xl font-bold text-white font-mono tracking-tight ${
              m.format === 'currency' ? '' : ''
            }`}>
              {m.format === 'currency'
                ? `R$ ${(Number(m.value) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : m.format === 'percent' ? `${m.value}%` : m.value}
            </p>
            {m.change !== 0 && (
              <div className="flex items-center gap-1">
                {m.change > 0 ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                <span className={`text-xs font-medium ${m.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {Math.abs(m.change).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
