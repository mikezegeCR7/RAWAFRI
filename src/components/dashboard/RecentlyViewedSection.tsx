import { Clock, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import productRice from "@/assets/rice.jpeg";
import productBeans from "@/assets/market-beans.jpeg";
import productPalmOil from "@/assets/bulk-onions.jpeg";
import productYam from "@/assets/yam.jpeg";
import productPepper from "@/assets/shallots.jpeg";
import productFish from "@/assets/honey-beans.jpeg";
import productLivestock from "@/assets/garri.jpeg";

type RecentProduct = {
  id: string;
  name: string;
  vendor: string;
  price: number;
  unit: string;
  rating: number;
  img: string;
  viewedAt: string;
};

const INITIAL: RecentProduct[] = [
  { id: "rv1", name: "Long Grain Parboiled Rice", vendor: "Mama T Store", price: 1450, unit: "kg", rating: 4.7, img: productRice, viewedAt: "Just now" },
  { id: "rv2", name: "Zaki-Biam Palm Oil", vendor: "Benue Fresh", price: 2800, unit: "L", rating: 4.9, img: productPalmOil, viewedAt: "5 min ago" },
  { id: "rv3", name: "Brown Beans (Oloyin)", vendor: "Mile 12 Bulk", price: 1200, unit: "kg", rating: 4.6, img: productBeans, viewedAt: "30 min ago" },
  { id: "rv4", name: "Old Yam (Large)", vendor: "Abuja Direct", price: 4500, unit: "pc", rating: 4.8, img: productYam, viewedAt: "1 hr ago" },
  { id: "rv5", name: "Rodo Pepper Basket", vendor: "Oyingbo Central", price: 3200, unit: "basket", rating: 4.5, img: productPepper, viewedAt: "2 hr ago" },
  { id: "rv6", name: "Fresh Tilapia (Iced)", vendor: "Epe Lagoon", price: 5200, unit: "kg", rating: 4.9, img: productFish, viewedAt: "Yesterday" },
];

export function RecentlyViewedSection() {
  const [items, setItems] = useState<RecentProduct[]>(INITIAL);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    toast.success("History cleared");
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Clock className="size-12 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="font-semibold mb-1">No recent views</h3>
        <p className="text-sm text-muted-foreground">Items you view will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <Clock className="size-5 text-muted-foreground" /> Recently Viewed
          </h2>
          <p className="text-sm text-muted-foreground">{items.length} items</p>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-destructive font-semibold hover:opacity-80 transition"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-card ring-1 ring-border rounded-2xl p-3 flex items-center gap-3 group hover:ring-brand/30 transition-all">
            <img src={item.img} alt={item.name} className="size-16 rounded-xl object-cover ring-1 ring-border shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.vendor}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-warning text-warning" />
                  <span className="text-[11px] text-muted-foreground">{item.rating}</span>
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {item.viewedAt}
                </span>
              </div>
              <p className="text-sm font-bold text-brand mt-1">₦{item.price.toLocaleString()}<span className="text-[10px] font-normal text-muted-foreground">/{item.unit}</span></p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => toast.success(`${item.name} added to cart`)}
                className="size-8 rounded-lg bg-brand/10 text-brand grid place-items-center hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                <Plus className="size-4" />
              </button>
              <button
                onClick={() => remove(item.id)}
                className="size-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive grid place-items-center transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
