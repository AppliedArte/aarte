"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const EASE = [0.19, 1, 0.22, 1] as const;

const PLANS = [
  {
    id: "minimum",
    label: "Minimum Plan",
    badge: "Most Popular",
    price: 79,
    cents: ".99",
    checkoutUrl: "https://whop.com/aarte/aarte-agent/",
    features: [
      "1 AARTE AI Agent",
      "Full API Access",
      "Priority Support",
      "Custom Integrations",
      "Monthly Updates",
      "Cancel Anytime",
    ],
  },
  {
    id: "premium",
    label: "Premium Plan",
    badge: "Best Value",
    price: 159,
    cents: ".99",
    checkoutUrl: "https://whop.com/aarte/aarte-premium/",
    features: [
      "Everything in Minimum",
      "5x More Tokens",
      "24/7 Support",
      "Custom Integrations",
      "Monthly Updates",
      "Cancel Anytime",
    ],
  },
  {
    id: "maximum",
    label: "Maximum Plan",
    badge: "Unlimited",
    price: 199,
    cents: ".99",
    checkoutUrl: "https://whop.com/aarte/aarte-maximum",
    features: [
      "Everything in Premium",
      "Unlimited Tokens",
      "Dedicated Account Manager",
      "Custom Integrations",
      "Monthly Updates",
      "Cancel Anytime",
    ],
  },
] as const;

export default function SignUpPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin?callbackUrl=/signup");
    },
  });

  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number]>(PLANS[0]);
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session?.user?.email) {
      setError("Session error. Please sign in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          telegram: telegram.trim() || null,
          whatsapp: whatsapp.trim() || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save signup info");

      window.location.href = selectedPlan.checkoutUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const navLinkClass = "font-mono text-xs text-white hover:text-white/60 transition-colors uppercase";
  const inputClass = "w-full bg-transparent border border-white/20 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors";
  const labelClass = "block font-mono text-[10px] text-white/40 uppercase mb-2";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="font-mono text-sm text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb700] selection:text-black">
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between">
        <Link href="/" className={navLinkClass}>AARTE</Link>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="font-mono text-xs text-white border border-white px-3 py-2 hover:bg-white hover:text-black transition-colors uppercase">Chat with AARTE</Link>
          <Link href="/" className={navLinkClass}>Back [&larr;]</Link>
        </div>
      </header>

      <main className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="w-full max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
            className="text-center mb-10"
          >
            <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[1.1] mb-4">
              Get AARTE
            </h1>
            <p className="text-white/60 font-mono text-sm">
              Create Your Personal AARTE Agent to Create your Moltbot (Formerly Clawdbot) assistant
            </p>
          </motion.div>

          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
            className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10 max-w-md mx-auto"
          >
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{session?.user?.name}</p>
              <p className="text-white/50 font-mono text-xs truncate">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase"
            >
              Switch
            </button>
          </motion.div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {PLANS.map((plan, planIndex) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <motion.button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + planIndex * 0.1, duration: 0.8, ease: EASE }}
                  className={`border p-8 relative overflow-hidden text-left transition-colors ${
                    isSelected
                      ? "border-white bg-white/5"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className={`absolute top-0 right-0 font-mono text-[10px] uppercase px-3 py-1 ${
                    isSelected ? "bg-white text-black" : "bg-white/20 text-white"
                  }`}>
                    {plan.badge}
                  </div>

                  <div className="mb-6">
                    <h2 className="font-mono text-xs text-white/40 uppercase mb-2">
                      {plan.label}
                    </h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-medium">${plan.price}</span>
                      <span className="text-2xl font-medium text-white/60">{plan.cents}</span>
                      <span className="text-white/40 font-mono text-sm ml-2">/ month</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-6" />

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.5 + planIndex * 0.1 + index * 0.05,
                          duration: 0.5,
                          ease: EASE,
                        }}
                        className="flex items-center gap-3 font-mono text-sm"
                      >
                        <span className="text-white/60">&rarr;</span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.button>
              );
            })}
          </div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleCheckout} className="space-y-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
              >
                <label className={labelClass}>
                  Telegram <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  className={inputClass}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.5, ease: EASE }}
              >
                <label className={labelClass}>
                  WhatsApp <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className={inputClass}
                />
              </motion.div>

              {error && <p className="text-red-400 font-mono text-xs">{error}</p>}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: EASE }}
                className="w-full bg-white text-black font-mono text-sm uppercase py-4 hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Processing..." : `Subscribe — $${selectedPlan.price}${selectedPlan.cents}/mo`}</span>
                {!isSubmitting && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </motion.button>
            </form>

            <p className="text-center text-white/30 font-mono text-[10px] mt-4 uppercase">
              Secure payment via Whop
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
            className="mt-8 text-center"
          >
            <p className="text-white/40 font-mono text-xs">
              Questions?{" "}
              <a
                href="mailto:aarte@aarte.co"
                className="text-white/60 hover:text-white transition-colors underline underline-offset-4"
              >
                Contact Support
              </a>
            </p>
          </motion.div>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-3 px-6">
        <div className="flex items-center justify-between font-mono text-[10px] text-white/30">
          <span>&copy; AARTE &mdash; Applied Artificial Intelligence</span>
          <span>Subscribe</span>
        </div>
      </footer>
    </div>
  );
}
