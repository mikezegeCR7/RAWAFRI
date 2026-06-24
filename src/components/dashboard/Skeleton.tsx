import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-muted via-accent to-muted bg-[length:200%_100%]",
        className,
      )}
      style={{ animation: "shimmer 1.5s infinite linear" }}
    />
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-20" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-4 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
