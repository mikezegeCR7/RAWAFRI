import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, Truck } from "lucide-react";
import { formatNaira } from "@/lib/admin-data";

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

const stats: StatCard[] = [
  {
    label: "Today's Revenue",
    value: formatNaira(284500),
    change: 12.4,
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Active Orders",
    value: "47",
    change: 8.1,
    icon: ShoppingCart,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Total Customers",
    value: "2,680",
    change: 5.3,
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Products Listed",
    value: "18",
    change: -2.1,
    icon: Package,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Pending Deliveries",
    value: "12",
    change: 14.7,
    icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "Completed Today",
    value: "35",
    change: 9.2,
    icon: TrendingUp,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const positive = stat.change >= 0;
        return (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? "text-green-600" : "text-red-500"}`}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1 leading-tight">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
