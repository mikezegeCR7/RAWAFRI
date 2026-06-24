import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Clock, XCircle, RotateCcw, MoreHorizontal, Eye, RefreshCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { payments as initialPayments, formatNaira, type Payment } from "@/lib/admin-data";

const statusConfig: Record<Payment["status"], { label: string; badge: string; icon: React.ReactNode }> = {
  success: { label: "Success", badge: "bg-green-50 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  pending: { label: "Pending", badge: "bg-amber-50 text-amber-700", icon: <Clock className="w-3 h-3" /> },
  failed: { label: "Failed", badge: "bg-red-50 text-red-600", icon: <XCircle className="w-3 h-3" /> },
  refunded: { label: "Refunded", badge: "bg-slate-100 text-slate-500", icon: <RotateCcw className="w-3 h-3" /> },
};

const methodColors: Record<string, string> = {
  "Bank Transfer": "bg-teal-50 text-teal-600",
};

function PaymentMenu({
  payment,
  onView,
  onRefund,
}: {
  payment: Payment;
  onView: () => void;
  onRefund: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 active:scale-90 transition"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1 text-sm">
          <button
            onClick={() => { setOpen(false); onView(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-left"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" /> View details
          </button>
          {payment.status === "success" && (
            <>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => { setOpen(false); onRefund(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-amber-50 text-amber-700 text-left"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Initiate refund
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function exportCSV(payments: Payment[]) {
  const headers = ["Reference", "Customer", "Order ID", "Amount (₦)", "Method", "Status", "Date"];
  const rows = payments.map((p) => [
    p.reference,
    p.customer,
    p.orderId,
    p.amount.toString(),
    p.method,
    p.status,
    p.date,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rawafri-payments-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Payments exported as CSV");
}

export function PaymentsSection({ search }: { search: string }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentList, setPaymentList] = useState(initialPayments);

  const filtered = paymentList.filter((p) => {
    const matchSearch =
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSuccess = paymentList.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const totalPending = paymentList.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalFailed = paymentList.filter((p) => p.status === "failed").reduce((s, p) => s + p.amount, 0);

  const viewDetails = (payment: Payment) => {
    toast.info(
      `${payment.reference}`,
      {
        description: `${payment.customer} · ${payment.orderId} · ${formatNaira(payment.amount)} via ${payment.method} · ${payment.status}`,
        duration: 5000,
      },
    );
  };

  const initiateRefund = (id: string) => {
    setPaymentList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        toast.success(`Refund of ${formatNaira(p.amount)} initiated for ${p.customer}`);
        return { ...p, status: "refunded" as Payment["status"] };
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Collected", value: formatNaira(totalSuccess), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending", value: formatNaira(totalPending), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Failed Payments", value: formatNaira(totalFailed), icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Transactions", value: paymentList.length.toString(), icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-base font-bold ${item.color} truncate`}>{item.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {["all", "success", "pending", "failed", "refunded"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              statusFilter === s ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Reference</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden sm:table-cell">Order</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden md:table-cell">Method</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((payment) => {
                const cfg = statusConfig[payment.status];
                return (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-slate-600">{payment.reference}</p>
                      <p className="text-slate-400 text-[11px]">{payment.id}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium whitespace-nowrap">{payment.customer}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="font-mono text-xs text-slate-600">{payment.orderId}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatNaira(payment.amount)}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${methodColors[payment.method] ?? "bg-slate-100 text-slate-600"}`}>
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${cfg.badge}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400 text-xs whitespace-nowrap">{payment.date}</td>
                    <td className="px-4 py-3.5">
                      <PaymentMenu
                        payment={payment}
                        onView={() => viewDetails(payment)}
                        onRefund={() => initiateRefund(payment.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {paymentList.length} transactions</span>
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
