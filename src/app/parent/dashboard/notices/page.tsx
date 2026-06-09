"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useParentStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Info, Calendar as CalendarIcon, AlertCircle, DollarSign } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const TYPE_CONFIG = {
  general: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  academic: { icon: CalendarIcon, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  event: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  fee: { icon: DollarSign, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

export default function NoticesPage() {
  const [mounted, setMounted] = useState(false);
  const { notices, markNoticeRead } = useParentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Notices"
        description="Important announcements and updates from the school."
        breadcrumbs={[{ label: "Parent Dashboard", href: "/parent/dashboard" }, { label: "Notices" }]}
      />

      <div className="mx-auto max-w-4xl space-y-4">
        {notices.length > 0 ? notices.map((notice) => {
          const config = TYPE_CONFIG[notice.type] || TYPE_CONFIG.general;
          const Icon = config.icon;
          
          return (
            <Card 
              key={notice.id} 
              className={`dashboard-card overflow-hidden transition-all hover:border-white/10 ${!notice.isRead ? 'border-l-2 border-l-blue-500 border-y-white/5 border-r-white/5 bg-blue-500/5' : 'border-white/5'}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{notice.title}</h3>
                        {!notice.isRead && <Badge className="bg-blue-500">New</Badge>}
                      </div>
                      <span className="text-xs text-zinc-400">{formatDate(notice.date)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {notice.content}
                    </p>
                    <div className="pt-2 flex justify-end">
                      {!notice.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => markNoticeRead(notice.id)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 text-center">
            <Bell className="mb-2 h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-400">No notices at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
