import { CreditCard, Smartphone, CheckCircle2, XCircle, Clock, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PaymentMethod = { id: string; type: "card" | "transfer"; label: string; sub: string; isDefault: boolean };
type PaymentTx = { id: string; date: string; desc: string; amount: number; status: "success" | "failed" | "pending" };

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm1", type: "card", label: "Zenith Bank Mastercard", sub: "•••• •••• •••• 4521", isDefault: true },
  { id: "pm2", type: "transfer", label: "GTBank Transfer", sub: "0212345678 · GTB", isDefault: false },
];

const TRANSACTIONS: PaymentTx[] = [
  { id: "t1", date: "Today", desc: "Order #ORD-8821 · Oyingbo Market", amount: 12450, status: "success" },
  { id: "t2", date: "Yesterday", desc: "Order #ORD-8804 · Mile 12 Depot", amount: 8500, status: "success" },
  { id: "t3", date: "Jun 4", desc: "Order #ORD-8795 · Mama T Store", amount: 6400, status: "success" },
  { id: "t4", date: "Jun 1", desc: "Order #ORD-8771 · Epe Lagoon Depot", amount: 5200, status: "pending" },
  { id: "t5", date: "May 29", desc: "Order #ORD-8760 · Oyingbo Market", amount: 3400, status: "failed" },
  { id: "t6", date: "May 27", desc: "Order #ORD-8755 · Mile 12 Depot", amount: 9750, status: "success" },
  { id: "t7", date: "May 23", desc: "Order #ORD-8740 · Mama T Store", amount: 4600, status: "success" },
];

const TX_STATUS: Record<PaymentTx["status"], { icon: React.ElementType; cls: string; label: string }> = {
  success: { icon: CheckCircle2, cls: "text-success", label: "Success" },
  failed: { icon: XCircle, cls: "text-destructive", label: "Failed" },
  pending: { icon: Clock, cls: "text-warning", label: "Pending" },
};

const totalSpent = TRANSACTIONS.filter((t) => t.status === "success").reduce((s, t) => s + t.amount, 0);

export function PaymentsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-display font-semibold">Payment & History</h2>
        <p className="text-sm text-muted-foreground">Manage cards and view transactions</p>
      </div>

      {/* Spend summary */}
      <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 text-white">
        <p className="text-xs font-medium text-violet-200 mb-1">Total spent this year</p>
        <p className="text-3xl font-bold font-display">₦{totalSpent.toLocaleString()}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[11px] text-violet-200">Successful</p>
            <p className="text-base font-semibold">{TRANSACTIONS.filter((t) => t.status === "success").length} orders</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[11px] text-violet-200">This month</p>
            <p className="text-base font-semibold">₦20,950</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Payment Methods</p>
          <button
            onClick={() => toast.message("Add payment method coming soon")}
            className="text-xs text-brand font-semibold flex items-center gap-1 hover:opacity-80 transition"
          >
            <Plus className="size-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((pm) => (
            <div key={pm.id} className={cn(
              "bg-card ring-1 rounded-2xl p-4 flex items-center gap-3",
              pm.isDefault ? "ring-brand/40" : "ring-border",
            )}>
              <div className={cn(
                "size-10 rounded-xl grid place-items-center shrink-0",
                pm.type === "card" ? "bg-violet-100 text-violet-600" : "bg-green-100 text-green-600",
              )}>
                {pm.type === "card" ? <CreditCard className="size-5" /> : <Smartphone className="size-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{pm.label}</p>
                <p className="text-xs text-muted-foreground">{pm.sub}</p>
              </div>
              {pm.isDefault && (
                <span className="text-[10px] bg-brand/10 text-brand font-semibold px-2.5 py-1 rounded-full">Default</span>
              )}
              <button className="size-8 rounded-full hover:bg-accent grid place-items-center transition-colors">
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <p className="text-sm font-semibold mb-3">Transaction History</p>
        <div className="bg-card ring-1 ring-border rounded-2xl overflow-hidden divide-y divide-border">
          {TRANSACTIONS.map((tx) => {
            const { icon: Icon, cls, label } = TX_STATUS[tx.status];
            return (
              <div key={tx.id} className="p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors">
                <div className={cn("size-9 rounded-full grid place-items-center shrink-0 bg-muted", cls)}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.desc}</p>
                  <p className="text-xs text-muted-foreground">{tx.date} · {label}</p>
                </div>
                <p className={cn(
                  "text-sm font-bold shrink-0",
                  tx.status === "failed" ? "text-muted-foreground line-through" : "text-foreground",
                )}>
                  {tx.status === "success" ? "-" : ""}₦{tx.amount.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
