import { redirect } from 'next/navigation'
import { getSessionAction } from '@/lib/auth/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { CompanyStatus } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const { session, user, company } = await getSessionAction()

  if (!session || !user || !company) {
    redirect('/')
  }

  const status = company.status as CompanyStatus
  const isExpired = status === 'expired'
  const isBlocked = status === 'blocked'
  const isTrial = status === 'trial'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full glass border-slate-800">
        <CardHeader className="text-center">
          {isBlocked && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-2xl text-white">Conta Bloqueada</CardTitle>
              <CardDescription className="text-slate-400">
                Sua conta foi bloqueada. Entre em contato com o suporte.
              </CardDescription>
            </>
          )}

          {isExpired && (
            <>
              <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
              <CardTitle className="text-2xl text-white">Assinatura Expirada</CardTitle>
              <CardDescription className="text-slate-400">
                Seu período de teste expirou em {company.trial_ends_at && formatDate(company.trial_ends_at)}
              </CardDescription>
            </>
          )}

          {isTrial && (
            <>
              <div className="mx-auto w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-cyan-400" />
              </div>
              <CardTitle className="text-2xl text-white">Período de Teste</CardTitle>
              <CardDescription className="text-slate-400">
                Seu período de teste expira em {company.trial_ends_at && formatDate(company.trial_ends_at)}
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Planos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Escolha seu Plano</h3>

            <div className="grid gap-4">
              <div className="p-6 rounded-lg border border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">Plano Mensal</h4>
                    <p className="text-slate-400 text-sm">Faturamento mensal sem compromisso</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-cyan-400">R$ 97</div>
                    <div className="text-slate-400 text-sm">/mês</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Usuários ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Ordens de serviço ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Suporte por WhatsApp
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border-2 border-cyan-500 bg-cyan-500/5 relative">
                <div className="absolute -top-3 left-4 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MAIS POPULAR
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">Plano Anual</h4>
                    <p className="text-slate-400 text-sm">2 meses grátis no plano anual</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-cyan-400">R$ 970</div>
                    <div className="text-slate-400 text-sm">/ano</div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Tudo do plano mensal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Economia de R$ 194/ano
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Suporte prioritário
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white h-12">
              Assinar Agora
            </Button>
            <p className="text-center text-xs text-slate-500">
              Sistema de pagamento em desenvolvimento
            </p>
          </div>

          {/* Contato */}
          <div className="text-center pt-4 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              Dúvidas? Entre em contato pelo WhatsApp:{' '}
              <a href="https://wa.me/5511999999999" className="text-cyan-400 hover:underline">
                (11) 99999-9999
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
