"use client";

import { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning";
  isCurrency?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    icon: "bg-blue-500/15 text-blue-400 ring-blue-500/20",
    glow: "from-blue-500/10 to-transparent",
  },
  primary: {
    icon: "bg-blue-500/15 text-blue-400 ring-blue-500/20",
    glow: "from-blue-500/10 to-transparent",
  },
  success: {
    icon: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
    glow: "from-emerald-500/10 to-transparent",
  },
  warning: {
    icon: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
    glow: "from-amber-500/10 to-transparent",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  isCurrency,
  className,
}: StatCardProps) {
  const displayValue =
    typeof value === "number" && isCurrency ? formatCurrency(value) : value;
  const styles = variantStyles[variant];

  return (
    <div className={cn("dashboard-card group relative overflow-hidden p-6", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          styles.glow
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-white">{displayValue}</p>
          {description && (
            <p className="text-xs text-zinc-500">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.value >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3 ring-1", styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
