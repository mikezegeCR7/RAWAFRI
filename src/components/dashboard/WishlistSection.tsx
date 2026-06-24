import { useState } from "react";
import { Heart, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import productRice from "@/assets/rice.jpeg";
import productBeans from "@/assets/market-beans.jpeg";
import productPalmOil from "@/assets/bulk-onions.jpeg";
import productYam from "@/assets/yam.jpeg";
import productPepper from "@/assets/shallots.jpeg";
import productFish from "@/assets/honey-beans.jpeg";
import productLivestock from "@/assets/garri.jpeg";

type WishItem = {
  id: string;
  name: string;
  vendor: string;
  price: number;
  unit: string;
  rating: number;
  img: string;
  onSale?: boolean;
  oldPrice?: number;
};

const INITIAL_WISH: WishItem[] = [
  { id: "w1", name: "Long Grain Parboiled Rice", vendor: "Mama T Store", price: 1450, unit: "kg", rating: 4.7, img: productRice, onSale: true, oldPrice: 1700 },
  { id: "w2", name: "Zaki-Biam Palm Oil", vendor: "Benue Fresh", price: 2800, unit: "L", rating: 4.9, img: productPalmOil },
  { id: "w3", name: "Brown Beans (Oloyin)", vendor: "Mile 12 Bulk", price: 1200, unit: "kg", rating: 4.6, img: productBeans },
  { id: "w4", name: "Old Yam (Large)", vendor: "Abuja Direct", price: 4500, unit: "pc", rating: 4.8, img: productYam, onSale: true, oldPrice: 5200 },
  { id: "w5", name: "Rodo Pepper Basket", vendor: "Oyingbo Central", price: 3200, unit: "basket", rating: 4.5, img: productPepper },
  { id: "w6", name: "Fresh Tilapia (Iced)", vendor: "Epe Lagoon", price: 5200, unit: "kg", rating: 4.9, img: productFish },
  { id: "w7", name: "Live Broiler Chicken", vendor: "Ogun Farm Co.", price: 8500, unit: "bird", rating: 4.7, img: productLivestock },
];

export function WishlistSection() {
  const [items, setItems] = useState<WishItem[]>(INITIAL_WISH);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Removed from wishlist");
  };

  const addToCart = (name: string) => {
    toast.success(`${name} added to cart`);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="size-12 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="font-semibold mb-1">Your wishlist is empty</h3>
        <p className="text-sm text-muted-foreground">Save items you love to buy later</p>
      </div>
    );
  }

  const onSaleItems = items.filter((i) => i.onSale);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-display font-semibold">Wishlist</h2>
          <p className="text-sm text-muted-foreground">{items.length} saved items</p>
        </div>
        {onSaleItems.length > 0 && (
          <span className="text-xs bg-rose-50 text-rose-600 ring-1 ring-rose-200 font-semibold px-2.5 py-1 rounded-full">
            {onSaleItems.length} on sale!
          </span>
        )}
      </div>

      {onSaleItems.length > 0 && (
        <div className="bg-rose-50 ring-1 ring-rose-200 rounded-2xl p-3 text-sm text-rose-700 font-medium">
          🎉 {onSaleItems.length} item{onSaleItems.length > 1 ? "s" : ""} on your wishlist {onSaleItems.length > 1 ? "are" : "is"} on sale right now!
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card ring-1 ring-border rounded-2xl overflow-hidden group">
            <div className="relative aspect-square overflow-hidden">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {item.onSale && (
                <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SALE
                </span>
              )}
              <button
                onClick={() => remove(item.id)}
                className="absolute top-2 right-2 size-7 bg-card/90 backdrop-blur-sm rounded-full grid place-items-center hover:bg-destructive hover:text-white transition-colors ring-1 ring-border"
              >
                <Heart className="size-3.5 fill-rose-500 text-rose-500" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold leading-tight line-clamp-2">{item.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.vendor}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="size-3 fill-warning text-warning" />
                <span className="text-[10px] text-muted-foreground">{item.rating}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-sm font-bold text-brand">₦{item.price.toLocaleString()}<span className="text-[10px] font-normal text-muted-foreground">/{item.unit}</span></p>
                {item.oldPrice && (
                  <p className="text-[11px] text-muted-foreground line-through">₦{item.oldPrice.toLocaleString()}</p>
                )}
              </div>
              <button
                onClick={() => addToCart(item.name)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand/10 text-brand text-xs font-semibold hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                <Plus className="size-3.5" /> Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
