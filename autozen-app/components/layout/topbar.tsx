'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { useProfile } from '@/hooks/useProfile';
import { InstallPWA } from '@/components/install-pwa';

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

  const roleLabel = profile?.role === 'super_admin' ? 'Super Admin'
    : profile?.role === 'admin_empresa' ? 'Administrador'
    : profile?.role === 'funcionario' ? 'Funcionário' : '';

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AZ';

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  })();

  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 bg-card/40 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-autozen.png"
          alt="AutoZen"
          onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
          className="h-9 w-auto object-contain ml-10 lg:hidden"
        />
        <div className="hidden lg:block">
          <h2 className="text-sm font-semibold text-foreground">
            {greeting}, {profile?.name ? profile.name.split(' ')[0] : 'bem-vindo'}
          </h2>
          <p className="text-xs text-muted-foreground/80">{roleLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <InstallPWA />

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-accent/10"
          aria-label="Notificações"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </Button>

        <div className="flex items-center gap-2 pl-2 ml-2 border-l border-border/50">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {initials}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
