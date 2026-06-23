'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    const preloaded = sessionStorage.getItem('az_splash');
    const delay = preloaded ? 50 : 1800;
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/dashboard';
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError('Sistema não configurado. Tente novamente em instantes.');
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : error.message);
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Não foi possível conectar ao Supabase. Verifique a configuração do projeto em .env.local.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          company_name: companyName,
          responsible,
          whatsapp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar conta.');
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        setError('Conta criada. Faça login para entrar.');
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: registerEmail,
        password: registerPassword,
      });

      if (signInError) {
        setError('Conta criada, mas falha ao entrar. Tente fazer login.');
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Não foi possível conectar ao Supabase. Verifique a configuração do projeto em .env.local.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/[0.04] via-blue-400/[0.02] to-transparent rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-400/[0.03] via-blue-500/[0.01] to-transparent rounded-full blur-[100px]" />

      <div
        className={`relative w-full max-w-sm px-6 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo-autozen.png"
              alt="AutoZen"
              className="w-48 h-auto mb-6"
            />
            <h1 className="text-lg font-semibold text-white tracking-tight">
              {isLogin ? 'Acessar plataforma' : 'Criar conta'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLogin
                ? 'Informe seus dados para entrar'
                : 'Comece seu teste gratuito de 7 dias'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="company-name" className="text-sm text-slate-400 font-medium">
                    Empresa
                  </Label>
                  <Input
                    id="company-name"
                    placeholder="Lava Jato Premium"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="h-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 text-white placeholder:text-slate-600 rounded-lg transition-all duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="responsible" className="text-sm text-slate-400 font-medium">
                    Responsável
                  </Label>
                  <Input
                    id="responsible"
                    placeholder="João Silva"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    required
                    className="h-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 text-white placeholder:text-slate-600 rounded-lg transition-all duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className="text-sm text-slate-400 font-medium">
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="h-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 text-white placeholder:text-slate-600 rounded-lg transition-all duration-300"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-slate-400 font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={isLogin ? loginEmail : registerEmail}
                  onChange={(e) => {
                    const v = e.target.value;
                    isLogin ? setLoginEmail(v) : setRegisterEmail(v);
                  }}
                  required
                  className="h-10 pl-9 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 text-white placeholder:text-slate-600 rounded-lg transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-slate-400 font-medium">
                  Senha
                </Label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={isLogin ? loginPassword : registerPassword}
                  onChange={(e) => {
                    const v = e.target.value;
                    isLogin ? setLoginPassword(v) : setRegisterPassword(v);
                  }}
                  required
                  minLength={!isLogin ? 6 : undefined}
                  className="h-10 pl-9 pr-9 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 text-white placeholder:text-slate-600 rounded-lg transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all duration-300 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                isLogin ? 'Entrar' : 'Criar empresa'
              )}
            </Button>
          </form>

          {!isLogin && (
            <p className="text-xs text-slate-600 text-center mt-4">
              7 dias de teste gratuito · Sem cartão de crédito
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-700 text-center mt-6">
          &copy; {new Date().getFullYear()} AutoZen. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
