'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Bell, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { useProfile } from '@/hooks/useProfile';
import { InstallPWA } from '@/components/install-pwa';
import { cn } from '@/lib/utils';

export function TopBar() {
  const router = useRouter();
  const { profile } = useProfile();

  async function handleLogout() {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
  }

  const roleLabel =
    profile?.role === 'super_admin'   ? 'Super Admin'   :
    profile?.role === 'admin_empresa' ? 'Administrador' :
    profile?.role === 'funcionario'   ? 'Funcionário'   : '';

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AZ';

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  })();

  return (
    <header className="h-16 border-b border-border/40 flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-xl sticky top-0 z-30">

      {/* Left — greeting or mobile logo */}
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-autozen.png"
          alt="AutoZen"
          onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
          className="h-9 w-auto object-contain ml-10 lg:hidden"
        />
        <div className="hidden lg:block">
          <h2 className="text-sm font-semibold text-foreground leading-tight">
            {greeting},{' '}
            <span className="gradient-text">
              {profile?.name ? profile.name.split(' ')[0] : 'bem-vindo'}
            </span>
          </h2>
          {roleLabel && (
            <p className="text-[11px] text-muted-foreground/70">{roleLabel}</p>
          )}
        </div>
      </div>

      {/* Center — Search bar (desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <button
          id="topbar-search"
          className={cn(
            'w-full flex items-center gap-2.5 px-3.5 h-9 rounded-xl',
            'bg-muted/40 border border-border/50 hover:border-primary/30',
            'text-muted-foreground hover:text-foreground',
            'text-sm transition-all duration-200 group'
          )}
          aria-label="Buscar"
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 text-left truncate text-sm opacity-60">
            Buscar clientes, OS, veículos...
          </span>
          <span className="hidden lg:flex items-center gap-0.5 text-[10px] font-mono bg-muted border border-border/60 rounded px-1 py-0.5 opacity-50">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1">
        <InstallPWA />

        {/* Mobile search */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
          aria-label="Notificações"
        >
          <Bell className="w-4 h-4" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-border/50 mx-1" />

        {/* User menu */}
        <button
          id="topbar-user-menu"
          onClick={handleLogout}
          title="Clique para sair"
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-xl',
            'hover:bg-muted/50 transition-colors duration-200 group'
          )}
        >
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
            {initials}
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground hidden lg:block" />
        </button>

        {/* Logout button (explicit, desktop) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="hidden lg:flex text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          aria-label="Sair"
          id="topbar-logout"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
