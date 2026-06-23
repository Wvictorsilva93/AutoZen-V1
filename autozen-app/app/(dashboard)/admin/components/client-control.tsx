'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Shield, ShieldOff, CreditCard, Key,
  Mail, Trash2, Eye, ChevronDown, CheckCircle2, XCircle,
  Building2, Phone, Clock, AlertTriangle, ExternalLink
} from 'lucide-react'
import type { CommandCenterData } from './command-center'

interface ClientAction {
  label: string
  icon: any
  color: string
  description: string
}

const actions: ClientAction[] = [
  { label: 'Acessar Painel', icon: ExternalLink, color: 'blue', description: 'Entrar como cliente' },
  { label: 'Suspender', icon: ShieldOff, color: 'red', description: 'Bloquear acesso' },
  { label: 'Reativar', icon: Shield, color: 'emerald', description: 'Restaurar acesso' },
  { label: 'Alterar Plano', icon: CreditCard, color: 'violet', description: 'Mudar assinatura' },
  { label: 'Resetar Senha', icon: Key, color: 'amber', description: 'Enviar email de reset' },
  { label: 'Enviar Mensagem', icon: Mail, color: 'cyan', description: 'Notificação manual' },
  { label: 'Excluir', icon: Trash2, color: 'red', description: 'Remover permanentemente' },
]

const actionColors: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
}

export function ClientControl({ data }: { data: CommandCenterData }) {
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const companies = data.companies
    .filter(c => {
      if (!search) return true
      return c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.responsible_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.cnpj?.includes(search)
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const selected = data.companies.find(c => c.id === selectedCompany)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Controle de Clientes
          </h3>
          <p className="text-sm text-slate-500">Gerencie acesso, planos e ações de cada empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {companies.slice(0, 20).map(company => {
              const isActive = company.active && !company.blocked
              const isTrial = company.trial_end && new Date(company.trial_end) > new Date()
              return (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id === selectedCompany ? null : company.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedCompany === company.id
                      ? 'bg-blue-500/10 border border-blue-500/20'
                      : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                      {company.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{company.name}</p>
                      <div className="flex items-center gap-1.5">
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        {!isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                        {isTrial && <span className="text-[9px] text-amber-400">Trial</span>}
                        <span className="text-[10px] text-slate-600">{company.plan || 'Grátis'}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-lg font-bold text-blue-400">
                    {selected.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selected.name}</h4>
                    <p className="text-sm text-slate-400">
                      {selected.responsible_name} · {selected.city || '—'}/{selected.state || '—'}
                    </p>
                    <p className="text-xs text-slate-600">CNPJ: {selected.cnpj || 'Não informado'} · {selected.phone || 'Sem telefone'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <InfoBox label="Plano" value={selected.plan || 'Grátis'} />
                  <InfoBox label="Status" value={selected.blocked ? 'Bloqueado' : selected.active ? 'Ativo' : 'Inativo'} />
                  <InfoBox label="Criada" value={new Date(selected.created_at).toLocaleDateString('pt-BR')} />
                  <InfoBox label="Atualizada" value={new Date(selected.updated_at).toLocaleDateString('pt-BR')} />
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Ações disponíveis</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {actions.map(action => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        className={`p-3 rounded-xl border text-left transition-all ${actionColors[action.color]}`}
                      >
                        <Icon className="w-4 h-4 mb-1.5" />
                        <p className="text-xs font-medium">{action.label}</p>
                        <p className="text-[10px] opacity-60">{action.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Building2 className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm text-slate-500">Selecione uma empresa para gerenciar</p>
              <p className="text-xs text-slate-600 mt-1">Clique em uma empresa da lista ao lado</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-lg bg-white/[0.03]">
      <p className="text-[10px] text-slate-600">{label}</p>
      <p className="text-xs font-medium text-white">{value}</p>
    </div>
  )
}
