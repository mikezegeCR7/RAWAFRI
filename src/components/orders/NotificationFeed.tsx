import { Bell, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Notification } from "@/lib/order-data";

const ICON_MAP = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};

const COLOR_MAP = {
  success: "text-emerald-600 bg-emerald-50",
  info: "text-blue-600 bg-blue-50",
  warning: "text-amber-600 bg-amber-50",
};

export function NotificationFeed({
  notifications,
}: {
  notifications: Notification[];
}) {
  const unread = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className="bg-card rounded-2xl ring-1 ring-border px-5 py-8 text-center">
        <Bell className="size-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Bell className="size-4 text-brand" />
        <h3 className="font-semibold text-sm text-foreground">Updates</h3>
        {unread > 0 && (
          <span className="ml-auto text-[10px] font-bold bg-brand text-brand-foreground rounded-full px-2 py-0.5">
            {unread} new
          </span>
        )}
      </div>

      <div className="divide-y divide-border">
        {[...notifications].reverse().map((n) => {
          const Icon = ICON_MAP[n.type];
          return (
            <div
              key={n.id}
              className={cn(
                "px-5 py-3.5 flex gap-3 items-start transition-colors",
                !n.read && "bg-brand/4"
              )}
            >
              <div
                className={cn(
                  "size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  COLOR_MAP[n.type]
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="size-2 rounded-full bg-brand mt-1.5 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
