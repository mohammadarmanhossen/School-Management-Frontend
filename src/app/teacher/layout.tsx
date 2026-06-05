import { DashboardLayout } from "@/layouts";
import { RouteGuard } from "@/components/auth/route-guard";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["teacher"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RouteGuard>
  );
}
