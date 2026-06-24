import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Menu, X, Bell } from "lucide-react";
import { DashboardSidebar, NAV_ITEMS, type NavKey } from "@/components/dashboard/DashboardSidebar";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { OrdersSection } from "@/components/dashboard/OrdersSection";
import { CartSection } from "@/components/dashboard/CartSection";
import { AddressesSection } from "@/components/dashboard/AddressesSection";
import { PaymentsSection } from "@/components/dashboard/PaymentsSection";
import { NotificationsSection } from "@/components/dashboard/NotificationsSection";
import { RecommendedSection } from "@/components/dashboard/RecommendedSection";
import { RecentlyViewedSection } from "@/components/dashboard/RecentlyViewedSection";
import { cn } from "@/lib/utils";

function SectionContent({ section, onNavigate }: { section: NavKey; onNavigate: (key: NavKey) => void }) {
  switch (section) {
    case "overview":    return <OverviewSection onNavigate={onNavigate} />;
    case "orders":      return <OrdersSection />;
    case "cart":        return <CartSection />;
    case "addresses":   return <AddressesSection />;
    case "payments":    return <PaymentsSection />;
    case "notifications": return <NotificationsSection />;
    case "recommended": return <RecommendedSection />;
    case "recent":      return <RecentlyViewedSection />;
    default:            return <OverviewSection onNavigate={onNavigate} />;
  }
}

const SECTION_TITLES: Record<NavKey, string> = {
  overview:      "Dashboard",
  orders:        "Orders",
  cart:          "Cart",
  addresses:     "Addresses",
  payments:      "Payments",
  notifications: "Notifications",
  recommended:   "Recommended",
  recent:        "Recently Viewed",
};

export default function Dashboard() {
  const params = useParams<{ section?: string }>();
  const [, navigate] = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const active = (params.section as NavKey) || "overview";

  const handleNav = (key: NavKey) => {
    navigate(`/dashboard/${key}`);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden size-8 rounded-full bg-card ring-1 ring-border grid place-items-center"
              onClick={() => setMobileSidebarOpen((v) => !v)}
            >
              {mobileSidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img src="/rawafri-logo.png" alt="RawAfri" className="size-8 rounded-xl object-contain" />
              <span className="font-display text-lg font-semibold tracking-tight hidden sm:block">RawAfri</span>
            </a>

            {/* Breadcrumb */}
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>/</span>
              <span className="text-foreground font-medium">{SECTION_TITLES[active]}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav("notifications")}
              className="relative size-9 rounded-full bg-card ring-1 ring-border grid place-items-center hover:bg-accent transition-colors"
            >
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 size-2 bg-brand rounded-full" />
            </button>

            <a href="/" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-card ring-1 ring-border rounded-full px-3 py-2">
              <ArrowLeft className="size-3.5" />
              Marketplace
            </a>

            {/* Avatar */}
            <div className="size-9 rounded-full bg-brand/20 ring-2 ring-brand/30 grid place-items-center">
              <span className="text-sm font-bold text-brand">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay sidebar */}
      {mobileSidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="lg:hidden fixed top-14 left-0 bottom-0 z-40 w-72 bg-card border-r border-border overflow-y-auto">
            <MobileSidebarContent active={active} onChange={handleNav} />
          </div>
        </>
      )}

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start">
        {/* Desktop sidebar */}
        <DashboardSidebar active={active} onChange={handleNav} />

        {/* Content area */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-6">
          <div
            key={active}
            className="animate-fade-up"
          >
            <SectionContent section={active} onNavigate={handleNav} />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardBottomNav active={active} onChange={handleNav} />
    </div>
  );
}

function MobileSidebarContent({ active, onChange }: { active: string; onChange: (key: NavKey) => void }) {
  return (
    <div className="p-4 space-y-1">
      <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-border">
        <div className="size-10 rounded-full bg-brand/10 ring-2 ring-brand/20 grid place-items-center">
          <span className="text-sm font-bold text-brand">A</span>
        </div>
        <div>
          <p className="text-sm font-semibold">Adaeze Okafor</p>
          <p className="text-xs text-muted-foreground">adaeze@gmail.com</p>
        </div>
      </div>
      {NAV_ITEMS.map(({ key, label, icon: Icon, badge }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
              isActive ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4 shrink-0", isActive ? "text-brand" : "text-muted-foreground")} />
            <span className="flex-1 text-left">{label}</span>
            {badge != null && (
              <span className={cn(
                "size-5 rounded-full text-[10px] font-bold grid place-items-center",
                isActive ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
              )}>
                {badge}
              </span>
            )}
          </button>
        );
      })}
      <div className="pt-2 border-t border-border mt-2">
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
          Back to Marketplace
        </a>
      </div>
    </div>
  );
}
