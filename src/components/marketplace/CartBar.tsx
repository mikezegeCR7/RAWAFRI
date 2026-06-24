import { ShoppingBasket } from "lucide-react";
import { useLocation } from "wouter";

const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export function CartBar({ count, total }: { count: number; total: number }) {
  const [, navigate] = useLocation();
  if (count === 0) return null;
  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-foreground text-background flex items-center justify-between py-3 px-5 rounded-2xl shadow-xl ring-1 ring-white/10 hover:opacity-95 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="size-7 bg-white/15 rounded-lg flex items-center justify-center text-xs font-bold">
            {count}
          </div>
          <ShoppingBasket className="size-4" />
          <span className="text-sm font-medium">View market basket</span>
        </div>
        <span className="text-sm font-semibold">{formatNaira(total)}</span>
      </button>
    </div>
  );
}