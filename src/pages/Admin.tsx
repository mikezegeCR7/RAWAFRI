import { useState } from "react";
import { AdminSidebar, type AdminSection } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { StatsCards } from "@/components/admin/overview/StatsCards";
import { RevenueChart, OrdersBarChart, CategoryPieChart } from "@/components/admin/overview/RevenueChart";
import { RecentOrders } from "@/components/admin/overview/RecentOrders";
import { TopProducts } from "@/components/admin/overview/TopProducts";
import { ProductsSection } from "@/components/admin/sections/ProductsSection";
import { OrdersSection } from "@/components/admin/sections/OrdersSection";
import { CustomersSection } from "@/components/admin/sections/CustomersSection";
import { InventorySection } from "@/components/admin/sections/InventorySection";
import { PaymentsSection } from "@/components/admin/sections/PaymentsSection";
import { NotificationsSection } from "@/components/admin/sections/NotificationsSection";
import { ReportsSection } from "@/components/admin/sections/ReportsSection";
import { SettingsSection } from "@/components/admin/sections/SettingsSection";

function OverviewSection({ search, onNavigate }: { search: string; onNavigate: (s: AdminSection) => void }) {
  return (
    <div className="space-y-5">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <OrdersBarChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentOrders onNavigate={onNavigate} />
        </div>
        <div className="space-y-4">
          <CategoryPieChart />
        </div>
      </div>
      <TopProducts />
    </div>
  );
}

export default function Admin() {
  const [section, setSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = (s: AdminSection) => {
    setSection(s);
    setSearch("");
  };

  const renderSection = () => {
    switch (section) {
      case "overview":
        return <OverviewSection search={search} onNavigate={navigate} />;
      case "products":
        return <ProductsSection search={search} />;
      case "orders":
        return <OrdersSection search={search} />;
      case "customers":
        return <CustomersSection search={search} />;
      case "inventory":
        return <InventorySection search={search} />;
      case "payments":
        return <PaymentsSection search={search} />;
      case "notifications":
        return <NotificationsSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar
        active={section}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          section={section}
          onMenuOpen={() => setSidebarOpen(true)}
          search={search}
          onSearch={setSearch}
          onNavigate={navigate}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
