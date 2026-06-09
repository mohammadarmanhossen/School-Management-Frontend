import { LandingHeader } from "@/components/landing/landing-header";
import { TeacherApplySection } from "@/components/landing/teacher-apply";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
  title: "Teacher Application",
  description: "Apply to join our teaching faculty.",
};

export default function TeacherApplyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <TeacherApplySection />
      </main>
      <LandingFooter />
    </div>
  );
}
