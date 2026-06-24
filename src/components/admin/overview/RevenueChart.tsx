import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { revenueData, customerGrowthData, categoryData, formatNaira } from "@/lib/admin-data";

const PIE_COLORS = ["#16a34a", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6"];

export function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-900 font-semibold text-sm">Weekly Revenue</h3>
          <p className="text-slate-500 text-xs mt-0.5">Mon – Sun this week</p>
        </div>
        <div className="text-right">
          <p className="text-slate-900 font-bold text-lg">{formatNaira(2841500)}</p>
          <p className="text-green-600 text-xs font-medium">+11.2% vs last week</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => [formatNaira(value), "Revenue"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersBarChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="mb-5">
        <h3 className="text-slate-900 font-semibold text-sm">Daily Orders</h3>
        <p className="text-slate-500 text-xs mt-0.5">Orders per day this week</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => [value, "Orders"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Bar dataKey="orders" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CustomerGrowthChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="mb-5">
        <h3 className="text-slate-900 font-semibold text-sm">Customer Growth</h3>
        <p className="text-slate-500 text-xs mt-0.5">Total registered customers by month</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={customerGrowthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), "Customers"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Area type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} fill="url(#custGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="mb-4">
        <h3 className="text-slate-900 font-semibold text-sm">Sales by Category</h3>
        <p className="text-slate-500 text-xs mt-0.5">Revenue share by product type</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {categoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Share"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
