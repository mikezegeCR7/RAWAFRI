import { Plus } from "lucide-react";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  category: string;
  vendor: string;
  price: number;
  unit: string;
  image: string;
};

const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="bg-card rounded-2xl ring-1 ring-border flex flex-col overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
      <div className="p-2 pb-0">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={512}
            height={512}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold leading-tight mb-1 flex-1 text-foreground">
          {product.name}
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3">
          {product.vendor}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">
            {formatNaira(product.price)}
            <span className="text-[10px] font-normal text-muted-foreground">
              /{product.unit}
            </span>
          </p>
          <button
            onClick={() => toast.success(`${product.name} added to basket`)}
            aria-label={`Add ${product.name} to basket`}
            className="size-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center ring-1 ring-brand/15 hover:bg-brand hover:text-brand-foreground transition-colors active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}