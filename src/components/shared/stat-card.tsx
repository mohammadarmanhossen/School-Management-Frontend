"use client";

import { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning";
  isCurrency?: boolean;
}

const variantStyles = {
  default: "bg-primary/10 text-primary",
  primary: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  success: "bg-green-500/10 text-green-600 dark:text-green-400",
  warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  isCurrency,
}: StatCardProps) {
  const displayValue =
    typeof value === "number" && isCurrency ? formatCurrency(value) : value;

  return (
    <Card className="glass-card overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{displayValue}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend.value >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn("rounded-xl p-3", variantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
