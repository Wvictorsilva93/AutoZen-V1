'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Lock, Unlock, Eye, MonitorSmartphone, Globe,
  AlertTriangle, CheckCircle2, XCircle, Key, Smartphone, Laptop,
  RefreshCw, UserX, Clock, Wifi
} from 'lucide-react'

interface Session {
  id: string
  user: string
  device: string
  browser: string
  ip: string
  location: string
  lastActive: Date
  current: boolean
}

interface LoginAttempt {
  id: string
  email: string
  success: boolean
  ip: string
  timestamp: Date
  reason?: string
}

const mockSessions: Session[] = [
  { id: '1', user: 'Admin Master', device: 'Desktop', browser: 'Chrome 120', ip: '189.45.23.12', location: 'São Paulo, SP', lastActive: new Date(), current: true },
  { id: '2', user: 'Admin Master', device: 'Mobile', browser: 'Safari 17', ip: '189.45.23.12', location: 'São Paulo, SP', lastActive: new Date(Date.now() - 3600000), current: false },
  { id: '3', user: 'João Silva', device: 'Desktop', browser: 'Firefox 121', ip: '201.17.45.89', location: 'Cuiabá, MT', lastActive: new Date(Date.now() - 7200000), current: false },
]

const mockLoginAttempts: LoginAttempt[] = [
  { id: '1', email: 'admin@autozen.com.br', success: true, ip: '189.45.23.12', timestamp: new Date() },
  { id: '2', email: 'admin@autozen.com.br', success: false, ip: '45.23.12.89', timestamp: new Date(Date.now() - 1800000), reason: 'Senha incorreta' },
  { id: '3', email: 'unknown@test.com', success: false, ip: '103.21.58.12', timestamp: new Date(Date.now() - 3600000), reason: 'Email não encontrado' },
  { id: '4', email: 'admin@autozen.com.br', success: true, ip: '189.45.23.12', timestamp: new Date(Date.now() - 7200000) },
  { id: '5', email: 'admin@autozen.com.br', success: false, ip: '45.23.12.89', timestamp: new Date(Date.now() - 10800000), reason: 'Tentativas excessivas' },
]

const blockedIPs = [
  { ip: '103.21.58.12', reason: 'Tentativa de brute force', blocked: new Date(Date.now() - 86400000), requests: 47 },
  { ip: '45.23.12.89', reason: 'Múltiplos logins falhos', blocked: new Date(Date.now() - 3600000), requests: 12 },
  { ip: '91.189.89.45', reason: 'Scan automatizado', blocked: new Date(Date.now() - 172800000), requests: 234 },
]

const securityChecks = [
  { label: 'HTTPS/HSTS', status: 'pass', detail: 'Certificado válido' },
  { label: 'Rate Limiting', status: 'pass', detail: '100 req/min por IP' },
  { label: 'CORS Policy', status: 'pass', detail: 'Restrito a domínios autorizados' },
  { label: 'Two-Factor Auth', status: 'warn', detail: 'Opcional para admins' },
  { label: 'Session Timeout', status: 'pass', detail: '30 minutos de inatividade' },
  { label: 'SQL Injection', status: 'pass', detail: 'Parâmetros preparados via Supabase' },
  { label: 'XSS Protection', status: 'pass', detail: 'Sanitização de input ativa' },
  { label: 'CSRF Tokens', status: 'pass', detail: 'Proteção ativa em formulários' },
  { label: 'Password Policy', status: 'warn', detail: 'Mínimo 8 caracteres' },
  { label: 'Audit Logging', status: 'pass', detail: 'Todas as ações registradas' },
]

const statusIcons: Record<string, { icon: any; color: string; bg: string }> = {
  pass: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  warn: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  fail: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
}

export function SecurityPanel({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'logins' | 'blocked' | 'checks'>('sessions')

  const tabs = [
    { key: 'sessions' as const, label: 'Sessões Ativas', icon: MonitorSmartphone, count: mockSessions.length },
    { key: 'logins' as const, label: 'Tentativas', icon: Lock, count: mockLoginAttempts.length },
    { key: 'blocked' as const, label: 'IPs Bloqueados', icon: UserX, count: blockedIPs.length },
    { key: 'checks' as const, label: 'Verificações', icon: Shield, count: securityChecks.filter(c => c.status === 'pass').length },
  ]

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
            <Shield className="w-5 h-5 text-emerald-400" />
            Painel de Segurança
          </h3>
          <p className="text-sm text-slate-500">
            <span className="text-emerald-400">{securityChecks.filter(c => c.status === 'pass').length}/{securityChecks.length}</span> verificações passando
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-xl p-1 border border-white/5 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              <span className="text-[10px] opacity-60">({tab.count})</span>
            </button>
          )
        })}
      </div>

      {activeTab === 'sessions' && (
        <div className="space-y-2">
          {mockSessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                session.current ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
              }`}>
                {session.device === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{session.user}</span>
                  {session.current && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Atual</span>}
                </div>
                <p className="text-[10px] text-slate-600">
                  {session.browser} · {session.ip} · {session.location}
                </p>
              </div>
              <span className="text-[10px] text-slate-600">
                {Math.round((Date.now() - session.lastActive.getTime()) / 60000)}min atrás
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'logins' && (
        <div className="space-y-2">
          {mockLoginAttempts.map((attempt, i) => (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                attempt.success ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                attempt.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {attempt.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white">{attempt.email}</p>
                <p className="text-[10px] text-slate-600">{attempt.ip} · {attempt.reason || 'Sucesso'}</p>
              </div>
              <span className="text-[10px] text-slate-600">
                {attempt.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="space-y-2">
          {blockedIPs.map((ip, i) => (
            <motion.div
              key={ip.ip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
            >
              <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-mono text-white">{ip.ip}</p>
                <p className="text-[10px] text-slate-400">{ip.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-red-400">{ip.requests} reqs</p>
                <p className="text-[10px] text-slate-600">
                  {ip.blocked.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'checks' && (
        <div className="space-y-1.5">
          {securityChecks.map((check, i) => {
            const s = statusIcons[check.status]
            const Icon = s.icon
            return (
              <motion.div
                key={check.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02]"
              >
                <Icon className={`w-4 h-4 ${s.color} shrink-0`} />
                <span className="text-sm text-white flex-1">{check.label}</span>
                <span className="text-[10px] text-slate-500">{check.detail}</span>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
