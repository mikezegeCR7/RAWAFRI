import { useState, useEffect } from "react";
import { Sparkles, Plus, Star, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";
import { ProductCardSkeleton } from "./Skeleton";

import productRice from "@/assets/rice.jpeg";
import productBeans from "@/assets/market-beans.jpeg";
import productPalmOil from "@/assets/bulk-onions.jpeg";
import productYam from "@/assets/yam.jpeg";
import productPepper from "@/assets/shallots.jpeg";
import productFish from "@/assets/honey-beans.jpeg";
import productLivestock from "@/assets/garri.jpeg";

type Product = {
  id: string;
  name: string;
  category: string;
  vendor: string;
  price: number;
  oldPrice?: number;
  unit: string;
  rating: number;
  reviews: number;
  img: string;
  tag?: "bestseller" | "trending" | "new";
};

const RECOMMENDED: Product[] = [
  { id: "r1", name: "Long Grain Parboiled Rice", category: "Grains", vendor: "Mama T Store", price: 1450, unit: "kg", rating: 4.7, reviews: 234, img: productRice, tag: "bestseller" },
  { id: "r2", name: "Zaki-Biam Palm Oil", category: "Oils", vendor: "Benue Fresh", price: 2800, unit: "L", rating: 4.9, reviews: 187, img: productPalmOil, tag: "trending" },
  { id: "r3", name: "Brown Beans (Oloyin)", category: "Legumes", vendor: "Mile 12 Bulk", price: 1200, unit: "kg", rating: 4.6, reviews: 156, img: productBeans },
  { id: "r4", name: "Old Yam (Large)", category: "Tubers", vendor: "Abuja Direct", price: 4500, unit: "pc", rating: 4.8, reviews: 98, img: productYam, tag: "new" },
  { id: "r5", name: "Rodo Pepper Basket", category: "Vegetables", vendor: "Oyingbo Central", price: 3200, unit: "basket", rating: 4.5, reviews: 73, img: productPepper },
  { id: "r6", name: "Fresh Tilapia (Iced)", category: "Fish", vendor: "Epe Lagoon", price: 5200, unit: "kg", rating: 4.9, reviews: 211, img: productFish, tag: "trending" },
  { id: "r7", name: "Live Broiler Chicken", category: "Livestock", vendor: "Ogun Farm Co.", price: 8500, unit: "bird", rating: 4.7, reviews: 64, img: productLivestock },
];

const TAG_CONFIG = {
  bestseller: { label: "Bestseller", cls: "bg-brand text-brand-foreground", icon: TrendingUp },
  trending: { label: "Trending", cls: "bg-orange-500 text-white", icon: Zap },
  new: { label: "New", cls: "bg-violet-600 text-white", icon: Sparkles },
};

export function RecommendedSection() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => new Set([...prev, product.id]));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-display font-semibold flex items-center gap-2">
          <Sparkles className="size-5 text-brand" />
          Recommended for You
        </h2>
        <p className="text-sm text-muted-foreground">Based on your order history and location</p>
      </div>

      {/* Category quick filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", "Grains", "Oils", "Legumes", "Fish", "Tubers", "Vegetables"].map((cat) => (
          <button
            key={cat}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-card ring-1 ring-border text-muted-foreground hover:ring-brand/40 hover:text-brand transition-all first:bg-brand first:text-brand-foreground first:ring-brand"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : RECOMMENDED.map((product) => {
              const isInCart = cart.has(product.id);
              const tagConfig = product.tag ? TAG_CONFIG[product.tag] : null;
              return (
                <div key={product.id} className="bg-card ring-1 ring-border rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    {tagConfig && (
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${tagConfig.cls}`}>
                        <tagConfig.icon className="size-2.5" />
                        {tagConfig.label}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{product.category}</p>
                    <p className="text-sm font-semibold leading-tight mt-0.5 flex-1">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{product.vendor}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="size-3 fill-warning text-warning" />
                      <span className="text-[11px] font-medium">{product.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-bold text-foreground">
                        ₦{product.price.toLocaleString()}
                        <span className="text-[10px] font-normal text-muted-foreground">/{product.unit}</span>
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className={`size-8 rounded-lg grid place-items-center transition-all ${
                          isInCart
                            ? "bg-success/15 text-success"
                            : "bg-brand/10 text-brand hover:bg-brand hover:text-brand-foreground"
                        }`}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
