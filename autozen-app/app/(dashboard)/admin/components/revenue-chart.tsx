'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import type { CommandCenterData } from './command-center'

type Period = '7d' | '30d' | '90d' | '12m'

export function RevenueChart({ data }: { data: CommandCenterData }) {
  const [period, setPeriod] = useState<Period>('30d')
  const [hovered, setHovered] = useState<number | null>(null)

  const chartData = useMemo(() => {
    const revenues = data.financials.filter(f => f.type === 'revenue').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const now = Date.now()
    const ranges: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90, '12m': 365 }
    const days = ranges[period]
    const cutoff = new Date(now - days * 86400000)
    const filtered = revenues.filter(r => new Date(r.date) >= cutoff)

    const grouped: Record<string, number> = {}
    filtered.forEach(r => {
      const key = r.date.slice(0, 10)
      grouped[key] = (grouped[key] || 0) + r.amount
    })

    const result: { date: string; revenue: number; label: string }[] = []
    const start = new Date(now - days * 86400000)
    for (let d = new Date(start); d <= new Date(); d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10)
      const rev = grouped[key] || 0
      const day = d.getDate()
      const month = d.toLocaleDateString('pt-BR', { month: 'short' })
      result.push({
        date: key,
        revenue: rev,
        label: period === '7d' ? d.toLocaleDateString('pt-BR', { weekday: 'short' }) :
               period === '30d' ? `${day} ${month}` :
               period === '90d' ? `${day} ${month}` : month,
      })
    }
    return result
  }, [data, period])

  const totalInPeriod = chartData.reduce((a, d) => a + d.revenue, 0)
  const prevPeriod = useMemo(() => {
    const revenues = data.financials.filter(f => f.type === 'revenue')
    const days = { '7d': 7, '30d': 30, '90d': 90, '12m': 365 }[period]
    const cutoff = new Date(Date.now() - days * 86400000 * 2)
    const endPrev = new Date(Date.now() - days * 86400000)
    return revenues
      .filter(r => new Date(r.date) >= cutoff && new Date(r.date) < endPrev)
      .reduce((a, r) => a + r.amount, 0)
  }, [data, period])
  const change = prevPeriod > 0 ? ((totalInPeriod - prevPeriod) / prevPeriod) * 100 : 0

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' },
    { key: '12m', label: '12M' },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-slate-900/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-lg font-bold text-white font-mono">
          R$ {(payload[0].value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 overflow-hidden"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 border border-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Receita em Tempo Real</h2>
                <p className="text-xs text-slate-500">Faturamento diário consolidado</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
            {periods.map(p => (
              <button key={p.key} onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  period === p.key ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline gap-4">
          <div>
            <p className="text-3xl font-bold text-white font-mono tracking-tight">
              R$ {(totalInPeriod / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-600">vs período anterior</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} onMouseMove={(e) => {
              if (typeof e.activeTooltipIndex === 'number') setHovered(e.activeTooltipIndex)
            }} onMouseLeave={() => setHovered(null)}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(v: number) => `R$${(v / 100).toFixed(0)}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
