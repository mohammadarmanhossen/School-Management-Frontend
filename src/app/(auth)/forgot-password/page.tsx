"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas";
import { authService } from "@/services";
import { getErrorMessage } from "@/services/api-client";
import { AuthLayout, AuthCard, AuthLink } from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout variant="login">
      <AuthCard
        title="Forgot password?"
        description="Enter your email and we'll send you a reset link"
        footer={
          <>
            Remember your password? <AuthLink href="/login">Sign in</AuthLink>
          </>
        }
      >
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Check your email for a password reset link. It may take a few minutes to arrive.
            </p>
            <AuthLink href="/login">Back to login</AuthLink>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@school.edu.bd" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
