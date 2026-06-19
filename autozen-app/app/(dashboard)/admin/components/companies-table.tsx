'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Building2, ExternalLink, MoreHorizontal,
  CheckCircle2, XCircle, ArrowUpDown, MapPin, LogIn,
  Clock, Eye, Shield
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

export function CompaniesTable({ data }: { data: CommandCenterData }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'plan' | 'status'>('created_at')

  const filtered = useMemo(() => {
    let list = [...data.companies]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.responsible_name?.toLowerCase().includes(q) ||
        c.cnpj?.includes(q) ||
        c.city?.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'plan') return (a.plan || '').localeCompare(b.plan || '')
      if (sortBy === 'status') {
        const sa = a.blocked ? 2 : a.active ? 0 : 1
        const sb = b.blocked ? 2 : b.active ? 0 : 1
        return sa - sb
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    return list.slice(0, 10)
  }, [data, search, sortBy])

  const getPlanBadge = (plan: string | null) => {
    const styles: Record<string, string> = {
      basic: 'bg-slate-500/10 text-slate-400',
      pro: 'bg-blue-500/10 text-blue-400',
      premium: 'bg-violet-500/10 text-violet-400',
      enterprise: 'bg-amber-500/10 text-amber-400',
    }
    return styles[plan?.toLowerCase() || ''] || 'bg-slate-500/10 text-slate-400'
  }

  const lastLogin = (companyId: string) => {
    const p = data.profiles.find(pr => pr.company_id === companyId)
    if (!p?.last_sign_in) return null
    const diff = Date.now() - new Date(p.last_sign_in).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Agora'
    if (mins < 60) return `${mins}min atrás`
    if (hours < 24) return `${hours}h atrás`
    if (days < 7) return `${days}d atrás`
    return new Date(p.last_sign_in).toLocaleDateString('pt-BR')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 overflow-hidden"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600/20 to-cyan-600/5 border border-cyan-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Empresas</h2>
              <p className="text-xs text-slate-500">{data.companies.length} cadastradas</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text" placeholder="Buscar empresa..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-56 pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <Th label="Empresa" sort={sortBy === 'name'} onClick={() => setSortBy('name')} />
                <Th label="Cidade" />
                <Th label="Plano" sort={sortBy === 'plan'} onClick={() => setSortBy('plan')} />
                <Th label="Status" sort={sortBy === 'status'} onClick={() => setSortBy('status')} />
                <Th label="Cadastro" sort={sortBy === 'created_at'} onClick={() => setSortBy('created_at')} />
                <Th label="Último Login" />
                <Th label="" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((company, i) => (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-400/10 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                        {company.logo_url ? (
                          <img src={company.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          company.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{company.name}</p>
                        <p className="text-xs text-slate-600 truncate">{company.responsible_name || company.cnpj || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {company.city ? `${company.city}${company.state ? `, ${company.state}` : ''}` : '—'}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    {company.plan ? (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getPlanBadge(company.plan)}`}>
                        {company.plan}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {company.blocked ? (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <Shield className="w-3 h-3" /> Bloqueado
                      </span>
                    ) : company.active ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <XCircle className="w-3 h-3" /> Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-xs text-slate-500">
                    {new Date(company.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3 h-3 shrink-0" />
                      {lastLogin(company.id) || '—'}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Entrar como Cliente"
                        className="p-1.5 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-500 transition-all"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Detalhes"
                        className="p-1.5 rounded-lg hover:bg-blue-500/20 hover:text-blue-400 text-slate-500 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Mais ações"
                        className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white text-slate-500 transition-all"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-slate-600">Nenhuma empresa encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

function Th({ label, sort, onClick }: { label: string; sort?: boolean; onClick?: () => void }) {
  return (
    <th className="py-2 px-2 text-left text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-400 transition-colors select-none" onClick={onClick}>
      <div className="flex items-center gap-1">
        {label}
        {sort && <ArrowUpDown className="w-3 h-3" />}
      </div>
    </th>
  )
}
