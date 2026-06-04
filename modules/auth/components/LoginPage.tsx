'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Car, DollarSign, Calendar, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function LoginPage() {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({
    companyName: '',
    ownerName: '',
    whatsapp: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { loginAction } = await import('@/lib/auth/actions')
      const result = await loginAction(loginData.email, loginData.password)

      if (!result.success) {
        setError(result.error || 'Erro ao fazer login')
        return
      }

      // Redirect será feito pelo middleware
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Erro inesperado ao fazer login')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { signupAction } = await import('@/lib/auth/actions')
      const result = await signupAction(signupData)

      if (!result.success) {
        setError(result.error || 'Erro ao criar conta')
        return
      }

      // Redirect será feito pelo middleware
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Erro inesperado ao criar conta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      icon: Car,
      label: 'Veículos em atendimento',
      value: '12',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: DollarSign,
      label: 'Caixa do dia',
      value: 'R$ 2.450',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Calendar,
      label: 'Agendamentos',
      value: '8',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: FileText,
      label: 'OS abertas',
      value: '15',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Lado Esquerdo - Apresentação */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <div className="space-y-2">
            <div className="relative w-64 h-32 mb-6">
              <Image
                src="/logo.png"
                alt="AutoZen"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Título */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Tranquilidade e eficiência
              <br />
              <span className="text-cyan-400">na gestão do seu negócio</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
              Controle clientes, veículos, serviços, estoque, financeiro e operação em um único sistema.
            </p>
          </div>

          {/* Cards Animados */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="glass group hover:bg-white/10 rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulários */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        {/* Background glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo Mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="relative w-48 h-24">
              <Image
                src="/logo.png"
                alt="AutoZen"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <Card className="glass border-slate-800 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-white">Bem-vindo ao AutoZen</CardTitle>
              <CardDescription className="text-slate-400">
                Entre na sua conta ou crie uma nova empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar Empresa</TabsTrigger>
                </TabsList>

                {/* Tab Login */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-slate-300">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-slate-300">
                        Senha
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold h-11 glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Entrando...' : 'Entrar no AutoZen'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Tab Cadastro */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-slate-300">
                        Nome da Empresa
                      </Label>
                      <Input
                        id="company-name"
                        type="text"
                        placeholder="Lava Jato Premium"
                        value={signupData.companyName}
                        onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-name" className="text-slate-300">
                        Responsável
                      </Label>
                      <Input
                        id="owner-name"
                        type="text"
                        placeholder="João Silva"
                        value={signupData.ownerName}
                        onChange={(e) => setSignupData({ ...signupData, ownerName: e.target.value })}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-slate-300">
                        WhatsApp
                      </Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={signupData.whatsapp}
                        onChange={(e) => setSignupData({ ...signupData, whatsapp: e.target.value })}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-slate-300">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-300">
                        Senha
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold h-11 glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Criando...' : 'Criar Minha Empresa'}
                    </Button>
                    <p className="text-xs text-slate-400 text-center">
                      7 dias de teste grátis • Sem cartão de crédito
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-8">
            © 2026 AutoZen • Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Animações CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
