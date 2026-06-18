'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import {
  Shield, LayoutDashboard, Building2, Package, Users, DollarSign,
  MessageSquare, ClipboardList, Lock, Loader2,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useProfile } from '@/hooks/useProfile'
import { OverviewTab } from './components/overview-tab'
import { CompaniesTab } from './components/companies-tab'
import { PlansTab } from './components/plans-tab'
import { UsersTab } from './components/users-tab'
import { FinanceTab } from './components/finance-tab'
import { SupportTab } from './components/support-tab'
import { AuditTab } from './components/audit-tab'
import { SecurityTab } from './components/security-tab'

const tabs = [
  { value: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { value: 'companies', label: 'Empresas', icon: Building2 },
  { value: 'plans', label: 'Planos', icon: Package },
  { value: 'users', label: 'Usuários', icon: Users },
  { value: 'finance', label: 'Financeiro', icon: DollarSign },
  { value: 'support', label: 'Suporte', icon: MessageSquare },
  { value: 'audit', label: 'Auditoria', icon: ClipboardList },
  { value: 'security', label: 'Segurança', icon: Lock },
]

export default function AdminPage() {
  const { isSuperAdmin, loading } = useProfile()
  const [tab, setTab] = useState('overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-white font-medium">Acesso restrito</p>
        <p className="text-sm">Esta área é exclusiva do super administrador do sistema.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
          <p className="text-sm text-slate-400">Gestão completa do SaaS</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full h-auto flex-wrap gap-1 bg-slate-800/50 p-1">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="gap-2 px-3 py-2">
              <t.icon className="w-4 h-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="companies"><CompaniesTab /></TabsContent>
        <TabsContent value="plans"><PlansTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="finance"><FinanceTab /></TabsContent>
        <TabsContent value="support"><SupportTab /></TabsContent>
        <TabsContent value="audit"><AuditTab /></TabsContent>
        <TabsContent value="security"><SecurityTab /></TabsContent>
      </Tabs>
    </div>
  )
}
