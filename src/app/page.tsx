import { LandingHeader } from "@/components/landing/landing-header";
import {
  HeroSection,
  FeaturesSection,
  WorkProcessSection,
  ModulesSection,
  PricingSection,
} from "@/components/landing/landing-sections";
import { ContactSection } from "@/components/landing/contact-section";
import { CtaSection, LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <WorkProcessSection />
        <ModulesSection />
        <PricingSection />
        <ContactSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
