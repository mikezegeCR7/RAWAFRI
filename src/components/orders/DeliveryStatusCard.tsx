import { MapPin, Clock, CheckCircle } from "lucide-react";
import { type Order, STATUS_BADGE, formatNaira } from "@/lib/order-data";
import { cn } from "@/lib/utils";

export function DeliveryStatusCard({ order }: { order: Order }) {
  const badge = STATUS_BADGE[order.status];

  return (
    <div className="bg-card rounded-2xl ring-1 ring-border p-5 space-y-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Order reference</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{order.reference}</p>
        </div>
        <span className={cn("text-xs font-semibold px-3 py-1 rounded-full ring-1 whitespace-nowrap", badge.color)}>
          {badge.label}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Details */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Delivery address</p>
            <p className="text-sm font-medium text-foreground">{order.address}</p>
            {order.landmark && <p className="text-xs text-muted-foreground">{order.landmark}</p>}
          </div>
        </div>


        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">
              {order.status === "delivered" ? "Delivered" : "Estimated delivery"}
            </p>
            <p className="text-sm font-medium text-foreground">{order.estimatedDelivery}</p>
            {order.confirmedAt && (
              <p className="text-xs text-green-600 font-medium mt-0.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmed at {order.confirmedAt}</p>
            )}
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Order total</span>
        <span className="text-sm font-bold text-foreground">{formatNaira(order.total)}</span>
      </div>
    </div>
  );
}
