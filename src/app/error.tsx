'use client';

// AutoZen - Error Page
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para o console
    console.error('[ERROR_PAGE]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EF4444] opacity-10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F59E0B] opacity-10 blur-[100px] rounded-full" />

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Auto<span className="text-[#3B82F6]">Zen</span>
          </h1>
        </div>

        {/* Ícone de erro */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Mensagem */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Algo deu errado
          </h2>
          <p className="text-gray-400 mb-4">
            Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte se o problema persistir.
          </p>
          
          {/* Detalhes do erro (apenas em dev) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-[#151D2F] border border-red-500/20 rounded-lg p-4 text-left mb-4">
              <p className="text-xs text-red-400 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
          >
            <a href="/dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Ir para Dashboard
            </a>
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
