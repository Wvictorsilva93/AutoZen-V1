'use client';

import { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';

type NavChild = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavChild[];
};

const navigation: NavItem[] = [
  { name: 'Dashboard',    href: '/dashboard',   icon: LayoutDashboard },
  {
    name: 'Clientes',     href: '/clientes',     icon: Users,
    children: [{ name: 'Ranking', href: '/clientes/ranking', icon: Trophy }],
  },
  { name: 'Veículos',     href: '/veiculos',     icon: Car },
  { name: 'Serviços',     href: '/servicos',     icon: Wrench },
  { name: 'Agendamento',  href: '/agendamento',  icon: Calendar },
  { name: 'Fila de OS',   href: '/kanban',       icon: Columns3 },
  { name: 'Check-in',    href: '/checkin',      icon: ClipboardCheck },
  { name: 'Financeiro',  href: '/financeiro',   icon: DollarSign },
  { name: 'Estoque',     href: '/estoque',      icon: Package },
  { name: 'Funcionários',href: '/funcionarios', icon: UserCog },
  { name: 'Relatórios',  href: '/relatorios',   icon: BarChart3 },
];

const adminNavigation: NavItem[] = [
  { name: 'Super Admin', href: '/admin', icon: Shield },
];

const STORAGE_KEY = 'az_sidebar_collapsed';

export function Sidebar() {
  const pathname = usePathname();
  const { isSuperAdmin, profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Persist collapse state
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCollapsed(stored === 'true');
  }, []);

  function toggleCollapse() {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev));
      return !prev;
    });
  }

  function toggleGroup(name: string) {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AZ';

  function NavLink({ item, depth = 0 }: { item: NavItem | NavChild; depth?: number }) {
    const hasChildren = 'children' in item && item.children && item.children.length > 0;
    const isOpen = openGroups[item.name] ?? false;
    const isActive =
      pathname === item.href ||
      (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));

    if (hasChildren && !collapsed) {
      return (
        <div>
          <button
            onClick={() => toggleGroup(item.name)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
              isActive
                ? 'text-primary bg-primary/10 nav-active-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
            )}
          >
            <item.icon className={cn('w-4.5 h-4.5 flex-shrink-0 transition-colors', isActive && 'text-primary')} />
            <span className="flex-1 text-left truncate">{item.name}</span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>
          {isOpen && (
            <div className="mt-0.5 ml-3 pl-3 border-l border-sidebar-border/50 space-y-0.5">
              {'children' in item && item.children?.map((child) => (
                <NavLink key={child.href} item={child} depth={1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        title={collapsed ? item.name : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
          collapsed && 'justify-center px-2',
          depth === 1 && 'py-2 text-xs',
          isActive
            ? 'text-primary bg-primary/10 nav-active-glow'
            : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
        )}
      >
        <item.icon
          className={cn(
            'flex-shrink-0 transition-all duration-200',
            depth === 0 ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5',
            isActive ? 'text-primary' : 'group-hover:text-foreground'
          )}
        />
        {!collapsed && (
          <span className="truncate">{item.name}</span>
        )}
        {'badge' in item && item.badge && !collapsed && (
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
            {item.badge}
          </span>
        )}

        {/* Tooltip for collapsed mode */}
        {collapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
            {item.name}
          </div>
        )}
      </Link>
    );
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card border border-border shadow-lg hover:bg-sidebar-accent transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-64',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo area */}
        <div
          className={cn(
            'relative flex items-center h-[68px] px-4 border-b border-sidebar-border',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <Link
            href="/dashboard"
            className={cn('flex items-center gap-3 min-w-0', collapsed && 'justify-center')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-autozen.png"
              alt="AutoZen"
              onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
              className={cn(
                'object-contain transition-all duration-300',
                collapsed ? 'h-8 w-8' : 'h-9 w-auto'
              )}
            />
          </Link>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute right-3 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-sidebar-accent transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop collapse toggle */}
          {!mobileOpen && (
            <button
              onClick={toggleCollapse}
              className={cn(
                'hidden lg:flex items-center justify-center w-6 h-6 rounded-lg border border-sidebar-border bg-sidebar hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-all duration-200 flex-shrink-0',
                collapsed && 'absolute -right-3 top-1/2 -translate-y-1/2 z-10 shadow-md bg-card'
              )}
              aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            >
              {collapsed
                ? <ChevronRight className="w-3 h-3" />
                : <ChevronLeft className="w-3 h-3" />
              }
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {navigation.map((item, idx) => (
            <div
              key={item.href}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              <NavLink item={item} />
            </div>
          ))}

          {/* Divider */}
          {isSuperAdmin && (
            <div className={cn('pt-3 mt-3 border-t border-sidebar-border', collapsed && 'px-0')}>
              {adminNavigation.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          )}
        </nav>

        {/* User section at bottom */}
        <div className={cn(
          'p-3 border-t border-sidebar-border',
          collapsed ? 'flex justify-center' : ''
        )}>
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-xl p-2 hover:bg-sidebar-accent transition-colors cursor-default',
              collapsed && 'justify-center'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 ring-1 ring-primary/20">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {profile?.name?.split(' ')[0] ?? 'Usuário'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {profile?.role === 'super_admin' ? 'Super Admin'
                    : profile?.role === 'admin_empresa' ? 'Administrador'
                    : 'Funcionário'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
