'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Calendar,
  Columns3,
  DollarSign,
  Package,
  UserCog,
  BarChart3,
  Shield,
  Menu,
  X,
  Trophy,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Clientes', href: '/clientes', icon: Users,
    children: [{ name: 'Ranking', href: '/clientes/ranking', icon: Trophy }],
  },
  { name: 'Veículos', href: '/veiculos', icon: Car },
  { name: 'Serviços', href: '/servicos', icon: Wrench },
  { name: 'Agendamento', href: '/agendamento', icon: Calendar },
  { name: 'Kanban (OS)', href: '/kanban', icon: Columns3 },
  { name: 'Check-in', href: '/checkin', icon: ClipboardCheck },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Estoque', href: '/estoque', icon: Package },
  { name: 'Funcionários', href: '/funcionarios', icon: UserCog },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
];

const adminNavigation = [
  { name: 'Super Admin', href: '/admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSuperAdmin } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card border border-border shadow-lg"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-center h-[72px] px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-autozen.png"
              alt="AutoZen"
              onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute right-4 text-muted-foreground hover:text-foreground"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const hasChildren = 'children' in item && item.children && item.children.length > 0;
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
                    isActive
                      ? 'text-primary bg-primary/10 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:rounded-r-full before:bg-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                  <span>{item.name}</span>
                </Link>
                {hasChildren && 'children' in item && item.children?.map((child) => {
                  const childActive = pathname === child.href || pathname.startsWith(child.href + '/');
                  return (
                    <Link
                      key={child.name}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg text-sm transition-all duration-200',
                        childActive
                          ? 'text-primary bg-primary/5'
                          : 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-sidebar-accent'
                      )}
                    >
                      <child.icon className={cn('w-4 h-4 flex-shrink-0', childActive && 'text-primary')} />
                      <span>{child.name}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          <div className="pt-4 mt-4 border-t border-sidebar-border">
            {isSuperAdmin && adminNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
