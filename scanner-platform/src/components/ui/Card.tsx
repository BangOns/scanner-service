import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-6 shadow-sm transition-all duration-200",
        hoverEffect && "hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/40 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
