'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { UserRole, CompanyStatus } from '@/types/database'

export type AuthUser = {
  id: string
  company_id: string
  name: string
  email: string
  role: UserRole
}

export type AuthCompany = {
  id: string
  name: string
  status: CompanyStatus
  trial_ends_at: string | null
}

export type AuthState = {
  user: AuthUser | null
  company: AuthCompany | null
  loading: boolean
  isAuthenticated: boolean
}

/**
 * Hook para gerenciar autenticação no cliente
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    company: null,
    loading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const supabase = getSupabaseClient()

    async function loadSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setState({ user: null, company: null, loading: false, isAuthenticated: false })
          return
        }

        // Buscar dados do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('id, company_id, name, email, role')
          .eq('auth_id', session.user.id)
          .single()

        if (!userData) {
          setState({ user: null, company: null, loading: false, isAuthenticated: false })
          return
        }

        const typedUser = userData as unknown as AuthUser

        // Buscar dados da empresa
        const { data: companyData } = await supabase
          .from('companies')
          .select('id, name, status, trial_ends_at')
          .eq('id', typedUser.company_id)
          .single()

        setState({
          user: typedUser,
          company: companyData as unknown as AuthCompany,
          loading: false,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error('Load session error:', error)
        setState({ user: null, company: null, loading: false, isAuthenticated: false })
      }
    }

    loadSession()

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setState({ user: null, company: null, loading: false, isAuthenticated: false })
      } else {
        loadSession()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return state
}
