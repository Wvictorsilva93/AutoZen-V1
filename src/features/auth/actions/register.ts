'use server';

// AutoZen - Register Server Action
import { createClient } from '@/src/lib/supabase/server';
import { registerSchema, type RegisterFormData } from '../validators/register.schema';

export interface RegisterResult {
  success: boolean;
  error?: string;
  data?: {
    userId: string;
    tenantId: string;
    email: string;
  };
}

export async function registerAction(
  formData: RegisterFormData
): Promise<RegisterResult> {
  try {
    // Validar dados
    const validatedData = registerSchema.parse(formData);

    // Criar cliente Supabase com service role (para criar empresa)
    const supabase = await createClient();

    // ===============================================
    // PASSO 1: Verificar se email já existe
    // ===============================================
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', validatedData.email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: 'Este email já está cadastrado',
      };
    }

    // ===============================================
    // PASSO 2: Criar empresa (tenant)
    // ===============================================
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: validatedData.companyName,
        cnpj: validatedData.cnpj || null,
        phone: validatedData.companyPhone,
        email: validatedData.companyEmail,
        active: true,
      })
      .select('id')
      .single();

    if (companyError || !company) {
      console.error('[COMPANY_ERROR]', companyError);
      return {
        success: false,
        error: 'Erro ao criar empresa. Tente novamente.',
      };
    }

    const tenantId = company.id;

    // ===============================================
    // PASSO 3: Criar usuário no Supabase Auth
    // ===============================================
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.responsibleName,
          tenant_id: tenantId,
          role: 'admin', // Primeiro usuário é sempre admin
        },
      },
    });

    if (authError || !authData.user) {
      console.error('[AUTH_ERROR]', authError);
      
      // Rollback: deletar empresa criada
      await supabase
        .from('companies')
        .delete()
        .eq('id', tenantId);
      
      return {
        success: false,
        error: authError?.message === 'User already registered'
          ? 'Este email já está cadastrado'
          : 'Erro ao criar usuário. Tente novamente.',
      };
    }

    const userId = authData.user.id;

    // ===============================================
    // PASSO 4: Criar perfil do usuário
    // ===============================================
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        tenant_id: tenantId,
        name: validatedData.responsibleName,
        role: 'admin',
        phone: validatedData.responsiblePhone,
        active: true,
      });

    if (profileError) {
      console.error('[PROFILE_ERROR]', profileError);
      
      // Rollback: deletar empresa e usuário
      await supabase.auth.admin.deleteUser(userId);
      await supabase.from('companies').delete().eq('id', tenantId);
      
      return {
        success: false,
        error: 'Erro ao criar perfil. Tente novamente.',
      };
    }

    // ===============================================
    // PASSO 5: Criar assinatura trial (14 dias)
    // ===============================================
    const trialStartsAt = new Date();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        tenant_id: tenantId,
        plan: 'autozen',
        status: 'trial',
        amount: 97.0,
        trial_starts_at: trialStartsAt.toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
      });

    if (subscriptionError) {
      console.error('[SUBSCRIPTION_ERROR]', subscriptionError);
      
      // Continuar mesmo com erro na assinatura
      // Admin pode criar manualmente depois
    }

    // ===============================================
    // PASSO 6: Fazer login automático
    // ===============================================
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (loginError) {
      console.error('[AUTO_LOGIN_ERROR]', loginError);
      // Não é erro crítico, usuário pode fazer login manualmente
    }

    // ===============================================
    // SUCESSO!
    // ===============================================
    return {
      success: true,
      data: {
        userId,
        tenantId,
        email: validatedData.email,
      },
    };
  } catch (error) {
    console.error('[REGISTER_ACTION_ERROR]', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao criar conta',
    };
  }
}
