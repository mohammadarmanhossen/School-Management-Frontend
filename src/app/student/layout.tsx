import { DashboardLayout } from "@/layouts";
import { RouteGuard } from "@/components/auth/route-guard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["student"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RouteGuard>
  );
}
