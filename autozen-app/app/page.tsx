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
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-gradient-to-br from-[#02050e] via-[#060f1e] to-[#02050e]">
      {/* === BACKGROUND LAYER === */}

      {/* Grade tecnológica sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTUwYTAiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      {/* Orbes de luz ambiente — mais refinadas */}
      <div className="absolute top-[-12%] left-[-8%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-blue-600/15 via-blue-500/8 to-transparent rounded-full blur-[140px] animate-glow-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-gradient-to-tl from-cyan-500/12 via-blue-500/6 to-transparent rounded-full blur-[140px] animate-glow-pulse" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-[35%] left-[40%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-gradient-to-r from-indigo-500/8 via-blue-500/4 to-transparent rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '4s' }} />

      {/* Linhas de luz tecnológicas — abstratas e elegantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Linha horizontal superior */}
        <div className="absolute top-[15%] left-0 right-0 h-px opacity-[0.08]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 1">
            <line x1="0" y1="0" x2="1440" y2="0" stroke="url(#tech-line-1)" strokeWidth="1" />
          </svg>
        </div>
        {/* Linha vertical esquerda */}
        <div className="absolute left-[20%] top-0 bottom-0 w-px opacity-[0.06]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1 900">
            <line x1="0" y1="0" x2="0" y2="900" stroke="url(#tech-line-2)" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Ondas abstratas decorativas — mais sofisticadas */}
      <div className="absolute bottom-0 left-0 right-0 h-72 opacity-[0.03]">
        <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,200 C320,320 480,120 720,200 C960,280 1120,80 1440,200 L1440,400 L0,400 Z" fill="url(#wave-grad)" className="animate-wave-slow" />
          <path d="M0,220 C320,140 480,300 720,200 C960,100 1120,260 1440,220 L1440,400 L0,400 Z" fill="url(#wave-grad-2)" className="animate-wave-slower" style={{ animationDelay: '-4s' }} />
        </svg>
      </div>

      {/* Partículas flutuantes — mais refinadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              left: `${5 + (i * 3.8) % 95}%`,
              top: `${10 + (i * 7.2) % 85}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              background: i % 3 === 0 ? 'rgba(59,130,246,0.35)' : i % 3 === 1 ? 'rgba(6,182,212,0.25)' : 'rgba(99,102,241,0.2)',
              boxShadow: i % 2 === 0 ? '0 0 6px rgba(59,130,246,0.2)' : 'none',
              animationDuration: `${18 + (i % 7) * 3}s`,
              animationDelay: `${(i * 0.7) % 8}s`,
            }}
          />
        ))}
      </div>

      {/* === LADO ESQUERDO — Branding === */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 py-12 lg:px-16">
        <div
          className={`flex flex-col items-center text-center transition-all duration-1200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Logo — sem caixa, integrada ao ambiente */}
          <div className="relative mb-6">
            {/* Camadas de glow atrás da logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 rounded-full blur-[120px] animate-glow-pulse" />
              <div className="w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-autozen.png"
              alt="AutoZen"
              onError={(e) => { e.currentTarget.src = ''; }}
              className="w-[300px] h-auto relative animate-logo-float [mix-blend-mode:screen] drop-shadow-[0_0_40px_rgba(59,130,246,0.2)]"
            />
          </div>

          <p className="text-slate-500 text-sm max-w-xs leading-relaxed hidden lg:block tracking-wide">
            Tecnologia e tranquilidade para gestão automotiva
          </p>
        </div>
      </div>

      {/* === LADO DIREITO — Auth Card === */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div
          className={`w-full max-w-md transition-all duration-1200 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Card premium com borda animada */}
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-blue-500/20 via-white/[0.06] to-blue-500/10">
            {/* Brilho pulsante na borda */}
            <div className="absolute inset-0 rounded-3xl opacity-0 animate-border-glow bg-gradient-to-b from-blue-400/10 via-transparent to-cyan-400/5" />

            {/* Conteúdo do card */}
            <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-[0_12px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] p-10">
              {/* Brilho no topo */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

              {/* Header do card */}
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
                  <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
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
  );
}
