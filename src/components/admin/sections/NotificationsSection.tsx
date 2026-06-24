import { useState } from "react";
import {
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Archive,
  Info,
  Check,
  CheckCheck,
  Bell,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { notifications as initialNotifications, complaints as initialComplaints, type Notification, type Complaint } from "@/lib/admin-data";

const typeConfig: Record<Notification["type"], { icon: React.ComponentType<{ className?: string }>; bg: string; color: string }> = {
  order: { icon: ShoppingCart, bg: "bg-blue-50", color: "text-blue-600" },
  payment: { icon: CreditCard, bg: "bg-amber-50", color: "text-amber-600" },
  complaint: { icon: MessageSquare, bg: "bg-red-50", color: "text-red-600" },
  inventory: { icon: Archive, bg: "bg-orange-50", color: "text-orange-600" },
  system: { icon: Info, bg: "bg-slate-100", color: "text-slate-500" },
};

const priorityBadge = {
  high: "bg-red-50 text-red-600 border border-red-200",
  medium: "bg-amber-50 text-amber-600 border border-amber-200",
  low: "bg-slate-100 text-slate-500 border border-slate-200",
};

const complaintStatusStyle = {
  open: "bg-red-50 text-red-600",
  in_progress: "bg-amber-50 text-amber-700",
  resolved: "bg-green-50 text-green-700",
};

export function NotificationsSection() {
  const [typeFilter, setTypeFilter] = useState<Notification["type"] | "all">("all");
  const [notifs, setNotifs] = useState(initialNotifications);
  const [complaintList, setComplaintList] = useState(initialComplaints);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const filtered = notifs.filter((n) => typeFilter === "all" || n.type === typeFilter);
  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const markResolved = (id: string) => {
    setComplaintList((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        toast.success(`Complaint from ${c.customer} marked as resolved`);
        return { ...c, status: "resolved" as Complaint["status"] };
      }),
    );
  };

  const sendResponse = (complaint: Complaint) => {
    if (!responseText.trim()) {
      toast.error("Please type a response before sending");
      return;
    }
    toast.success(`Response sent to ${complaint.customer}`, {
      description: responseText.slice(0, 60) + (responseText.length > 60 ? "…" : ""),
    });
    setComplaintList((prev) =>
      prev.map((c) => (c.id === complaint.id ? { ...c, status: "in_progress" as Complaint["status"] } : c)),
    );
    setRespondingTo(null);
    setResponseText("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            <h3 className="text-slate-900 font-semibold text-sm">Notifications</h3>
            {unread > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              {(["all", "order", "payment", "complaint", "inventory", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all ${
                    typeFilter === t ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium">
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map((notif) => {
            const cfg = typeConfig[notif.type];
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors ${notif.read ? "opacity-70" : "bg-blue-50/20"}`}
              >
                <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${notif.read ? "text-slate-600" : "text-slate-900"}`}>{notif.title}</p>
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{notif.message}</p>
                  <p className="text-slate-400 text-[11px] mt-1">{notif.time}</p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markRead(notif.id)}
                    className="text-slate-400 hover:text-green-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 active:scale-90 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No notifications.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <h3 className="text-slate-900 font-semibold text-sm">Customer Complaints</h3>
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {complaintList.filter((c) => c.status === "open").length} open
            </span>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {complaintList.map((complaint) => (
            <div key={complaint.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-800 text-sm font-semibold">{complaint.subject}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${priorityBadge[complaint.priority]}`}>
                      {complaint.priority}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${complaintStatusStyle[complaint.status]}`}>
                      {complaint.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{complaint.customer} · {complaint.orderId} · {complaint.date}</p>
                  <p className="text-slate-600 text-sm mt-2">{complaint.message}</p>
                </div>
              </div>

              {/* Inline response textarea */}
              {respondingTo === complaint.id && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={`Write your response to ${complaint.customer}…`}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendResponse(complaint)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-[11px] font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Send className="w-3 h-3" /> Send Response
                    </button>
                    <button
                      onClick={() => { setRespondingTo(null); setResponseText(""); }}
                      className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {respondingTo !== complaint.id && (
                <div className="flex gap-2 mt-3">
                  {complaint.status !== "resolved" && (
                    <button
                      onClick={() => { setRespondingTo(complaint.id); setResponseText(""); }}
                      className="px-3 py-1.5 bg-green-600 text-white text-[11px] font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Respond
                    </button>
                  )}
                  {complaint.status !== "resolved" && (
                    <button
                      onClick={() => markResolved(complaint.id)}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {complaint.status === "resolved" && (
                    <span className="text-[11px] text-green-600 font-medium">✓ Resolved</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
