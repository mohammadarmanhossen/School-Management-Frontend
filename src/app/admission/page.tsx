import { LandingHeader } from "@/components/landing/landing-header";
import { StudentApplySection } from "@/components/landing/student-apply";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
  title: "Admission Application",
  description: "Apply for student admission online.",
};

export default function AdmissionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <StudentApplySection />
      </main>
      <LandingFooter />
    </div>
  );
}
