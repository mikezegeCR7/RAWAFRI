import { MapPin, Phone, Store, Clock } from "lucide-react";
import { type Order } from "@/lib/order-data";

export function DeliveryInfo({ order }: { order: Order }) {
  return (
    <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">Delivery Details</h3>
      </div>

      <div className="divide-y divide-border">
        <InfoRow icon={MapPin} label="Delivery address">
          <p className="text-sm font-medium text-foreground">{order.address}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{order.landmark}</p>
        </InfoRow>

        <InfoRow icon={Clock} label="Estimated arrival">
          <p className="text-sm font-medium text-foreground">{order.estimatedDelivery}</p>
          {order.estimatedMinutes > 0 && (
            <p className="text-xs text-brand font-medium mt-0.5">
              ~{order.estimatedMinutes} minutes away
            </p>
          )}
        </InfoRow>

        <InfoRow icon={Store} label="Dispatched from">
          <p className="text-sm font-medium text-foreground">{order.vendorName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{order.vendorMarket}</p>
        </InfoRow>

        <InfoRow icon={Phone} label="Contact">
          <p className="text-sm font-medium text-foreground">{order.contactName}</p>
          <a
            href={`tel:${order.contactPhone}`}
            className="text-xs text-brand font-medium mt-0.5 hover:underline inline-block"
          >
            {order.contactPhone}
          </a>
        </InfoRow>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4 flex gap-3">
      <div className="size-8 rounded-lg bg-brand/8 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-4 text-brand" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}
