"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { EASE_OUT_EXPO } from "@/lib/constants";
import { BarcodeSVG } from "@/components/ui";
import { FadeIn } from "@/components/animations";

const PLANS = [
  {
    id: "minimum",
    num: "01",
    label: "Minimum",
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
    num: "02",
    label: "Premium",
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
    num: "03",
    label: "Maximum",
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb700] selection:text-black">
      {/* Header — matches main site */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between mix-blend-difference">
        <Link href="/" className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center">
          AARTE
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/chat" className="font-mono text-xs text-black bg-white px-3 sm:px-4 py-2 hover:bg-white/90 transition-colors uppercase min-h-[44px] flex items-center">
            Chat with AARTE
          </Link>
          <Link href="/" className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center">
            Back [&larr;]
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Chapter header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-12 sm:mb-16"
          >
            <span className="font-mono text-xs text-white/40">03</span>
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-mono text-xs text-white/40">get started</span>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-8 sm:gap-12">
            {/* Left — Title */}
            <div className="md:col-span-7">
              <motion.h1
                className="text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: EASE_OUT_EXPO }}
              >
                <span className="block">Get</span>
                <span className="block">AARTE</span>
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
              >
                Create your personal Moltbot AI assistant. Select a plan, connect your channels, and start automating.
              </motion.p>
            </div>

            {/* Right — User + Barcode */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE_OUT_EXPO }}
              >
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-3">Signed in as</div>
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  {session?.user?.image && (
                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                    <p className="text-white/40 font-mono text-[10px] truncate">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="font-mono text-[10px] text-white/30 hover:text-white transition-colors uppercase min-h-[44px] flex items-center"
                  >
                    Switch
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="hidden md:block mt-auto pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <BarcodeSVG className="h-16 w-auto text-white/10" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-8">Select your plan</div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-px bg-white/10 mb-16">
            {PLANS.map((plan, i) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <FadeIn key={plan.id} delay={i * 0.1}>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full text-left p-6 sm:p-8 transition-colors relative ${
                      isSelected ? "bg-white/6" : "bg-[#0a0a0a] hover:bg-white/3"
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-6 sm:top-8 right-6 sm:right-8 w-2 h-2 rounded-full bg-white" />
                    )}

                    {/* Plan number + badge */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-xs text-white/30">{plan.num}</span>
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{plan.badge}</span>
                    </div>

                    {/* Plan name */}
                    <h3 className="text-2xl sm:text-3xl font-medium leading-[1.1] tracking-[-0.02em] mb-4">
                      {plan.label}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.03em]">
                        ${plan.price}
                      </span>
                      <span className="text-xl font-medium text-white/50">{plan.cents}</span>
                      <span className="text-white/30 font-mono text-xs ml-2">/ mo</span>
                    </div>

                    {/* Features */}
                    <div className="space-y-0">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center py-2 border-t border-white/6">
                          <span className="font-mono text-xs text-white/50">{feature}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/6" />
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>

          {/* Checkout form */}
          <FadeIn delay={0.3}>
            <div className="max-w-lg mx-auto">
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mb-6">Contact details</div>

              <form onSubmit={handleCheckout}>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-2">
                      Telegram <span className="text-white/20">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full bg-transparent border-b border-white/20 px-0 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-2">
                      WhatsApp <span className="text-white/20">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full bg-transparent border-b border-white/20 px-0 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/50 transition-colors"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 font-mono text-[10px] uppercase tracking-wider mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-mono text-sm text-black bg-white px-6 py-3 hover:bg-white/90 transition-colors uppercase min-h-[44px] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : `Subscribe — $${selectedPlan.price}${selectedPlan.cents}/mo`}
                  {!isSubmitting && <span>&rarr;</span>}
                </button>

                <div className="flex items-center gap-4 mt-4">
                  <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">Secure payment via Whop</span>
                  <div className="flex-1 h-px bg-white/6" />
                  <a href="mailto:aarte@aarte.co" className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider min-h-[44px] flex items-center">
                    Contact Support
                  </a>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Corner brackets — decorative */}
      <div className="fixed inset-0 pointer-events-none z-30" aria-hidden="true">
        <svg className="absolute bottom-16 left-4 sm:left-6 w-3 h-3 text-white/20" viewBox="0 0 14 14" fill="none">
          <rect y="13" width="14" height="1" fill="currentColor" />
          <rect width="1" height="14" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-16 right-4 sm:right-6 w-3 h-3 text-white/20" viewBox="0 0 14 14" fill="none">
          <rect y="13" width="14" height="1" fill="currentColor" />
          <rect x="13" width="1" height="14" fill="currentColor" />
        </svg>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-2 px-4 sm:px-6">
        <div className="flex items-center justify-between font-mono text-[10px] text-white/30">
          <span>&copy; AARTE &mdash; Applied Artificial Intelligence</span>
          <span>// get-started.loaded</span>
        </div>
      </footer>
    </div>
  );
}
