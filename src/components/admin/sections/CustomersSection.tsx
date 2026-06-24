import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, UserCheck, UserX, AlertOctagon, Eye, Flag, Ban } from "lucide-react";
import { toast } from "sonner";
import { customers as initialCustomers, formatNaira, type Customer } from "@/lib/admin-data";

const statusBadge = (status: Customer["status"]) => {
  if (status === "active") return "bg-green-50 text-green-700";
  if (status === "inactive") return "bg-slate-100 text-slate-500";
  return "bg-red-50 text-red-600";
};
const statusIcon = (status: Customer["status"]) => {
  if (status === "active") return <UserCheck className="w-3 h-3" />;
  if (status === "inactive") return <UserX className="w-3 h-3" />;
  return <AlertOctagon className="w-3 h-3" />;
};

function CustomerMenu({
  customer,
  onView,
  onFlag,
  onSuspend,
}: {
  customer: Customer;
  onView: () => void;
  onFlag: () => void;
  onSuspend: () => void;
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
            <Eye className="w-3.5 h-3.5 text-slate-400" /> View profile
          </button>
          {customer.status !== "flagged" && (
            <button
              onClick={() => { setOpen(false); onFlag(); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-amber-50 text-amber-700 text-left"
            >
              <Flag className="w-3.5 h-3.5" /> Flag account
            </button>
          )}
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => { setOpen(false); onSuspend(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 text-left"
          >
            <Ban className="w-3.5 h-3.5" />
            {customer.status === "inactive" ? "Reactivate" : "Suspend"}
          </button>
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 10;

export function CustomersSection({ search }: { search: string }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<"spent" | "orders" | "joined">("spent");
  const [page, setPage] = useState(1);
  const [customerList, setCustomerList] = useState(initialCustomers);

  const filtered = customerList
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sort === "spent") return b.spent - a.spent;
      if (sort === "orders") return b.orders - a.orders;
      return new Date(b.joined).getTime() - new Date(a.joined).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const summary = {
    total: customerList.length,
    active: customerList.filter((c) => c.status === "active").length,
    flagged: customerList.filter((c) => c.status === "flagged").length,
    totalRevenue: customerList.reduce((s, c) => s + c.spent, 0),
  };

  const flagCustomer = (id: string) => {
    setCustomerList((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        toast.warning(`${c.name}'s account has been flagged for review`);
        return { ...c, status: "flagged" as Customer["status"] };
      }),
    );
  };

  const suspendOrReactivate = (id: string) => {
    setCustomerList((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next: Customer["status"] = c.status === "inactive" ? "active" : "inactive";
        toast.success(`${c.name}'s account ${next === "inactive" ? "suspended" : "reactivated"}`);
        return { ...c, status: next };
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Customers", value: summary.total.toLocaleString(), color: "text-slate-800" },
          { label: "Active", value: summary.active.toString(), color: "text-green-600" },
          { label: "Flagged", value: summary.flagged.toString(), color: "text-red-600" },
          { label: "Customer Revenue", value: formatNaira(summary.totalRevenue), color: "text-blue-600" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-slate-500 text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {["all", "active", "inactive", "flagged"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Sort by:</span>
          {[
            { key: "spent", label: "Total Spent" },
            { key: "orders", label: "Orders" },
            { key: "joined", label: "Newest" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key as typeof sort)}
              className={`px-2 py-1 rounded ${sort === opt.key ? "bg-slate-100 text-slate-800 font-medium" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden sm:table-cell">Contact</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden md:table-cell">Location</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5">Orders</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5">Total Spent</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[11px] font-bold">
                          {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-800 font-medium whitespace-nowrap">{customer.name}</p>
                        <p className="text-slate-400 text-[11px]">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <p className="text-slate-600 text-xs">{customer.phone}</p>
                    <p className="text-slate-400 text-[11px]">{customer.email}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-slate-600">{customer.location}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-700">{customer.orders}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-800 whitespace-nowrap">
                    {formatNaira(customer.spent)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full capitalize ${statusBadge(customer.status)}`}>
                      {statusIcon(customer.status)}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-slate-400 text-xs">{customer.joined}</td>
                  <td className="px-4 py-3.5">
                    <CustomerMenu
                      customer={customer}
                      onView={() => toast.info(`Viewing ${customer.name} — ${customer.orders} orders · ${formatNaira(customer.spent)} spent`)}
                      onFlag={() => flagCustomer(customer.id)}
                      onSuspend={() => suspendOrReactivate(customer.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} customers</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >←</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-2 py-1 rounded ${page === i + 1 ? "bg-green-600 text-white" : "border border-slate-200 hover:bg-slate-50"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
