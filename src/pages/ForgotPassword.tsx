import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); toast.success(`OTP sent to ${email}`); }, 1200);
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter the full 6-digit OTP"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("reset"); }, 1000);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("done"); }, 1200);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.975_0.008_75)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/login">
            <button className="w-9 h-9 rounded-xl border border-[oklch(0.88_0.01_75)] flex items-center justify-center hover:bg-white transition">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/rawafri-logo.png" alt="RawAfri" className="h-6 w-auto" />
            <span className="text-[oklch(0.50_0.16_145)] text-lg font-medium">RawAfri</span>
          </div>
        </div>

        {step === "email" && (
          <>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[oklch(0.94_0.04_145)] flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[oklch(0.50_0.16_145)]" />
              </div>
              <h1 className="text-2xl font-medium text-[oklch(0.15_0.02_75)]">Forgot password?</h1>
              <p className="text-sm text-[oklch(0.50_0.02_75)] mt-1">Enter your email and we'll send you a reset code.</p>
            </div>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[oklch(0.25_0.02_75)] mb-1.5">Email address</label>
                <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] transition" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-[oklch(0.50_0.16_145)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Sending...</> : "Send Reset Code"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-[oklch(0.15_0.02_75)]">Enter OTP</h1>
              <p className="text-sm text-[oklch(0.50_0.02_75)] mt-1">We sent a 6-digit code to <strong>{email}</strong></p>
            </div>
            <div className="flex gap-2 mb-6">
              {otp.map((d, i) => (
                <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => e.key === "Backspace" && !otp[i] && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
                  className="flex-1 h-12 rounded-xl border border-[oklch(0.88_0.01_75)] bg-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] transition" />
              ))}
            </div>
            <button onClick={handleVerifyOtp} disabled={loading} className="w-full py-2.5 rounded-xl bg-[oklch(0.50_0.16_145)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button onClick={() => { toast.success("Code resent!"); }} className="w-full mt-3 text-sm text-[oklch(0.50_0.02_75)] hover:text-[oklch(0.50_0.16_145)] transition">
              Didn't receive it? Resend code
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-[oklch(0.15_0.02_75)]">New password</h1>
              <p className="text-sm text-[oklch(0.50_0.02_75)] mt-1">Choose a strong password for your account.</p>
            </div>
            <form onSubmit={handleReset} className="space-y-4">
              {[
                { label: "New password", key: "password", val: password, set: setPassword },
                { label: "Confirm password", key: "confirm", val: confirm, set: setConfirm },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-[oklch(0.25_0.02_75)] mb-1.5">{f.label}</label>
                  <input type="password" required placeholder="••••••••" value={f.val} onChange={e => f.set(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[oklch(0.88_0.01_75)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.50_0.16_145)] transition" />
                </div>
              ))}
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-[oklch(0.50_0.16_145)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.94_0.04_145)] flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-[oklch(0.50_0.16_145)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[oklch(0.15_0.02_75)]">Password Reset!</h1>
              <p className="text-sm text-[oklch(0.50_0.02_75)] mt-1">Your password has been updated successfully.</p>
            </div>
            <Link href="/login">
              <button className="w-full py-2.5 rounded-xl bg-[oklch(0.50_0.16_145)] text-white text-sm font-medium hover:opacity-90 transition">
                Back to Login
              </button>
            </Link>
          </div>
        )}

        {step !== "done" && (
          <p className="text-center text-sm text-[oklch(0.50_0.02_75)] mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-[oklch(0.50_0.16_145)] font-medium hover:underline">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
