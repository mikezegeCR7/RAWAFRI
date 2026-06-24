import { Check, Clock } from "lucide-react";
import { ORDER_STAGES, STATUS_INDEX, type OrderStatus } from "@/lib/order-data";
import { cn } from "@/lib/utils";

export function OrderTimelineVertical({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-sm font-bold">✕</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
          <p className="text-xs text-muted-foreground">This order was cancelled</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[status] ?? 0;

  return (
    <ol className="space-y-0">
      {ORDER_STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const future = i > currentIndex;
        const isLast = i === ORDER_STAGES.length - 1;

        return (
          <li key={stage.key} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ring-2 transition-all",
                  done && "bg-brand ring-brand",
                  active && "bg-brand ring-brand ring-offset-2",
                  future && "bg-surface ring-border"
                )}
              >
                {done ? (
                  <Check className="w-4 h-4 text-brand-foreground" />
                ) : active ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-foreground animate-pulse" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
              {!isLast && (
                <div className={cn("w-0.5 flex-1 my-1 min-h-[20px]", done ? "bg-brand" : "bg-border")} />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-5 flex-1", isLast && "pb-0")}>
              <p className={cn("text-sm font-semibold leading-tight", future ? "text-muted-foreground" : "text-foreground")}>
                {stage.label}
              </p>
              <p className={cn("text-xs mt-0.5", future ? "text-muted-foreground/60" : "text-muted-foreground")}>
                {stage.sub}
              </p>
              {active && stage.key === "awaiting_confirmation" && (
                <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
                  Action required
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
