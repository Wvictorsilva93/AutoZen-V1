'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Calendar,
  FileText,
  DollarSign,
  Package,
  UserCog,
  BarChart3,
  Menu,
  X,
  LogOut,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { AuthUser, AuthCompany } from '@/hooks/useAuth'
import { logoutAction } from '@/lib/auth/actions'

type Props = {
  user: AuthUser
  company: AuthCompany
  children: React.ReactNode
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
  { icon: Car, label: 'Veículos', href: '/dashboard/veiculos' },
  { icon: Wrench, label: 'Serviços', href: '/dashboard/servicos' },
  { icon: Calendar, label: 'Agendamentos', href: '/dashboard/agendamentos' },
  { icon: FileText, label: 'Ordens de Serviço', href: '/dashboard/os' },
  { icon: FileText, label: 'Kanban', href: '/dashboard/kanban' },
  { icon: DollarSign, label: 'Financeiro', href: '/dashboard/financeiro' },
  { icon: Package, label: 'Estoque', href: '/dashboard/estoque' },
  { icon: UserCog, label: 'Funcionários', href: '/dashboard/funcionarios' },
  { icon: BarChart3, label: 'Relatórios', href: '/dashboard/relatorios' },
]

export function DashboardLayout({ user, company, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="relative w-40 h-20">
              <Image src="/logo.png" alt="AutoZen" fill className="object-contain" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <Separator className="bg-slate-800" />

          {/* User Info */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{company.name}</p>
                <p className="text-xs text-slate-400 capitalize">{company.status}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
