'use client'

import { useEffect, useState } from 'react'
import { Car, DollarSign, Calendar, FileText, TrendingUp, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { AuthUser, AuthCompany } from '@/hooks/useAuth'
import { getSupabaseClient } from '@/lib/supabase/client'

type Props = {
  user: AuthUser
  company: AuthCompany
}

type DashboardStats = {
  revenueToday: number
  revenueMonth: number
  profit: number
  averageTicket: number
  activeVehicles: number
  queue: number
  appointments: number
  openOrders: number
}

export function DashboardContent({ user, company }: Props) {
  const [stats, setStats] = useState<DashboardStats>({
    revenueToday: 0,
    revenueMonth: 0,
    profit: 0,
    averageTicket: 0,
    activeVehicles: 0,
    queue: 0,
    appointments: 0,
    openOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const supabase = getSupabaseClient()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        // Faturamento do dia
        const { data: todayRevenue } = await supabase
          .from('financial_entries')
          .select('amount')
          .eq('company_id', company.id)
          .eq('type', 'receita')
          .gte('date', today.toISOString())

        const revenueToday = (todayRevenue as any)?.reduce((sum: number, entry: any) => sum + entry.amount, 0) || 0

        // Faturamento do mês
        const { data: monthRevenue } = await supabase
          .from('financial_entries')
          .select('amount')
          .eq('company_id', company.id)
          .eq('type', 'receita')
          .gte('date', firstDayOfMonth.toISOString())

        const revenueMonth = (monthRevenue as any)?.reduce((sum: number, entry: any) => sum + entry.amount, 0) || 0

        // Despesas do mês
        const { data: monthExpenses } = await supabase
          .from('financial_entries')
          .select('amount')
          .eq('company_id', company.id)
          .eq('type', 'despesa')
          .gte('date', firstDayOfMonth.toISOString())

        const expensesMonth = (monthExpenses as any)?.reduce((sum: number, entry: any) => sum + entry.amount, 0) || 0
        const profit = revenueMonth - expensesMonth

        // OS abertas
        const { count: openOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .in('status', ['aguardando', 'lavando', 'finalizando'])

        // Veículos ativos (em atendimento)
        const { count: activeVehicles } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .in('status', ['lavando', 'finalizando'])

        // Fila (aguardando)
        const { count: queue } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .eq('status', 'aguardando')

        // Agendamentos de hoje
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const { count: appointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)
          .gte('scheduled_at', today.toISOString())
          .lt('scheduled_at', tomorrow.toISOString())
          .eq('status', 'agendado')

        // Ticket médio
        const { data: completedOrders } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('company_id', company.id)
          .eq('status', 'entregue')
          .gte('created_at', firstDayOfMonth.toISOString())

        const ordersData = completedOrders as any
        const averageTicket =
          ordersData && ordersData.length > 0
            ? ordersData.reduce((sum: number, order: any) => sum + order.total_amount, 0) /
              ordersData.length
            : 0

        setStats({
          revenueToday,
          revenueMonth,
          profit,
          averageTicket,
          activeVehicles: activeVehicles || 0,
          queue: queue || 0,
          appointments: appointments || 0,
          openOrders: openOrders || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [company.id])

  const cards = [
    {
      title: 'Faturamento Hoje',
      value: formatCurrency(stats.revenueToday),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Faturamento Mês',
      value: formatCurrency(stats.revenueMonth),
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Lucro',
      value: formatCurrency(stats.profit),
      icon: DollarSign,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(stats.averageTicket),
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Veículos Ativos',
      value: stats.activeVehicles.toString(),
      icon: Car,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Fila Atual',
      value: stats.queue.toString(),
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Agendamentos',
      value: stats.appointments.toString(),
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'OS Abertas',
      value: stats.openOrders.toString(),
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bem-vindo, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-400">
          {stats.revenueToday > 0
            ? `Hoje você faturou ${formatCurrency(stats.revenueToday)} e possui ${
                stats.activeVehicles
              } veículos em atendimento.`
            : 'Comece o dia registrando suas primeiras ordens de serviço!'}
        </p>
      </div>

      {/* Status da empresa */}
      {company.status === 'trial' && company.trial_ends_at && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-orange-400">Período de Teste</CardTitle>
            <CardDescription className="text-slate-400">
              Seu período de teste expira em{' '}
              {formatDate(company.trial_ends_at)}. Aproveite todos os recursos!
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card
              key={index}
              className="glass border-slate-800 hover:border-slate-700 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loading ? '...' : card.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Próximas Implementações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Gráfico de Receita</CardTitle>
            <CardDescription className="text-slate-400">
              Últimos 7 dias (em desenvolvimento)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              Gráfico será implementado em breve
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Serviços Mais Vendidos</CardTitle>
            <CardDescription className="text-slate-400">
              Top 5 do mês (em desenvolvimento)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              Ranking será implementado em breve
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
