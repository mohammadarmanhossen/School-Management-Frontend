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
  const content = PANEL_CONTENT[variant];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Image panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={content.image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <School className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
            </div>
          </div>

          <div className="max-w-md space-y-6">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
                {content.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-white/75">
                {content.subtitle}
              </p>
            </div>
            <ul className="space-y-3">
              {content.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <School className="h-5 w-5" />
            </div>
            <span className="font-semibold">{APP_NAME}</span>
          </div>
        </div>

        <div className="relative h-44 shrink-0 overflow-hidden lg:hidden">
          <Image
            src={content.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
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
    <div className={cn("space-y-8", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
      {footer && (
        <p className="text-center text-sm text-muted-foreground">{footer}</p>
      )}
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-primary hover:underline underline-offset-4">
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
