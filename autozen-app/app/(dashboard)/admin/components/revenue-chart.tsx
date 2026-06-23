'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Calendar, BarChart3, LineChart } from 'lucide-react'
import type { CommandCenterData } from './command-center'

type Period = '7d' | '30d' | '90d' | '1y'

function generateDailyData(financials: CommandCenterData['financials'], period: Period) {
  const now = Date.now()
  const daysMap: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }
  const days = daysMap[period]
  const labels: string[] = []
  const values: number[] = []
  const cumulative: number[] = []
  let cum = 0

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 86400000)
    const dateStr = date.toISOString().slice(0, 10)
    labels.push(period === '1y'
      ? date.toLocaleDateString('pt-BR', { month: 'short' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    )
    const dayTotal = financials
      .filter(f => f.type === 'revenue' && new Date(f.date).toISOString().slice(0, 10) === dateStr)
      .reduce((a, f) => a + f.amount, 0)
    values.push(dayTotal)
    cum += dayTotal
    cumulative.push(cum)
  }
  return { labels, values, cumulative }
}

function MiniAreaChart({ data, color, height = 120 }: { data: number[]; color?: string; height?: number }) {
  if (data.length < 2) return <div className="h-32 bg-white/[0.02] rounded-lg" />
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const w = 600
  const h = height
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h * 0.85 - h * 0.05}`)
  const areaPoints = points.join(` ${w},${h} 0,${h}`)
  const linePoints = points.join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color || '#3b82f6'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color || '#3b82f6'} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#areaGrad)" />
      <polyline fill="none" stroke={color || '#3b82f6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={linePoints} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / range) * h * 0.85 - h * 0.05
        return i % Math.max(1, Math.floor(data.length / 8)) === 0 ? (
          <circle key={i} cx={x} cy={y} r="3" fill={color || '#3b82f6'} className="opacity-0 hover:opacity-100 transition-opacity" />
        ) : null
      })}
    </svg>
  )
}

export function RevenueChart({ data }: { data: CommandCenterData }) {
  const [period, setPeriod] = useState<Period>('30d')

  const { labels, values, cumulative } = useMemo(
    () => generateDailyData(data.financials, period),
    [data.financials, period]
  )

  const totalRevenue = values.reduce((a, b) => a + b, 0)
  const avgDaily = totalRevenue / (values.length || 1)
  const maxDay = Math.max(...values)
  const prevTotal = values.slice(0, Math.floor(values.length / 2)).reduce((a, b) => a + b, 0)
  const currTotal = values.slice(Math.floor(values.length / 2)).reduce((a, b) => a + b, 0)
  const trend = prevTotal > 0 ? ((currTotal - prevTotal) / prevTotal * 100).toFixed(1) : '0'

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: '7 dias' },
    { key: '30d', label: '30 dias' },
    { key: '90d', label: '90 dias' },
    { key: '1y', label: '1 ano' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Receita ao Longo do Tempo
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Acumulado: <span className="text-emerald-400 font-medium">R$ {(totalRevenue / 100).toFixed(2)}</span>
            {' · '}Média/dia: <span className="text-blue-400 font-medium">R$ {(avgDaily / 100).toFixed(2)}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/5">
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p.key
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 sm:h-56">
        <MiniAreaChart data={values} color="#3b82f6" height={220} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
        <MetricPill
          label="Pico diário"
          value={`R$ ${(maxDay / 100).toFixed(2)}`}
          icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
          color="emerald"
        />
        <MetricPill
          label="Acumulado"
          value={`R$ ${(totalRevenue / 100).toFixed(0)}`}
          icon={<Calendar className="w-3.5 h-3.5 text-blue-400" />}
          color="blue"
        />
        <MetricPill
          label="Tendência"
          value={`${Number(trend) >= 0 ? '+' : ''}${trend}%`}
          icon={Number(trend) >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
          color={Number(trend) >= 0 ? 'emerald' : 'red'}
        />
      </div>
    </motion.div>
  )
}

function MetricPill({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-400',
    red: 'bg-red-500/10 text-red-400',
  }
  return (
    <div className="text-center">
      <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">{label}</p>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${colors[color] || colors.blue}`}>
        {icon}
        {value}
      </div>
    </div>
  )
}
