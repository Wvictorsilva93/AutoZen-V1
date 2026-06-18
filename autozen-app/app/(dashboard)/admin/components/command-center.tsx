'use client'

import { useEffect, useState } from 'react'
import { listRows } from '@/lib/db'
import { useProfile } from '@/hooks/useProfile'
import { HeroSection } from './hero-section'
import { ExecutiveCards } from './executive-cards'
import { RevenueChart } from './revenue-chart'
import { CompaniesTable } from './companies-table'
import { SubscriptionCenter } from './subscription-center'
import { InfrastructureMonitor } from './infrastructure-monitor'
import { AlertCenter } from './alert-center'
import { GlobalAudit } from './global-audit'
import { ClientControl } from './client-control'
import { FinanceMetrics } from './finance-metrics'
import { SecurityPanel } from './security-panel'
import { BrazilMapSection } from './brazil-map'

interface Company {
  id: string; name: string; responsible_name: string | null; cnpj: string | null
  phone: string | null; plan: string | null; status: string | null
  active: boolean; blocked: boolean; city: string | null; state: string | null
  logo_url: string | null; trial_end: string | null; subscription_end: string | null
  created_at: string; updated_at: string
}

interface Profile { id: string; user_id: string; name: string; role: string; email: string | null; company_id: string | null; last_sign_in: string | null }
interface Financial { id: string; company_id: string; type: string; amount: number; description: string; date: string; created_at: string }
interface Plan { id: string; name: string; slug: string; price: number; features: string[]; active: boolean; description: string | null }
interface AuditLog { id: string; user_name: string; action: string; target: string; target_id: string; company_name: string; ip: string; user_agent: string; created_at: string }
interface SupportTicket { id: string; company_id: string; subject: string; status: string; priority: string; created_at: string }

export interface CommandCenterData {
  companies: Company[]
  profiles: Profile[]
  financials: Financial[]
  plans: Plan[]
  auditLogs: AuditLog[]
  tickets: SupportTicket[]
}

export function CommandCenter() {
  const { profile } = useProfile()
  const [data, setData] = useState<CommandCenterData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listRows<Company>('companies', { orderBy: 'created_at' }),
      listRows<Profile>('profiles', { orderBy: 'created_at' }),
      listRows<Financial>('financial_entries', { orderBy: 'date' }),
      listRows<Plan>('plans', { orderBy: 'created_at', ascending: true }),
      listRows<AuditLog>('audit_logs', { orderBy: 'created_at' }),
      listRows<SupportTicket>('support_tickets', { orderBy: 'created_at' }),
    ]).then(([c, p, f, pl, a, t]) => {
      setData({
        companies: c.data ?? [],
        profiles: p.data ?? [],
        financials: f.data ?? [],
        plans: pl.data ?? [],
        auditLogs: a.data ?? [],
        tickets: t.data ?? [],
      })
      setLoading(false)
    })
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-slate-800/50" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-800/50" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-slate-800/50" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 rounded-2xl bg-slate-800/50" />
          <div className="h-96 rounded-2xl bg-slate-800/50" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <HeroSection data={data} profile={profile} />
      <ExecutiveCards data={data} />
      <BrazilMapSection data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={data} />
        </div>
        <div>
          <SubscriptionCenter data={data} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <CompaniesTable data={data} />
        </div>
        <div className="lg:col-span-2">
          <InfrastructureMonitor />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <AlertCenter data={data} />
        </div>
        <div className="lg:col-span-3">
          <GlobalAudit data={data} />
        </div>
      </div>
      <ClientControl data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceMetrics data={data} />
        <SecurityPanel data={data} />
      </div>
    </div>
  )
}
