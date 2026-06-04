"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  FileText,
  Wrench,
  Package,
  DollarSign,
  UsersRound,
  BarChart3,
  Settings,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: Car, label: "Veículos", href: "/veiculos" },
  { icon: Calendar, label: "Agendamentos", href: "/agendamentos" },
  { icon: FileText, label: "Ordens de Serviço", href: "/ordens" },
  { icon: Wrench, label: "Serviços", href: "/servicos" },
  { icon: Package, label: "Estoque", href: "/estoque" },
  { icon: DollarSign, label: "Financeiro", href: "/financeiro" },
  { icon: UsersRound, label: "Equipe", href: "/equipe" },
  { icon: BarChart3, label: "Relatórios", href: "/relatorios" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [currentCompany] = useState("Auto Detailing Premium");

  return (
    <aside
      className={cn(
        "glass-sidebar h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/8">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-glow to-blue-primary flex items-center justify-center">
              <span className="text-lg font-bold text-white">AZ</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-body font-bold text-text-primary truncate">
                AutoZen
              </h2>
              <p className="text-caption text-text-secondary truncate">
                Gestão Premium
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Company Selector */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/8">
          <button className="w-full p-3 rounded-button bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left">
            <Building2 className="w-4 h-4 text-blue-glow flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-text-primary truncate">
                {currentCompany}
              </p>
              <p className="text-caption text-text-secondary">Plano Premium</p>
            </div>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    isActive ? "menu-item-active" : "menu-item",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-white/8">
          <button className="w-full p-3 rounded-button bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-glow to-purple flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">WA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-text-primary truncate">
                Wander Admin
              </p>
              <p className="text-caption text-text-secondary">Administrador</p>
            </div>
          </button>
        </div>
      )}
    </aside>
  );
}
