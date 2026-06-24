import { Package } from "lucide-react";
import { type Order, formatNaira } from "@/lib/order-data";

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <Package className="size-4 text-brand" />
        <h3 className="font-semibold text-sm text-foreground">Order Summary</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="divide-y divide-border">
        {order.items.map((item) => (
          <div key={item.id} className="px-5 py-3.5 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-brand/8 flex items-center justify-center shrink-0">
              <span className="text-brand text-sm font-bold">{item.quantity}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} {item.unit} × {formatNaira(item.price)}/{item.unit}
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground shrink-0">
              {formatNaira(item.quantity * item.price)}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-border space-y-2 bg-surface/50">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatNaira(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery fee</span>
          <span className="text-foreground">{formatNaira(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold border-t border-border pt-2 mt-1">
          <span className="text-foreground">Total</span>
          <span className="text-brand text-base">{formatNaira(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
