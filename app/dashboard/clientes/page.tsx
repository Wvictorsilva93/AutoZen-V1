import { redirect } from 'next/navigation'
import { getSessionAction } from '@/lib/auth/actions'
import { ClientesTable } from '@/modules/clientes/components/ClientesTable'

export const dynamic = 'force-dynamic'

export default async function ClientesPage() {
  const { session, user, company } = await getSessionAction()

  if (!session || !user || !company) {
    redirect('/')
  }

  if (company.status === 'expired' || company.status === 'blocked') {
    redirect('/billing')
  }

  return <ClientesTable companyId={company.id} />
}
