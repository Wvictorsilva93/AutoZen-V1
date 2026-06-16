'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { ShieldAlert, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function BloqueadoPage() {
  const router = useRouter();

  async function logout() {
    const supabase = getSupabaseClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md glass rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Acesso suspenso</h1>
        <p className="text-slate-400 text-sm mb-6">
          O acesso da sua empresa está temporariamente indisponível porque a assinatura está
          <span className="text-white font-medium"> expirada ou bloqueada</span>.
          Regularize para voltar a usar o AutoZen.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={() => window.open('https://wa.me/5565999850765?text=' + encodeURIComponent('Olá! Quero regularizar minha assinatura do AutoZen.'), '_blank')}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Falar com o suporte
          </Button>
          <Button variant="ghost" onClick={logout} className="w-full text-slate-300 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
