import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const VARIANTS = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  neutral: "bg-slate-800 text-slate-300 border-slate-700",
} as const;

const SIZES = {
  sm: "text-[11px] px-2 py-0.5 font-medium",
  md: "text-xs px-2.5 py-1 font-medium",
} as const;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border tracking-wide",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {children}
    </span>
  );
};
