import { useState } from "react";
import { Download, TrendingUp, TrendingDown, FilePlus } from "lucide-react";
import { toast } from "sonner";
import {
  RevenueChart,
  OrdersBarChart,
  CustomerGrowthChart,
  CategoryPieChart,
} from "../overview/RevenueChart";
import { formatNaira, revenueData } from "@/lib/admin-data";

const weeklyTotal = revenueData.reduce((s, d) => s + d.revenue, 0);
const weeklyOrders = revenueData.reduce((s, d) => s + d.orders, 0);
const avgOrder = Math.round(weeklyTotal / weeklyOrders);

const metrics = [
  { label: "Weekly Revenue", value: formatNaira(weeklyTotal), change: 11.2, up: true },
  { label: "Weekly Orders", value: weeklyOrders.toString(), change: 8.7, up: true },
  { label: "Avg Order Value", value: formatNaira(avgOrder), change: 2.4, up: true },
  { label: "Failed Payments", value: "1", change: 50, up: false },
  { label: "New Customers", value: "270", change: 12.5, up: true },
  { label: "Customer Retention", value: "82%", change: 3.1, up: true },
];

const initialReports = [
  { id: "r1", label: "Daily Revenue Report — June 7, 2026", size: "18 KB", type: "PDF" },
  { id: "r2", label: "Weekly Sales Summary — W23 2026", size: "42 KB", type: "Excel" },
  { id: "r3", label: "Inventory Status Report", size: "24 KB", type: "PDF" },
  { id: "r4", label: "Customer Growth Report — June 2026", size: "31 KB", type: "PDF" },
  { id: "r5", label: "Payment Reconciliation — June 6, 2026", size: "19 KB", type: "CSV" },
];

const typeColors: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  Excel: "bg-green-50 text-green-700",
  CSV: "bg-blue-50 text-blue-600",
};

const REPORT_TYPES = ["Daily Revenue Report", "Weekly Sales Summary", "Inventory Status Report", "Customer Growth Report", "Payment Reconciliation"];
const FILE_TYPES = ["PDF", "Excel", "CSV"];

function downloadReport(label: string, type: string) {
  const content =
    type === "CSV"
      ? `Report,Date,Generated\n"${label}","${new Date().toLocaleDateString()}","RawAfri Admin"`
      : `${label}\n\nGenerated: ${new Date().toLocaleString()}\nPlatform: RawAfri Marketplace\n\nThis is a placeholder report document.`;
  const mimeTypes: Record<string, string> = {
    CSV: "text/csv",
    PDF: "application/octet-stream",
    Excel: "application/octet-stream",
  };
  const ext: Record<string, string> = { CSV: "csv", PDF: "pdf", Excel: "xlsx" };
  const blob = new Blob([content], { type: mimeTypes[type] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.${ext[type]}`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`"${label}" downloaded`);
}

export function ReportsSection() {
  const [reports, setReports] = useState(initialReports);
  const [generating, setGenerating] = useState(false);

  const generateReport = () => {
    setGenerating(true);
    const type = FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)];
    const name = REPORT_TYPES[Math.floor(Math.random() * REPORT_TYPES.length)];
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const label = `${name} — ${date}`;
    const size = `${Math.floor(Math.random() * 50 + 10)} KB`;

    setTimeout(() => {
      setReports((prev) => [{ id: `r${Date.now()}`, label, size, type }, ...prev]);
      toast.success(`Report generated: "${label}"`);
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xl font-bold text-slate-900">{m.value}</p>
            <p className="text-slate-500 text-xs mt-1 leading-tight">{m.label}</p>
            <div className={`flex items-center gap-0.5 mt-2 text-xs font-medium ${m.up ? "text-green-600" : "text-red-500"}`}>
              {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(m.change)}% vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <OrdersBarChart />
        <CustomerGrowthChart />
        <CategoryPieChart />
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-900 font-semibold text-sm">Generated Reports</h3>
          <button
            onClick={generateReport}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            <FilePlus className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Generating…" : "Generate Report"}
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {reports.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[r.type] ?? "bg-slate-100 text-slate-500"}`}>
                <span className="text-[10px] font-bold">{r.type}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 text-sm font-medium truncate">{r.label}</p>
                <p className="text-slate-400 text-xs">{r.size}</p>
              </div>
              <button
                onClick={() => downloadReport(r.label, r.type)}
                className="text-slate-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
