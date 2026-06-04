import { redirect } from 'next/navigation'
import { getSessionAction } from '@/lib/auth/actions'
import { DashboardContent } from '@/modules/dashboard/components/DashboardContent'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { session, user, company } = await getSessionAction()

  if (!session || !user || !company) {
    redirect('/')
  }

  // Verificar status da empresa
  if (company.status === 'expired' || company.status === 'blocked') {
    redirect('/billing')
  }

  return <DashboardContent user={user} company={company} />
}
