// AutoZen - Login Page (2 colunas com design premium)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/src/features/auth/components/LoginForm';
import { RegisterForm } from '@/src/features/auth/components/RegisterForm';
import { Car, DollarSign, Calendar, Wrench } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex">
      {/* ESQUERDA - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A0F1C]" />
        
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB] opacity-20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3B82F6] opacity-15 blur-[100px] rounded-full" />

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-3">
              Auto<span className="text-[#3B82F6]">Zen</span>
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full" />
          </div>

          {/* Título e subtítulo */}
          <div className="mb-12 max-w-lg">
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              Tranquilidade e eficiência na gestão do seu negócio
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Controle clientes, veículos, serviços, estoque, financeiro e operação em um único sistema.
            </p>
          </div>

          {/* Cards animados */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {/* Card 1 */}
            <div className="group relative bg-[#151D2F]/60 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:bg-[#151D2F]/80 hover:border-[#3B82F6]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#3B82F6]/0 group-hover:from-[#2563EB]/5 group-hover:to-[#3B82F6]/10 rounded-xl transition-all duration-300" />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center mb-3 group-hover:bg-[#2563EB]/20 transition-colors">
                  <Car className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">24</p>
                <p className="text-sm text-gray-400">Veículos em atendimento</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-[#151D2F]/60 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:bg-[#151D2F]/80 hover:border-[#3B82F6]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#3B82F6]/0 group-hover:from-[#2563EB]/5 group-hover:to-[#3B82F6]/10 rounded-xl transition-all duration-300" />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3 group-hover:bg-[#10B981]/20 transition-colors">
                  <DollarSign className="w-5 h-5 text-[#10B981]" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">R$ 3.480</p>
                <p className="text-sm text-gray-400">Caixa do dia</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-[#151D2F]/60 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:bg-[#151D2F]/80 hover:border-[#3B82F6]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#3B82F6]/0 group-hover:from-[#2563EB]/5 group-hover:to-[#3B82F6]/10 rounded-xl transition-all duration-300" />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3 group-hover:bg-[#F59E0B]/20 transition-colors">
                  <Calendar className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">18</p>
                <p className="text-sm text-gray-400">Agendamentos</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative bg-[#151D2F]/60 backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:bg-[#151D2F]/80 hover:border-[#3B82F6]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#3B82F6]/0 group-hover:from-[#2563EB]/5 group-hover:to-[#3B82F6]/10 rounded-xl transition-all duration-300" />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center mb-3 group-hover:bg-[#8B5CF6]/20 transition-colors">
                  <Wrench className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">12</p>
                <p className="text-sm text-gray-400">OS abertas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIREITA - Formulário */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Card Glass Premium */}
          <div className="relative bg-[#151D2F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-8">
            {/* Glow interno */}
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />
            
            {/* Logo mobile */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Auto<span className="text-[#3B82F6]">Zen</span>
              </h1>
              <p className="text-sm text-gray-400">
                Gestão completa para sua oficina
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#0A0F1C]/60 p-1 rounded-lg">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-gray-400 rounded-md transition-all duration-200"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-gray-400 rounded-md transition-all duration-200"
                >
                  Criar Empresa
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Bem-vindo de volta
                  </h2>
                  <p className="text-sm text-gray-400">
                    Entre com suas credenciais para acessar o sistema
                  </p>
                </div>
                <LoginForm />
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Crie sua empresa
                  </h2>
                  <p className="text-sm text-gray-400">
                    Comece grátis com 14 dias de teste
                  </p>
                </div>
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            &copy; 2026 AutoZen. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
