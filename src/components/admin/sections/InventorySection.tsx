import { useState, useRef, useEffect } from "react";
import { AlertTriangle, XCircle, CheckCircle2, RefreshCw, MoreHorizontal, PackagePlus, Pencil, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { products as initialProducts, formatNaira, type Product } from "@/lib/admin-data";

const THRESHOLD = 250;

function StockBar({ stock, max }: { stock: number; max: number }) {
  const pct = max > 0 ? Math.min((stock / max) * 100, 100) : 0;
  const color = pct === 0 ? "bg-red-500" : pct < 20 ? "bg-amber-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-slate-500 w-8 text-right">{Math.round(pct)}%</span>
    </div>
  );
}

function InventoryMenu({
  product,
  onRestock,
  onEditPrice,
  onDeactivate,
}: {
  product: Product;
  onRestock: () => void;
  onEditPrice: () => void;
  onDeactivate: () => void;
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
            onClick={() => { setOpen(false); onRestock(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-left"
          >
            <PackagePlus className="w-3.5 h-3.5 text-green-600" /> Restock +500
          </button>
          <button
            onClick={() => { setOpen(false); onEditPrice(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-left"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-400" /> Adjust price
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => { setOpen(false); onDeactivate(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 text-left"
          >
            <PowerOff className="w-3.5 h-3.5" />
            {product.status === "out_of_stock" ? "Reactivate" : "Mark out of stock"}
          </button>
        </div>
      )}
    </div>
  );
}

export function InventorySection({ search }: { search: string }) {
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [productList, setProductList] = useState(initialProducts);

  const maxStock = Math.max(...productList.map((p) => p.stock + p.sold));

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "low" && p.status === "low_stock") ||
      (filter === "out" && p.status === "out_of_stock");
    return matchSearch && matchFilter;
  });

  const outOfStock = productList.filter((p) => p.status === "out_of_stock").length;
  const lowStock = productList.filter((p) => p.status === "low_stock").length;
  const healthy = productList.filter((p) => p.status === "active").length;
  const totalValue = productList.reduce((s, p) => s + p.stock * p.price, 0);

  const restock = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStock = p.stock + 500;
        const newStatus: Product["status"] = newStock >= THRESHOLD ? "active" : "low_stock";
        toast.success(`${p.name} restocked +500 units (now ${newStock.toLocaleString()})`);
        return { ...p, stock: newStock, status: newStatus };
      }),
    );
  };

  const adjustPrice = (id: string) => {
    const product = productList.find((p) => p.id === id);
    if (!product) return;
    const input = prompt(`New price for ${product.name} (current: ₦${product.price.toLocaleString()})`);
    const newPrice = Number(input);
    if (!input || isNaN(newPrice) || newPrice <= 0) {
      toast.error("Invalid price entered");
      return;
    }
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p)),
    );
    toast.success(`${product.name} price updated to ₦${newPrice.toLocaleString()}`);
  };

  const toggleDeactivate = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next: Product["status"] = p.status === "out_of_stock" ? "active" : "out_of_stock";
        toast.success(`${p.name} marked as "${next === "out_of_stock" ? "Out of Stock" : "In Stock"}"`);
        return { ...p, status: next };
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Healthy Stock", value: healthy, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Low Stock", value: lowStock, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Out of Stock", value: outOfStock, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Stock Value", value: formatNaira(totalValue), icon: RefreshCw, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {(outOfStock > 0 || lowStock > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-amber-800">Stock Alert: </span>
            <span className="text-amber-700">
              {outOfStock} product{outOfStock !== 1 ? "s" : ""} out of stock and {lowStock} running low.
              Use the ⋯ menu on each row to restock.
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {[
          { key: "all", label: "All Products" },
          { key: "low", label: `Low Stock (${lowStock})` },
          { key: "out", label: `Out of Stock (${outOfStock})` },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === opt.key ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Product</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 hidden sm:table-cell">Category</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5">In Stock</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5 hidden md:table-cell">Sold</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 w-40">Stock Level</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5 hidden sm:table-cell">Stock Value</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Alert</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((product) => {
                const stockValue = product.stock * product.price;
                const isAlert = product.status !== "active";
                return (
                  <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${isAlert ? "bg-red-50/30" : ""}`}>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-slate-800 font-medium">{product.name}</p>
                        <p className="text-slate-400 text-[11px]">{product.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-slate-600 text-xs">{product.category}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`font-bold text-sm ${product.stock === 0 ? "text-red-600" : product.stock < THRESHOLD ? "text-amber-600" : "text-slate-800"}`}>
                        {product.stock.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden md:table-cell text-slate-500 text-xs">{product.sold.toLocaleString()}</td>
                    <td className="px-4 py-3.5 w-40">
                      <StockBar stock={product.stock} max={maxStock} />
                    </td>
                    <td className="px-4 py-3.5 text-right hidden sm:table-cell text-slate-700 text-xs font-medium">
                      {formatNaira(stockValue)}
                    </td>
                    <td className="px-4 py-3.5">
                      {product.status === "out_of_stock" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                          <XCircle className="w-2.5 h-2.5" /> Restock
                        </span>
                      )}
                      {product.status === "low_stock" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                          <AlertTriangle className="w-2.5 h-2.5" /> Low
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <InventoryMenu
                        product={product}
                        onRestock={() => restock(product.id)}
                        onEditPrice={() => adjustPrice(product.id)}
                        onDeactivate={() => toggleDeactivate(product.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
