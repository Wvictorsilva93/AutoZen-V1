'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'

export type AuthResult = {
  success: boolean
  error?: string
  data?: any
}

/**
 * Server Action: Login
 */
export async function loginAction(email: string, password: string): Promise<AuthResult> {
  try {
    const supabase = await getSupabaseServer()

    // Autenticar com Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return {
        success: false,
        error: authError.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : 'Erro ao fazer login',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Usuário não encontrado',
      }
    }

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, company_id, name, email, role')
      .eq('auth_id', authData.user.id)
      .single()

    if (userError || !userData) {
      return {
        success: false,
        error: 'Usuário não cadastrado no sistema',
      }
    }

    const typedUser = userData as any

    // Buscar dados da empresa
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id, name, status, trial_ends_at')
      .eq('id', typedUser.company_id)
      .single()

    if (companyError || !companyData) {
      return {
        success: false,
        error: 'Empresa não encontrada',
      }
    }

    const typedCompany = companyData as any

    // Verificar status da assinatura
    if (typedCompany.status === 'blocked') {
      return {
        success: false,
        error: 'Empresa bloqueada. Entre em contato com o suporte.',
      }
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      data: {
        user: userData,
        company: companyData,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Erro inesperado ao fazer login',
    }
  }
}

/**
 * Server Action: Cadastro de Empresa
 */
export async function signupAction(data: {
  companyName: string
  ownerName: string
  whatsapp: string
  email: string
  password: string
}): Promise<AuthResult> {
  try {
    const supabase = await getSupabaseServer()

    // Verificar se email já existe
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existingCompany) {
      return {
        success: false,
        error: 'Email já cadastrado',
      }
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.ownerName,
        },
      },
    })

    if (authError) {
      return {
        success: false,
        error: authError.message === 'User already registered'
          ? 'Email já cadastrado'
          : 'Erro ao criar conta',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Erro ao criar usuário',
      }
    }

    // Criar empresa
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: data.companyName,
        owner_name: data.ownerName,
        email: data.email,
        whatsapp: data.whatsapp,
        status: 'trial' as any,
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as any)
      .select()
      .single()

    if (companyError || !companyData) {
      // Rollback: deletar usuário do auth
      await supabase.auth.admin.deleteUser(authData.user.id)
      return {
        success: false,
        error: 'Erro ao criar empresa',
      }
    }

    // Criar usuário na tabela users
    const { error: userError } = await supabase.from('users').insert({
      company_id: (companyData as any).id,
      auth_id: authData.user.id,
      name: data.ownerName,
      email: data.email,
      role: 'admin_empresa' as any,
    } as any)

    if (userError) {
      // Rollback: deletar empresa e usuário
      await supabase.from('companies').delete().eq('id', (companyData as any).id)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return {
        success: false,
        error: 'Erro ao vincular usuário',
      }
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      data: {
        user: {
          name: data.ownerName,
          email: data.email,
          role: 'admin_empresa',
        },
        company: companyData,
      },
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      success: false,
      error: 'Erro inesperado ao criar conta',
    }
  }
}

/**
 * Server Action: Logout
 */
export async function logoutAction() {
  try {
    const supabase = await getSupabaseServer()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
  }
  redirect('/')
}

/**
 * Server Action: Obter sessão atual
 */
export async function getSessionAction(): Promise<{
  session: any
  user: any
  company: any
}> {
  try {
    const supabase = await getSupabaseServer()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { session: null, user: null, company: null }
    }

    // Buscar dados do usuário
    const { data: userData } = await supabase
      .from('users')
      .select('id, company_id, name, email, role')
      .eq('auth_id', session.user.id)
      .single()

    if (!userData) {
      return { session, user: null, company: null }
    }

    const typedUser = userData as any

    // Buscar dados da empresa
    const { data: companyData } = await supabase
      .from('companies')
      .select('id, name, status, trial_ends_at')
      .eq('id', typedUser.company_id)
      .single()

    return {
      session,
      user: userData,
      company: companyData,
    }
  } catch (error) {
    console.error('Get session error:', error)
    return { session: null, user: null, company: null }
  }
}
