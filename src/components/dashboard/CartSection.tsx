import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import productRice from "@/assets/rice.jpeg";
import productBeans from "@/assets/market-beans.jpeg";
import productPalmOil from "@/assets/bulk-onions.jpeg";
import productYam from "@/assets/yam.jpeg";
import productPepper from "@/assets/shallots.jpeg";
import productFish from "@/assets/honey-beans.jpeg";
import productLivestock from "@/assets/garri.jpeg";

type CartItem = {
  id: string;
  name: string;
  vendor: string;
  price: number;
  unit: string;
  qty: number;
  img: string;
};

const INITIAL_CART: CartItem[] = [
  { id: "c1", name: "Long Grain Parboiled Rice", vendor: "Mama T Store", price: 1450, unit: "kg", qty: 3, img: productRice },
  { id: "c2", name: "Zaki-Biam Palm Oil", vendor: "Benue Fresh", price: 2800, unit: "L", qty: 1, img: productPalmOil },
  { id: "c3", name: "Brown Beans (Oloyin)", vendor: "Mile 12 Bulk", price: 1200, unit: "kg", qty: 2, img: productBeans },
];

export function CartSection() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = 850;
  const total = subtotal - discount + deliveryFee;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "GARRI10") {
      setPromoApplied(true);
      toast.success("Promo code applied — 10% off!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="size-12 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="font-semibold text-foreground mb-1">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground">Add items from the marketplace to get started</p>
        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 bg-brand text-brand-foreground text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-display font-semibold">Shopping Cart</h2>
        <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-card ring-1 ring-border rounded-2xl p-4 flex gap-3">
              <img src={item.img} alt={item.name} className="size-20 rounded-xl object-cover ring-1 ring-border shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.vendor}</p>
                <p className="text-sm font-bold text-brand mt-1">₦{item.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/{item.unit}</span></p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-muted rounded-full p-0.5">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="size-7 rounded-full bg-card grid place-items-center hover:bg-brand hover:text-brand-foreground transition-colors ring-1 ring-border"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="size-7 rounded-full bg-brand text-brand-foreground grid place-items-center hover:opacity-90 transition-opacity"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="size-8 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive grid place-items-center transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold">₦{(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-3">
          {/* Promo code */}
          <div className="bg-card ring-1 ring-border rounded-2xl p-4">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Tag className="size-4 text-brand" /> Promo Code</p>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code (try GARRI10)"
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                disabled={promoApplied}
              />
              <button
                onClick={applyPromo}
                disabled={promoApplied || !promoCode}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
                  promoApplied
                    ? "bg-success/10 text-success"
                    : "bg-brand text-brand-foreground hover:opacity-90 disabled:opacity-40",
                )}
              >
                {promoApplied ? "Applied!" : "Apply"}
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-card ring-1 ring-border rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold">Order Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-success">
                  <span>Discount (10%)</span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-brand">₦{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => toast.success("Redirecting to checkout...")}
              className="w-full bg-brand text-brand-foreground font-semibold py-3 rounded-xl hover:opacity-95 active:scale-[0.98] transition text-sm mt-1"
            >
              Proceed to Checkout
            </button>
            <p className="text-[11px] text-center text-muted-foreground">Estimated delivery: 45-90 min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
