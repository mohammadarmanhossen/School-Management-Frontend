"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity as ActivityIcon } from "lucide-react";
import type { Activity } from "@/types";

export function RecentActivities({ activities }: { activities: Activity[] }) {
  return (
    <div className="dashboard-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-6 py-4">
        <ActivityIcon className="h-5 w-5 text-blue-400" />
        <h3 className="text-base font-semibold text-white">Recent Activities</h3>
      </div>
      <div className="divide-y divide-white/[0.04] p-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-white/[0.02]"
          >
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300">{activity.description}</p>
              <p className="mt-1 text-xs text-zinc-600">
                {activity.user} ·{" "}
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
