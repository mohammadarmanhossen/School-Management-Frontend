import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  ClipboardCheck,
  Wallet,
  BarChart3,
  Shield,
  Sparkles,
  CheckCircle2,
  Users,
  Building,
  ArrowUpRight,
  MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:px-8 flex items-center">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-background dark:to-background">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] animate-float rounded-full bg-blue-400/20 mix-blend-multiply blur-[128px] dark:bg-blue-600/20" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] animate-float rounded-full bg-indigo-400/20 mix-blend-multiply blur-[128px] dark:bg-indigo-600/20" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-purple-400/10 mix-blend-multiply blur-[128px] dark:bg-purple-600/10" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10 w-full">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-8 gap-2 px-4 py-2 rounded-full border-blue-200 bg-blue-50/50 text-blue-700 backdrop-blur-md dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Next-Generation School ERP</span>
          </Badge>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Run Your School <br className="hidden sm:block" />
            <span className="gradient-text animate-gradient-x bg-[length:200%_auto]">
              Intelligently
            </span>
          </h1>
          
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground sm:text-2xl max-w-2xl mx-auto">
            The ultimate all-in-one platform to manage attendance, fees, exams, and communication. Built for scale, designed for simplicity.
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button size="lg" asChild className="group relative h-14 overflow-hidden rounded-full px-8 text-base shadow-2xl transition-all hover:scale-105 hover:shadow-blue-500/25">
              <Link href="/register">
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 rounded-full px-8 text-base backdrop-blur-md transition-all hover:bg-muted">
              <Link href="/login">Book a Demo</Link>
            </Button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> No credit card required
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> 14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> Cancel anytime
            </div>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="mx-auto mt-24 grid max-w-5xl gap-6 sm:grid-cols-3 relative">
          {[
            { icon: Users, label: "50,000+", sub: "Active Students", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Building, label: "250+", sub: "Schools Trust Us", color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { icon: Wallet, label: "৳100M+", sub: "Transactions Processed", color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <Card key={stat.label} className={`glass-premium border-0 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:bg-white/5`}>
              <CardContent className="pt-8 pb-8">
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <p className="text-4xl font-bold tracking-tight">{stat.label}</p>
                <p className="mt-2 font-medium text-muted-foreground">{stat.sub}</p>
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
      title: "Student Information",
      description: "Comprehensive profiles, admission flows, and parent-student relationship mapping in one centralized database.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: ClipboardCheck,
      title: "Biometric Attendance",
      description: "Seamless integration with RFID and biometric devices for real-time attendance tracking and automated SMS alerts.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Wallet,
      title: "Digital Fee Collection",
      description: "Automated invoicing with integrated payment gateways (bKash, SSLCommerz) for hassle-free fee collection.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Powerful reporting dashboards providing actionable insights into academic performance and financial health.",
      color: "from-rose-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access control, JWT authentication, and automated backups to keep your institutional data secure.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: MonitorSmartphone,
      title: "Mobile Ready",
      description: "Responsive portals for parents, teachers, and admins to manage operations from any device, anywhere.",
      color: "from-amber-500 to-orange-500"
    },
  ];

  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Core Capabilities</h2>
          <h3 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-muted-foreground">scale your institution</span>
          </h3>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group relative rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20">
              <div className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10`} />
              
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted transition-transform duration-500 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-950">
                <feature.icon className="h-7 w-7 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              
              <h4 className="mb-3 text-xl font-bold">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:text-blue-400">
                Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkProcessSection() {
  const steps = [
    { num: "01", title: "Consultation & Demo", desc: "We analyze your school's unique workflow and demonstrate how our platform can streamline your operations." },
    { num: "02", title: "Custom Setup", desc: "Our team configures the modules, imports your existing data, and sets up your branding." },
    { num: "03", title: "Training", desc: "Comprehensive onboarding sessions for your admins, teachers, and staff to ensure smooth adoption." },
    { num: "04", title: "Go Live", desc: "Launch the platform to parents and students with 24/7 technical support backing you up." },
  ];

  return (
    <section className="bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-3">Our Process</h2>
            <h3 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              From onboarding to <br/>
              <span className="text-slate-400">full digital transformation</span>
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-lg">
              Transitioning to a new system doesn&apos;t have to be painful. Our dedicated success team holds your hand through every step of the journey.
            </p>
            <Button size="lg" className="rounded-full h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white border-0">
              Schedule Consultation <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:translate-x-2">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600/20">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ModulesSection() {
  const modules = [
    "Admissions", "Student Portal", "HR & Payroll", "Attendance", "Examination", "Results Processing",
    "Transport", "Library", "Hostel", "Inventory", "Accounts", "Messaging SMS"
  ];

  return (
    <section id="modules" className="px-4 py-24 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-background">Extensive Modules</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            A fully integrated ecosystem
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Stop juggling multiple softwares. Manage your entire institution from a single unified dashboard.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {modules.map((mod) => (
            <div key={mod} className="glass-premium px-6 py-3 font-medium text-foreground transition-all hover:scale-105 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
              {mod}
            </div>
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
      description: "Perfect for primary schools starting their digital journey.",
      features: ["Up to 200 Students", "Basic Attendance", "Result Generation", "Email Support"],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "৳7,999",
      period: "/month",
      description: "The complete suite for growing high schools and colleges.",
      features: ["Up to 1,000 Students", "Payment Gateway Integration", "Parent & Teacher Portals", "Priority Phone Support", "Custom ID Cards"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored infrastructure for large school groups.",
      features: ["Unlimited Students", "Multi-Campus Management", "Dedicated Account Manager", "White-label App", "On-Premise Option"],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background" />
      
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
            Transparent pricing for <br className="hidden sm:block" />
            <span className="text-muted-foreground">schools of all sizes</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 ${plan.highlighted ? "border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10" : "hover:border-blue-200 dark:hover:border-blue-800"}`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-bl-full -z-10 opacity-10" />
              )}
              {plan.highlighted && (
                <div className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider text-center py-1.5 w-full">
                  Most Popular
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground h-10">{plan.description}</p>
                
                <div className="mt-8 mb-8">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground font-medium ml-1">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${plan.highlighted ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full h-12 rounded-xl text-base font-semibold ${plan.highlighted ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="/register">{plan.name === "Enterprise" ? "Contact Sales" : "Get Started Free"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
