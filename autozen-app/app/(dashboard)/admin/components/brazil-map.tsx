'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, Building2, Globe } from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface BrazilMapProps {
  data: CommandCenterData
}

const regions = [
  { name: 'MT - Mato Grosso', x: 38, y: 35, color: '#10b981', companies: '~5%' },
  { name: 'GO - Goiás', x: 48, y: 42, color: '#f59e0b', companies: '~8%' },
  { name: 'SP - São Paulo', x: 52, y: 58, color: '#3b82f6', companies: '~45%' },
  { name: 'PR - Paraná', x: 48, y: 68, color: '#8b5cf6', companies: '~22%' },
  { name: 'MG - Minas Gerais', x: 58, y: 50, color: '#06b6d4', companies: '~20%' },
]

export function BrazilMapSection({ data }: BrazilMapProps) {
  const activeCompanies = data.companies.filter(c => c.active && !c.blocked).length
  const statesWithCompanies = new Set(data.companies.filter(c => c.state).map(c => c.state)).size

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mapa do Brasil</h2>
            <p className="text-xs text-slate-500">Estados-alvo (MT, GO, SP, PR, MG)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="w-3.5 h-3.5" />
            {activeCompanies} ativas
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            {statesWithCompanies} estados
          </div>
        </div>
      </div>

      <div className="relative bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_60%)] rounded-xl h-64 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-72">
            {regions.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
                className="absolute group"
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
              >
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-r blur-xl opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: r.color }} />
                  <div className="relative w-4 h-4 rounded-full border-2 border-white/30 shadow-lg cursor-pointer"
                    style={{ backgroundColor: r.color }}>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                  <div className="bg-slate-900/95 border border-white/10 rounded-lg px-2.5 py-1.5 shadow-2xl backdrop-blur-md">
                    <p className="text-xs font-medium text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.companies} empresas</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {regions.map((r, i) =>
              regions.slice(i + 1).map((r2, j) => (
                <svg key={`${i}-${j}`} className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={`${(r.x / 100) * 256}`} y1={`${(r.y / 100) * 288}`}
                    x2={`${(r2.x / 100) * 256}`} y2={`${(r2.y / 100) * 288}`}
                    stroke={r.color} strokeWidth="0.5" opacity="0.15"
                    strokeDasharray="3 3"
                  />
                </svg>
              ))
            )}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-4">
          {regions.map(r => (
            <div key={`leg-${r.name}`} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="text-[10px] text-slate-600">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
