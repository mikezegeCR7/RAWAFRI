import { useState } from "react";
import { Bell, Truck, Tag, Package, Star, AlertCircle, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type NotifType = "delivery" | "promo" | "order" | "review" | "alert";

type Notif = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; cls: string }> = {
  delivery: { icon: Truck, cls: "bg-orange-100 text-orange-600" },
  promo: { icon: Tag, cls: "bg-rose-100 text-rose-600" },
  order: { icon: Package, cls: "bg-blue-100 text-blue-600" },
  review: { icon: Star, cls: "bg-yellow-100 text-yellow-600" },
  alert: { icon: AlertCircle, cls: "bg-violet-100 text-violet-600" },
};

const INITIAL_NOTIFS: Notif[] = [
  { id: "n1", type: "delivery", title: "Order on the way!", body: "Emmanuel O. has picked up your order #ORD-8821 and is 18 minutes away.", time: "2 min ago", read: false },
  { id: "n2", type: "promo", title: "Flash Sale 🔥", body: "Get 15% off all fish and seafood today only. Use code FISH15 at checkout.", time: "1 hr ago", read: false },
  { id: "n3", type: "order", title: "Order confirmed", body: "Your order #ORD-8821 has been received and is being prepared by Oyingbo Central Market.", time: "2 hr ago", read: false },
  { id: "n4", type: "review", title: "Rate your last order", body: "How was your order from Mile 12 Direct Depot? Share your experience.", time: "Yesterday", read: false },
  { id: "n5", type: "promo", title: "Weekend deal: Palm Oil", body: "Zaki-Biam Palm Oil now ₦2,400/L for the weekend. Stock up while supply lasts.", time: "Yesterday", read: true },
  { id: "n6", type: "order", title: "Order #ORD-8804 delivered", body: "Your yams from Mile 12 Depot have been delivered. Enjoy your meal!", time: "2 days ago", read: true },
  { id: "n7", type: "alert", title: "Price drop alert 📉", body: "Brown Beans (Oloyin) dropped from ₦1,600 to ₦1,200/kg.", time: "3 days ago", read: true },
];

export function NotificationsSection() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const dismiss = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const markRead = (id: string) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const displayed = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-display font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-brand font-semibold hover:opacity-80 transition"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => toast.message("Notification settings coming soon")}
            className="size-8 rounded-full bg-card ring-1 ring-border grid place-items-center hover:bg-accent transition-colors"
          >
            <Settings className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
              filter === f ? "bg-brand text-brand-foreground" : "bg-card ring-1 ring-border text-muted-foreground hover:ring-brand/40",
            )}
          >
            {f === "all" ? "All" : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="size-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((notif) => {
            const { icon: Icon, cls } = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "relative bg-card ring-1 rounded-2xl p-4 flex gap-3 cursor-pointer transition-all",
                  notif.read ? "ring-border" : "ring-brand/30 bg-brand/5",
                )}
              >
                {!notif.read && (
                  <span className="absolute top-4 right-10 size-2 bg-brand rounded-full" />
                )}
                <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", cls)}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm leading-tight", notif.read ? "font-medium text-foreground" : "font-semibold text-foreground")}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">{notif.time}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                  className="size-6 rounded-full hover:bg-muted grid place-items-center transition-colors shrink-0 mt-0.5"
                >
                  <X className="size-3 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
