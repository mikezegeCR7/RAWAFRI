import { useState } from "react";
import { Save, Shield, Bell, Globe, CreditCard, Truck, Users, X, UserPlus } from "lucide-react";
import { toast } from "sonner";

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-slate-100 last:border-0 gap-3">
      <div className="min-w-0 sm:max-w-[60%]">
        <p className="text-slate-800 text-sm font-medium">{label}</p>
        {description && <p className="text-slate-400 text-xs mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0 w-full sm:w-auto">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${on ? "bg-green-600" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

function ConfigureModal({ gateway, onClose }: { gateway: string; onClose: () => void }) {
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-96 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Configure {gateway}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Public Key</label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={`${gateway.toLowerCase()}_pub_xxxxxxxxx`}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Secret Key</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="sk_xxxxxxxxxxxxxxxxx"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-400">Keys are encrypted at rest and never exposed in logs.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              toast.success(`${gateway} configuration saved`);
              onClose();
            }}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
}

function AddRoleModal({ role, onClose, onAdd }: { role: string; onClose: () => void; onAdd: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Add {role}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@rawafri.ng"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">They'll receive an invite email with access instructions.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!email.includes("@")) { toast.error("Please enter a valid email"); return; }
              onAdd(email);
              onClose();
            }}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsSection() {
  const [active, setActive] = useState("general");
  const [configureGateway, setConfigureGateway] = useState<string | null>(null);
  const [addingRole, setAddingRole] = useState<string | null>(null);
  const [roleCounts, setRoleCounts] = useState({ ops: 0, support: 0, finance: 0 });

  const sections = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "access", label: "Access & Roles", icon: Shield },
  ];

  const saveChanges = () => {
    const section = sections.find((s) => s.id === active);
    toast.success(`${section?.label} settings saved`, { description: "Changes applied successfully" });
  };

  const renderContent = () => {
    switch (active) {
      case "general":
        return (
          <div className="space-y-0">
            <SettingRow label="Platform Name" description="Displayed across the marketplace">
              <input defaultValue="RawAfri" className="border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </SettingRow>
            <SettingRow label="Default Currency" description="All prices displayed in this currency">
              <select className="border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 focus:outline-none bg-white w-full sm:w-auto">
                <option>NGN — Nigerian Naira</option>
                <option>USD — US Dollar</option>
              </select>
            </SettingRow>
            <SettingRow label="Timezone" description="Used for scheduling and reports">
              <select className="border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 focus:outline-none bg-white w-full sm:w-auto">
                <option>Africa/Lagos (WAT)</option>
                <option>UTC</option>
              </select>
            </SettingRow>
            <SettingRow label="Maintenance Mode" description="Take the platform offline for maintenance">
              <Toggle />
            </SettingRow>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-0">
            <SettingRow label="Email notifications" description="Send order updates via email"><Toggle defaultChecked /></SettingRow>
            <SettingRow label="SMS alerts" description="Send delivery SMS to customers"><Toggle defaultChecked /></SettingRow>
            <SettingRow label="Low stock alerts" description="Notify admin when stock drops below threshold"><Toggle defaultChecked /></SettingRow>
            <SettingRow label="Failed payment alerts" description="Immediate alert on payment failures"><Toggle defaultChecked /></SettingRow>
            <SettingRow label="Daily digest" description="Daily summary email at 8:00 AM"><Toggle /></SettingRow>
          </div>
        );
      case "payments":
        return (
          <div className="space-y-0">
            <SettingRow label="Bank Transfer Details" description="Account customers transfer payments to">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">Active</span>
                <button
                  onClick={() => setConfigureGateway("Bank Transfer")}
                  className="text-xs text-slate-500 underline hover:text-green-600 transition-colors"
                >
                  Configure
                </button>
              </div>
            </SettingRow>
            <SettingRow label="Require payment proof" description="Customers must upload a transfer screenshot or receipt">
              <Toggle defaultChecked />
            </SettingRow>
            <SettingRow label="Auto-flag unconfirmed payments" description="Alert admin if payment isn't confirmed within 24 hours">
              <Toggle defaultChecked />
            </SettingRow>
            <SettingRow label="Transaction Fee (%)" description="Platform fee charged per order">
              <input defaultValue="2.5" type="number" step="0.1" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 w-24 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </SettingRow>
            <SettingRow label="Auto-refund failed orders" description="Automatically refund cancelled paid orders">
              <Toggle defaultChecked />
            </SettingRow>
          </div>
        );
      case "delivery":
        return (
          <div className="space-y-0">
            <SettingRow label="Standard delivery fee (₦)" description="Default fee for standard delivery">
              <input defaultValue="1500" type="number" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 w-32 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </SettingRow>
            <SettingRow label="Free delivery threshold (₦)" description="Orders above this amount get free delivery">
              <input defaultValue="25000" type="number" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 w-32 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </SettingRow>
            <SettingRow label="Max delivery radius (km)" description="Maximum distance for delivery">
              <input defaultValue="50" type="number" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 w-24 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </SettingRow>
            <SettingRow label="Same-day delivery cutoff" description="Last time to place orders for same-day delivery">
              <input defaultValue="14:00" type="time" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </SettingRow>
          </div>
        );
      case "access":
        return (
          <div className="space-y-0">
            <SettingRow label="Super Admin" description="Full platform access — cannot be restricted">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">1 user</span>
            </SettingRow>
            <SettingRow label="Operations Manager" description="Orders, inventory, and delivery access">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{roleCounts.ops} users</span>
                <button onClick={() => setAddingRole("Operations Manager")} className="text-xs text-green-600 font-medium hover:text-green-700">+ Add</button>
              </div>
            </SettingRow>
            <SettingRow label="Customer Support" description="Customers and complaints access only">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{roleCounts.support} users</span>
                <button onClick={() => setAddingRole("Customer Support")} className="text-xs text-green-600 font-medium hover:text-green-700">+ Add</button>
              </div>
            </SettingRow>
            <SettingRow label="Finance Analyst" description="Payments and reports access only">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{roleCounts.finance} users</span>
                <button onClick={() => setAddingRole("Finance Analyst")} className="text-xs text-green-600 font-medium hover:text-green-700">+ Add</button>
              </div>
            </SettingRow>
          </div>
        );
      default:
        return null;
    }
  };

  const currentSection = sections.find((s) => s.id === active)!;

  return (
    <>
      {configureGateway && (
        <ConfigureModal gateway={configureGateway} onClose={() => setConfigureGateway(null)} />
      )}
      {addingRole && (
        <AddRoleModal
          role={addingRole}
          onClose={() => setAddingRole(null)}
          onAdd={(email) => {
            const key = addingRole === "Operations Manager" ? "ops" : addingRole === "Customer Support" ? "support" : "finance";
            setRoleCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
            toast.success(`Invite sent to ${email}`, { description: `Role: ${addingRole}` });
          }}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Mobile: horizontal scrollable tabs. Desktop: vertical sidebar */}
        <div className="flex lg:flex-col gap-1.5 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-48 lg:flex-shrink-0 -mx-1 px-1 lg:mx-0 lg:px-0 scrollbar-hide">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 lg:w-full ${
                  active === s.id ? "bg-green-600 text-white" : "text-slate-600 hover:bg-slate-100 bg-slate-50 lg:bg-transparent"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              {(() => { const Icon = currentSection.icon; return <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />; })()}
              <h3 className="text-slate-900 font-semibold text-sm truncate">{currentSection.label} Settings</h3>
            </div>
            <button
              onClick={saveChanges}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex-shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
          <div className="px-4 sm:px-5">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
