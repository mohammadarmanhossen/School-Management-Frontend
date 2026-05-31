"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface AuthInputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  error?: string;
}

export function AuthInput({ icon, error, className, ...props }: AuthInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          className={cn(icon && "pl-10", error && "border-destructive focus-visible:ring-destructive/20", className)}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
