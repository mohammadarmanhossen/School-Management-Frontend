"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockParentNotifications } from "@/lib/mock-data";
import type { Notification } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

const TYPE_STYLES: Record<Notification["type"], string> = {
  info: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
  success: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
  warning: "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30",
  error: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
};

export default function ParentNotificationsPage() {
  const [notifications, setNotifications] = useState(mockParentNotifications);

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  function NotificationItem({ item }: { item: Notification }) {
    return (
      <Card className={`${TYPE_STYLES[item.type]} ${!item.read ? "ring-1 ring-primary/20" : ""}`}>
        <CardContent className="flex gap-4 pt-4">
          <div className="mt-0.5">
            {!item.read ? (
              <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
            ) : (
              <span className="block h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{item.title}</p>
              <Badge variant="outline" className="shrink-0 text-xs capitalize">
                {item.type}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
              {item.link && (
                <Link href={item.link} className="text-xs font-medium text-primary hover:underline">
                  View details
                </Link>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            {!item.read && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markRead(item.id)}>
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => remove(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated on your child's school activities"
        breadcrumbs={[
          { label: "Parent Portal", href: "/parent/dashboard" },
          { label: "Notifications" },
        ]}
        actions={
          unread.length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )
        }
      />

      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
        <Bell className="h-5 w-5 text-primary" />
        <p className="text-sm">
          You have <strong>{unread.length} unread</strong> notification{unread.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-3">
          {notifications.map((n) => (
            <NotificationItem key={n.id} item={n} />
          ))}
        </TabsContent>
        <TabsContent value="unread" className="mt-4 space-y-3">
          {unread.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No unread notifications</p>
          ) : (
            unread.map((n) => <NotificationItem key={n.id} item={n} />)
          )}
        </TabsContent>
        <TabsContent value="read" className="mt-4 space-y-3">
          {read.map((n) => (
            <NotificationItem key={n.id} item={n} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
