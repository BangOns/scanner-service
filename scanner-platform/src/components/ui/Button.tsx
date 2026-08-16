import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const BASE_STYLES =
  "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

const VARIANTS = {
  primary:
    "bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-md shadow-sky-500/20 focus:ring-sky-400 focus:ring-offset-slate-900",
  secondary:
    "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60 focus:ring-slate-400 focus:ring-offset-slate-900",
  outline:
    "border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent focus:ring-slate-400 focus:ring-offset-slate-900",
  danger:
    "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500 focus:ring-offset-slate-900",
  ghost:
    "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 focus:ring-slate-500 focus:ring-offset-slate-900",
} as const;

const SIZES = {
  sm: "text-xs px-2.5 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-5 py-2.5 gap-2.5",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(BASE_STYLES, VARIANTS[variant], SIZES[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
