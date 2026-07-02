'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login')
        return
      }

      if (data.user?.role === 'super_admin') {
        router.push('/super-admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030712]">
      {/* Background Gradients & Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[100vw] h-[40vw] rounded-full bg-sky-900/10 blur-[150px] mix-blend-screen" />
        {/* Subtle dot pattern for visual depth */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      </div>

      {/* Main Logo Top Centered */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        {/* We apply mix-blend-screen to gracefully remove black backgrounds from the logo */}
        <img 
          src="/logo.png" 
          alt="AutoZen Logo" 
          className="h-12 md:h-16 object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.3)] opacity-90 transition-opacity hover:opacity-100"
          style={{ mixBlendMode: 'screen' }}
          onError={(e) => {
            // Hide if logo not found
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] px-6 relative z-10 animate-fadeIn mt-16 md:mt-0">
        <div className="backdrop-blur-2xl bg-[#0f172a]/40 border border-white/[0.08] rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/5 before:pointer-events-none">
          
          <div className="text-center mb-8">
            {/* Small AZ Logo / Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-white/10 shadow-[0_0_20px_rgba(8,145,178,0.2)]">
              <span className="text-xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">AZ</span>
            </div>
            
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-2.5">
              Bem-vindo ao AutoZen
            </h1>
            <p className="text-[14px] text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              Tranquilidade e eficiência na gestão do seu negócio.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl text-[13px] bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-slate-300 ml-1">
                E-mail
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-3 rounded-xl outline-none focus:bg-white/[0.05] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 placeholder:text-slate-600"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-slate-300 ml-1">
                Senha
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] text-white px-4 py-3 rounded-xl outline-none focus:bg-white/[0.05] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 placeholder:text-slate-600 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-xl font-medium text-[15px] py-3.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                {/* Button Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:scale-105 transition-transform duration-500" />
                
                {/* Button Glow/Luminous Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_70%)]" />
                
                {/* Button Content */}
                <span className="relative flex items-center justify-center text-white shadow-sm">
                  {loading ? 'Entrando...' : 'Entrar no Sistema'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Below Card Links & Utilities */}
        <div className="mt-8 text-center space-y-6">
          <Link href="/register" className="text-[13px] text-slate-400 hover:text-white transition-colors duration-200">
            Ainda não tem uma conta? <span className="text-cyan-400 font-medium">Criar conta</span>
          </Link>
          
          {/* Subtle Dev Test Accounts (Can be safely ignored/removed by user later) */}
          <div className="text-[10px] text-slate-500/40 flex flex-col items-center space-y-1 select-none">
            <p>Super Admin: superadmin@autozen.com / admin123</p>
            <p>Admin: admin@oficina.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
