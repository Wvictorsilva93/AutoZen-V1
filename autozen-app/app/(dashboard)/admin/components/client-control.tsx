'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Building2, MoreHorizontal, ExternalLink, Ban, CheckCircle2,
  RefreshCw, MessageSquare, Trash2, UserCog, Shield, ArrowUpDown,
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

export function ClientControl({ data }: { data: CommandCenterData }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all')

  const companies = useMemo(() => {
    let list = [...data.companies]
    if (filterStatus === 'active') list = list.filter(c => c.active && !c.blocked)
    if (filterStatus === 'blocked') list = list.filter(c => c.blocked)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.responsible_name?.toLowerCase().includes(q))
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [data, search, filterStatus])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/50 overflow-hidden"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Controle de Clientes</h2>
              <p className="text-xs text-slate-500">Gerenciamento completo de empresas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FilterBtn label="Todos" active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} />
            <FilterBtn label="Ativos" active={filterStatus === 'active'} onClick={() => setFilterStatus('active')} />
            <FilterBtn label="Bloqueados" active={filterStatus === 'blocked'} onClick={() => setFilterStatus('blocked')} />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input type="text" placeholder="Buscar por nome ou responsável..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-600">Empresa</th>
                <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-600">Responsável</th>
                <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-600">Plano</th>
                <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-600">Status</th>
                <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {companies.map((company, i) => (
                <motion.tr key={company.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-400/10 flex items-center justify-center text-xs font-bold text-blue-400">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{company.name}</p>
                        <p className="text-xs text-slate-600">{company.cnpj || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-slate-400">{company.responsible_name || '—'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400">
                      {company.plan || 'Sem plano'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {company.blocked ? (
                      <span className="flex items-center gap-1 text-xs text-red-400"><Ban className="w-3 h-3" /> Bloqueado</span>
                    ) : company.active ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Ativo</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400"><Shield className="w-3 h-3" /> Inativo</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={ExternalLink} label="Entrar como cliente" />
                      <ActionBtn icon={RefreshCw} label="Alterar plano" />
                      <ActionBtn icon={MessageSquare} label="Enviar mensagem" />
                      <ActionBtn icon={company.blocked ? CheckCircle2 : Ban} label={company.blocked ? 'Desbloquear' : 'Bloquear'} />
                      <ActionBtn icon={Trash2} label="Excluir" />
                    </div>
                  </td>
                </motion.tr>
              ))}
              {companies.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-600">Nenhuma empresa encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white bg-white/5'
      }`}
    >
      {label}
    </button>
  )
}

function ActionBtn({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all" title={label}>
      <Icon className="w-4 h-4" />
    </button>
  )
}
