'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
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

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center">
        {/* Logo no mobile (no desktop a sidebar já exibe) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-autozen.png"
          alt="AutoZen"
          onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
          className="h-11 w-auto object-contain ml-10 lg:hidden"
        />
        <div className="hidden lg:block">
          <h2 className="text-sm font-medium text-white">
            {profile?.name ? `Olá, ${profile.name.split(' ')[0]}` : 'Bem-vindo ao AutoZen'}
          </h2>
          {roleLabel && <p className="text-xs text-muted-foreground">{roleLabel}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <InstallPWA />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" aria-label="Perfil">
          <User className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-red-400"
          aria-label="Sair"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
