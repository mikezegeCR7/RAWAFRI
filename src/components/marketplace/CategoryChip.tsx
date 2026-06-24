import { cn } from "@/lib/utils";

export function CategoryChip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 active:scale-95",
        active
          ? "bg-brand text-brand-foreground ring-2 ring-brand ring-offset-1 ring-offset-surface shadow-sm"
          : "bg-card text-muted-foreground ring-1 ring-border hover:bg-accent",
      )}
    >
      {label}
    </button>
  );
}