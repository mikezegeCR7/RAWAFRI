import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, LayoutList, Package, ChevronDown, ChevronUp, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_ORDERS, type Order } from "@/lib/order-data";
import { DeliveryStatusCard } from "@/components/orders/DeliveryStatusCard";
import { DeliveryConfirmationCard } from "@/components/orders/DeliveryConfirmationCard";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { DeliveryInfo } from "@/components/orders/DeliveryInfo";
import { NotificationFeed } from "@/components/orders/NotificationFeed";
import { OrderHistoryList } from "@/components/orders/OrderHistoryList";
import { OrderLoadingState, OrderErrorState, OrderEmptyState } from "@/components/orders/OrderStates";
import { OrderTimelineVertical } from "@/components/orders/OrderTimeline";

type PageState = "loading" | "error" | "empty" | "ready";

export default function Orders() {
  const [, navigate] = useLocation();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailView, setDetailView] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (MOCK_ORDERS.length === 0) {
        setPageState("empty");
      } else {
        setOrders(MOCK_ORDERS);
        setSelectedOrder(MOCK_ORDERS[0]);
        setPageState("ready");
      }
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const totalUnread = orders.flatMap((o) => o.notifications).filter((n) => !n.read).length;
  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const pastOrders = orders.filter((o) => o.status === "delivered" || o.status === "cancelled");
  const awaitingConfirmation = orders.filter((o) => o.status === "awaiting_confirmation");

  const handleSelect = (order: Order) => {
    setSelectedOrder(order);
    setDetailView(true);
    setShowTimeline(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmed = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "delivered",
              confirmedAt: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
              notifications: [
                ...o.notifications,
                {
                  id: `n_conf_${orderId}`,
                  time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
                  message: "Delivery confirmed by customer. Thank you!",
                  type: "success" as const,
                  read: false,
                },
              ],
            }
          : o
      )
    );
    setSelectedOrder((prev) =>
      prev?.id === orderId ? { ...prev, status: "delivered" } : prev
    );
  };

  const handleIssueReported = (orderId: string, description: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              deliveryIssues: [
                ...(o.deliveryIssues ?? []),
                {
                  id: `issue_${Date.now()}`,
                  reportedAt: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
                  description,
                  resolved: false,
                },
              ],
              notifications: [
                ...o.notifications,
                {
                  id: `n_issue_${orderId}`,
                  time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
                  message: `Issue reported: ${description}`,
                  type: "warning" as const,
                  read: false,
                },
              ],
            }
          : o
      )
    );
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => {
              if (detailView) setDetailView(false);
              else navigate("/");
            }}
            className="size-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5 text-foreground" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground text-sm leading-tight">
              {detailView && selectedOrder ? selectedOrder.reference : "My Orders"}
            </h1>
          </div>

          {!detailView && totalUnread > 0 && (
            <div className="relative">
              <Bell className="size-5 text-foreground" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand text-brand-foreground text-[9px] font-bold flex items-center justify-center">
                {totalUnread}
              </span>
            </div>
          )}

          {detailView && (
            <button
              onClick={() => setDetailView(false)}
              className="flex items-center gap-1.5 text-xs font-medium text-brand hover:opacity-80 transition"
            >
              <LayoutList className="size-4" />
              All orders
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {pageState === "loading" && <OrderLoadingState />}
        {pageState === "error" && <OrderErrorState onRetry={() => setPageState("loading")} />}
        {pageState === "empty" && <OrderEmptyState />}

        {pageState === "ready" && !detailView && (
          <>
            {/* Awaiting confirmation banner */}
            {awaitingConfirmation.length > 0 && (
              <div className="bg-purple-50 rounded-2xl ring-1 ring-purple-200 p-4 flex items-center gap-3">
                <div className="size-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4.5 h-4.5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-800">
                    {awaitingConfirmation.length} delivery awaiting your confirmation
                  </p>
                  <p className="text-xs text-purple-600 mt-0.5">Tap the order below to confirm receipt</p>
                </div>
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                  {awaitingConfirmation.length}
                </span>
              </div>
            )}

            {activeOrders.length > 0 && (
              <section>
                <SectionHeader icon={Package} label="Active orders" count={activeOrders.length} />
                <div className="mt-3">
                  <OrderHistoryList orders={activeOrders} activeOrderId={selectedOrder?.id} onSelect={handleSelect} />
                </div>
              </section>
            )}

            {pastOrders.length > 0 && (
              <section>
                <button
                  onClick={() => setShowHistory((v) => !v)}
                  className="flex items-center gap-2 w-full"
                >
                  <History className="size-4 text-brand" />
                  <h2 className="text-sm font-semibold text-foreground flex-1 text-left">Delivery history</h2>
                  <span className="text-xs bg-brand/10 text-brand font-semibold rounded-full px-2 py-0.5">{pastOrders.length}</span>
                  {showHistory ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </button>
                {showHistory && (
                  <div className="mt-3">
                    <OrderHistoryList orders={pastOrders} activeOrderId={selectedOrder?.id} onSelect={handleSelect} />
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {pageState === "ready" && detailView && selectedOrder && (
          <div className="space-y-4">
            {/* Confirmation card — shown when awaiting confirmation */}
            {selectedOrder.status === "awaiting_confirmation" && (
              <DeliveryConfirmationCard
                order={selectedOrder}
                onConfirmed={handleConfirmed}
                onIssueReported={handleIssueReported}
              />
            )}

            <DeliveryStatusCard order={selectedOrder} />

            <button
              onClick={() => setShowTimeline((v) => !v)}
              className="w-full bg-card rounded-2xl ring-1 ring-border px-5 py-3.5 flex items-center gap-3 hover:bg-accent/40 transition-colors"
            >
              <Package className="size-4 text-brand" />
              <span className="text-sm font-semibold text-foreground flex-1 text-left">Delivery progress</span>
              {showTimeline ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
            </button>

            {showTimeline && (
              <div className="bg-card rounded-2xl ring-1 ring-border px-6 py-5">
                <OrderTimelineVertical status={selectedOrder.status} />
              </div>
            )}

            <DeliveryInfo order={selectedOrder} />
            <OrderSummary order={selectedOrder} />
            <NotificationFeed notifications={selectedOrder.notifications} />

            <button
              onClick={() => setDetailView(false)}
              className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to all orders
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function SectionHeader({ icon: Icon, label, count }: { icon: React.ComponentType<{ className?: string }>; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-brand" />
      <h2 className="text-sm font-semibold text-foreground capitalize">{label}</h2>
      <span className="text-xs bg-brand/10 text-brand font-semibold rounded-full px-2 py-0.5">{count}</span>
    </div>
  );
}
