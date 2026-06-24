import { products, formatNaira } from "@/lib/admin-data";

export function TopProducts() {
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6);
  const maxSold = Math.max(...top.map((p) => p.sold));

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-slate-900 font-semibold text-sm">Top Selling Products</h3>
          <p className="text-slate-400 text-xs mt-0.5">By total units sold</p>
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {top.map((product, i) => (
          <div key={product.id} className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-5 text-center text-xs font-bold text-slate-400">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-sm font-medium truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(product.sold / maxSold) * 100}%` }}
                  />
                </div>
                <span className="text-slate-400 text-[11px] flex-shrink-0">{product.sold.toLocaleString()} kg</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-slate-700 text-sm font-semibold">{formatNaira(product.price)}</p>
              <p className="text-slate-400 text-[11px]">{product.unit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
