import { Package, AlertTriangle, RefreshCcw } from "lucide-react";

export function OrderLoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-card rounded-2xl ring-1 ring-border overflow-hidden">
        <div className="px-5 py-4 bg-muted/40 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded-full w-1/3" />
            <div className="h-2.5 bg-muted rounded-full w-1/4" />
          </div>
        </div>
        <div className="px-5 py-6">
          <div className="flex justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="size-8 rounded-full bg-muted" />
                <div className="h-2 bg-muted rounded-full w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl ring-1 ring-border p-5 space-y-3">
          <div className="h-3 bg-muted rounded-full w-2/5" />
          <div className="h-2.5 bg-muted rounded-full w-3/5" />
          <div className="h-2.5 bg-muted rounded-full w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function OrderErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-card rounded-2xl ring-1 ring-border px-6 py-12 text-center">
      <div className="size-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        Couldn't load orders
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-brand text-brand-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition"
      >
        <RefreshCcw className="size-4" />
        Try again
      </button>
    </div>
  );
}

export function OrderEmptyState() {
  return (
    <div className="bg-card rounded-2xl ring-1 ring-border px-6 py-16 text-center">
      <div className="size-16 rounded-2xl bg-brand/8 flex items-center justify-center mx-auto mb-4">
        <Package className="size-8 text-brand/60" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">No orders yet</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Browse the marketplace and place your first order today.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 bg-brand text-brand-foreground text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition"
      >
        Shop now
      </a>
    </div>
  );
}
