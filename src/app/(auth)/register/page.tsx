"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/schemas";
import { authService } from "@/services";
import { getErrorMessage } from "@/services/api-client";
import { AuthLayout, AuthCard, AuthLink } from "@/layouts/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ROLES = [
  { value: "school_admin", label: "School Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success("Account created! Please verify your email.");
      router.push("/verify-email");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout variant="register">
      <AuthCard
        title="Create account"
        description="Fill in your details to get started with a free trial."
        footer={
          <>
            Already have an account?{" "}
            <AuthLink href="/login">Sign in</AuthLink>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <AuthInput
                id="firstName"
                placeholder="John"
                icon={<User className="h-4 w-4" />}
                error={errors.firstName?.message}
                {...register("firstName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <AuthInput
                id="lastName"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>
          </div>

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
            <Label htmlFor="phone">Phone number</Label>
            <AuthInput
              id="phone"
              placeholder="01XXXXXXXXX"
              icon={<Phone className="h-4 w-4" />}
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label>I am a</Label>
            <Select
              onValueChange={(v) => setValue("role", v as RegisterFormData["role"])}
              defaultValue="student"
            >
              <SelectTrigger className="h-11 rounded-lg">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <AuthInput
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <AuthInput
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <Button type="submit" className="h-11 w-full rounded-lg text-sm font-medium" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
