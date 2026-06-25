'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Car, FileText, Kanban, DollarSign,
  Package, Calendar, BarChart3, Settings, Bell, Shield,
  ChevronLeft, ChevronRight, LogOut, Wrench
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', href: '/clients', icon: Users },
  { label: 'Veículos', href: '/vehicles', icon: Car },
  { label: 'Ordens de Serviço', href: '/orders', icon: FileText },
  { label: 'Kanban OS', href: '/kanban', icon: Kanban },
  { label: 'Financeiro', href: '/financial', icon: DollarSign },
  { label: 'Estoque', href: '/stock', icon: Package },
  { label: 'Agendamentos', href: '/appointments', icon: Calendar },
  { label: 'Relatórios', href: '/reports', icon: BarChart3 },
  { label: 'Configurações', href: '/settings', icon: Settings },
]

const superAdminItems = [
  { label: 'Super Admin', href: '/super-admin', icon: Shield },
]

interface SidebarProps {
  userRole: string
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ userRole, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const allItems = [
    ...(userRole === 'super_admin' ? superAdminItems : []),
    ...menuItems,
  ]

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-[70px]' : 'w-[260px]'
      }`}
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)' }}>
              <Wrench size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              AutoZen
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {allItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive ? 'text-white' : ''
              }`}
              style={{
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary)',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Plano</p>
            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Pro</p>
          </div>
        )}
      </div>
    </aside>
  )
}
