import { useState, useEffect } from "react";
const productRice = "https://placehold.co/400x400/e8eee0/2d7a3a?text=Rice";
const productBeans = "https://placehold.co/400x400/e8eee0/2d7a3a?text=Beans";
const productPalmOil = "https://placehold.co/400x400/e8eee0/2d7a3a?text=Palm+Oil";
const productYam = "https://placehold.co/400x400/e8eee0/2d7a3a?text=Yam";
const productPepper = "https://placehold.co/400x400/e8eee0/2d7a3a?text=Pepper";
const productFish = "https://placehold.co/400x400/e8eee0/2d7a3a?text=Fish";
const productLivestock = "https://placehold.co/400x400/e8eee0/2d7a3a?text=Livestock";
import {
  ShoppingBag,
  Bell,
  Wallet,
  TrendingUp,
  Clock,
  ChevronRight,
  Package,
  Star,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCardSkeleton, OrderCardSkeleton } from "./Skeleton";
import { OrderStatusBadge, ORDER_MOCK_DATA } from "./OrdersSection";
import type { NavKey } from "./DashboardSidebar";


interface Props {
  onNavigate: (key: NavKey) => void;
}

const STATS = [
  { label: "Total Orders", value: "24", sub: "+3 this month", icon: ShoppingBag, color: "text-brand bg-brand/10" },
  { label: "Recently Viewed", value: "12", sub: "Last 7 days", icon: Clock, color: "text-rose-500 bg-rose-50" },
  { label: "Total Spent", value: "₦142,500", sub: "Since Jan 2025", icon: Wallet, color: "text-violet-600 bg-violet-50" },
  { label: "Avg. Rating Given", value: "4.8★", sub: "Across 18 reviews", icon: TrendingUp, color: "text-warning bg-warning/10" },
];

export function OverviewSection({ onNavigate }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const recentOrders = ORDER_MOCK_DATA.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-6 text-brand-foreground">
        <p className="text-sm font-medium text-brand-foreground/80 mb-1">Good afternoon 👋</p>
        <h2 className="text-2xl font-display font-semibold">Welcome back, Adaeze</h2>
        <p className="text-sm text-brand-foreground/70 mt-1.5">You have 1 active delivery and 2 items in your cart</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onNavigate("orders")}
            className="bg-brand-foreground/15 hover:bg-brand-foreground/25 text-brand-foreground text-xs font-semibold px-4 py-2 rounded-full transition-colors"
          >
            Track Order
          </button>
          <button
            onClick={() => onNavigate("cart")}
            className="bg-brand-foreground/15 hover:bg-brand-foreground/25 text-brand-foreground text-xs font-semibold px-4 py-2 rounded-full transition-colors"
          >
            View Cart
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STATS.map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-card ring-1 ring-border rounded-2xl p-4">
                <div className={cn("size-9 rounded-xl grid place-items-center mb-3", color)}>
                  <Icon className="size-4" />
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
              </div>
            ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Recent Orders</h3>
          <button
            onClick={() => onNavigate("orders")}
            className="text-xs text-brand font-semibold flex items-center gap-1 hover:opacity-80 transition"
          >
            View all <ChevronRight className="size-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => <OrderCardSkeleton key={i} />)
            : recentOrders.map((order) => (
                <MiniOrderCard key={order.id} order={order} onNavigate={onNavigate} />
              ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Quick Access</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Addresses", icon: MapPin, key: "addresses" as NavKey },
            { label: "Payments", icon: Wallet, key: "payments" as NavKey },
            { label: "Notifications", icon: Bell, key: "notifications" as NavKey },
          ].map(({ label, icon: Icon, key }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="bg-card ring-1 ring-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:ring-brand/40 hover:bg-accent transition-all"
            >
              <Icon className="size-5 text-brand" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recently Viewed Mini */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Recently Viewed</h3>
          <button
            onClick={() => onNavigate("recent")}
            className="text-xs text-brand font-semibold flex items-center gap-1 hover:opacity-80 transition"
          >
            See all <ChevronRight className="size-3.5" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {[
            { name: "Long Grain Rice", price: "₦1,450/kg", img: productRice, rating: 4.7 },
            { name: "Zaki-Biam Palm Oil", price: "₦2,800/L", img: productPalmOil, rating: 4.9 },
            { name: "Brown Beans (Oloyin)", price: "₦1,200/kg", img: productBeans, rating: 4.6 },
          ].map(({ name, price, img, rating }) => (
            <div key={name} className="shrink-0 w-36 bg-card ring-1 ring-border rounded-2xl overflow-hidden">
              <img src={img} alt={name} className="w-full aspect-square object-cover" />
              <div className="p-2.5">
                <p className="text-xs font-semibold leading-tight line-clamp-1">{name}</p>
                <p className="text-[11px] text-brand font-bold mt-1">{price}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="size-3 fill-warning text-warning" />
                  <span className="text-[10px] text-muted-foreground">{rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniOrderCard({ order, onNavigate }: {
  order: typeof ORDER_MOCK_DATA[0];
  onNavigate: (key: NavKey) => void;
}) {
  return (
    <div className="bg-card ring-1 ring-border rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-semibold text-foreground">#{order.id}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.name} className="size-10 rounded-lg overflow-hidden ring-1 ring-border">
            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-[10px] font-semibold text-muted-foreground">+{order.items.length - 3}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">₦{order.total.toLocaleString()}</p>
        <button
          onClick={() => onNavigate("orders")}
          className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-full hover:bg-brand hover:text-brand-foreground transition-colors"
        >
          {order.status === "dispatched" ? "Track order" : "View details"}
        </button>
      </div>
    </div>
  );
}
