import { useEffect, useState } from "react";
import {
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Star,
  Truck,
  Store,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { ProductCard, type Product } from "@/components/marketplace/ProductCard";
import { DeliveryBadge } from "@/components/marketplace/DeliveryBadge";
import { cn } from "@/lib/utils";

import realRice from "@/assets/rice.jpeg";
import realHoneyBeans from "@/assets/honey-beans.jpeg";
import realMarketBeans from "@/assets/market-beans.jpeg";
import realGarri from "@/assets/garri.jpeg";
import realYam from "@/assets/yam.jpeg";
import realBulkOnions from "@/assets/bulk-onions.jpeg";
import realShallots from "@/assets/shallots.jpeg";
import realSweetPotato from "@/assets/sweet-potato.jpeg";

const LOCATIONS = ["Ikoyi, Lagos", "Lekki, Lagos", "Yaba, Lagos", "Wuse, Abuja", "GRA, Port Harcourt"];

const SEARCH_SUGGESTIONS = [
  "Foreign rice 50kg",
  "Brown beans (oloyin)",
  "Fresh tomatoes basket",
  "Palm oil 5 litres",
  "Live catfish",
];

const CATEGORIES = [
  { key: "rice", label: "Rice", image: realRice, count: "1 item" },
  { key: "beans", label: "Beans", image: realMarketBeans, count: "2 items" },
  { key: "yam", label: "Yam", image: realYam, count: "1 item" },
  { key: "sweet-potato", label: "Sweet Potato", image: realSweetPotato, count: "1 item" },
  { key: "onions", label: "Onions", image: realBulkOnions, count: "2 items" },
  { key: "garri", label: "Garri", image: realGarri, count: "1 item" },
] as const;

const PRODUCTS: Product[] = [
  { id: "p1", name: "Long Grain Parboiled Rice", category: "Grains", price: 1450, unit: "kg", image: realRice },
  { id: "p2", name: "Garri (Fine / Ijebu)", category: "Grains", price: 650, unit: "kg", image: realGarri },
  { id: "p3", name: "Brown Beans (Oloyin)", category: "Legumes", price: 1200, unit: "kg", image: realMarketBeans },
  { id: "p4", name: "Old Yam (Large)", category: "Tubers", price: 4500, unit: "pc", image: realYam },
  { id: "p5", name: "Red Onions (Bulk Bag)", category: "Vegetables", price: 2800, unit: "bag", image: realBulkOnions },
  { id: "p6", name: "Shallots (Small Red Onions)", category: "Vegetables", price: 950, unit: "kg", image: realShallots },
  { id: "p7", name: "Sweet Potatoes", category: "Tubers", price: 700, unit: "kg", image: realSweetPotato },
  { id: "p8", name: "Honey Beans (White)", category: "Legumes", price: 1100, unit: "kg", image: realHoneyBeans },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-surface font-sans text-foreground">
      <Navbar />
      <Hero />
      <TrustBar />
      <CategoriesSection />
      <ProductsSection />
      <Footer />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-surface/85 backdrop-blur-md border-b border-border/60" : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center">
          <img src="/rawafri-logo.png" alt="RawAfri" className="h-11 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#categories" className="hover:text-foreground transition-colors">Categories</a>
          <a href="#products" className="hover:text-foreground transition-colors">Products</a>
          <a href="/orders" className="hover:text-foreground transition-colors">My Orders</a>
          <a href="/help" className="hover:text-foreground transition-colors">Help</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-sm font-semibold text-brand bg-brand/10 px-4 py-2 rounded-full hover:bg-brand hover:text-brand-foreground transition-colors"
          >
            My Dashboard
          </a>
          <a
            href="/admin"
            className="text-sm font-semibold text-white bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors"
          >
            Admin Panel
          </a>
          <a
            href="/login"
            className="text-sm font-semibold text-foreground hover:text-brand transition-colors"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition active:scale-95"
          >
            Register
          </a>
        </div>
        <button
          aria-label="Menu"
          className="md:hidden size-9 rounded-full bg-card ring-1 ring-border grid place-items-center"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <a href="#categories" onClick={() => setOpen(false)}>Categories</a>
          <a href="#products" onClick={() => setOpen(false)}>Products</a>
          <a href="/orders" className="block py-2 text-foreground font-semibold" onClick={() => setOpen(false)}>My Orders →</a>
          <a href="/help" className="block py-2 text-foreground font-semibold" onClick={() => setOpen(false)}>Help →</a>
          <a href="/dashboard" className="block py-2 text-brand font-semibold">My Dashboard →</a>
          <a href="/admin" className="block py-2 text-slate-800 font-semibold">Admin Panel →</a>
          <div className="flex gap-2 pt-2 border-t border-border">
            <a href="/login" className="flex-1 py-2 rounded-full ring-1 ring-border font-semibold text-center">Log in</a>
            <a href="/signup" className="flex-1 py-2 rounded-full bg-foreground text-background font-semibold text-center">Register</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const filtered = query
    ? SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_SUGGESTIONS;

  return (
    <section id="top" className="relative pt-28 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-muted via-surface to-surface" />
      <div aria-hidden className="absolute -top-24 -right-24 size-[420px] rounded-full bg-brand/15 blur-3xl -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-card ring-1 ring-border rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="size-3.5 text-brand" />
            Wholesale market prices, delivered today
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-foreground">
            Raw foodstuff from <em className="text-brand not-italic">Nigeria's</em> best markets — to your door.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Rice, beans, yam, garri, onions and sweet potatoes — sourced direct from Mile 12, Oyingbo and farm depots. Quality guaranteed. Same-day delivery.
          </p>

          <div className="mt-8 bg-card rounded-2xl ring-1 ring-border shadow-[0_8px_30px_-15px_rgba(0,0,0,0.15)] p-2 flex flex-col sm:flex-row gap-2 relative w-full max-w-full overflow-hidden">
            <div className="flex items-center gap-1 w-full min-w-0 sm:contents">
              <label className="relative flex items-center gap-2 px-3 sm:border-r sm:border-border shrink-0">
                <MapPin className="size-4 text-brand shrink-0" />
                <select
                  aria-label="Delivery location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent text-sm font-semibold py-3 pr-5 sm:pr-6 focus:outline-none cursor-pointer appearance-none w-[100px] sm:w-auto sm:max-w-none truncate"
                >
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <label className="relative flex-1 min-w-0 flex items-center gap-2 px-3 border-l border-border sm:border-l-0">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  placeholder="Search rice, peppers..."
                  className="w-full min-w-0 bg-transparent text-sm py-3 focus:outline-none placeholder:text-muted-foreground"
                />
              </label>
            </div>
            <button
              onClick={() => toast.success(`Searching "${query || "everything"}" in ${location}`)}
              className="bg-brand text-brand-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-95 active:scale-[0.98] transition w-full sm:w-auto"
            >
              Search
            </button>
            {focused && filtered.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-card ring-1 ring-border rounded-2xl shadow-lg p-2 z-20 animate-fade-up">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1 font-semibold">Suggestions</p>
                {filtered.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => { setQuery(s); toast.success(`Searching "${s}"`); }}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors text-sm"
                  >
                    <Search className="size-3.5 text-muted-foreground" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-success" /> 2,500+ orders delivered</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 text-brand" /> Avg. 90 min delivery</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-success" /> Quality guaranteed</span>
          </div>
        </div>

        <div className="relative animate-fade-up">
          <div className="aspect-square rounded-3xl overflow-hidden ring-1 ring-border shadow-[0_30px_80px_-30px_rgba(140,70,30,0.45)]">
            <img
              src={realRice}
              alt="Nigerian raw foodstuff marketplace — fresh rice from Mile 12"
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-4 -right-4 bg-card rounded-2xl ring-1 ring-border shadow-lg px-3 py-2 flex items-center gap-2">
            <Star className="size-4 fill-warning text-warning" />
            <span className="text-sm font-bold">4.9</span>
            <span className="text-xs text-muted-foreground">Avg. customer rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Quality guaranteed", sub: "Every product inspected" },
    { icon: Truck, label: "Same-day delivery", sub: "Order before 2 pm" },
    { icon: Store, label: "Direct market prices", sub: "No middlemen markups" },
    { icon: CheckCircle2, label: "Secure payments", sub: "Verified bank transfer" },
  ];
  return (
    <div className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-brand/10 text-brand grid place-items-center shrink-0">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesSection() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section id="categories" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">Browse by type</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Shop by category</h2>
          </div>
          <button
            onClick={() => toast.message("Full catalogue coming soon")}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand hover:opacity-80 transition"
          >
            See all <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActive(cat.key); toast.success(`Browsing ${cat.label}`); }}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl ring-1 transition-all",
                active === cat.key
                  ? "ring-brand bg-brand/5"
                  : "ring-border bg-card hover:ring-brand/40 hover:bg-accent",
              )}
            >
              <div className="size-12 rounded-full overflow-hidden ring-1 ring-border">
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-foreground">{cat.label}</span>
              <span className="text-[10px] text-muted-foreground">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section className="py-16 lg:py-24 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">Today's picks</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Featured products</h2>
          </div>
          <DeliveryBadge status="on-the-way" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <img src="/rawafri-logo.png" alt="RawAfri" className="h-9 w-auto" />
        </div>
        <p>© {new Date().getFullYear()} RawAfri Marketplace. Lagos, Nigeria.</p>
        <div className="flex gap-5">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
