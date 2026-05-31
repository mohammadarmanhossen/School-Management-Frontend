import { DashboardLayout } from "@/layouts";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
