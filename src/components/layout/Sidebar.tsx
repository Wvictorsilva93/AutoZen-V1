'use client';

// AutoZen - Sidebar Component
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  Wrench,
  DollarSign,
  Settings,
  CreditCard,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Clientes',
    href: '/clientes',
    icon: Users,
  },
  {
    label: 'Veículos',
    href: '/veiculos',
    icon: Car,
  },
  {
    label: 'Agendamentos',
    href: '/agendamentos',
    icon: Calendar,
  },
  {
    label: 'Ordens de Serviço',
    href: '/ordens-servico',
    icon: Wrench,
  },
  {
    label: 'Financeiro',
    href: '/financeiro',
    icon: DollarSign,
  },
  {
    label: 'Assinatura',
    href: '/assinatura',
    icon: CreditCard,
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-[#151D2F] border-r border-white/[0.08] h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/[0.08]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">
            Auto<span className="text-[#3B82F6]">Zen</span>
          </h1>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#0A0F1C]/50'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.08]">
        <div className="bg-[#0A0F1C]/60 rounded-lg p-3 border border-white/[0.08]">
          <p className="text-xs text-gray-400 mb-1">Trial ativo</p>
          <p className="text-sm font-semibold text-white">12 dias restantes</p>
          <Link
            href="/assinatura"
            className="text-xs text-[#3B82F6] hover:text-[#2563EB] transition-colors mt-2 inline-block"
          >
            Renovar assinatura →
          </Link>
        </div>
      </div>
    </aside>
  );
}
