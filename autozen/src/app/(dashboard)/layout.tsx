'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  companyId?: string
  company?: { name: string; slug: string } | null
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/login')
          return
        }
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => {
        router.push('/login')
      })
  }, [router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center animate-pulse"
            style={{ background: 'var(--accent)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className={`hidden lg:block`}>
        <Sidebar
          userRole={user.role}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <Sidebar
            userRole={user.role}
            collapsed={false}
            onToggle={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[70px]' : 'lg:ml-[260px]'}`}>
        <Header user={user} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-6 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  )
}
