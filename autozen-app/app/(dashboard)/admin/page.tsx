'use client'

export const dynamic = 'force-dynamic'

import { Shield, Loader2 } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { CommandCenter } from './components/command-center'

export default function AdminPage() {
  const { isSuperAdmin, loading } = useProfile()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 blur-xl" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-white font-semibold text-lg">AutoZen Command Center</p>
            <p className="text-slate-500 text-sm">Preparando painel executivo...</p>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
        </div>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Acesso Restrito</h2>
            <p className="text-slate-500 text-sm mt-1">Esta área é exclusiva do super administrador.</p>
          </div>
        </div>
      </div>
    )
  }

  return <CommandCenter />
}
