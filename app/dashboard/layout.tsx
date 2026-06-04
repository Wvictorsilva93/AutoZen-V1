import { redirect } from 'next/navigation'
import { getSessionAction } from '@/lib/auth/actions'
import { DashboardLayout } from '@/modules/dashboard/components/DashboardLayout'

export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { session, user, company } = await getSessionAction()

  if (!session || !user || !company) {
    redirect('/')
  }

  return (
    <DashboardLayout user={user} company={company}>
      {children}
    </DashboardLayout>
  )
}
