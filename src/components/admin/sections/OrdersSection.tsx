import { Fragment, useState } from "react";
import { ChevronRight, Phone, X, CheckCircle, AlertTriangle, Clock, History } from "lucide-react";
import { toast } from "sonner";
import { orders as initialOrders, formatNaira, statusColors, statusLabels, type OrderStatus } from "@/lib/admin-data";

const STATUS_FLOW: OrderStatus[] = [
  "received",
  "payment_confirmed",
  "preparing",
  "out_for_delivery",
  "awaiting_confirmation",
  "delivered",
  "cancelled",
];

const DELIVERY_FLOW: OrderStatus[] = [
  "received",
  "payment_confirmed",
  "preparing",
  "out_for_delivery",
  "awaiting_confirmation",
  "delivered",
];

const paymentBadge = (status: string) => {
  if (status === "paid") return "bg-green-50 text-green-700";
  if (status === "pending") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-600";
};

const PAGE_SIZE = 8;

export function OrdersSection({ search }: { search: string }) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [orderList, setOrderList] = useState(initialOrders);
  const [contactOrder, setContactOrder] = useState<(typeof initialOrders)[0] | null>(null);
  const [confirmModal, setConfirmModal] = useState<(typeof initialOrders)[0] | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filtered = orderList.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeOrders = filtered.filter(o => o.status !== "delivered" && o.status !== "cancelled");
  const historyOrders = filtered.filter(o => o.status === "delivered" || o.status === "cancelled");
  const awaitingConfirmation = orderList.filter(o => o.status === "awaiting_confirmation");

  const displayOrders = statusFilter !== "all"
    ? filtered
    : showHistory ? filtered : activeOrders;

  const totalPages = Math.max(1, Math.ceil(displayOrders.length / PAGE_SIZE));
  const paginated = displayOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = STATUS_FLOW.reduce(
    (acc, s) => ({ ...acc, [s]: orderList.filter((o) => o.status === s).length }),
    {} as Record<OrderStatus, number>
  );

  const updateStatus = (orderId: string) => {
    setOrderList((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || o.status === "cancelled" || o.status === "delivered") return o;
        const idx = DELIVERY_FLOW.indexOf(o.status as OrderStatus);
        const next = DELIVERY_FLOW[Math.min(idx + 1, DELIVERY_FLOW.length - 1)];
        toast.success(`Order ${orderId} → "${statusLabels[next]}"`);
        return { ...o, status: next };
      })
    );
  };

  const confirmDelivery = (orderId: string) => {
    setOrderList((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        toast.success(`Delivery confirmed for ${orderId}`);
        return { ...o, status: "delivered" as OrderStatus };
      })
    );
    setConfirmModal(null);
    setExpanded(null);
  };

  const cancelOrder = (orderId: string) => {
    setOrderList((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        toast.error(`Order ${orderId} cancelled`);
        return { ...o, status: "cancelled" as OrderStatus };
      })
    );
    setExpanded(null);
  };

  return (
    <div className="space-y-4">

      {/* Contact Modal */}
      {contactOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setContactOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-80 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Contact Customer</h3>
              <button onClick={() => setContactOrder(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{contactOrder.customer}</p>
              <p className="text-xs text-slate-500">Order: {contactOrder.id}</p>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`tel:${contactOrder.phone}`} className="flex items-center gap-2 justify-center w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                <Phone className="w-4 h-4" /> Call {contactOrder.phone}
              </a>
              <button onClick={() => { navigator.clipboard.writeText(contactOrder.phone); toast.success("Copied!"); }} className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                Copy number
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Confirm Delivery Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setConfirmModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[340px] space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Confirm Delivery</h3>
              <button onClick={() => setConfirmModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 space-y-1">
              <p className="text-sm font-semibold text-slate-800">{confirmModal.id}</p>
              <p className="text-xs text-slate-500">{confirmModal.customer} · {confirmModal.phone}</p>
              <p className="text-xs text-slate-500">{confirmModal.items}</p>
            </div>
            <p className="text-xs text-slate-500">
              Use this to manually confirm delivery after the customer confirms via phone call or in person.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmModal(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={() => confirmDelivery(confirmModal.id)} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Awaiting confirmation banner */}
      {awaitingConfirmation.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-purple-800">
              {awaitingConfirmation.length} order{awaitingConfirmation.length > 1 ? "s" : ""} awaiting customer confirmation
            </p>
            <p className="text-xs text-purple-600 mt-0.5">
              {awaitingConfirmation.map(o => o.id).join(", ")}
            </p>
          </div>
          <button
            onClick={() => { setStatusFilter("awaiting_confirmation"); setPage(1); }}
            className="text-xs font-medium text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition"
          >
            View all
          </button>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {(["all", ...STATUS_FLOW] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-2 py-2 rounded-lg text-[11px] font-medium transition-all text-center ${
              statusFilter === s ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {s === "all" ? "All" : statusLabels[s]}
            {s !== "all" && counts[s] > 0 && (
              <span className={`ml-1 text-[10px] ${statusFilter === s ? "text-white/70" : "text-slate-400"}`}>
                ({counts[s]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Order ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden md:table-cell">Items</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5">Total</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden sm:table-cell">Payment</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden lg:table-cell">Time</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${order.status === "awaiting_confirmation" ? "bg-purple-50/50" : ""}`}
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-slate-700 font-semibold">{order.id}</span>
                        {order.status === "awaiting_confirmation" && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-slate-800 font-medium whitespace-nowrap">{order.customer}</p>
                        <p className="text-slate-400 text-[11px]">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-slate-600 text-xs max-w-[200px] truncate">{order.items}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-800 whitespace-nowrap">
                      {formatNaira(order.total)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full capitalize ${paymentBadge(order.payment)}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400 text-xs whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expanded === order.id ? "rotate-90" : ""}`} />
                    </td>
                  </tr>

                  {expanded === order.id && (
                    <tr className="bg-slate-50">
                      <td colSpan={8} className="px-5 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
                          <div>
                            <p className="text-slate-400 font-medium mb-1">Delivery Address</p>
                            <p className="text-slate-700">{order.address}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-medium mb-1">Order Items</p>
                            <p className="text-slate-700">{order.items}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-medium mb-2">Status Timeline</p>
                            <div className="flex items-center gap-1 flex-wrap">
                              {DELIVERY_FLOW.map((s, i) => {
                                const currentIdx = DELIVERY_FLOW.indexOf(order.status as OrderStatus);
                                const done = order.status !== "cancelled" && currentIdx >= i;
                                return (
                                  <div key={s} className="flex items-center gap-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${done ? "bg-green-100 text-green-700" : s === "awaiting_confirmation" ? "bg-purple-100 text-purple-600" : "bg-slate-200 text-slate-500"}`}>
                                      {statusLabels[s]}
                                    </span>
                                    {i < DELIVERY_FLOW.length - 1 && <span className="text-slate-300">›</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Awaiting confirmation special section */}
                        {order.status === "awaiting_confirmation" && (
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3 flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <p className="text-xs text-purple-700 flex-1">
                              This order is awaiting customer confirmation. You can confirm manually if the customer called to confirm.
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {order.status !== "delivered" && order.status !== "cancelled" && order.status !== "awaiting_confirmation" && (
                            <button
                              onClick={() => updateStatus(order.id)}
                              className="px-3 py-1.5 bg-green-600 text-white text-[11px] font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Update → {(() => {
                                const idx = DELIVERY_FLOW.indexOf(order.status as OrderStatus);
                                return statusLabels[DELIVERY_FLOW[Math.min(idx + 1, DELIVERY_FLOW.length - 1)]];
                              })()}
                            </button>
                          )}

                          {order.status === "awaiting_confirmation" && (
                            <button
                              onClick={() => setConfirmModal(order)}
                              className="px-3 py-1.5 bg-green-600 text-white text-[11px] font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Confirm Delivery (Admin)
                            </button>
                          )}

                          <button
                            onClick={() => setContactOrder(order)}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" /> Contact Customer
                          </button>

                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-[11px] font-medium rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>

          {displayOrders.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No orders match your filters.</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span>Showing {Math.min(page * PAGE_SIZE, displayOrders.length)} of {displayOrders.length}</span>
            {statusFilter === "all" && (
              <button
                onClick={() => setShowHistory(v => !v)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition"
              >
                <History className="w-3.5 h-3.5" />
                {showHistory ? "Hide history" : "Show delivery history"}
              </button>
            )}
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40">←</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={`px-2 py-1 rounded ${page === i + 1 ? "bg-green-600 text-white" : "border border-slate-200 hover:bg-slate-50"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
