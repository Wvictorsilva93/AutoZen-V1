import { redirect } from 'next/navigation'
import { getSessionAction } from '@/lib/auth/actions'
import { VeiculosTable } from '@/modules/veiculos/components/VeiculosTable'

export const dynamic = 'force-dynamic'

export default async function VeiculosPage() {
  const { session, user, company } = await getSessionAction()

  if (!session || !user || !company) {
    redirect('/')
  }

  if (company.status === 'expired' || company.status === 'blocked') {
    redirect('/billing')
  }

  return <VeiculosTable companyId={company.id} />
}
