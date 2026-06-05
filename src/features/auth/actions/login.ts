'use server';

// AutoZen - Login Server Action
import { createClient } from '@/src/lib/supabase/server';
import { loginSchema, type LoginFormData } from '../validators/login.schema';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface LoginResult {
  success: boolean;
  error?: string;
  data?: {
    userId: string;
    email: string;
  };
}

export async function loginAction(
  formData: LoginFormData
): Promise<LoginResult> {
  try {
    // Validar dados
    const validatedData = loginSchema.parse(formData);

    // Criar cliente Supabase
    const supabase = await createClient();

    // Fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      console.error('[LOGIN_ERROR]', error);
      return {
        success: false,
        error: error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : 'Erro ao fazer login. Tente novamente.',
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Erro ao autenticar usuário',
      };
    }

    // Verificar se o perfil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, tenant_id, name, role, active')
      .eq('user_id', data.user.id)
      .single();

    if (profileError || !profile) {
      console.error('[PROFILE_ERROR]', profileError);
      
      // Fazer logout se não encontrar perfil
      await supabase.auth.signOut();
      
      return {
        success: false,
        error: 'Perfil de usuário não encontrado. Entre em contato com o suporte.',
      };
    }

    // Verificar se o usuário está ativo
    if (!profile.active) {
      await supabase.auth.signOut();
      
      return {
        success: false,
        error: 'Seu usuário está inativo. Entre em contato com o administrador.',
      };
    }

    // Verificar status da assinatura
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('status, trial_ends_at')
      .eq('tenant_id', profile.tenant_id)
      .single();

    if (subscriptionError) {
      console.error('[SUBSCRIPTION_ERROR]', subscriptionError);
    }

    // Permitir acesso apenas para trial ou active
    const allowedStatuses = ['trial', 'active'];
    
    if (subscription && !allowedStatuses.includes(subscription.status)) {
      // Usuário tem acesso bloqueado por assinatura
      // Mas permitir login para redirecionar para /assinatura
      console.log('[SUBSCRIPTION_BLOCKED]', subscription.status);
    }

    return {
      success: true,
      data: {
        userId: data.user.id,
        email: data.user.email!,
      },
    };
  } catch (error) {
    console.error('[LOGIN_ACTION_ERROR]', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login',
    };
  }
}

// Action para logout
export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[LOGOUT_ERROR]', error);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('[LOGOUT_ACTION_ERROR]', error);
    return { success: false };
  }
}
