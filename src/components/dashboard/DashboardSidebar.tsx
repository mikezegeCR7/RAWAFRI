import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  MapPin,
  CreditCard,
  Bell,
  Sparkles,
  Clock,
  LogOut,
  ChevronRight,
  User,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "cart", label: "Cart", icon: ShoppingCart, badge: 3 },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell, badge: 4 },
  { key: "recommended", label: "Recommended", icon: Sparkles },
  { key: "recent", label: "Recently Viewed", icon: Clock },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

interface Props {
  active: string;
  onChange: (key: NavKey) => void;
}

export function DashboardSidebar({ active, onChange }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-card ring-1 ring-border rounded-2xl overflow-hidden h-fit sticky top-24">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-brand/10 ring-2 ring-brand/20 grid place-items-center">
            <User className="size-5 text-brand" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Adaeze Okafor</p>
            <p className="text-xs text-muted-foreground">adaeze@gmail.com</p>
          </div>
        </div>
      </div>

      <nav className="p-2 flex-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon, badge }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="flex-1 text-left">{label}</span>
              {badge != null && (
                <span className={cn(
                  "size-5 rounded-full text-[10px] font-bold grid place-items-center",
                  isActive ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
                )}>
                  {badge}
                </span>
              )}
              {isActive && <ChevronRight className="size-3.5 text-brand" />}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border space-y-1">
        <a
          href="/help"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <HelpCircle className="size-4" />
          Help & Support
        </a>
        <button
          onClick={() => window.location.href = "/"}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
