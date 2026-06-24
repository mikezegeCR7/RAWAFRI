import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CheckCircle, Truck, Wallet, ShieldCheck } from "lucide-react";

export default function Signup() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.975_0.008_75)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-[oklch(0.50_0.16_145)] p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 left-12 w-56 h-56 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5">
              <img src="/rawafri-logo.png" alt="RawAfri" className="w-full h-full object-contain" />
            </div>
            <span className="text-white text-2xl font-medium tracking-tight">RawAfri</span>
          </div>
          <p className="text-white/60 text-sm ml-[52px]">Nigeria's raw foodstuff marketplace</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-3xl font-medium leading-snug">
            Order raw foodstuff the easy way.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Whether you're a home cook or a restaurant owner — RawAfri connects you directly to the source.
          </p>

          <div className="space-y-3">
            {[
              { Icon: CheckCircle, text: "Quality guaranteed on every order" },
              { Icon: Truck, text: "Same-day delivery across Lagos & Abuja" },
              { Icon: Wallet, text: "Real wholesale market prices" },
              { Icon: ShieldCheck, text: "Secure payment via bank transfer" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <item.Icon className="w-4 h-4 text-white/90 flex-shrink-0" />
                <span className="text-white/80 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/rawafri-logo.png" alt="RawAfri" className="h-8 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-medium text-[oklch(0.15_0.02_75)] mb-1">Create your account</h1>
            <p className="text-sm text-[oklch(0.50_0.02_75)]">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[oklch(0.25_0.02_75)] mb-1.5">Full name</label>
              <input
                type="text"
                required
                placeholder="Adaeze Okonkwo"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] bg-white text-sm text-[oklch(0.15_0.02_75)] placeholder:text-[oklch(0.65_0.01_75)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.25_0.02_75)] mb-1.5">Email address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] bg-white text-sm text-[oklch(0.15_0.02_75)] placeholder:text-[oklch(0.65_0.01_75)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.25_0.02_75)] mb-1.5">Phone number</label>
              <input
                type="tel"
                required
                placeholder="08012345678"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] bg-white text-sm text-[oklch(0.15_0.02_75)] placeholder:text-[oklch(0.65_0.01_75)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.25_0.02_75)] mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] bg-white text-sm text-[oklch(0.15_0.02_75)] placeholder:text-[oklch(0.65_0.01_75)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] focus:border-transparent transition"
              />
            </div>

            <p className="text-xs text-[oklch(0.55_0.02_75)]">
              By creating an account you agree to our{" "}
              <a href="#" className="text-[oklch(0.50_0.16_145)] hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-[oklch(0.50_0.16_145)] hover:underline">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[oklch(0.50_0.16_145)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-[oklch(0.50_0.02_75)] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[oklch(0.50_0.16_145)] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
