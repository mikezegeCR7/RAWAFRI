import { Star } from "lucide-react";

export type Vendor = {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  image: string;
};

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <article className="min-w-[280px] bg-card rounded-2xl ring-1 ring-border overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
      <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          loading="lazy"
          width={800}
          height={450}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-base text-foreground">{vendor.name}</h3>
          <p className="text-xs text-muted-foreground">{vendor.subtitle}</p>
        </div>
        <div className="bg-muted px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 shrink-0">
          <Star className="size-3 fill-warning text-warning" />
          {vendor.rating.toFixed(1)}
        </div>
      </div>
    </article>
  );
}