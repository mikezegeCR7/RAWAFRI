import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderCardSkeleton } from "./Skeleton";

import productRice from "@/assets/rice.jpeg";
import productBeans from "@/assets/market-beans.jpeg";
import productPalmOil from "@/assets/bulk-onions.jpeg";
import productYam from "@/assets/yam.jpeg";
import productPepper from "@/assets/shallots.jpeg";
import productFish from "@/assets/honey-beans.jpeg";
import productLivestock from "@/assets/garri.jpeg";
export type OrderStatus = "pending" | "processing" | "dispatched" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; cls: string; step: number }> = {
  pending: { label: "Pending", icon: Clock, cls: "bg-yellow-50 text-yellow-700 ring-yellow-200", step: 0 },
  processing: { label: "Processing", icon: Package, cls: "bg-blue-50 text-blue-700 ring-blue-200", step: 1 },
  dispatched: { label: "Dispatched", icon: Truck, cls: "bg-orange-50 text-orange-700 ring-orange-200", step: 2 },
  delivered: { label: "Delivered", icon: CheckCircle2, cls: "bg-green-50 text-green-700 ring-green-200", step: 3 },
  cancelled: { label: "Cancelled", icon: XCircle, cls: "bg-red-50 text-red-700 ring-red-200", step: -1 },
};

export type Order = {
  id: string;
  date: string;
  vendor: string;
  status: OrderStatus;
  total: number;
  address: string;
  rider?: { name: string; phone: string };
  eta?: string;
  items: { name: string; qty: number; price: number; img: string }[];
};

export const ORDER_MOCK_DATA: Order[] = [
  {
    id: "ORD-8821",
    date: "Today, 11:30 AM",
    vendor: "Oyingbo Central Market",
    status: "dispatched",
    total: 12450,
    address: "24 Admiralty Way, Lekki Phase 1",
    rider: { name: "Emmanuel O.", phone: "+234 812 345 6789" },
    eta: "≈ 18 min away",
    items: [
      { name: "Long Grain Rice", qty: 5, price: 1450, img: productRice },
      { name: "Palm Oil (5L)", qty: 1, price: 2800, img: productPalmOil },
      { name: "Brown Beans", qty: 3, price: 1200, img: productBeans },
    ],
  },
  {
    id: "ORD-8804",
    date: "Yesterday, 2:15 PM",
    vendor: "Mile 12 Direct Depot",
    status: "delivered",
    total: 8500,
    address: "24 Admiralty Way, Lekki Phase 1",
    items: [
      { name: "Old Yam (Large)", qty: 2, price: 4500, img: productYam },
    ],
  },
  {
    id: "ORD-8795",
    date: "Jun 4, 9:00 AM",
    vendor: "Mama T Store",
    status: "delivered",
    total: 6400,
    address: "24 Admiralty Way, Lekki Phase 1",
    items: [
      { name: "Rodo Pepper Basket", qty: 1, price: 3200, img: productPepper },
      { name: "Fresh Tilapia (Iced)", qty: 1, price: 3200, img: productFish },
    ],
  },
  {
    id: "ORD-8771",
    date: "Jun 1, 7:45 AM",
    vendor: "Epe Lagoon Depot",
    status: "processing",
    total: 5200,
    address: "24 Admiralty Way, Lekki Phase 1",
    items: [
      { name: "Fresh Tilapia (Iced)", qty: 1, price: 5200, img: productFish },
    ],
  },
  {
    id: "ORD-8760",
    date: "May 29, 3:00 PM",
    vendor: "Oyingbo Central Market",
    status: "cancelled",
    total: 3400,
    address: "24 Admiralty Way, Lekki Phase 1",
    items: [
      { name: "Brown Beans", qty: 2, price: 1200, img: productBeans },
      { name: "Honey Beans", qty: 1, price: 950, img: productBeans },
    ],
  },
  {
    id: "ORD-8755",
    date: "May 27, 11:00 AM",
    vendor: "Mile 12 Direct Depot",
    status: "pending",
    total: 9750,
    address: "24 Admiralty Way, Lekki Phase 1",
    items: [
      { name: "Long Grain Rice", qty: 5, price: 1450, img: productRice },
      { name: "Palm Oil (5L)", qty: 1, price: 2800, img: productPalmOil },
    ],
  },
];

