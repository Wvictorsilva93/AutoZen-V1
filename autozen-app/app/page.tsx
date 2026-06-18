'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [remember, setRemember] = useState(false);

  // Register state
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
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060a17] via-[#0a1628] to-[#060a17]" />

      {/* Orbes de luz ambiente */}
      <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-cyan-500/8 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-indigo-500/6 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Linhas de grade sutis */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      {/* Onda abstrata decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-[0.04]">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,160 C320,280 480,80 720,160 C960,240 1120,80 1440,160 L1440,320 L0,320 Z"
            fill="url(#wave-gradient)"
            className="animate-wave"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: 0.2 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* LADO ESQUERDO - Branding */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 py-12 lg:px-16">
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Logo integrada ao ambiente — sem caixa, sem moldura */}
          <div className="relative mb-6">
            {/* Glow sutil atrás da logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-autozen.png"
              alt="AutoZen"
              onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
              className="w-[290px] h-auto relative drop-shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            />
          </div>

          <p className="text-slate-500 text-sm max-w-xs leading-relaxed hidden lg:block">
            Tecnologia e tranquilidade para gestão automotiva
          </p>
        </div>
      </div>

      {/* LADO DIREITO - Auth Card */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div
          className={`w-full max-w-md transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Card glassmorphism premium */}
          <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] p-10">
            {/* Brilho sutil no topo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

            {/* Header do card */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {activeTab === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
              </h1>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {activeTab === 'login'
                  ? 'Gerencie sua operação com tranquilidade e eficiência.'
                  : 'Comece seu teste gratuito de 7 dias.'}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/[0.04] p-1 rounded-xl border border-white/[0.05]">
                <TabsTrigger
                  value="login"
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/20 text-slate-400 transition-all duration-300"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/20 text-slate-400 transition-all duration-300"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Tab Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-sm text-slate-300 font-medium">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="h-11 pl-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-sm text-slate-300 font-medium">
                        Senha
                      </Label>
                      <button
                        type="button"
                        className="text-xs text-blue-400/70 hover:text-blue-400 transition-colors"
                      >
                        Esqueceu?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="h-11 pl-10 pr-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                          remember
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-white/[0.15] group-hover:border-white/[0.25]'
                        }`}
                        onClick={() => setRemember(!remember)}
                      >
                        {remember && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                        Lembrar-me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-xs text-blue-400/70 hover:text-blue-400 transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl shadow-lg shadow-blue-600/15 hover:shadow-blue-500/25 transition-all duration-300 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Entrar no AutoZen'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Tab Cadastro */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="company-name" className="text-sm text-slate-300 font-medium">
                      Empresa
                    </Label>
                    <Input
                      id="company-name"
                      placeholder="Lava Jato Premium"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="responsible" className="text-sm text-slate-300 font-medium">
                      Responsável
                    </Label>
                    <Input
                      id="responsible"
                      placeholder="João Silva"
                      value={responsible}
                      onChange={(e) => setResponsible(e.target.value)}
                      required
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp" className="text-sm text-slate-300 font-medium">
                      WhatsApp
                    </Label>
                    <Input
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                      className="h-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-email" className="text-sm text-slate-300 font-medium">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        className="h-11 pl-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-password" className="text-sm text-slate-300 font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-11 pl-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl shadow-lg shadow-blue-600/15 hover:shadow-blue-500/25 transition-all duration-300 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Criar Empresa'
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    7 dias de teste gratuito · Sem cartão de crédito
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
