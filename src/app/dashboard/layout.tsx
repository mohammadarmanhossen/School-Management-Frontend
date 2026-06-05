import { DashboardLayout } from "@/layouts";
import { RouteGuard } from "@/components/auth/route-guard";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </RouteGuard>
  );
}
