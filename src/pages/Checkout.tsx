import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, CheckCircle, X, Plus, Minus, Tag, Truck, Clock, AlertCircle, Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCart, DELIVERY_ZONES, VALID_PROMOS, formatNaira } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type Step = "cart" | "address" | "payment" | "processing" | "success" | "failed";

type Address = {
  fullName: string;
  phone: string;
  address: string;
  zone: string;
  landmark: string;
};

type PaymentMethod = "bank_transfer";

const STEPS = [
  { key: "cart", label: "Cart" },
  { key: "address", label: "Delivery" },
  { key: "payment", label: "Payment" },
];

const BANK_DETAILS = {
  bank: "Guaranty Trust Bank",
  accountName: "RawAfri Marketplace Ltd",
  accountNumber: "0123456789",
};

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [address, setAddress] = useState<Address>({ fullName: "", phone: "", address: "", zone: DELIVERY_ZONES[0].zone, landmark: "" });
  const [payMethod] = useState<PaymentMethod>("bank_transfer");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<typeof VALID_PROMOS[0] | null>(null);
  const [promoError, setPromoError] = useState("");
  const [orderRef, setOrderRef] = useState("");

  const zone = DELIVERY_ZONES.find(z => z.zone === address.zone) ?? DELIVERY_ZONES[0];
  const deliveryFee = zone.fee;
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.discount / 100) : 0;
  const total = subtotal + deliveryFee - discount;

  const applyPromo = () => {
    const found = VALID_PROMOS.find(p => p.code === promo.toUpperCase().trim());
    if (found) {
      setAppliedPromo(found);
      setPromoError("");
      toast.success(`Promo applied: ${found.label}`);
    } else {
      setPromoError("Invalid promo code");
      setAppliedPromo(null);
    }
  };

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      const ref = `RAW-${Date.now().toString().slice(-7)}`;
      setOrderRef(ref);
      setStep("success");
      toast.success("Order placed! Awaiting payment confirmation.");
    }, 1800);
  };

  const stepIndex = ["cart", "address", "payment"].indexOf(step);

  if (step === "processing") return <ProcessingScreen />;
  if (step === "success") return <SuccessScreen orderRef={orderRef} total={total} eta={zone.eta} onDone={() => navigate("/orders")} />;
  if (step === "failed") return <FailedScreen onRetry={() => setStep("payment")} onHome={() => navigate("/")} />;

  return (
    <div className="min-h-screen bg-[oklch(0.975_0.008_75)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[oklch(0.92_0.005_75)] px-4 h-14 flex items-center gap-3 max-w-2xl mx-auto">
        <button onClick={() => step === "cart" ? navigate("/") : setStep(step === "address" ? "cart" : "address")} className="w-11 h-11 -ml-1 rounded-xl flex items-center justify-center hover:bg-[oklch(0.96_0.005_75)] active:scale-90 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-[oklch(0.15_0.02_75)]">
            {step === "cart" ? "Your Cart" : step === "address" ? "Delivery Details" : "Payment"}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <div className={cn("w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition",
                i < stepIndex ? "bg-[oklch(0.50_0.16_145)] text-white" :
                i === stepIndex ? "bg-[oklch(0.50_0.16_145)] text-white ring-2 ring-[oklch(0.50_0.16_145)]/30" :
                "bg-[oklch(0.92_0.005_75)] text-[oklch(0.50_0.02_75)]"
              )}>
                {i < stepIndex ? <CheckCircle className="w-3 h-3" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={cn("w-4 h-0.5", i < stepIndex ? "bg-[oklch(0.50_0.16_145)]" : "bg-[oklch(0.92_0.005_75)]")} />}
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 pb-10 space-y-4">
        {/* CART STEP */}
        {step === "cart" && (
          <>
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-[oklch(0.75_0.01_75)]" />
                <p className="text-[oklch(0.40_0.02_75)] font-medium">Your cart is empty</p>
                <button onClick={() => navigate("/")} className="text-sm text-[oklch(0.50_0.16_145)] font-medium">Browse products →</button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-[oklch(0.92_0.005_75)] divide-y divide-[oklch(0.96_0.005_75)] overflow-hidden">
                  {items.map(item => (
                    <div key={item.id} className="p-4 flex gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[oklch(0.94_0.02_145)] flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-6 h-6 text-[oklch(0.50_0.16_145)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[oklch(0.15_0.02_75)] truncate">{item.name}</p>
                        <p className="text-sm font-bold text-[oklch(0.50_0.16_145)] mt-1">{formatNaira(item.price)}<span className="text-xs font-normal text-[oklch(0.55_0.02_75)]">/{item.unit}</span></p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeItem(item.id)} className="w-8 h-8 -mr-1.5 -mt-1.5 flex items-center justify-center text-[oklch(0.65_0.01_75)] hover:text-red-500 active:scale-90 transition">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 bg-[oklch(0.96_0.005_75)] rounded-xl p-1">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm hover:bg-[oklch(0.94_0.02_145)] active:scale-90 transition">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-9 h-9 rounded-lg bg-[oklch(0.50_0.16_145)] text-white flex items-center justify-center shadow-sm hover:opacity-90 active:scale-90 transition">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-[oklch(0.25_0.02_75)]">{formatNaira(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="bg-white rounded-2xl border border-[oklch(0.92_0.005_75)] p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.65_0.01_75)]" />
                      <input
                        value={promo}
                        onChange={e => { setPromo(e.target.value); setPromoError(""); }}
                        placeholder="Promo code"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] bg-[oklch(0.975_0.008_75)]"
                      />
                    </div>
                    <button onClick={applyPromo} className="px-4 py-2.5 rounded-xl bg-[oklch(0.50_0.16_145)] text-white text-sm font-medium hover:opacity-90 transition">Apply</button>
                  </div>
                  {promoError && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{promoError}</p>}
                  {appliedPromo && <p className="text-xs text-[oklch(0.50_0.16_145)] mt-1.5 font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {appliedPromo.label}</p>}
                </div>

                {/* Order summary */}
                <OrderSummaryCard subtotal={subtotal} deliveryFee={deliveryFee} discount={discount} total={total} eta={zone.eta} />

                <button onClick={() => setStep("address")} className="w-full py-3.5 rounded-2xl bg-[oklch(0.50_0.16_145)] text-white font-semibold hover:opacity-90 transition">
                  Continue to Delivery →
                </button>
              </>
            )}
          </>
        )}

        {/* ADDRESS STEP */}
        {step === "address" && (
          <>
            <div className="bg-white rounded-2xl border border-[oklch(0.92_0.005_75)] p-5 space-y-4">
              <h2 className="text-sm font-semibold text-[oklch(0.15_0.02_75)] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[oklch(0.50_0.16_145)]" /> Delivery Information
              </h2>

              {[
                { key: "fullName", label: "Full name", placeholder: "Chidinma Okafor", type: "text" },
                { key: "phone", label: "Phone number", placeholder: "08012345678", type: "tel" },
                { key: "address", label: "Street address", placeholder: "14B Admiralty Way, Lekki Phase 1", type: "text" },
                { key: "landmark", label: "Nearest landmark (optional)", placeholder: "Near Shoprite Lekki", type: "text" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-[oklch(0.35_0.02_75)] mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={address[f.key as keyof Address]}
                    onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] bg-[oklch(0.975_0.008_75)]"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-[oklch(0.35_0.02_75)] mb-1.5">Delivery zone</label>
                <select
                  value={address.zone}
                  onChange={e => setAddress(a => ({ ...a, zone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] bg-[oklch(0.975_0.008_75)]"
                >
                  {DELIVERY_ZONES.map(z => (
                    <option key={z.zone} value={z.zone}>{z.zone} — {formatNaira(z.fee)} · {z.eta}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 bg-[oklch(0.94_0.04_145)] rounded-xl p-3">
                <Clock className="w-4 h-4 text-[oklch(0.50_0.16_145)] flex-shrink-0" />
                <p className="text-xs text-[oklch(0.30_0.10_145)]">Estimated delivery: <strong>{zone.eta}</strong> · Fee: <strong>{formatNaira(deliveryFee)}</strong></p>
              </div>
            </div>

            <OrderSummaryCard subtotal={subtotal} deliveryFee={deliveryFee} discount={discount} total={total} eta={zone.eta} />

            <button
              onClick={() => {
                if (!address.fullName || !address.phone || !address.address) {
                  toast.error("Please fill in all required fields");
                  return;
                }
                setStep("payment");
              }}
              className="w-full py-3.5 rounded-2xl bg-[oklch(0.50_0.16_145)] text-white font-semibold hover:opacity-90 transition"
            >
              Continue to Payment →
            </button>
          </>
        )}

        {/* PAYMENT STEP */}
        {step === "payment" && (
          <>
            {/* Delivery summary */}
            <div className="bg-white rounded-2xl border border-[oklch(0.92_0.005_75)] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[oklch(0.94_0.04_145)] flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-[oklch(0.50_0.16_145)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[oklch(0.55_0.02_75)]">Delivering to</p>
                <p className="text-sm font-semibold text-[oklch(0.15_0.02_75)]">{address.address}</p>
                <p className="text-xs text-[oklch(0.55_0.02_75)]">{address.zone} · {zone.eta}</p>
              </div>
              <button onClick={() => setStep("address")} className="text-xs text-[oklch(0.50_0.16_145)] font-medium">Edit</button>
            </div>

            {/* Bank transfer details */}
            <div className="bg-white rounded-2xl border border-[oklch(0.92_0.005_75)] p-5 space-y-4">
              <h2 className="text-sm font-semibold text-[oklch(0.15_0.02_75)] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[oklch(0.50_0.16_145)]" /> Pay by Bank Transfer
              </h2>

              <div className="bg-[oklch(0.94_0.04_145)] rounded-xl p-4 space-y-2.5 border border-[oklch(0.85_0.08_145)]">
                <p className="text-xs font-semibold text-[oklch(0.30_0.10_145)] mb-1">Transfer to this account:</p>
                {[
                  { label: "Bank", value: BANK_DETAILS.bank },
                  { label: "Account Name", value: BANK_DETAILS.accountName },
                  { label: "Account Number", value: BANK_DETAILS.accountNumber },
                  { label: "Amount", value: formatNaira(total) },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-[oklch(0.35_0.08_145)]">{row.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[oklch(0.20_0.10_145)]">{row.value}</span>
                      <button onClick={() => { navigator.clipboard.writeText(row.value); toast.success(`${row.label} copied!`); }} className="w-8 h-8 -mr-1 flex items-center justify-center text-[oklch(0.45_0.10_145)] hover:opacity-70 active:scale-90 transition flex-shrink-0">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Proof of payment upload */}
              <div>
                <label className="block text-xs font-medium text-[oklch(0.35_0.02_75)] mb-1.5">Upload proof of payment (optional)</label>
                <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-[oklch(0.85_0.01_75)] bg-[oklch(0.975_0.008_75)] cursor-pointer hover:border-[oklch(0.50_0.16_145)] transition">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProofFile(file);
                        toast.success("Receipt attached");
                      }
                    }}
                  />
                  <Truck className="w-4 h-4 text-[oklch(0.55_0.02_75)]" />
                  <span className="text-xs font-medium text-[oklch(0.45_0.02_75)]">
                    {proofFile ? proofFile.name : "Tap to upload screenshot or receipt"}
                  </span>
                </label>
              </div>

              <p className="text-[11px] text-[oklch(0.50_0.02_75)] leading-relaxed">
                After transferring, click "I've Paid" below. Our team will confirm your payment within 5–15 minutes and start preparing your order.
              </p>
            </div>

            <OrderSummaryCard subtotal={subtotal} deliveryFee={deliveryFee} discount={discount} total={total} eta={zone.eta} />

            {/* Security badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[oklch(0.55_0.02_75)]">
              <ShieldCheck className="w-3.5 h-3.5" /> Manually verified by our team for your safety
            </div>

            <button onClick={handlePay} className="w-full py-3.5 rounded-2xl bg-[oklch(0.50_0.16_145)] text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
              I've Paid — Confirm Order
            </button>
          </>
        )}
      </main>
    </div>
  );
}

function OrderSummaryCard({ subtotal, deliveryFee, discount, total, eta }: { subtotal: number; deliveryFee: number; discount: number; total: number; eta: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[oklch(0.92_0.005_75)] p-4 space-y-2">
      <h3 className="text-xs font-semibold text-[oklch(0.40_0.02_75)] uppercase tracking-wide">Order Summary</h3>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-[oklch(0.40_0.02_75)]"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
        <div className="flex justify-between text-[oklch(0.40_0.02_75)]"><span>Delivery fee</span><span>{formatNaira(deliveryFee)}</span></div>
        {discount > 0 && <div className="flex justify-between text-[oklch(0.50_0.16_145)]"><span>Promo discount</span><span>-{formatNaira(discount)}</span></div>}
        <div className="h-px bg-[oklch(0.92_0.005_75)] my-1" />
        <div className="flex justify-between font-bold text-[oklch(0.15_0.02_75)]"><span>Total</span><span>{formatNaira(total)}</span></div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[oklch(0.55_0.02_75)] pt-1">
        <Clock className="w-3.5 h-3.5" /> Estimated delivery: <strong>{eta}</strong>
      </div>
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="min-h-screen bg-[oklch(0.975_0.008_75)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-[oklch(0.50_0.16_145)] border-t-transparent animate-spin mx-auto" />
        <p className="font-semibold text-[oklch(0.15_0.02_75)]">Submitting your order...</p>
        <p className="text-sm text-[oklch(0.55_0.02_75)]">Please don't close this page</p>
      </div>
    </div>
  );
}

function SuccessScreen({ orderRef, total, eta, onDone }: { orderRef: string; total: number; eta: string; onDone: () => void }) {
  return (
    <div className="min-h-screen bg-[oklch(0.975_0.008_75)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-5">
        <div className="bg-white rounded-3xl border border-[oklch(0.92_0.005_75)] p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[oklch(0.15_0.02_75)]">Order Received!</h1>
            <p className="text-sm text-[oklch(0.55_0.02_75)] mt-1">Awaiting payment confirmation</p>
          </div>

          <div className="bg-[oklch(0.975_0.008_75)] rounded-2xl p-4 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-[oklch(0.55_0.02_75)]">Order reference</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[oklch(0.15_0.02_75)]">{orderRef}</span>
                <button onClick={() => { navigator.clipboard.writeText(orderRef); toast.success("Copied!"); }}>
                  <Copy className="w-3.5 h-3.5 text-[oklch(0.55_0.02_75)]" />
                </button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[oklch(0.55_0.02_75)]">Amount to pay</span>
              <span className="font-bold text-[oklch(0.50_0.16_145)]">{formatNaira(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[oklch(0.55_0.02_75)]">Estimated delivery</span>
              <span className="font-bold text-[oklch(0.15_0.02_75)]">{eta}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 rounded-xl p-3">
            <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <p className="text-xs text-purple-700 text-left">We're confirming your bank transfer. This usually takes 5–15 minutes — we'll notify you once confirmed.</p>
          </div>
        </div>

        <button onClick={onDone} className="w-full py-3.5 rounded-2xl bg-[oklch(0.50_0.16_145)] text-white font-semibold hover:opacity-90 transition">
          Track My Order →
        </button>
      </div>
    </div>
  );
}

function FailedScreen({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  return (
    <div className="min-h-screen bg-[oklch(0.975_0.008_75)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="bg-white rounded-3xl border border-[oklch(0.92_0.005_75)] p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[oklch(0.15_0.02_75)]">Payment Failed</h1>
            <p className="text-sm text-[oklch(0.55_0.02_75)] mt-1">Something went wrong with your payment</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-xs text-red-700 text-left">
            Your card was not charged. Please check your card details or try a different payment method.
          </div>
        </div>
        <button onClick={onRetry} className="w-full py-3.5 rounded-2xl bg-[oklch(0.50_0.16_145)] text-white font-semibold hover:opacity-90 transition">
          Try Again
        </button>
        <button onClick={onHome} className="w-full py-3 text-sm text-[oklch(0.55_0.02_75)] hover:text-[oklch(0.15_0.02_75)] transition">
          Return to Home
        </button>
      </div>
    </div>
  );
}
