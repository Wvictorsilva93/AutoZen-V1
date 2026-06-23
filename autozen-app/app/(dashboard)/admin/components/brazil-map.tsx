'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Building2, TrendingUp } from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface StateData {
  uf: string
  name: string
  x: number
  y: number
  companies: number
  percentage: number
}

const TARGET_STATES = ['MT', 'GO', 'SP', 'PR', 'MG']
const STATE_NAMES: Record<string, string> = {
  MT: 'Mato Grosso', GO: 'Goiás', SP: 'São Paulo',
  PR: 'Paraná', MG: 'Minas Gerais',
}

const STATE_COORDS: Record<string, { x: number; y: number }> = {
  MT: { x: 200, y: 140 }, GO: { x: 340, y: 160 }, SP: { x: 380, y: 260 },
  PR: { x: 350, y: 280 }, MG: { x: 420, y: 200 },
}

export function BrazilMapSection({ data }: { data: CommandCenterData }) {
  const stateStats = useMemo(() => {
    const totalActive = data.companies.filter(c => c.active && !c.blocked).length || 1
    return TARGET_STATES.map(uf => ({
      uf,
      name: STATE_NAMES[uf],
      ...STATE_COORDS[uf],
      companies: data.companies.filter(c => c.state === uf && c.active && !c.blocked).length,
      percentage: Math.round((data.companies.filter(c => c.state === uf && c.active && !c.blocked).length / totalActive) * 100),
    }))
  }, [data.companies])

  const totalTarget = stateStats.reduce((a, s) => a + s.companies, 0)
  const totalAll = data.companies.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Presença Geográfica
          </h3>
          <p className="text-sm text-slate-500">Estados-alvo: MT, GO, SP, PR, MG</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{totalTarget}<span className="text-sm text-slate-500">/{totalAll}</span></p>
          <p className="text-[10px] text-slate-600">Empresas nos estados-alvo</p>
        </div>
      </div>

      <div className="relative bg-slate-800/30 rounded-xl p-4 overflow-hidden">
        <svg viewBox="0 0 600 400" className="w-full h-64">
          <defs>
            <radialGradient id="dotGlow">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Simplified Brazil outline */}
          <path
            d="M120,80 L180,60 L250,70 L320,60 L380,80 L420,100 L460,90 L500,120 L520,160 L510,200 L490,240 L470,280 L440,310 L400,340 L350,350 L300,340 L250,330 L200,310 L160,280 L130,240 L110,200 L100,160 L110,120 Z"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          {stateStats.map((s, i) => (
            <g key={s.uf}>
              <circle cx={s.x} cy={s.y} r={20 + s.companies * 3} fill="url(#dotGlow)" opacity={0.5} />
              <circle cx={s.x} cy={s.y} r={6 + Math.min(s.companies * 1.5, 10)} fill="#06b6d4" opacity={0.8} className="drop-shadow-lg" />
              <text x={s.x} y={s.y - 18} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">{s.uf}</text>
              <text x={s.x} y={s.y + 24} textAnchor="middle" fill="#94a3b8" fontSize="9">{s.companies} empresas</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {stateStats.map(s => (
          <div key={s.uf} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="text-xs font-bold text-cyan-400">{s.uf}</p>
            <p className="text-lg font-bold text-white">{s.companies}</p>
            <p className="text-[10px] text-slate-600">{s.percentage}%</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
