'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Package, CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { CommandCenterData } from './command-center'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#64748b']

export function SubscriptionCenter({ data }: { data: CommandCenterData }) {
  const planDist = useMemo(() => {
    const dist: Record<string, number> = {}
    data.companies.forEach(c => {
      const p = c.plan || 'Sem plano'
      dist[p] = (dist[p] || 0) + 1
    })
    return Object.entries(dist).map(([name, value]) => ({ name, value }))
  }, [data])

  const totalActive = data.companies.filter(c => c.active && !c.blocked).length
  const totalBlocked = data.companies.filter(c => c.blocked).length
  const totalTrialing = data.companies.filter(c => !c.active && c.trial_end).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="h-full rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600/20 to-violet-600/5 border border-violet-500/20 flex items-center justify-center">
          <Package className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Distribuição de Planos</h2>
          <p className="text-xs text-slate-500">{data.companies.length} empresas no total</p>
        </div>
      </div>

      {planDist.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={planDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {planDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="bg-slate-900/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
                      <p className="text-sm text-white font-medium">{payload[0].name}</p>
                      <p className="text-lg font-bold text-white font-mono">{payload[0].value} empresas</p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-slate-600">Nenhum dado de plano disponível</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatBox icon={CheckCircle2} value={String(totalActive)} label="Ativas" color="text-emerald-400" bg="bg-emerald-500/10" />
        <StatBox icon={XCircle} value={String(totalBlocked)} label="Bloqueadas" color="text-red-400" bg="bg-red-500/10" />
        <StatBox icon={Clock} value={String(totalTrialing)} label="Trial" color="text-amber-400" bg="bg-amber-500/10" />
      </div>
    </motion.div>
  )
}

function StatBox({ icon: Icon, value, label, color, bg }: { icon: any; value: string; label: string; color: string; bg: string }) {
  return (
    <div className={`rounded-xl ${bg} border border-white/5 p-3 text-center`}>
      <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}
