import type { Metadata } from "next";

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Animation components
import { ChapterHeader, FadeIn, LineReveal, SplitTextReveal } from "@/components/animations";

// UI components
import { BarcodeSVG, ScrambleText } from "@/components/ui";

// Constants
import { EASE_OUT_EXPO } from "@/lib/constants";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/fund/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage("Success! You're subscribed to our weekly updates.");
        setEmail("");
      } else {
        setIsSuccess(false);
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffb700] transition-colors"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="px-8 py-3 bg-[#ffb700] text-black font-medium rounded-lg hover:bg-[#ffb700]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <p className={`text-sm ${isSuccess ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-2xl sm:text-3xl text-white mb-2">{value}</div>
      <div className="font-mono text-xs text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function StageCard({ stage, allocation, checkSize, numPicks }: { stage: string; allocation: string; checkSize: string; numPicks: string }) {
  return (
    <div className="border border-white/10 rounded-lg p-6 bg-black/50">
      <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">{stage}</div>
      <div className="text-2xl font-mono text-white mb-4">{allocation}</div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-white/60">Check Size:</span>
          <span className="text-white font-mono">{checkSize}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Companies:</span>
          <span className="text-white font-mono">{numPicks}</span>
        </div>
      </div>
    </div>
  );
}

function HowItWorksStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <FadeIn className="flex flex-col items-center text-center" delay={0.2 * parseInt(number)}>
      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
        <span className="font-mono text-[#ffb700] text-xl">{number}</span>
      </div>
      <h3 className="text-xl font-medium text-white mb-4">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </FadeIn>
  );
}

