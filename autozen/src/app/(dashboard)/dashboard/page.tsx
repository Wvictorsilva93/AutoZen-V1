'use client'

import { useState, useEffect } from 'react'
import {
  Users, Car, FileText, DollarSign, Package, TrendingUp,
  Clock, CheckCircle, Truck, AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

interface DashboardData {
  type: string
  stats: Record<string, number>
  recentOrders?: Array<{
    id: string; number: number; status: string; description: string
    finalValue: number; createdAt: string
    client: { name: string }; vehicle: { plate: string; brand: string; model: string }
  }>
  lowStockProducts?: Array<{ id: string; name: string; stockQuantity: number; minStock: number }>
  upcomingAppointments?: Array<{
    id: string; title: string; date: string; status: string
    client?: { name: string }; vehicle?: { plate: string }
  }>
  recentCompanies?: Array<{ id: string; name: string; plan: string; active: boolean }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 w-20 rounded mb-3" style={{ background: 'var(--bg-input)' }} />
              <div className="h-8 w-32 rounded" style={{ background: 'var(--bg-input)' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.type === 'super_admin') {
    return <SuperAdminDashboard data={data} />
  }

  return <CompanyDashboard data={data} />
}

function SuperAdminDashboard({ data }: { data: DashboardData }) {
  const stats = [
    { label: 'Empresas', value: data.stats.totalCompanies, icon: FileText, color: 'var(--accent)' },
    { label: 'Usuários', value: data.stats.totalUsers, icon: Users, color: 'var(--success)' },
    { label: 'Clientes', value: data.stats.totalClients, icon: Users, color: 'var(--warning)' },
    { label: 'Receita Total', value: formatCurrency(data.stats.totalRevenue), icon: DollarSign, color: 'var(--info)' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Super Admin Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Empresas Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>Empresa</th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>Plano</th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentCompanies?.map((company) => (
                <tr key={company.id} className="table-row border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-primary)' }}>{company.name}</td>
                  <td className="py-3 px-4">
                    <span className="badge" style={{ background: 'var(--accent)15', color: 'var(--accent)', borderColor: 'var(--accent)30' }}>
                      {company.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${company.active ? '' : ''}`}
                      style={{
                        background: company.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: company.active ? 'var(--success)' : 'var(--danger)',
                        borderColor: company.active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                      }}>
                      {company.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CompanyDashboard({ data }: { data: DashboardData }) {
  const stats = [
    { label: 'Receita Mensal', value: formatCurrency(data.stats.monthlyRevenue), icon: DollarSign, color: 'var(--success)', trend: '+12%', up: true },
    { label: 'OS Abertas', value: data.stats.pendingOrders, icon: Clock, color: 'var(--warning)', trend: '', up: false },
    { label: 'OS Em Execução', value: data.stats.inProgressOrders, icon: FileText, color: 'var(--info)', trend: '', up: false },
    { label: 'OS Finalizadas', value: data.stats.completedOrders, icon: CheckCircle, color: 'var(--success)', trend: '', up: false },
    { label: 'Clientes Ativos', value: data.stats.totalClients, icon: Users, color: 'var(--accent)', trend: '+3', up: true },
    { label: 'Veículos', value: data.stats.totalVehicles, icon: Car, color: 'var(--info)', trend: '', up: false },
    { label: 'Ticket Médio', value: formatCurrency(data.stats.averageTicket), icon: TrendingUp, color: 'var(--accent)', trend: '+5%', up: true },
    { label: 'Produtos', value: data.stats.totalProducts, icon: Package, color: 'var(--warning)', trend: '', up: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Visão geral da sua oficina</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card animate-fadeIn" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                {stat.trend && (
                  <span className="flex items-center text-xs font-medium mb-1"
                    style={{ color: stat.up ? 'var(--success)' : 'var(--danger)' }}>
                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Ordens de Serviço Recentes</h2>
          <div className="space-y-3">
            {data.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
                style={{ background: 'var(--bg-input)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--accent)15', color: 'var(--accent)' }}>
                    #{order.number}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{order.client.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {order.vehicle.brand} {order.vehicle.model} - {order.vehicle.plate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(order.finalValue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {data.lowStockProducts && data.lowStockProducts.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Estoque Baixo</h2>
              </div>
              <div className="space-y-2">
                {data.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 rounded-lg"
                    style={{ background: 'var(--bg-input)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
                    <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>
                      {product.stockQuantity} / {product.minStock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} style={{ color: 'var(--info)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Próximos Agendamentos</h2>
            </div>
            <div className="space-y-2">
              {data.upcomingAppointments?.map((appointment) => (
                <div key={appointment.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{appointment.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(appointment.date)}
                    {appointment.client && ` - ${appointment.client.name}`}
                  </p>
                </div>
              ))}
              {(!data.upcomingAppointments || data.upcomingAppointments.length === 0) && (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
                  Nenhum agendamento próximo
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
