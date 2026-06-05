'use client';

// AutoZen - Login Form Component
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../validators/login.schema';
import { loginAction } from '../actions/login';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setError(null);

    startTransition(async () => {
      const result = await loginAction(data);

      if (!result.success) {
        setError(result.error || 'Erro ao fazer login');
        return;
      }

      // Sucesso - redirecionar
      router.push('/dashboard');
      router.refresh();
    });
  };

  return (
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

      {/* Senha */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-gray-200">
            Senha
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isPending}
          {...register('password')}
          className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
        />
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Erro geral */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Botão submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-11 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-[#2563EB]/20"
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
