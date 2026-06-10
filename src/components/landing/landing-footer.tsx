"use client";

import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { APP_NAME } from "@/constants";

export function CtaSection() {
  return (
    <section className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x bg-[length:200%_auto]" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl animate-pulse-slow" />

        <div className="relative px-8 py-20 text-center sm:px-16 sm:py-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            Start free — no credit card required
          </div>
          <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to transform your school?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
            Join hundreds of institutions already using our platform to automate their operations and focus on what matters: education.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-14 min-w-[200px] rounded-full bg-white px-8 font-bold text-blue-600 shadow-2xl transition-all hover:scale-105 hover:bg-blue-50"
            >
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 min-w-[200px] rounded-full border-white/40 bg-transparent px-8 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
            >
              <a href="#contact">Contact Sales</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "Pricing", href: "#pricing" },
    { label: "Demo", href: "/register" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#contact" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function LandingFooter() {
  return (
    <footer className="mt-8 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Enterprise school management for modern institutions — students, teachers,
              parents, and admins in one unified platform.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="mailto:info@schoolmgmt.com"
                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-blue-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-500" />
                </span>
                info@schoolmgmt.com
              </a>
              <a
                href="tel:+8801234567890"
                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-blue-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <Phone className="h-4 w-4 text-blue-500" />
                </span>
                +880 1234-567890
              </a>
              <p className="flex items-start gap-3 text-sm text-slate-400">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <MapPin className="h-4 w-4 text-blue-500" />
                </span>
                123 Education Road, Dhanmondi, Dhaka 1205
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold tracking-wide text-white">{title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h4 className="text-sm font-semibold text-white">Newsletter</h4>
              <p className="mt-2 text-sm text-slate-400">
                Product updates and tips for school admins.
              </p>
              <form
                className="mt-4 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Subscribed! Check your inbox.");
                }}
              >
                <Input
                  type="email"
                  placeholder="you@school.edu.bd"
                  className="h-12 rounded-xl border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
                  required
                />
                <Button type="submit" className="h-12 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/login"
              className="text-slate-500 transition-colors hover:text-slate-300"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-slate-500 transition-colors hover:text-slate-300"
            >
              Register
            </Link>
            <a
              href="#contact"
              className="text-slate-500 transition-colors hover:text-slate-300"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
