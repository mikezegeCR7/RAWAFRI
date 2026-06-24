import { useState, useCallback } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  vendor: string;
};

export type PromoCode = {
  code: string;
  discount: number; // percentage
  label: string;
};

export const VALID_PROMOS: PromoCode[] = [
  { code: "RAWAFRI10", discount: 10, label: "10% off your order" },
  { code: "FIRSTORDER", discount: 15, label: "15% first order discount" },
  { code: "MILE12", discount: 5, label: "5% Mile 12 special" },
];

export const INITIAL_CART: CartItem[] = [
  { id: "p1", name: "Long Grain Parboiled Rice", price: 1450, unit: "kg", quantity: 5, image: "", vendor: "Mama T Store" },
  { id: "p2", name: "Brown Beans (Oloyin)", price: 1200, unit: "kg", quantity: 3, image: "", vendor: "Mama T Store" },
  { id: "p3", name: "Red Onions (Bulk Bag)", price: 2800, unit: "bag", quantity: 1, image: "", vendor: "Mama T Store" },
];

export const DELIVERY_ZONES = [
  { zone: "Lekki / Ajah", fee: 800, eta: "45-60 mins" },
  { zone: "Victoria Island / Ikoyi", fee: 700, eta: "30-45 mins" },
  { zone: "Yaba / Surulere", fee: 900, eta: "60-90 mins" },
  { zone: "Ikeja / Maryland", fee: 1000, eta: "60-90 mins" },
  { zone: "Lagos Island", fee: 750, eta: "40-60 mins" },
  { zone: "Abuja (Central)", fee: 2500, eta: "Same day" },
  { zone: "Other areas", fee: 1500, eta: "1-2 days" },
];

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return { items, updateQty, removeItem, subtotal };
}
