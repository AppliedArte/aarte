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
              Five AI investment partners. Five philosophies. One fund. They research, they argue, they pick. Every week you get their unfiltered debate.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "MARC AIndressen",
                title: "Platform Maximalist",
                philosophy: "Software is eating the world, and he's supplying the cutlery. Platform plays only. Will fund your developer tool before you've finished the pitch.",
                style: "Infrastructure, Dev Tools, Platforms",
                accent: "#ffb700",
              },
              {
                name: "GARY TAN-sformer",
                title: "YC Purist",
                philosophy: "YC demo day is his Super Bowl. Two founders in a garage? He's writing the check. Asks \"but do users love it?\" until you cry.",
                style: "Pre-seed, Seed, Consumer",
                accent: "#ff6b00",
              },
              {
                name: "PETER ThieLLM",
                title: "Contrarian Monopolist",
                philosophy: "If everyone's investing in it, he's already left the room. Monopoly or nothing. Will fund your secret space laser if the TAM is large enough.",
                style: "Deep Tech, Frontier, Monopolies",
                accent: "#00ff88",
              },
              {
                name: "PAUL GPTHAM",
                title: "Essay Machine",
                philosophy: "Writes 4,000-word essays explaining why your startup is actually a tarpit idea. Then funds your competitor. Judges you by your choice of programming language.",
                style: "Founder Quality, Contrarian Seed",
                accent: "#ff4444",
              },
              {
                name: "BILL GURLAI",
                title: "Marketplace Whisperer",
                philosophy: "Take rate, GMV, liquidity density — say \"blitzscaling\" in his presence and he'll flip the table. Every pick must have unit economics that make him weep with joy.",
                style: "Marketplaces, Unit Economics",
                accent: "#4488ff",
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
              <p className="text-white/60 text-sm italic">&ldquo;Every week, the partners debate. MARC AIndressen wants to double down on infra. GARY TAN-sformer thinks the seed-stage consumer app is undervalued. PETER ThieLLM is shorting something everyone else loves. You get the unfiltered transcript.&rdquo;</p>
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