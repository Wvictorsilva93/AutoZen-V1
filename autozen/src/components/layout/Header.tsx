'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Search, User, LogOut, ChevronDown, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  user: {
    name: string
    email: string
    role: string
    company?: { name: string } | null
  }
  onMenuClick?: () => void
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    employee: 'Funcionário',
  }

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-40 glass"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg lg:hidden transition-colors hover:bg-[var(--bg-card-hover)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar..."
            className="input pl-10 w-80"
            style={{ background: 'var(--bg-input)', borderColor: 'var(--border)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
        </button>

        {showNotifications && (
          <div
            className="absolute right-16 top-14 w-80 rounded-xl p-4 animate-scaleIn z-50"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Notificações
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>OS #1002 atualizada</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Há 5 minutos</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Estoque baixo: Filtro de Ar</p>
                <p className="text-xs mt-1" style={{ color: 'var(--warning)' }}>Atenção</p>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--accent)' }}>
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {user.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {roleLabels[user.role] || user.role}
              </p>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 top-14 w-56 rounded-xl p-2 animate-scaleIn z-50"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              </div>
              <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
              <button
                onClick={() => { router.push('/settings'); setShowUserMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--bg-card-hover)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <User size={16} />
                Meu Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--bg-card-hover)]"
                style={{ color: 'var(--danger)' }}
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
