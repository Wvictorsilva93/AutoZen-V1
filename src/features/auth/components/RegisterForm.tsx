'use client';

// AutoZen - Register Form Component
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../validators/register.schema';
import { registerAction } from '../actions/register';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const acceptTerms = watch('acceptTerms');

  const onSubmit = (data: RegisterFormData) => {
    setError(null);

    startTransition(async () => {
      const result = await registerAction(data);

      if (!result.success) {
        setError(result.error || 'Erro ao criar conta');
        return;
      }

      // Sucesso - redirecionar
      router.push('/dashboard');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
      {/* Dados da Empresa */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-200 pb-2 border-b border-white/10">
          Dados da Empresa
        </h3>

        {/* Nome Empresa */}
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium text-gray-200">
            Nome da Empresa *
          </label>
          <Input
            id="companyName"
            type="text"
            placeholder="Auto Center Exemplo"
            disabled={isPending}
            {...register('companyName')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          {errors.companyName && (
            <p className="text-xs text-red-400">{errors.companyName.message}</p>
          )}
        </div>

        {/* CNPJ */}
        <div className="space-y-2">
          <label htmlFor="cnpj" className="text-sm font-medium text-gray-200">
            CNPJ (Opcional)
          </label>
          <Input
            id="cnpj"
            type="text"
            placeholder="00.000.000/0000-00"
            disabled={isPending}
            {...register('cnpj')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          {errors.cnpj && (
            <p className="text-xs text-red-400">{errors.cnpj.message}</p>
          )}
        </div>

        {/* Telefone Empresa */}
        <div className="space-y-2">
          <label htmlFor="companyPhone" className="text-sm font-medium text-gray-200">
            Telefone/WhatsApp *
          </label>
          <Input
            id="companyPhone"
            type="tel"
            placeholder="(00) 00000-0000"
            disabled={isPending}
            {...register('companyPhone')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          {errors.companyPhone && (
            <p className="text-xs text-red-400">{errors.companyPhone.message}</p>
          )}
        </div>

        {/* Email Empresa */}
        <div className="space-y-2">
          <label htmlFor="companyEmail" className="text-sm font-medium text-gray-200">
            Email da Empresa *
          </label>
          <Input
            id="companyEmail"
            type="email"
            placeholder="contato@empresa.com"
            disabled={isPending}
            {...register('companyEmail')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          {errors.companyEmail && (
            <p className="text-xs text-red-400">{errors.companyEmail.message}</p>
          )}
        </div>
      </div>

      {/* Dados do Responsável */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-200 pb-2 border-b border-white/10">
          Dados do Responsável
        </h3>

        {/* Nome Responsável */}
        <div className="space-y-2">
          <label htmlFor="responsibleName" className="text-sm font-medium text-gray-200">
            Nome Completo *
          </label>
          <Input
            id="responsibleName"
            type="text"
            placeholder="João da Silva"
            disabled={isPending}
            {...register('responsibleName')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          {errors.responsibleName && (
            <p className="text-xs text-red-400">{errors.responsibleName.message}</p>
          )}
        </div>

        {/* Telefone Responsável */}
        <div className="space-y-2">
          <label htmlFor="responsiblePhone" className="text-sm font-medium text-gray-200">
            Telefone/WhatsApp *
          </label>
          <Input
            id="responsiblePhone"
            type="tel"
            placeholder="(00) 00000-0000"
            disabled={isPending}
            {...register('responsiblePhone')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          {errors.responsiblePhone && (
            <p className="text-xs text-red-400">{errors.responsiblePhone.message}</p>
          )}
        </div>
      </div>

      {/* Credenciais */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-200 pb-2 border-b border-white/10">
          Credenciais de Acesso
        </h3>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-200">
            Email de Acesso *
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
          <label htmlFor="password" className="text-sm font-medium text-gray-200">
            Senha *
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            {...register('password')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          <p className="text-xs text-gray-400">
            Mínimo 8 caracteres, com maiúsculas, minúsculas e números
          </p>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmar Senha */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
            Confirmar Senha *
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            {...register('confirmPassword')}
            className="bg-[#0A0F1C] border-white/10 text-white placeholder:text-gray-500 focus:border-[#3B82F6]"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Termos */}
      <div className="flex items-start space-x-3 pt-2">
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
          disabled={isPending}
          className="mt-1"
        />
        <label htmlFor="acceptTerms" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
          Aceito os{' '}
          <a href="/termos" target="_blank" className="text-[#3B82F6] hover:underline">
            Termos de Uso
          </a>{' '}
          e a{' '}
          <a href="/privacidade" target="_blank" className="text-[#3B82F6] hover:underline">
            Política de Privacidade
          </a>
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-xs text-red-400">{errors.acceptTerms.message}</p>
      )}

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
        {isPending ? 'Criando conta...' : 'Criar Empresa'}
      </Button>

      {/* Trial info */}
      <p className="text-center text-xs text-gray-400">
        Você terá 14 dias de teste grátis. Sem necessidade de cartão de crédito.
      </p>
    </form>
  );
}
