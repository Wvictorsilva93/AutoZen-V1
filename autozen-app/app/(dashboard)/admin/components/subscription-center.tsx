'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Check, Star, Zap, Crown, Building2 } from 'lucide-react'
import type { CommandCenterData } from './command-center'

export function SubscriptionCenter({ data }: { data: CommandCenterData }) {
  const planColors: Record<string, { gradient: string; border: string; icon: string; badge: string }> = {
    basico: { gradient: 'from-slate-600/20 to-slate-600/5', border: 'border-slate-500/20', icon: 'text-slate-400', badge: 'bg-slate-500/20 text-slate-400' },
    professional: { gradient: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', icon: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400' },
    premium: { gradient: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20', icon: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-400' },
    enterprise: { gradient: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20', icon: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' },
  }

  const defaultColors: { gradient: string; border: string; icon: string; badge: string } = {
    gradient: 'from-cyan-600/20 to-cyan-600/5', border: 'border-cyan-500/20', icon: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-400',
  }

  const planIcons: Record<string, any> = {
    basico: Star, professional: Zap, premium: Crown, enterprise: Building2,
  }

  const planStats = useMemo(() => {
    return data.plans.map(plan => ({
      ...plan,
      companyCount: data.companies.filter(c =>
        (c.plan === plan.slug || c.plan === plan.name) && c.active && !c.blocked
      ).length,
    })).sort((a, b) => b.companyCount - a.companyCount)
  }, [data.plans, data.companies])

  const totalCompanies = data.companies.filter(c => c.active && !c.blocked).length || 1

  const donutData = planStats.map((p, i) => ({
    name: p.name,
    value: p.companyCount,
    percentage: Math.round((p.companyCount / totalCompanies) * 100),
    colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#64748b'],
  }))

  const donutSegments = donutData.reduce<{ start: number; end: number; color: string }[]>((acc, d, i) => {
    const start = i === 0 ? 0 : acc[i - 1].end
    const end = start + (d.percentage / 100) * 360
    acc.push({ start, end, color: d.colors[i % d.colors.length] })
    return acc
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
        <CreditCard className="w-5 h-5 text-violet-400" />
        Central de Assinaturas
      </h3>

      <div className="flex items-center justify-center mb-5">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {donutSegments.map((seg, i) => {
              const r = 38
              const circ = 2 * Math.PI * r
              const dash = ((seg.end - seg.start) / 360) * circ
              const offset = (seg.start / 360) * circ
              return (
                <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={seg.color} strokeWidth="8"
                  strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
                  className="transition-all duration-700" opacity={0.85} />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-white">{totalCompanies}</p>
            <p className="text-[9px] text-slate-500">empresas</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {planStats.map((plan, i) => {
          const colors = planColors[plan.slug] || defaultColors
          const Icon = planIcons[plan.slug] || Star
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-xl border ${colors.border} bg-gradient-to-r ${colors.gradient}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                  <span className="text-sm font-medium text-white">{plan.name}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                  {plan.companyCount} empresas
                </span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-1.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round((plan.companyCount / totalCompanies) * 100)}%`,
                    backgroundColor: donutData[i]?.colors[i % donutData[i].colors.length],
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-600">
                  R$ {(plan.price / 100).toFixed(2)}/mês
                </span>
                <span className="text-[10px] text-slate-600">
                  {Math.round((plan.companyCount / totalCompanies) * 100)}%
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
