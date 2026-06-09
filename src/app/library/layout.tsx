import { DashboardLayout } from "@/layouts";
import { RouteGuard } from "@/components/auth/route-guard";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["librarian", "school_admin"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </RouteGuard>
  );
}
