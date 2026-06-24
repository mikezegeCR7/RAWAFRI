import { type Order, STATUS_BADGE, formatNaira } from "@/lib/order-data";
import { cn } from "@/lib/utils";
import { ChevronRight, CheckCircle, Package, ShoppingBag } from "lucide-react";

type Props = {
  orders: Order[];
  activeOrderId?: string;
  onSelect: (order: Order) => void;
};

export function OrderHistoryList({ orders, activeOrderId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const badge = STATUS_BADGE[order.status];
        const unread = order.notifications.filter((n) => !n.read).length;
        const isAwaitingConfirmation = order.status === "awaiting_confirmation";

        return (
          <button
            key={order.id}
            onClick={() => onSelect(order)}
            className={cn(
              "w-full text-left bg-card rounded-2xl ring-1 p-4 transition-all hover:shadow-sm",
              activeOrderId === order.id ? "ring-brand" : isAwaitingConfirmation ? "ring-purple-300" : "ring-border"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                isAwaitingConfirmation ? "bg-purple-100" : "bg-brand/10"
              )}>
                {order.status === "delivered" ? (
                  <CheckCircle className="w-4.5 h-4.5 text-brand" />
                ) : isAwaitingConfirmation ? (
                  <Package className="w-4.5 h-4.5 text-purple-600" />
                ) : (
                  <ShoppingBag className="w-4.5 h-4.5 text-brand" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{order.reference}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand text-brand-foreground text-[10px] font-bold flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full ring-1", badge.color)}>
                    {badge.label}
                  </span>
                  <span className="text-xs font-bold text-foreground">{formatNaira(order.total)}</span>
                </div>

                {isAwaitingConfirmation && (
                  <p className="text-xs text-purple-700 font-medium mt-1.5">
                    ⚡ Action required — tap to confirm delivery
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
