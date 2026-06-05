// AutoZen - Dashboard Layout
import { Sidebar } from '@/src/components/layout/Sidebar';
import { Header } from '@/src/components/layout/Header';
import { AuthProvider } from '@/src/providers/auth-provider';
import { TenantProvider } from '@/src/providers/tenant-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <TenantProvider>
        <div className="flex h-screen bg-[#0A0F1C]">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </TenantProvider>
    </AuthProvider>
  );
}
