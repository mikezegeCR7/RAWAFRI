import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  MapPin,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_ITEMS = [
  { key: "overview", label: "Home", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "cart", label: "Cart", icon: ShoppingCart, badge: 3 },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "notifications", label: "Alerts", icon: Bell, badge: 4 },
] as const;

interface Props {
  active: string;
  onChange: (key: string) => void;
}

export function DashboardBottomNav({ active, onChange }: Props) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-md border-t border-border z-50 px-2 py-2">
      <div className="flex items-center justify-around">
        {MOBILE_ITEMS.map(({ key, label, icon: Icon, badge }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-col items-center gap-1 relative px-2 py-1"
            >
              <div className="relative">
                <Icon
                  className={cn("size-5 transition-colors", isActive ? "text-brand" : "text-muted-foreground")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {badge != null && (
                  <span className="absolute -top-1.5 -right-1.5 size-4 bg-brand text-brand-foreground text-[9px] font-bold rounded-full grid place-items-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px] font-medium", isActive ? "text-brand" : "text-muted-foreground")}>
                {label}
              </span>
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
