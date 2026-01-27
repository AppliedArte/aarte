"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

const WHOP_CHECKOUT_URL = "https://whop.com/aarte/aarte-agent/";

const features = [
  "1 AARTE AI Agent",
  "Full API Access",
  "Priority Support",
  "Custom Integrations",
  "Monthly Updates",
  "Cancel Anytime",
];

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store signup data before redirecting to checkout
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          telegram: telegram.trim() || null,
          whatsapp: whatsapp.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save signup info");
      }

      // Redirect to Whop checkout
      window.location.href = WHOP_CHECKOUT_URL;
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb700] selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase"
        >
          AARTE
        </Link>
        <Link
          href="/"
          className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase"
        >
          Back [←]
        </Link>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className="w-full max-w-md"
        >
          {/* Pricing Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="text-center mb-10"
          >
            <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[1.1] mb-4">
              Get AARTE
            </h1>
            <p className="text-white/60 font-mono text-sm">
              Create Your Personal AARTE Agent to Create your Moltbot (Formerly Clawdbot) assistant
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: EASE_OUT_EXPO }}
            className="border border-white/20 p-8 relative overflow-hidden"
          >
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-white text-black font-mono text-[10px] uppercase px-3 py-1">
              Most Popular
            </div>

            {/* Plan Name */}
            <div className="mb-6">
              <h2 className="font-mono text-xs text-white/40 uppercase mb-2">
                Minimum Plan
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-medium">$29</span>
                <span className="text-2xl font-medium text-white/60">.99</span>
                <span className="text-white/40 font-mono text-sm ml-2">
                  / month
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-6" />

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.5,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="flex items-center gap-3 font-mono text-sm"
                >
                  <span className="text-white/60">→</span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-white/10 my-6" />

            {/* Signup Form */}
            <form onSubmit={handleCheckout} className="space-y-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5, ease: EASE_OUT_EXPO }}
              >
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-2">
                  Email <span className="text-white/60">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent border border-white/20 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.5, ease: EASE_OUT_EXPO }}
              >
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-2">
                  Telegram <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: EASE_OUT_EXPO }}
              >
                <label className="block font-mono text-[10px] text-white/40 uppercase mb-2">
                  WhatsApp <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                />
              </motion.div>

              {error && (
                <p className="text-red-400 font-mono text-xs">{error}</p>
              )}

              {/* CTA Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.5, ease: EASE_OUT_EXPO }}
                className="w-full bg-white text-black font-mono text-sm uppercase py-4 hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Processing..." : "Subscribe Now"}</span>
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

            {/* Secure Payment Note */}
            <p className="text-center text-white/30 font-mono text-[10px] mt-4 uppercase">
              Secure payment via Whop
            </p>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: EASE_OUT_EXPO }}
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

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-3 px-6">
        <div className="flex items-center justify-between font-mono text-[10px] text-white/30">
          <span>© AARTE — Applied Artificial Intelligence</span>
          <span>Subscribe</span>
        </div>
      </footer>
    </div>
  );
}
