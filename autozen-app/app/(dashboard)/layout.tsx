import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { Toaster } from '@/components/ui/sonner';
import { AccessGuard } from '@/components/access-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessGuard>
      <div className="flex h-screen overflow-hidden bg-premium-gradient">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    </AccessGuard>
  );
}
