'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Wrench, Eye, EyeOff } from 'lucide-react'

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

      if (data.user.role === 'super_admin') {
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'var(--accent)', filter: 'blur(100px)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'var(--accent)', filter: 'blur(100px)' }} />
      </div>

      <div className="w-full max-w-md animate-fadeIn relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--accent)' }}>
            <Wrench size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>AutoZen</h1>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Gestão Automotiva Inteligente</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Entrar na sua conta
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/register" className="text-sm" style={{ color: 'var(--accent)' }}>
              Criar uma conta
            </Link>
          </div>

          <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
            <p className="font-medium mb-1">Contas de teste:</p>
            <p>Super Admin: superadmin@autozen.com / admin123</p>
            <p>Admin: admin@oficina.com / 123456</p>
            <p>Func: funcionario@oficina.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
