// AutoZen - 404 Not Found Page
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB] opacity-10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3B82F6] opacity-10 blur-[100px] rounded-full" />

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Auto<span className="text-[#3B82F6]">Zen</span>
          </h1>
        </div>

        {/* 404 */}
        <div className="mb-8">
          <h2 className="text-8xl font-bold text-white mb-4">404</h2>
          <p className="text-2xl font-semibold text-gray-300 mb-3">
            Página não encontrada
          </p>
          <p className="text-gray-400">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Ir para Dashboard
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
          >
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-8">
          &copy; 2026 AutoZen. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
