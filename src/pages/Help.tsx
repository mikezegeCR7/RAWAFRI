import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Send, Sparkles, Phone, MessageCircle, Package, CreditCard, Truck, RotateCcw } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

type View = "categories" | "chat";

const QUICK_PROMPTS = [
  { icon: Package, label: "Track my order" },
  { icon: CreditCard, label: "Payment & bank transfer help" },
  { icon: Truck, label: "Delivery times & areas" },
  { icon: RotateCcw, label: "Report an issue with my order" },
];

const nowTime = () => new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm RawAfri's support assistant. Ask me anything about your order, delivery, or payments.",
  time: nowTime(),
};

// Placeholder response engine — swap this for a real backend AI call later.
function getPlaceholderReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("track") || q.includes("order") || q.includes("status")) {
    return "You can track your order anytime from the Orders page — it shows live status from order received through to delivery. Once a delivery arrives, you'll be asked to confirm receipt there too. Want me to take you to your orders?";
  }
  if (q.includes("bank") || q.includes("transfer") || q.includes("pay") || q.includes("payment")) {
    return "We currently accept bank transfer only. After checkout, you'll see our account details to transfer to, with an option to upload your payment proof. Our team usually confirms transfers within 5–15 minutes during business hours.";
  }
  if (q.includes("deliver") || q.includes("time") || q.includes("area") || q.includes("location")) {
    return "Delivery typically takes 60–90 minutes within Lagos and Abuja, depending on your location and order size. You'll see an estimated delivery time at checkout before you confirm your order.";
  }
  if (q.includes("issue") || q.includes("problem") || q.includes("wrong") || q.includes("missing") || q.includes("damage")) {
    return "Sorry to hear that. You can report a delivery issue directly from the Orders page on any order awaiting confirmation — just tap 'Report Issue' and describe what happened. Our team will follow up with you quickly.";
  }
  return "Thanks for reaching out! I can help with order tracking, payments, delivery, or reporting an issue. For anything urgent or order-specific, our team is also reachable directly on the contact line below.";
}

export default function Help() {
  const [, navigate] = useLocation();
  const [view, setView] = useState<View>("categories");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (view === "categories") setView("chat");

    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", content: trimmed, time: nowTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    // Placeholder delay — replace with real AI backend call.
    setTimeout(() => {
      const reply: Message = {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: getPlaceholderReply(trimmed),
        time: nowTime(),
      };
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
    }, 900);
  };

  const handleBack = () => {
    if (view === "chat") {
      // Step back into the help center instead of leaving the page
      setView("categories");
      setMessages([WELCOME_MESSAGE]);
      setThinking(false);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="size-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors"
            aria-label={view === "chat" ? "Back to help center" : "Go back"}
          >
            <ArrowLeft className="size-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="size-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="size-4 text-brand" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-foreground text-sm leading-tight truncate">
                {view === "chat" ? "RawAfri Support" : "Help Center"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {view === "chat" ? "Usually replies instantly" : "How can we help you today?"}
              </p>
            </div>
          </div>
          <a
            href="tel:+2348001234567"
            className="size-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors flex-shrink-0"
            aria-label="Call support"
          >
            <Phone className="size-4 text-brand" />
          </a>
        </div>
      </header>

      {view === "categories" ? (
        /* Categories view */
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
            <div className="bg-card ring-1 ring-border rounded-2xl p-5 flex items-start gap-3">
              <div className="size-9 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="size-4 text-brand" />
              </div>
              <p className="text-sm text-foreground leading-relaxed pt-1.5">
                Hi! I'm RawAfri's support assistant. Pick a topic below, or type your own question to get started.
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2.5 px-1">Common topics</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.label)}
                    className="flex items-center gap-2.5 bg-card ring-1 ring-border rounded-xl px-3.5 py-3 text-left text-sm font-medium text-foreground hover:ring-brand/40 hover:bg-accent active:scale-[0.98] transition"
                  >
                    <q.icon className="size-4 text-brand flex-shrink-0" />
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* Chat view */
        <main ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="size-7 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mb-1">
                      <Sparkles className="size-3.5 text-brand" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-brand text-brand-foreground rounded-br-md"
                          : "bg-card ring-1 ring-border text-foreground rounded-bl-md"
                      }`}
                    >
                      {m.content}
                    </div>
                    <p className={`text-[10px] text-muted-foreground mt-1 ${m.role === "user" ? "text-right" : ""}`}>{m.time}</p>
                  </div>
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="size-7 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="size-3.5 text-brand" />
                  </div>
                  <div className="bg-card ring-1 ring-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Composer */}
      <div className="sticky bottom-0 bg-surface/95 backdrop-blur-md border-t border-border">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-center gap-2 bg-card ring-1 ring-border rounded-2xl p-1.5 pl-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your order, delivery, or payment..."
              className="flex-1 min-w-0 bg-transparent text-sm py-2 focus:outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="size-10 rounded-xl bg-brand text-brand-foreground flex items-center justify-center hover:opacity-90 active:scale-90 transition disabled:opacity-40 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </button>
          </form>
          <p className="text-center text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <MessageCircle className="size-3" /> Need urgent help? Call us anytime at +234 800 123 4567
          </p>
        </div>
      </div>
    </div>
  );
}
