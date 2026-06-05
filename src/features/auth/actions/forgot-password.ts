'use server';

// AutoZen - Forgot Password Server Action
import { createClient } from '@/src/lib/supabase/server';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../validators/forgot-password.schema';

export interface ForgotPasswordResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function forgotPasswordAction(
  formData: ForgotPasswordFormData
): Promise<ForgotPasswordResult> {
  try {
    // Validar dados
    const validatedData = forgotPasswordSchema.parse(formData);

    // Criar cliente Supabase
    const supabase = await createClient();

    // Enviar email de recuperação
    const { error } = await supabase.auth.resetPasswordForEmail(
      validatedData.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      }
    );

    if (error) {
      console.error('[FORGOT_PASSWORD_ERROR]', error);
      
      // Não revelar se o email existe ou não (segurança)
      return {
        success: true,
        message: 'Se o email existir em nossa base, você receberá as instruções de recuperação.',
      };
    }

    return {
      success: true,
      message: 'Email de recuperação enviado! Verifique sua caixa de entrada.',
    };
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ACTION_ERROR]', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao enviar email de recuperação',
    };
  }
}
