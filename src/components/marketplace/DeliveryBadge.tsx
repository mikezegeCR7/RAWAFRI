import { cn } from "@/lib/utils";

type Status = "preparing" | "on-the-way" | "arriving" | "delivered";

const STYLES: Record<Status, { label: string; cls: string }> = {
  preparing: { label: "Preparing", cls: "bg-warning/15 text-warning" },
  "on-the-way": { label: "On the way", cls: "bg-brand/10 text-brand" },
  arriving: { label: "Arriving soon", cls: "bg-brand/10 text-brand" },
  delivered: { label: "Delivered", cls: "bg-success/15 text-success" },
};

export function DeliveryBadge({ status }: { status: Status }) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        s.cls,
      )}
    >
      <span className="size-1.5 rounded-full bg-current animate-pulse" />
      {s.label}
    </span>
  );
}