'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const preloaded = sessionStorage.getItem('az_splash');
    const delay = preloaded ? 50 : 1800;
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: unknown } }) => {
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
        email,
        password,
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060b18]">
      {/* Ambient gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060b18] via-[#0a1628] to-[#060b18]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-blue-600/[0.07] via-cyan-500/[0.03] to-transparent rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-gradient-to-t from-blue-800/[0.06] to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/[0.04] to-transparent rounded-full blur-[100px]" />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated orbs */}
      <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-blue-400/30 animate-pulse" />
      <div className="absolute top-40 right-[20%] w-1.5 h-1.5 rounded-full bg-cyan-400/25 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-[30%] w-1 h-1 rounded-full bg-blue-300/20 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[60%] right-[15%] w-2 h-2 rounded-full bg-cyan-300/20 animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Main content */}
      <div
        className={`relative w-full max-w-md px-6 transition-all duration-1000 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Logo area with glow */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            {/* Glow behind logo */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-cyan-400/15 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/8 to-blue-600/10 rounded-full blur-xl" />
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-autozen.png"
              alt="AutoZen"
              className="relative w-64 h-auto drop-shadow-[0_0_40px_rgba(59,130,246,0.25)]"
            />
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_80px_rgba(59,130,246,0.06)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gerencie sua operação com tranquilidade e eficiência.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-slate-300 font-medium">
                E-mail
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-slate-300 font-medium">
                Senha
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-11 pr-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/[0.12] bg-white/[0.04] peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200 flex items-center justify-center">
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Lembrar-me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400/80 hover:text-blue-300 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 transition-all duration-300 text-sm tracking-wide"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Entrar no AutoZen'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-600 text-center mt-8">
          &copy; {new Date().getFullYear()} AutoZen. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
