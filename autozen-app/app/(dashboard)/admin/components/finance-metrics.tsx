'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, DollarSign, CreditCard, Users, Target, BarChart3, Percent } from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface Metric {
  label: string
  value: string
  change?: number
  icon: any
  color: keyof typeof colorMap
  format?: 'currency' | 'percent' | 'number'
}

const colorMap = {
  emerald: { icon: 'text-emerald-400', value: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  blue: { icon: 'text-blue-400', value: 'text-blue-400', bg: 'bg-blue-500/10' },
  violet: { icon: 'text-violet-400', value: 'text-violet-400', bg: 'bg-violet-500/10' },
  amber: { icon: 'text-amber-400', value: 'text-amber-400', bg: 'bg-amber-500/10' },
  red: { icon: 'text-red-400', value: 'text-red-400', bg: 'bg-red-500/10' },
  cyan: { icon: 'text-cyan-400', value: 'text-cyan-400', bg: 'bg-cyan-500/10' },
}

function formatCurrency(value: number): string {
  return `R$ ${(value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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

    const activeCount = data.companies.filter(c => c.active && !c.blocked).length || 1
    const totalCompanies = data.companies.length || 1
    const newThisMonth = data.companies.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 86400000)).length

    const churnCount = data.companies.filter(c => !c.active && c.updated_at && new Date(c.updated_at) > new Date(Date.now() - 30 * 86400000)).length
    const churnRate = (churnCount / activeCount) * 100
    const ltv = totalRev / activeCount
    const cac = (totalExp * 0.3) / Math.max(newThisMonth, 1)
    const ticketMedio = mrr / activeCount
    const conversionRate = totalCompanies > 0 ? (activeCount / totalCompanies) * 100 : 0
    const margemLiquida = totalRev > 0 ? ((totalRev - totalExp) / totalRev) * 100 : 0

    return [
      { label: 'MRR', value: formatCurrency(mrr), change: mrrPrev > 0 ? ((mrr - mrrPrev) / mrrPrev) * 100 : 0, icon: DollarSign, color: 'emerald' as const, format: 'currency' as const },
      { label: 'ARR', value: formatCurrency(mrr * 12), icon: CreditCard, color: 'blue' as const, format: 'currency' as const },
      { label: 'LTV Médio', value: formatCurrency(ltv), icon: Target, color: 'violet' as const, format: 'currency' as const },
      { label: 'CAC', value: formatCurrency(cac), icon: Users, color: 'amber' as const, format: 'currency' as const },
      { label: 'Churn Rate', value: `${churnRate.toFixed(1)}%`, change: churnRate, icon: TrendingDown, color: 'red' as const, format: 'percent' as const },
      { label: 'Margem Líquida', value: `${margemLiquida.toFixed(1)}%`, icon: BarChart3, color: 'cyan' as const, format: 'percent' as const },
      { label: 'Ticket Médio', value: formatCurrency(ticketMedio), icon: CreditCard, color: 'violet' as const, format: 'currency' as const },
      { label: 'Taxa de Conversão', value: `${conversionRate.toFixed(1)}%`, icon: Percent, color: 'emerald' as const, format: 'percent' as const },
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, i) => {
          const c = colorMap[m.color]
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{m.label}</span>
                <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <m.icon className={`w-3.5 h-3.5 ${c.icon}`} />
                </div>
              </div>
              <p className={`text-lg font-bold text-white font-mono tracking-tight`}>
                {m.value}
              </p>
              {m.change !== undefined && m.change !== 0 && (
                <div className="flex items-center gap-1">
                  <TrendingDown className={`w-3 h-3 ${m.change > 0 ? 'text-emerald-400 rotate-180' : 'text-red-400'}`} />
                  <span className={`text-xs font-medium ${m.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Math.abs(m.change).toFixed(1)}%
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
