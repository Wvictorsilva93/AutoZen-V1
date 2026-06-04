"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Car, Coins, Calendar, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import FloatingCard from "./FloatingCard";
import ParticleField from "@/components/effects/ParticleField";

export default function AuthScreen() {
  return (
    <div className="min-h-screen w-full bg-background-primary relative overflow-hidden noise-texture">
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-glow/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
        <ParticleField />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Hero Section */}
        <div className="flex flex-col justify-between p-8 lg:p-16 relative">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Image
              src="/logo-autozen.png"
              alt="AutoZen"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </motion.div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold leading-[1.2] mb-6 text-shadow-glow"
            >
              Tranquilidade e eficiência na gestão do seu negócio
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-text-secondary mb-12 leading-relaxed"
            >
              Controle clientes, veículos, serviços, estoque, financeiro e operação em um único sistema.
            </motion.p>

            {/* Floating Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <FloatingCard
                icon={Car}
                title="Veículos em Atendimento"
                value={24}
                status="Em execução"
                statusColor="blue"
                delay={0.3}
              />
              <FloatingCard
                icon={Coins}
                title="Caixa do Dia"
                value="R$ 3.480,00"
                status="Positivo"
                statusColor="green"
                delay={0.4}
              />
              <FloatingCard
                icon={Calendar}
                title="Agendamentos"
                value={18}
                status="Hoje"
                statusColor="amber"
                delay={0.5}
              />
              <FloatingCard
                icon={FileText}
                title="OS Abertas"
                value={12}
                status="Andamento"
                statusColor="blue"
                delay={0.6}
              />
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm text-text-secondary mt-12"
          >
            © 2024 AutoZen. Todos os direitos reservados.
          </motion.div>
        </div>

        {/* Right Column - Auth Card */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-[480px]"
          >
            <div className="glass-card-premium p-8 lg:p-10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta</h2>
                <p className="text-text-secondary text-sm">
                  Acesse sua conta ou crie uma nova empresa
                </p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList>
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar Empresa</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="signup">
                  <SignupForm />
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-6 border-t border-white/8">
                <p className="text-center text-sm text-text-secondary">
                  Sistema seguro com criptografia de ponta a ponta
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
