'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';

// Floating particle definition
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  color: string;
}

const COLORS = [
  'oklch(0.60 0.22 272 / 0.5)',  // indigo
  'oklch(0.68 0.22 295 / 0.45)', // violet
  'oklch(0.65 0.18 160 / 0.4)',  // emerald
  'oklch(0.75 0.18 258 / 0.4)',  // blue
];

function generateParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    dur: Math.random() * 8 + 6,
    delay: Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [particles] = useState(() => generateParticles(28));

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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(
          error.message === 'Invalid login credentials'
            ? 'E-mail ou senha incorretos. Verifique seus dados.'
            : error.message
        );
        return;
      }
      window.location.href = '/dashboard';
    } catch {
      setError('Não foi possível conectar. Verifique sua configuração.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">

      {/* ── Deep ambient layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient orb — top center */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, oklch(0.60 0.22 272 / 0.12) 0%, transparent 70%)' }}
        />
        {/* Violet orb — bottom left */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, oklch(0.68 0.22 295 / 0.08) 0%, transparent 70%)' }}
        />
        {/* Emerald accent — top right */}
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, oklch(0.65 0.18 160 / 0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Grid pattern ── */}
      <div className="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animation: `float ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main content card ── */}
      <div
        className={`
          relative w-full max-w-[420px] px-5 transition-all duration-700 ease-out
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* Logo & brand */}
        <div className="flex flex-col items-center mb-9">
          <div className="relative mb-5">
            {/* Multi-layer glow behind logo */}
            <div className="absolute -inset-10 rounded-full animate-glow-pulse opacity-70"
              style={{ background: 'radial-gradient(ellipse, oklch(0.60 0.22 272 / 0.18) 0%, transparent 70%)' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-autozen.png"
              alt="AutoZen"
              className="relative w-60 h-auto object-contain drop-shadow-[0_0_32px_oklch(0.60_0.22_272_/_0.3)]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Gestão automotiva premium</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl shadow-[0_24px_80px_oklch(0_0_0_/_0.45),0_0_0_1px_oklch(0.60_0.22_272_/_0.08)] p-7">

          {/* Card header */}
          <div className="mb-7 text-center">
            <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">
              Acesse sua conta
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bem-vindo de volta. Gerencie sua operação com eficiência.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 flex items-start gap-2.5 animate-scale-in">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
              <p className="text-sm text-destructive/90 leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                E-mail
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 pl-10 bg-muted/30 border-border/50 focus:border-primary/60 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/40 rounded-xl text-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Senha
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 pl-10 pr-11 bg-muted/30 border-border/50 focus:border-primary/60 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/40 rounded-xl text-sm transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded-md border border-border/60 bg-muted/30 peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                    {rememberMe && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Lembrar-me
                </span>
              </label>

              <button
                type="button"
                className="text-xs text-primary/70 hover:text-primary transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="w-full h-11 mt-2 relative overflow-hidden text-sm font-semibold rounded-xl transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, oklch(0.60 0.22 272) 0%, oklch(0.55 0.22 285) 100%)',
                boxShadow: '0 4px 24px oklch(0.60 0.22 272 / 0.35)',
              }}
            >
              {/* Hover shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Entrar no AutoZen
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground/40 mt-7">
          © {new Date().getFullYear()} AutoZen. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
