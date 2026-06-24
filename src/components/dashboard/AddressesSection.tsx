import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Address = {
  id: string;
  label: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  isDefault: boolean;
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "a1",
    label: "Home",
    type: "home",
    name: "Adaeze Okafor",
    phone: "+234 802 345 6789",
    line1: "24 Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    state: "Lagos State",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Office",
    type: "work",
    name: "Adaeze Okafor",
    phone: "+234 802 345 6789",
    line1: "15 Broad Street, Lagos Island",
    city: "Lagos",
    state: "Lagos State",
    isDefault: false,
  },
  {
    id: "a3",
    label: "Mum's Place",
    type: "other",
    name: "Mrs. Ngozi Okafor",
    phone: "+234 806 111 2222",
    line1: "7 Bode Thomas Street, Surulere",
    city: "Lagos",
    state: "Lagos State",
    isDefault: false,
  },
];

const TYPE_ICON: Record<string, React.ElementType> = {
  home: Home,
  work: Briefcase,
  other: MapPin,
};

export function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [adding, setAdding] = useState(false);

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated");
  };

  const remove = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-display font-semibold">Delivery Addresses</h2>
          <p className="text-sm text-muted-foreground">{addresses.length} saved addresses</p>
        </div>
        <button
          onClick={() => { setAdding(true); toast.message("Address form coming soon"); }}
          className="flex items-center gap-1.5 bg-brand text-brand-foreground text-xs font-semibold px-3 py-2 rounded-full hover:opacity-90 transition"
        >
          <Plus className="size-3.5" /> Add New
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => {
          const Icon = TYPE_ICON[addr.type];
          return (
            <div
              key={addr.id}
              className={cn(
                "bg-card ring-1 rounded-2xl p-4",
                addr.isDefault ? "ring-brand/40 bg-brand/5" : "ring-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "size-10 rounded-xl grid place-items-center shrink-0",
                    addr.isDefault ? "bg-brand/15 text-brand" : "bg-muted text-muted-foreground",
                  )}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold">{addr.label}</p>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-brand/15 text-brand font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star className="size-2.5 fill-brand" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{addr.name}</p>
                    <p className="text-xs text-muted-foreground">{addr.line1}</p>
                    <p className="text-xs text-muted-foreground">{addr.city}, {addr.state}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => toast.message("Edit address coming soon")}
                    className="size-8 rounded-full bg-muted hover:bg-accent grid place-items-center transition-colors"
                  >
                    <Edit2 className="size-3.5 text-muted-foreground" />
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => remove(addr.id)}
                      className="size-8 rounded-full hover:bg-destructive/10 grid place-items-center transition-colors"
                    >
                      <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </div>
              </div>
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id)}
                  className="mt-3 text-xs font-semibold text-brand hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => toast.message("Address form coming soon")}
        className="w-full py-3.5 rounded-2xl ring-2 ring-dashed ring-border text-sm text-muted-foreground font-medium hover:ring-brand/40 hover:text-brand hover:bg-brand/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="size-4" /> Add a new address
      </button>
    </div>
  );
}
