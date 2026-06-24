import { Home, Search, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "browse", label: "Browse", icon: Search },
  { key: "orders", label: "Orders", icon: Receipt },
  { key: "account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const [active, setActive] = useState<string>("home");
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border px-6 py-3 flex items-center justify-between z-50">
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="flex flex-col items-center gap-1 transition-colors"
          >
            <Icon
              className={cn(
                "size-5",
                isActive ? "text-brand" : "text-muted-foreground/60",
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                isActive ? "text-brand" : "text-muted-foreground/60",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}