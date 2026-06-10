"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, School, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants";
import { useAuthStore } from "@/store";
import { getDefaultDashboard } from "@/utils/rbac";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Modules", href: "#modules" },
  { label: "Pricing", href: "#pricing" },
  { label: "Admissions", href: "/admission" },
  { label: "Careers", href: "/teacher-apply" },
  { label: "Contact", href: "#contact" },
];

export function LandingHeader() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardHref = user ? getDefaultDashboard(user.role) : "/dashboard";

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between rounded-full border border-white/20 bg-white/60 px-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <School className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          </Button>
          {isAuthenticated ? (
            <Button asChild>
              <Link href={dashboardHref}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full font-medium" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-md" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      {mobileOpen && (
        <div className="absolute left-4 right-4 top-20 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t pt-4 px-2">
              {isAuthenticated ? (
                <Button className="rounded-full" asChild>
                  <Link href={dashboardHref}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button className="rounded-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
