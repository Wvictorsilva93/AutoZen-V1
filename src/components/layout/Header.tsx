'use client';

// AutoZen - Header Component
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/src/providers/auth-provider';
import { useTenant } from '@/src/providers/tenant-provider';
import { logoutAction } from '@/src/features/auth/actions/login';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, company } = useTenant();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-[#151D2F] border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Menu mobile */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Breadcrumb / Título da página */}
        <div>
          <h2 className="text-lg font-semibold text-white">
            {company?.name || 'Carregando...'}
          </h2>
          <p className="text-xs text-gray-400">
            {profile?.role === 'admin' ? 'Administrador' : profile?.role}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        {/* Notificações */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
        </Button>

        {/* Menu do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-3 text-gray-400 hover:text-white"
            >
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {profile?.name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#151D2F] border-white/[0.08]">
            <DropdownMenuLabel className="text-gray-400">
              Minha Conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.08]" />
            <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-[#0A0F1C]">
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-[#0A0F1C]">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.08]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
