'use client';

export const dynamic = 'force-dynamic';

import { CreditCard, Check, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Starter',
    price: 97,
    features: ['Até 3 funcionários', '100 OS/mês', 'Dashboard básico', 'WhatsApp manual', 'Suporte email'],
    popular: false,
  },
  {
    name: 'Profissional',
    price: 197,
    features: ['Até 10 funcionários', 'OS ilimitadas', 'Dashboard completo', 'WhatsApp automático', 'IA Operacional', 'Relatórios avançados', 'Suporte prioritário'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 397,
    features: ['Funcionários ilimitados', 'Multi-unidade', 'API personalizada', 'White-label', 'IA avançada', 'Gerente de conta', 'SLA garantido'],
    popular: false,
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Assinatura</h1>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Trial - 5 dias restantes
        </Badge>
      </div>

      {/* Current status */}
      <Card className="bg-card border-border border-l-4 border-l-amber-500">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-white font-medium">Período de teste ativo</p>
            <p className="text-xs text-slate-400">Seu trial expira em 5 dias. Escolha um plano para continuar usando o AutoZen.</p>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`bg-card border-border relative ${plan.popular ? 'border-blue-500 glow-blue' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Mais Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg text-white">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">R$ {plan.price}</span>
                <span className="text-sm text-slate-500">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Assinar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
