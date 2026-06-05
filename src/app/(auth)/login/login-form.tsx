"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/schemas";
import { useAuthStore } from "@/store";
import { authService } from "@/services";
import { getErrorMessage } from "@/services/api-client";
import { getDefaultDashboard } from "@/utils/rbac";
import { AuthLayout, AuthCard, AuthLink } from "@/layouts/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { User as UserType, UserRole } from "@/types";

const DEMO_USERS: Record<string, { password: string; user: UserType }> = {
  "admin@school.edu.bd": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@school.edu.bd",
      firstName: "School",
      lastName: "Admin",
      fullName: "School Admin",
      role: "school_admin" as UserRole,
      isEmailVerified: true,
      schoolId: "school-1",
      schoolName: "Dhaka Model School",
      createdAt: new Date().toISOString(),
    },
  },
  "teacher@school.edu.bd": {
    password: "teacher123",
    user: {
      id: "2",
      email: "teacher@school.edu.bd",
      firstName: "Mohammad",
      lastName: "Karim",
      fullName: "Mohammad Karim",
      role: "teacher" as UserRole,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    },
  },
  "student@school.edu.bd": {
    password: "student123",
    user: {
      id: "3",
      email: "student@school.edu.bd",
      firstName: "Rahim",
      lastName: "Ahmed",
      fullName: "Rahim Ahmed",
      role: "student" as UserRole,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    },
  },
  "parent@school.edu.bd": {
    password: "parent123",
    user: {
      id: "4",
      email: "parent@school.edu.bd",
      firstName: "Parent",
      lastName: "User",
      fullName: "Parent User",
      role: "parent" as UserRole,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    },
  },
  "librarian@school.edu.bd": {
    password: "library123",
    user: {
      id: "5",
      email: "librarian@school.edu.bd",
      firstName: "Ayesha",
      lastName: "Khatun",
      fullName: "Ayesha Khatun",
      role: "librarian" as UserRole,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    },
  },
  "superadmin@school.edu.bd": {
    password: "super123",
    user: {
      id: "6",
      email: "superadmin@school.edu.bd",
      firstName: "Super",
      lastName: "Admin",
      fullName: "Super Admin",
      role: "super_admin" as UserRole,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    },
  },
};

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@school.edu.bd", password: "admin123" },
  { role: "Teacher", email: "teacher@school.edu.bd", password: "teacher123" },
  { role: "Student", email: "student@school.edu.bd", password: "student123" },
  { role: "Parent", email: "parent@school.edu.bd", password: "parent123" },
  { role: "Librarian", email: "librarian@school.edu.bd", password: "library123" },
  { role: "Super Admin", email: "superadmin@school.edu.bd", password: "super123" },
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const rememberMe = watch("rememberMe");

  const fillDemo = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const demoUser = DEMO_USERS[data.email];
      if (demoUser && demoUser.password === data.password) {
        setAuth(
          demoUser.user,
          { access: "demo-access-token", refresh: "demo-refresh-token" },
          data.rememberMe
        );
        toast.success("Welcome back!");
        router.push(searchParams.get("redirect") || getDefaultDashboard(demoUser.user.role));
        return;
      }

      const response = await authService.login(data);
      setAuth(response.user, response.tokens, data.rememberMe);
      toast.success("Welcome back!");
      router.push(searchParams.get("redirect") || getDefaultDashboard(response.user.role));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout variant="login">
      <AuthCard
        title="Sign in"
        description="Enter your credentials to access your dashboard."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <AuthLink href="/register">Create account</AuthLink>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <AuthInput
              id="email"
              type="email"
              placeholder="you@school.edu.bd"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <AuthLink href="/forgot-password">Forgot password?</AuthLink>
            </div>
            <AuthInput
              id="password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="flex items-center gap-2.5">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            />
            <Label htmlFor="rememberMe" className="cursor-pointer text-sm font-normal">
              Keep me signed in
            </Label>
          </div>

          <Button type="submit" className="h-11 w-full rounded-lg text-sm font-medium" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="rounded-xl border border-dashed bg-muted/40 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Quick demo access
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => fillDemo(account.email, account.password)}
                className="rounded-lg border bg-background px-3 py-2.5 text-left text-xs transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <span className="font-medium text-foreground">{account.role}</span>
                <span className="mt-0.5 block truncate text-muted-foreground">{account.email}</span>
              </button>
            ))}
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
 