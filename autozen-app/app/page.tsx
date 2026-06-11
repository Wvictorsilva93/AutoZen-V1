'use client';

import { useState } from 'react';
import { Car, DollarSign, Calendar, FileText, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';

const statsCards = [
  { icon: Car, label: 'Veículos em atendimento', value: '12', color: 'from-blue-500 to-cyan-500' },
  { icon: DollarSign, label: 'Caixa do dia', value: 'R$ 2.450', color: 'from-emerald-500 to-green-500' },
  { icon: Calendar, label: 'Agendamentos', value: '8', color: 'from-violet-500 to-purple-500' },
  { icon: FileText, label: 'OS abertas', value: '5', color: 'from-amber-500 to-orange-500' },
];

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [companyName, setCompanyName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
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
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            company_name: companyName,
            responsible,
            whatsapp,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Lado Esquerdo - Branding */}
      <div className="relative flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-0">
        <div className="max-w-lg mx-auto lg:mx-0">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center glow-blue">
              <Car className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              AutoZen
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-2xl lg:text-4xl font-semibold text-white leading-tight mb-4">
            Tranquilidade e eficiência na gestão do seu negócio
          </h2>

          {/* Subtitle */}
          <p className="text-base lg:text-lg text-slate-400 mb-10">
            Controle clientes, veículos, serviços, estoque, financeiro e operação em um único sistema.
          </p>

          {/* Animated stats cards */}
          <div className="grid grid-cols-2 gap-3">
            {statsCards.map((card, i) => (
              <div
                key={card.label}
                className="glass-card rounded-xl p-4 animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-2 opacity-90`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-slate-400">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado Direito - Auth Card */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md glass rounded-2xl p-8 glow-blue">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Criar Empresa
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Tab Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-slate-300">Senha</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium h-11 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar no AutoZen'}
                </Button>
              </form>
            </TabsContent>

            {/* Tab Cadastro */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-slate-300">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    placeholder="Lava Jato Premium"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsible" className="text-slate-300">Responsável</Label>
                  <Input
                    id="responsible"
                    placeholder="João Silva"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-slate-300">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-slate-300">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-slate-300">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium h-11 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Empresa'}
                </Button>

                <p className="text-xs text-slate-500 text-center mt-3">
                  7 dias de teste gratuito. Sem cartão de crédito.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