const FILTER_TABS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "dispatched", label: "Dispatched" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, icon: Icon, cls } = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1", cls)}>
      <Icon className="size-3" />
      {label}
    </span>
  );
}

const TRACKER_STEPS = [
  { key: "pending", label: "Ordered", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "dispatched", label: "On the way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function OrderTracker({ order }: { order: Order }) {
  const step = STATUS_CONFIG[order.status].step;
  if (order.status === "cancelled") return null;

  return (
    <div className="py-4">
      {order.status === "dispatched" && order.rider && (
        <div className="mb-4 bg-orange-50 ring-1 ring-orange-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-orange-100 rounded-full grid place-items-center">
              <Truck className="size-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-orange-800">{order.rider.name} is on the way</p>
              <p className="text-[11px] text-orange-700">{order.eta}</p>
            </div>
          </div>
          <a
            href={`tel:${order.rider.phone}`}
            className="size-8 bg-orange-100 rounded-full grid place-items-center hover:bg-orange-200 transition-colors"
          >
            <Phone className="size-3.5 text-orange-600" />
          </a>
        </div>
      )}

      <div className="flex items-center gap-0">
        {TRACKER_STEPS.map(({ key, label, icon: Icon }, i) => {
          const done = step > i;
          const active = step === i;
          return (
            <div key={key} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  "size-8 rounded-full grid place-items-center ring-2 transition-all",
                  done ? "bg-brand ring-brand text-brand-foreground" :
                  active ? "bg-brand/10 ring-brand text-brand animate-pulse" :
                  "bg-muted ring-border text-muted-foreground",
                )}>
                  <Icon className="size-3.5" />
                </div>
                <span className={cn("text-[10px] font-medium text-center leading-none whitespace-nowrap", done || active ? "text-brand" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
              {i < TRACKER_STEPS.length - 1 && (
                <div className={cn("flex-1 h-0.5 mb-4 mx-1 rounded-full transition-all", done ? "bg-brand" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(order.status === "dispatched");

  return (
    <div className={cn(
      "bg-card ring-1 rounded-2xl overflow-hidden transition-all",
      order.status === "dispatched" ? "ring-orange-300 shadow-sm shadow-orange-100" : "ring-border",
    )}>
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">#{order.id}</p>
              {order.status === "dispatched" && (
                <span className="text-[10px] bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{order.date} · {order.vendor}</p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.name} className="size-10 rounded-lg overflow-hidden ring-1 ring-border">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
              +{order.items.length - 3}
            </div>
          )}
          <div className="ml-auto">
            <p className="text-sm font-bold">₦{order.total.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground text-right">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-4">
          <OrderTracker order={order} />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="size-10 rounded-lg object-cover ring-1 ring-border" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold">₦{(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span>{order.address}</span>
          </div>

          {order.status === "delivered" && (
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-brand/10 text-brand hover:bg-brand hover:text-brand-foreground transition-colors flex items-center justify-center gap-1.5">
                <Star className="size-3.5" /> Rate order
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Reorder
              </button>
            </div>
          )}
          {order.status === "cancelled" && (
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-brand/10 text-brand hover:bg-brand hover:text-brand-foreground transition-colors">
              Reorder items
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function OrdersSection() {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = filter === "all" ? ORDER_MOCK_DATA : ORDER_MOCK_DATA.filter((o) => o.status === filter);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-display font-semibold">Order History</h2>
        <p className="text-sm text-muted-foreground">{ORDER_MOCK_DATA.length} orders total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              filter === key
                ? "bg-brand text-brand-foreground"
                : "bg-card ring-1 ring-border text-muted-foreground hover:ring-brand/40",
            )}
          >
            {label}
            {key !== "all" && (
              <span className="ml-1.5 opacity-70">
                ({ORDER_MOCK_DATA.filter((o) => o.status === key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)
          : filtered.length === 0
          ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No orders found</p>
            </div>
          )
          : filtered.map((order) => <OrderCard key={order.id} order={order} />)
        }
      </div>
    </div>
  );
}
