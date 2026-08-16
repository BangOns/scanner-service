import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || props.name || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={cn(
              "w-full bg-slate-950/80 border rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20",
              leftIcon ? "pl-10" : "pl-3.5",
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-800 focus:border-sky-500",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={errorId} className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
