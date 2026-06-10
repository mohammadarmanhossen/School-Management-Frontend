"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, School, CheckCircle2 } from "lucide-react";
import { APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

type AuthVariant = "login" | "register";

const PANEL_CONTENT: Record<
  AuthVariant,
  { image: string; title: string; subtitle: string; points: string[] }
> = {
  login: {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    title: "Welcome back to your school hub",
    subtitle: "Access attendance, exams, fees, and reports — all in one secure dashboard.",
    points: [
      "Real-time attendance & analytics",
      "Secure role-based access",
      "Trusted by 500+ schools",
    ],
  },
  register: {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80", // Slightly different placeholder for variety
    title: "Start managing your school today",
    subtitle: "Create your account and set up students, teachers, classes, and more in minutes.",
    points: [
      "Free 14-day trial",
      "No credit card required",
      "Setup in under 10 minutes",
    ],
  },
};

export function AuthLayout({
  children,
  variant = "login",
}: {
  children: React.ReactNode;
  variant?: AuthVariant;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-primary/30">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 -translate-y-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 blur-[100px] bg-gradient-to-b from-primary via-indigo-500 to-transparent rounded-full pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] opacity-20 blur-[120px] bg-gradient-to-t from-blue-600 to-transparent rounded-full pointer-events-none" />

      {/* Header / Logo */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12 z-20">
        <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
            <School className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">{APP_NAME}</span>
        </Link>
      </div>

      {/* Centered Main Form Container */}
      <div className="relative z-10 w-full max-w-[440px] px-6 mt-16 lg:mt-0">
        <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700">
          {children}
        </div>
      </div>

      {/* Footer Element */}
      <div className="absolute bottom-8 text-center w-full z-20">
        <p className="text-xs text-white/40 tracking-wider">
          &copy; {new Date().getFullYear()} {APP_NAME}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-8 p-8 sm:p-10 bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[2rem] border border-white/[0.08] shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden", className)}>
      {/* Card Inner Glow */}
      <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="space-y-3 relative z-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">{title}</h2>
        {description && (
          <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
        )}
      </div>
      <div className="relative z-10 text-zinc-200">
        {children}
      </div>
      {footer && (
        <div className="relative z-10 pt-4 border-t border-white/5 text-center text-sm text-zinc-400">
          {footer}
        </div>
      )}
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors">
      {children}
    </Link>
  );
}

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
