'use client';

// AutoZen - Forgot Password Page
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/src/features/auth/validators/forgot-password.schema';
import { forgotPasswordAction } from '@/src/features/auth/actions/forgot-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await forgotPasswordAction(data);

      if (!result.success) {
        setError(result.error || 'Erro ao enviar email');
        return;
      }

      setSuccess(result.message || 'Email enviado com sucesso');
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card Glass Premium */}
        <div className="relative bg-[#151D2F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-8">
          {/* Glow interno */}
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Auto<span className="text-[#3B82F6]">Zen</span>
            </h1>
          </div>

          {/* Ícone */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#3B82F6]" />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Esqueceu sua senha?
            </h2>
            <p className="text-sm text-gray-400">
              Digite seu email e enviaremos as instruções para recuperação
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-200">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                disabled={isPending}
                {...register('email')}
                className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Erro */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Sucesso */}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            {/* Botão submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-11 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-[#2563EB]/20"
            >
              {isPending ? 'Enviando...' : 'Enviar Email de Recuperação'}
            </Button>

            {/* Voltar */}
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-[#3B82F6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para login
            </Link>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          &copy; 2026 AutoZen. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
