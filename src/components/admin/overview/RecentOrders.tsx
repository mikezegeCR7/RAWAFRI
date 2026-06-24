import { Eye } from "lucide-react";
import { orders, formatNaira, statusColors, statusLabels } from "@/lib/admin-data";
import type { AdminSection } from "../layout/AdminSidebar";

export function RecentOrders({ onNavigate }: { onNavigate: (s: AdminSection) => void }) {
  const recent = orders.slice(0, 6);
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-slate-900 font-semibold text-sm">Recent Orders</h3>
          <p className="text-slate-400 text-xs mt-0.5">Latest activity across the platform</p>
        </div>
        <button
          onClick={() => onNavigate("orders")}
          className="text-green-600 text-xs font-medium hover:text-green-700 transition-colors"
        >
          View all →
        </button>
      </div>
      <div className="divide-y divide-slate-50">
        {recent.map((order) => (
          <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-900 text-sm font-medium">{order.id}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5 truncate">{order.customer} · {order.items}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-slate-900 text-sm font-semibold">{formatNaira(order.total)}</p>
              <p className="text-slate-400 text-[11px]">{order.date.split(" ")[1]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
