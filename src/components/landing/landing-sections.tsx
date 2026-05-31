import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  ClipboardCheck,
  Wallet,
  BarChart3,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Enterprise Education ERP Platform
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Run Your School{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Smarter
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            All-in-one platform for attendance, exams, fees, results, and parent communication.
            Built for modern schools in Bangladesh and beyond.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link href="/login">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: GraduationCap, label: "1,248+", sub: "Students Managed" },
            { icon: ClipboardCheck, label: "94.2%", sub: "Avg. Attendance" },
            { icon: Wallet, label: "৳28.5L", sub: "Fees Collected / mo" },
          ].map((stat) => (
            <Card key={stat.label} className="glass-card border-0 text-center">
              <CardContent className="pt-6">
                <stat.icon className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-3 text-2xl font-bold">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: GraduationCap,
      title: "Student Management",
      description: "Complete student profiles, enrollment, class allocation, and parent linking.",
    },
    {
      icon: ClipboardCheck,
      title: "Smart Attendance",
      description: "Daily tracking, QR-ready check-in, monthly reports, and biometric-ready structure.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights on attendance, revenue, exam performance, and growth trends.",
    },
    {
      icon: Wallet,
      title: "Fee Collection",
      description: "bKash, Nagad, Rocket, SSLCommerz integration with invoices and receipts.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure portals for admins, teachers, students, and parents with JWT auth.",
    },
    {
      icon: Sparkles,
      title: "AI-Ready Platform",
      description: "Built for result analysis, attendance prediction, and future AI integrations.",
    },
  ];

  return (
    <section id="features" className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your school needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            From admission to graduation — manage every aspect of school operations in one place.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="glass-card transition-shadow hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ModulesSection() {
  const modules = [
    "Students", "Teachers", "Classes", "Attendance", "Exams", "Results",
    "Assignments", "Fees", "Library", "Transport", "Timetable", "Notices",
  ];

  return (
    <section id="modules" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Modules</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            12+ integrated modules
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete suite of tools designed for Bangladeshi schools and international standards.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {modules.map((mod) => (
            <Badge key={mod} variant="secondary" className="px-4 py-2 text-sm">
              {mod}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "৳2,999",
      period: "/month",
      description: "For small schools up to 200 students",
      features: ["Student & Teacher Management", "Attendance & Exams", "Basic Reports", "Email Support"],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "৳7,999",
      period: "/month",
      description: "For growing schools up to 1,000 students",
      features: ["All Starter features", "Fee & Payment Gateway", "Parent Portal", "Priority Support", "Custom Branding"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large institutions & multi-school groups",
      features: ["Unlimited students", "Multi-school support", "API Access", "Dedicated Manager", "On-premise option"],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose the plan that fits your school. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.highlighted ? "border-primary shadow-lg ring-1 ring-primary" : "glass-card"}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
              )}
              <CardContent className="pt-8">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="/register">{plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-4xl overflow-hidden border-0 bg-gradient-to-br from-primary to-blue-700 text-primary-foreground">
        <CardContent className="px-8 py-14 text-center sm:px-16">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to transform your school?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Join 500+ schools already using our platform. Start your free trial today.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="h-11 px-8">
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-11 border-white/30 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#contact">Contact Sales</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-semibold">School Management System</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">Login</Link>
          <Link href="/register" className="hover:text-foreground">Register</Link>
        </div>
      </div>
    </footer>
  );
}
