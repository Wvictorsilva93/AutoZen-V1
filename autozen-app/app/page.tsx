'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock, Check, Briefcase, Users, Car, TrendingUp, ArrowRight, CheckCircle, Shield, Zap, HeadphonesIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';

function StatCard({ icon: Icon, value, label, delay }: { icon: React.ElementType; value: string; label: string; delay: string }) {
  return (
    <div
      className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 transition-all duration-500 hover:bg-white/[0.06] hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5"
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-transparent to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
      <div className="relative flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center shrink-0 group-hover:from-blue-500/30 group-hover:to-cyan-500/20 transition-all duration-500">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors duration-300">{value}</div>
          <div className="text-xs text-slate-500 mt-0.5 group-hover:text-slate-400 transition-colors duration-300">{label}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-400">
      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-blue-400" />
      </div>
      <span>{text}</span>
    </div>
  );
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [remember, setRemember] = useState(false);

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
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-[#02050e] via-[#060f1e] to-[#02050e]">
      {/* === BACKGROUND LAYER === */}

      {/* Grade tecnológica */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTUwYTAiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      {/* Orbes de luz */}
      <div className="absolute top-[-12%] left-[-5%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] bg-gradient-to-br from-blue-600/15 via-blue-500/8 to-transparent rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute bottom-[-15%] right-[-8%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] bg-gradient-to-tl from-cyan-500/12 via-blue-500/6 to-transparent rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />

      {/* Linhas tecnológicas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-0 right-0 h-px opacity-[0.06]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 1">
            <line x1="0" y1="0" x2="1440" y2="0" stroke="url(#tech-line-1)" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute left-[25%] top-0 bottom-0 w-px opacity-[0.04]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1 900">
            <line x1="0" y1="0" x2="0" y2="900" stroke="url(#tech-line-2)" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Ondas decorativas */}
      <div className="absolute bottom-0 left-0 right-0 h-72 opacity-[0.025]">
        <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tech-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tech-line-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,200 C320,320 480,120 720,200 C960,280 1120,80 1440,200 L1440,400 L0,400 Z" fill="url(#wave-grad-1)" className="animate-wave-slow" />
          <path d="M0,220 C320,140 480,300 720,200 C960,100 1120,260 1440,220 L1440,400 L0,400 Z" fill="url(#wave-grad-2)" className="animate-wave-slower" style={{ animationDelay: '-4s' }} />
        </svg>
      </div>

      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              left: `${5 + (i * 4.8) % 95}%`,
              top: `${10 + (i * 7.2) % 85}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              background: i % 3 === 0 ? 'rgba(59,130,246,0.4)' : i % 3 === 1 ? 'rgba(6,182,212,0.3)' : 'rgba(99,102,241,0.25)',
              boxShadow: i % 2 === 0 ? '0 0 6px rgba(59,130,246,0.25)' : 'none',
              animationDuration: `${20 + (i % 7) * 3}s`,
              animationDelay: `${(i * 0.7) % 8}s`,
            }}
          />
        ))}
      </div>

      {/* === 60/40 LAYOUT === */}
      <div className="relative flex flex-col lg:flex-row w-full min-h-screen">

        {/* ========== LADO ESQUERDO (60%) — Branding Institucional ========== */}
        <div className="lg:w-[60%] flex flex-col items-center justify-center px-6 py-12 lg:px-16 lg:py-0 relative">
          <div
            className={`w-full max-w-xl transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Logo */}
            <div className="relative mb-10">
              <div className="absolute -inset-40 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] bg-gradient-to-r from-blue-600/15 via-cyan-500/8 to-blue-600/15 rounded-full blur-[120px]" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-autozen.png"
                alt="AutoZen"
                className="w-[280px] h-auto relative animate-logo-float"
              />
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              Gestão Inteligente para{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Lava Jatos e Estéticas Automotivas
              </span>
            </h1>

            <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-lg mb-10">
              Gerencie ordens de serviço, clientes, funcionários e finanças em um só lugar.
              Mais eficiência, menos papelada.
            </p>

            {/* Feature tags */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-12 max-w-md">
              <FeatureRow icon={CheckCircle} text="Ordens de Serviço digitais" />
              <FeatureRow icon={Users} text="Gestão de clientes" />
              <FeatureRow icon={Zap} text="Agenda inteligente" />
              <FeatureRow icon={Shield} text="Relatórios financeiros" />
              <FeatureRow icon={HeadphonesIcon} text="Suporte prioritário" />
              <FeatureRow icon={TrendingUp} text="Indicadores em tempo real" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <StatCard icon={Briefcase} value="2.4k+" label="Ordens de Serviço realizadas" delay="" />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <StatCard icon={Users} value="850+" label="Clientes cadastrados" delay="" />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <StatCard icon={Car} value="1.2k+" label="Veículos atendidos" delay="" />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <StatCard icon={TrendingUp} value="R$ 380k+" label="Faturamento processado" delay="" />
              </div>
            </div>
          </div>
        </div>

        {/* ========== LADO DIREITO (40%) — Auth Card ========== */}
        <div className="lg:w-[40%] flex items-center justify-center px-6 py-12 lg:py-0 relative">
          {/* Separador vertical sutil (só em desktop) */}
          <div className="absolute left-0 top-[10%] bottom-[10%] w-px hidden lg:block bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

          <div
            className={`w-full max-w-md transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-blue-500/20 via-white/[0.06] to-blue-500/10">
              <div className="absolute inset-0 rounded-3xl opacity-0 animate-border-glow bg-gradient-to-b from-blue-400/10 via-transparent to-cyan-400/5" />

              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-[0_12px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] p-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

                {/* Card header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-white tracking-tight">
                    {activeTab === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
                  </h1>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {activeTab === 'login'
                      ? 'Acesse sua plataforma com segurança e praticidade.'
                      : 'Comece seu teste gratuito de 7 dias — sem compromisso.'}
                  </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
                    <TabsTrigger
                      value="login"
                      className="rounded-lg text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/25 text-slate-400 transition-all duration-300"
                    >
                      Entrar
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="rounded-lg text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/25 text-slate-400 transition-all duration-300"
                    >
                      Criar Conta
                    </TabsTrigger>
                  </TabsList>

                  {error && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5 animate-fade-in-up">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="login-email" className="text-sm text-slate-300 font-medium">
                          E-mail
                        </Label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-focus-within:from-blue-600/20 group-focus-within:via-blue-500/10 group-focus-within:to-blue-600/20 transition-all duration-500 blur-sm" />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300 z-10" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            className="relative h-11 pl-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
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
                            className="text-xs text-blue-400/60 hover:text-blue-400 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-blue-400/40 hover:after:w-full after:transition-all after:duration-300"
                          >
                            Esqueceu?
                          </button>
                        </div>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-focus-within:from-blue-600/20 group-focus-within:via-blue-500/10 group-focus-within:to-blue-600/20 transition-all duration-500 blur-sm" />
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300 z-10" />
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            className="relative h-11 pl-10 pr-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10"
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
                                ? 'bg-blue-600 border-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                                : 'border-white/[0.15] group-hover:border-white/[0.3]'
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
                          className="text-xs text-blue-400/60 hover:text-blue-400 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-blue-400/40 hover:after:w-full after:transition-all after:duration-300"
                        >
                          Esqueci minha senha
                        </button>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="relative w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl shadow-lg shadow-blue-600/15 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-sm overflow-hidden"
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Entrar no AutoZen'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="company-name" className="text-sm text-slate-300 font-medium">
                          Empresa
                        </Label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-focus-within:from-blue-600/20 group-focus-within:via-blue-500/10 group-focus-within:to-blue-600/20 transition-all duration-500 blur-sm" />
                          <Input
                            id="company-name"
                            placeholder="Lava Jato Premium"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            className="relative h-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="responsible" className="text-sm text-slate-300 font-medium">
                          Responsável
                        </Label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-focus-within:from-blue-600/20 group-focus-within:via-blue-500/10 group-focus-within:to-blue-600/20 transition-all duration-500 blur-sm" />
                          <Input
                            id="responsible"
                            placeholder="João Silva"
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                            required
                            className="relative h-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="whatsapp" className="text-sm text-slate-300 font-medium">
                          WhatsApp
                        </Label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-focus-within:from-blue-600/20 group-focus-within:via-blue-500/10 group-focus-within:to-blue-600/20 transition-all duration-500 blur-sm" />
                          <Input
                            id="whatsapp"
                            placeholder="(11) 99999-9999"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            required
                            className="relative h-11 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="register-email" className="text-sm text-slate-300 font-medium">
                          E-mail
                        </Label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-focus-within:from-blue-600/20 group-focus-within:via-blue-500/10 group-focus-within:to-blue-600/20 transition-all duration-500 blur-sm" />
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300 z-10" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            required
                            className="relative h-11 pl-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="register-password" className="text-sm text-slate-300 font-medium">
                          Senha
                        </Label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-focus-within:from-blue-600/20 group-focus-within:via-blue-500/10 group-focus-within:to-blue-600/20 transition-all duration-500 blur-sm" />
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300 z-10" />
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="••••••••"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                            minLength={6}
                            className="relative h-11 pl-10 bg-white/[0.04] border-white/[0.08] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 text-white placeholder:text-slate-600 rounded-xl transition-all duration-300"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="relative w-full h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl shadow-lg shadow-blue-600/15 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-sm overflow-hidden"
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
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

            {/* Footer */}
            <p className="text-xs text-slate-600 text-center mt-6 tracking-wide">
              &copy; {new Date().getFullYear()} AutoZen. Todos os direitos reservados.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
