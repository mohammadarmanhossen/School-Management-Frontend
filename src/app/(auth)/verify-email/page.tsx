"use client";

import { Mail, CheckCircle } from "lucide-react";
import { AuthLayout, AuthCard, AuthLink } from "@/layouts/auth-layout";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <AuthCard title="Verify your email">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Check your inbox and spam folder
          </div>
          <Button variant="outline" asChild>
            <AuthLink href="/login">Back to login</AuthLink>
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