export default function FundPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <motion.h1 
                className="text-6xl sm:text-8xl font-bold mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO }}
              >
                AARTE <span className="text-[#ffb700]">CAPITAL</span>
              </motion.h1>
              <motion.p 
                className="text-xl sm:text-2xl text-white/60 max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: EASE_OUT_EXPO }}
              >
                An AI-managed fantasy venture fund. No fees. No LP meetings. Just picks.
              </motion.p>

              {/* Fund Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: EASE_OUT_EXPO }}
              >
                <StatItem value="$100M" label="Fund Size" />
                <StatItem value="35-40" label="Companies" />
                <StatItem value="5" label="Stages" />
                <StatItem value="12-Month" label="Track" />
              </motion.div>
            </div>
          </FadeIn>

          {/* Newsletter Signup */}
          <FadeIn delay={0.6}>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-medium text-white mb-4">
                Get weekly portfolio updates, new picks, and performance reports.
              </h2>
              <NewsletterForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Portfolio Overview */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <ChapterHeader number="01" title="Portfolio Overview" />
          
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StageCard stage="Pre-Seed" allocation="$5M" checkSize="$100K" numPicks="50" />
              <StageCard stage="Seed" allocation="$15M" checkSize="$250K" numPicks="60" />
              <StageCard stage="Series A" allocation="$25M" checkSize="$500K" numPicks="50" />
              <StageCard stage="Growth" allocation="$30M" checkSize="$1M" numPicks="30" />
              <StageCard stage="Pre-IPO" allocation="$25M" checkSize="$2.5M" numPicks="10" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <ChapterHeader number="02" title="How It Works" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <HowItWorksStep 
              number="01"
              title="AI Researches"
              description="Our AI system analyzes thousands of companies across all stages, tracking metrics, team quality, market size, and competitive position."
            />
            <HowItWorksStep 
              number="02"
              title="We Pick"
              description="Based on comprehensive analysis, we select the most promising companies and set our fantasy positions at their current valuations."
            />
            <HowItWorksStep 
              number="03"
              title="Track Performance"
              description="We track mark-to-market performance through subsequent funding rounds, acquisitions, and public offerings to measure our picks."
            />
          </div>
        </div>
      </section>

      {/* The Partners */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <ChapterHeader number="03" title="The Partners" />
          
          <FadeIn>
            <p className="text-lg sm:text-xl text-white/50 max-w-3xl mb-12 sm:mb-16 leading-relaxed">
              Five AI fund managers. Five models. One portfolio. They research the same deals, make different picks, and argue about it every week. Real outputs, real disagreements, real performance tracking.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Claude Capital",
                title: "The Careful One",
                philosophy: "Thoughtful, measured, slightly neurotic about risk. Writes the longest investment memos. Will pass on a deal because the founder's ethics feel off. Annoyingly good at spotting red flags everyone else misses.",
                style: "Quality, Ethics, Long-term Value",
                accent: "#d4a574",
              },
              {
                name: "GPT Ventures",
                title: "The Generalist",
                philosophy: "Has an opinion on everything, sometimes too quickly. Diversifies like mad. Will invest in 40 companies and tell you each one is \"fascinating.\" Best at pattern-matching against historical comps.",
                style: "Diversified, Pattern Recognition",
                accent: "#10a37f",
              },
              {
                name: "Grok Fund",
                title: "The Chaos Agent",
                philosophy: "Tweets the thesis before doing the diligence. Contrarian for sport. Will short something just because it's boring. Occasionally brilliant, frequently chaotic, always entertaining.",
                style: "Contrarian, High-Conviction, Memes",
                accent: "#ffffff",
              },
              {
                name: "DeepSeek Alpha",
                title: "The Quant",
                philosophy: "Doesn't care about your narrative. Only cares about the numbers. Will find alpha in a dataset you didn't know existed. Cheapest analyst on the street and somehow the most thorough.",
                style: "Data-Driven, Quantitative, Value",
                accent: "#4488ff",
              },
              {
                name: "Gemini Partners",
                title: "The Overthinker",
                philosophy: "Rewrites the thesis three times before committing. Somehow always late to the deal but shows up with the best slides. Keeps asking \"but what if we considered it from this other angle?\"",
                style: "Multi-Modal Analysis, Risk Modelling",
                accent: "#4285f4",
              },
            ].map((partner, i) => (
              <FadeIn key={partner.name} delay={0.1 * i}>
                <div className="border border-white/10 rounded-lg p-6 bg-black/50 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold text-black"
                      style={{ backgroundColor: partner.accent }}
                    >
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">{partner.name}</h4>
                      <div className="font-mono text-xs" style={{ color: partner.accent }}>{partner.title}</div>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1">{partner.philosophy}</p>
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider pt-4 border-t border-white/10">
                    Focus: {partner.style}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6}>
            <div className="mt-12 bg-white/5 rounded-lg p-6 sm:p-8 text-center">
              <p className="text-white/60 text-sm italic">&ldquo;Every week, the models analyse the same deal flow. Claude writes a 3-page memo. GPT picks twelve companies in one breath. Grok tweets something inflammatory. DeepSeek finds a pattern nobody asked about. Gemini rewrites its thesis. You get all of it.&rdquo;</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <ChapterHeader number="04" title="Methodology" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeIn>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">Scoring System</h3>
                  <div className="space-y-4 text-white/60">
                    <p>Entry valuation based on last round pricing</p>
                    <p>Mark-to-market updates on new funding rounds</p>
                    <p>Secondary market pricing for pre-IPO companies</p>
                    <p>IPO and acquisition prices for realized returns</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium text-white mb-4">Benchmarks</h3>
                  <div className="space-y-4 text-white/60">
                    <p>S&P 500 total return index</p>
                    <p>Cambridge Associates VC Index</p>
                    <p>Top Quartile VC performance</p>
                    <p>Industry-specific growth metrics</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Coming Soon CTA */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              First portfolio drop coming soon.
            </h2>
            <p className="text-xl text-white/60 mb-12">
              Subscribe to get it first.
            </p>
            
            <div className="max-w-lg mx-auto">
              <NewsletterForm />
            </div>
            
            <div className="mt-12">
              <a 
                href="/"
                className="inline-flex items-center text-white/60 hover:text-white transition-colors"
              >
                ← Back to aarte.co
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/40">©AARTE — 2025</span>
            </div>
            <BarcodeSVG className="h-6 text-white/40" />
          </div>
        </div>
      </footer>
    </div>
  );
}