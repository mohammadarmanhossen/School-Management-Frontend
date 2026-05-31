import {
  LandingHeader,
} from "@/components/landing/landing-header";
import {
  HeroSection,
  FeaturesSection,
  ModulesSection,
  PricingSection,
  CtaSection,
  LandingFooter,
} from "@/components/landing/landing-sections";
import { ContactSection } from "@/components/landing/contact-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ModulesSection />
        <PricingSection />
        <ContactSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
