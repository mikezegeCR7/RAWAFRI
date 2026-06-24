import { useState } from "react";
import { CheckCircle, AlertTriangle, Phone, Shield, Package } from "lucide-react";
import { type Order } from "@/lib/order-data";
import { toast } from "sonner";

type Props = {
  order: Order;
  onConfirmed: (orderId: string) => void;
  onIssueReported: (orderId: string, description: string) => void;
};

export function DeliveryConfirmationCard({ order, onConfirmed, onIssueReported }: Props) {
  const [view, setView] = useState<"main" | "otp" | "issue" | "success">("main");
  const [otp, setOtp] = useState("");
  const [issueText, setIssueText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView("success");
      onConfirmed(order.id);
      toast.success("Delivery confirmed! Thank you.");
    }, 1200);
  };

  const handleOtpConfirm = () => {
    if (otp.length < 4) {
      toast.error("Please enter the OTP sent to your phone");
      return;
    }
    handleConfirm();
  };

  const handleReportIssue = () => {
    if (!issueText.trim()) {
      toast.error("Please describe the issue");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onIssueReported(order.id, issueText);
      toast.warning("Issue reported. Our team will contact you shortly.");
      setView("main");
      setIssueText("");
    }, 1000);
  };

  if (view === "success") {
    return (
      <div className="bg-card rounded-2xl ring-1 ring-border p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-lg">Delivery Confirmed!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You've confirmed receipt of order {order.reference}. Enjoy your food!
          </p>
        </div>
        <div className="bg-green-50 rounded-xl px-4 py-3 text-xs text-green-700 font-medium flex items-center justify-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" /> Confirmed at {new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    );
  }

  if (view === "otp") {
    return (
      <div className="bg-card rounded-2xl ring-1 ring-border p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">OTP Verification</h3>
            <p className="text-xs text-muted-foreground">Enter the code sent to {order.contactPhone}</p>
          </div>
        </div>

        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value.slice(0, 6))}
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-center text-2xl font-bold tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setView("main")}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition"
          >
            Back
          </button>
          <button
            onClick={handleOtpConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Verifying...</>
            ) : "Verify & Confirm"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "issue") {
    return (
      <div className="bg-card rounded-2xl ring-1 ring-border p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Report Delivery Issue</h3>
            <p className="text-xs text-muted-foreground">Describe the problem with your delivery</p>
          </div>
        </div>

        <textarea
          placeholder="e.g. Wrong items delivered, missing items, damaged goods..."
          value={issueText}
          onChange={e => setIssueText(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand resize-none"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setView("main")}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition"
          >
            Back
          </button>
          <button
            onClick={handleReportIssue}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl ring-2 ring-purple-300 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm">Your delivery has arrived!</h3>
            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full ring-1 ring-purple-200">
              Awaiting Confirmation
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Please confirm you've received order {order.reference}
          </p>
        </div>
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-brand text-brand-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Confirming...</>
        ) : (
          <><CheckCircle className="w-4 h-4" /> Confirm Delivery Received</>
        )}
      </button>

      {/* OTP option */}
      <button
        onClick={() => setView("otp")}
        className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent transition flex items-center justify-center gap-2"
      >
        <Shield className="w-4 h-4 text-purple-600" />
        Verify with OTP instead
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">Having an issue?</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setView("issue")}
          className="flex-1 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition flex items-center justify-center gap-1.5 ring-1 ring-red-200"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Report Issue
        </button>
        <a
          href="tel:+2348001234567"
          className="flex-1 py-2 rounded-xl bg-surface text-foreground text-xs font-medium hover:bg-accent transition flex items-center justify-center gap-1.5 ring-1 ring-border"
        >
          <Phone className="w-3.5 h-3.5" />
          Call Support
        </a>
      </div>
    </div>
  );
}
