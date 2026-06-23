'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, Search, Filter, ChevronDown, ExternalLink,
  CheckCircle2, XCircle, Clock, AlertTriangle, MoreHorizontal,
  ArrowUpDown, Eye, Shield, Mail, Phone
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

type SortKey = 'name' | 'created_at' | 'status' | 'plan'
type SortDir = 'asc' | 'desc'

export function CompaniesTable({ data }: { data: CommandCenterData }) {
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const plans = [...new Set(data.plans.map(p => p.slug || p.name))]

  const filtered = data.companies
    .filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
          !c.responsible_name?.toLowerCase().includes(search.toLowerCase()) &&
          !c.cnpj?.includes(search)) return false
      if (filterPlan !== 'all' && c.plan !== filterPlan) return false
      if (filterStatus === 'active' && (!c.active || c.blocked)) return false
      if (filterStatus === 'blocked' && !c.blocked) return false
      if (filterStatus === 'trial' && (!c.trial_end || new Date(c.trial_end) < new Date())) return false
      return true
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'created_at') cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      else if (sortKey === 'status') cmp = (a.active ? 1 : 0) - (b.active ? 1 : 0)
      else if (sortKey === 'plan') cmp = (a.plan || '').localeCompare(b.plan || '')
      return sortDir === 'asc' ? cmp : -cmp
    })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const getStatus = (c: CommandCenterData['companies'][0]) => {
    if (c.blocked) return { label: 'Bloqueado', color: 'red', icon: XCircle }
    if (!c.active) return { label: 'Inativo', color: 'slate', icon: Clock }
    if (c.trial_end && new Date(c.trial_end) > new Date()) return { label: 'Trial', color: 'amber', icon: AlertTriangle }
    return { label: 'Ativo', color: 'emerald', icon: CheckCircle2 }
  }

  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Empresas Cadastradas
          </h3>
          <p className="text-sm text-slate-500">{filtered.length} empresas encontradas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar empresa, CNPJ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-56"
            />
          </div>
          <select
            value={filterPlan}
            onChange={e => setFilterPlan(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-slate-300 focus:outline-none"
          >
            <option value="all">Todos planos</option>
            {plans.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-slate-300 focus:outline-none"
          >
            <option value="all">Todos status</option>
            <option value="active">Ativos</option>
            <option value="blocked">Bloqueados</option>
            <option value="trial">Trial</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {[
                { key: 'name', label: 'Empresa' },
                { key: 'status', label: 'Status' },
                { key: 'plan', label: 'Plano' },
                { key: 'created_at', label: 'Criada em' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key as SortKey)}
                  className="text-left py-3 px-3 text-[10px] text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
              ))}
              <th className="text-left py-3 px-3 text-[10px] text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((company, i) => {
              const status = getStatus(company)
              const StatusIcon = status.icon
              const plan = data.plans.find(p => p.slug === company.plan || p.name === company.plan)
              return (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{company.name}</p>
                        <p className="text-[10px] text-slate-600">{company.responsible_name} · {company.city || '—'}/{company.state || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClasses[status.color]}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-400 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5">
                      {plan?.name || company.plan || 'Grátis'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-500">
                    {new Date(company.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-white transition-colors" title="Ver detalhes">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-blue-400 transition-colors" title="Entrar como cliente">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-slate-300 transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 20 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-600">Mostrando 20 de {filtered.length} empresas</p>
        </div>
      )}
    </motion.div>
  )
}
