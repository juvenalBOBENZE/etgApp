import { Sidebar } from "@/components/layout/Sidebar";
import { AuthGuard } from "@/components/layout/AuthGuard";


// app/dashboard/layout.tsx (ou équivalent)
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
<AuthGuard>
    <div className="lg:flex lg:min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
</AuthGuard>
  );
}
