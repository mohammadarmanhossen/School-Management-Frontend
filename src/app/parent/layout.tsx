import { DashboardLayout } from "@/layouts";
import { RouteGuard } from "@/components/auth/route-guard";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["parent"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RouteGuard>
  );
}
