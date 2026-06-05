// AutoZen - Dashboard Page
import { Card } from '@/components/ui/card';
import { 
  DollarSign, 
  Users, 
  Car, 
  Wrench,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export default function DashboardPage() {
  // KPIs mockados
  const mockKPIs = {
    receita: {
      valor: 'R$ 12.480,00',
      variacao: '+12.5%',
      tipo: 'up' as const,
      label: 'Receita do Mês',
    },
    clientes: {
      valor: '89',
      variacao: '+8',
      tipo: 'up' as const,
      label: 'Clientes Ativos',
    },
    veiculos: {
      valor: '142',
      variacao: '+15',
      tipo: 'up' as const,
      label: 'Veículos Cadastrados',
    },
    osAbertas: {
      valor: '12',
      variacao: '-3',
      tipo: 'down' as const,
      label: 'OS Abertas',
    },
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Visão geral do seu negócio
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Receita */}
        <Card className="bg-[#151D2F] border-white/[0.08] p-6 relative overflow-hidden group hover:border-[#3B82F6]/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/0 to-[#10B981]/0 group-hover:from-[#10B981]/5 group-hover:to-[#10B981]/10 transition-all duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#10B981]" />
              </div>
              <div className="flex items-center gap-1 text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{mockKPIs.receita.variacao}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {mockKPIs.receita.valor}
            </p>
            <p className="text-sm text-gray-400">
              {mockKPIs.receita.label}
            </p>
          </div>
        </Card>

        {/* Clientes */}
        <Card className="bg-[#151D2F] border-white/[0.08] p-6 relative overflow-hidden group hover:border-[#3B82F6]/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/0 to-[#3B82F6]/0 group-hover:from-[#3B82F6]/5 group-hover:to-[#3B82F6]/10 transition-all duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div className="flex items-center gap-1 text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{mockKPIs.clientes.variacao}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {mockKPIs.clientes.valor}
            </p>
            <p className="text-sm text-gray-400">
              {mockKPIs.clientes.label}
            </p>
          </div>
        </Card>

        {/* Veículos */}
        <Card className="bg-[#151D2F] border-white/[0.08] p-6 relative overflow-hidden group hover:border-[#3B82F6]/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/0 to-[#F59E0B]/0 group-hover:from-[#F59E0B]/5 group-hover:to-[#F59E0B]/10 transition-all duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <Car className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div className="flex items-center gap-1 text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{mockKPIs.veiculos.variacao}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {mockKPIs.veiculos.valor}
            </p>
            <p className="text-sm text-gray-400">
              {mockKPIs.veiculos.label}
            </p>
          </div>
        </Card>

        {/* OS Abertas */}
        <Card className="bg-[#151D2F] border-white/[0.08] p-6 relative overflow-hidden group hover:border-[#3B82F6]/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/0 to-[#8B5CF6]/0 group-hover:from-[#8B5CF6]/5 group-hover:to-[#8B5CF6]/10 transition-all duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div className="flex items-center gap-1 text-[#10B981]">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">{mockKPIs.osAbertas.variacao}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {mockKPIs.osAbertas.valor}
            </p>
            <p className="text-sm text-gray-400">
              {mockKPIs.osAbertas.label}
            </p>
          </div>
        </Card>
      </div>

      {/* Seção inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas OS */}
        <Card className="bg-[#151D2F] border-white/[0.08] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Últimas Ordens de Serviço
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0A0F1C]/50 border border-white/[0.05] hover:border-[#3B82F6]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      OS #{1000 + i}
                    </p>
                    <p className="text-xs text-gray-400">
                      Cliente {i} - Veículo ABC-{i}234
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#10B981]">
                    R$ {(Math.random() * 1000 + 200).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">Em andamento</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Próximos Agendamentos */}
        <Card className="bg-[#151D2F] border-white/[0.08] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Próximos Agendamentos
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0A0F1C]/50 border border-white/[0.05] hover:border-[#3B82F6]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                    <Car className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Cliente {i}
                    </p>
                    <p className="text-xs text-gray-400">
                      Veículo XYZ-{i}234
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {new Date(Date.now() + i * 86400000).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {8 + i}:00
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Banner Trial */}
      <Card className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] border-0 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Seu trial está ativo! 🎉
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Você tem 12 dias restantes de teste grátis. Aproveite todos os recursos do AutoZen.
            </p>
            <Button className="bg-white text-[#2563EB] hover:bg-white/90">
              Ver detalhes da assinatura
            </Button>
          </div>
          <div className="hidden md:block text-6xl">
            🚀
          </div>
        </div>
      </Card>
    </div>
  );
}
