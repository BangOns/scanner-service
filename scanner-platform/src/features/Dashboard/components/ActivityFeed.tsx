import React from "react";
import { formatDate } from "@/lib/utils";
import { Activity, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  user: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Belum ada aktivitas tercatat.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/60">
      {activities.map(item => (
        <div key={item.id} className="py-3.5 flex items-start justify-between gap-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-slate-800/80 text-sky-400 border border-slate-700/50 mt-0.5">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium text-slate-200">{item.action}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.entity}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
            <Clock className="w-3 h-3" />
            <span>{formatDate(item.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
