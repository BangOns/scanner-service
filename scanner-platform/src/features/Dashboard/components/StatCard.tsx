import React from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  trend?: {
    text: string;
    positive?: boolean;
  };
  color?: "sky" | "emerald" | "amber" | "indigo";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  trend,
  color = "sky",
}) => {
  const colorMap = {
    sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <Card hoverEffect className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <h4 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
            {value}
          </h4>
          {sublabel && (
            <p className="text-xs text-slate-400 mt-1">{sublabel}</p>
          )}
          {trend && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "font-medium",
                  trend.positive ? "text-emerald-400" : "text-amber-400"
                )}
              >
                {trend.text}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl border shrink-0", colorMap[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
