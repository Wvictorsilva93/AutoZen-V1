import { 
  Car, 
  DollarSign, 
  Calendar, 
  FileText, 
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const stats = [
    {
      title: "Faturamento do Mês",
      value: "R$ 48.250,00",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "success" as const,
    },
    {
      title: "Veículos em Atendimento",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Car,
      color: "info" as const,
    },
    {
      title: "Agendamentos Hoje",
      value: "18",
      change: "-2",
      trend: "down",
      icon: Calendar,
      color: "warning" as const,
    },
    {
      title: "OS Abertas",
      value: "12",
      change: "+5",
      trend: "up",
      icon: FileText,
      color: "premium" as const,
    },
    {
      title: "Clientes Ativos",
      value: "342",
      change: "+28",
      trend: "up",
      icon: Users,
      color: "info" as const,
    },
    {
      title: "Ticket Médio",
      value: "R$ 486,00",
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      color: "success" as const,
    },
  ];

  const recentOrders = [
    { id: "OS-1234", client: "João Silva", vehicle: "BMW X5", status: "Em Andamento", value: "R$ 850,00" },
    { id: "OS-1233", client: "Maria Santos", vehicle: "Audi A4", status: "Aguardando", value: "R$ 1.250,00" },
    { id: "OS-1232", client: "Pedro Costa", vehicle: "Mercedes C180", status: "Finalizada", value: "R$ 650,00" },
    { id: "OS-1231", client: "Ana Oliveira", vehicle: "Porsche 911", status: "Em Andamento", value: "R$ 2.100,00" },
  ];

  const statusColors = {
    "Em Andamento": "info",
    "Aguardando": "warning",
    "Finalizada": "success",
  } as const;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-text-primary">Dashboard</h1>
          <p className="text-body text-text-secondary mt-1">
            Visão geral do seu negócio
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="success">Plano Premium</Badge>
          <button className="btn-primary h-10 px-4 text-body-sm">
            Nova OS
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          
          return (
            <Card key={stat.title} className="card-stat">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                  <Icon className="w-5 h-5 text-blue-glow" />
                </div>
                <Badge variant={stat.color}>{stat.change}</Badge>
              </div>
              <p className="text-body-sm text-text-secondary mb-1">
                {stat.title}
              </p>
              <div className="flex items-end gap-2">
                <p className="text-heading-2 text-text-primary">
                  {stat.value}
                </p>
                <TrendIcon 
                  className={`w-4 h-4 mb-2 ${
                    stat.trend === "up" ? "text-success" : "text-error"
                  }`}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ordens de Serviço Recentes</CardTitle>
              <CardDescription>Últimas OS do sistema</CardDescription>
            </div>
            <button className="btn-ghost h-9 px-3 text-body-sm">
              Ver todas
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-text-primary">
                    OS
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-text-primary">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-text-primary">
                    Veículo
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-text-primary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-body-sm font-semibold text-text-primary">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="px-6 py-4 text-body-sm font-medium text-text-primary">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-text-secondary">
                      {order.client}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-text-secondary">
                      {order.vehicle}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColors[order.status as keyof typeof statusColors]}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-body-sm font-medium text-text-primary text-right">
                      {order.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
