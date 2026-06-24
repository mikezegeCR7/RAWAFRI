import { useState, useRef, useEffect } from "react";
import { Plus, MoreHorizontal, TrendingUp, AlertTriangle, XCircle, X, Pencil, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { products as initialProducts, formatNaira, type Product } from "@/lib/admin-data";

const stockBadge = (status: Product["status"]) => {
  if (status === "active") return "bg-green-50 text-green-700";
  if (status === "low_stock") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-600";
};
const stockLabel = (status: Product["status"]) => {
  if (status === "active") return "In Stock";
  if (status === "low_stock") return "Low Stock";
  return "Out of Stock";
};
const stockIcon = (status: Product["status"]) => {
  if (status === "active") return <TrendingUp className="w-3 h-3" />;
  if (status === "low_stock") return <AlertTriangle className="w-3 h-3" />;
  return <XCircle className="w-3 h-3" />;
};

const categories = ["All", "Grains", "Legumes", "Tubers", "Vegetables", "Oils", "Seafood", "Livestock"];

function ActionMenu({
  product,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
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
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-left"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-400" /> Edit product
          </button>
          <button
            onClick={() => { setOpen(false); onToggleStatus(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-left"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            {product.status === "active" ? "Mark low stock" : "Mark in stock"}
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 text-left"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete product
          </button>
        </div>
      )}
    </div>
  );
}

const BLANK_PRODUCT = { name: "", category: "Grains", price: "", unit: "kg", stock: "" };

export function ProductsSection({ search }: { search: string }) {
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productList, setProductList] = useState(initialProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(BLANK_PRODUCT);

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm(BLANK_PRODUCT);
    setShowAddModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, price: p.price.toString(), unit: p.unit, stock: p.stock.toString() });
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price || !form.stock) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? { ...p, name: form.name, category: form.category as Product["category"], price: Number(form.price), unit: form.unit, stock: Number(form.stock) }
            : p,
        ),
      );
      toast.success(`"${form.name}" updated successfully`);
    } else {
      const newProduct: Product = {
        id: `PRD-${Date.now()}`,
        name: form.name,
        category: form.category as Product["category"],
        price: Number(form.price),
        unit: form.unit,
        stock: Number(form.stock),
        sold: 0,
        status: "active",
      };
      setProductList((prev) => [newProduct, ...prev]);
      toast.success(`"${form.name}" added to catalog`);
    }
    setShowAddModal(false);
  };

  const toggleStatus = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next: Product["status"] = p.status === "active" ? "low_stock" : "active";
        toast.success(`${p.name} marked as "${stockLabel(next)}"`);
        return { ...p, status: next };
      }),
    );
  };

  const deleteProduct = (id: string) => {
    const product = productList.find((p) => p.id === id);
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast.success(`"${product?.name}" removed from catalog`);
  };

  return (
    <div className="space-y-4">
      {/* Add / Edit Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-96 max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{editProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Product Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Long Grain Parboiled Rice"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none bg-white"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none bg-white"
                  >
                    {["kg", "g", "L", "piece", "bag", "basket", "tuber", "crate"].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Price (₦) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Stock (units) *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
              >
                {editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="all">All Status</option>
            <option value="active">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 whitespace-nowrap">Product</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 whitespace-nowrap">Category</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5 whitespace-nowrap">Price</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5 whitespace-nowrap">Stock</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3.5 whitespace-nowrap">Units Sold</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-slate-800 font-medium">{product.name}</p>
                      <p className="text-slate-400 text-[11px]">{product.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{product.category}</td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <span className="font-semibold text-slate-800">{formatNaira(product.price)}</span>
                    <span className="text-slate-400 text-[11px] ml-1">{product.unit}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-700 whitespace-nowrap">{product.stock.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right text-slate-600 whitespace-nowrap">{product.sold.toLocaleString()}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${stockBadge(product.status)}`}>
                      {stockIcon(product.status)}
                      {stockLabel(product.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <ActionMenu
                      product={product}
                      onEdit={() => openEdit(product)}
                      onToggleStatus={() => toggleStatus(product.id)}
                      onDelete={() => deleteProduct(product.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No products match your filters.</div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {productList.length} products</span>
        </div>
      </div>
    </div>
  );
}
