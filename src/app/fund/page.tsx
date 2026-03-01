"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChapterHeader, FadeIn, LineReveal, SplitTextReveal } from "@/components/animations";
import { BarcodeSVG } from "@/components/ui";
import { EASE_OUT_EXPO } from "@/lib/constants";

const PARTNERS = [
  {
    name: "MARC AIndressen",
    title: "Platform Maximalist",
    philosophy: "Software is eating the world, and he\u2019s supplying the cutlery. Platform plays only. Will fund your developer tool before you\u2019ve finished the pitch.",
    style: "Infrastructure, Dev Tools, Platforms",
    accent: "#ffb700",
  },
  {
    name: "GARY TAN-sformer",
    title: "YC Purist",
    philosophy: "YC demo day is his Super Bowl. Two founders in a garage? He\u2019s writing the check. Asks \u201Cbut do users love it?\u201D until you cry.",
    style: "Pre-seed, Seed, Consumer",
    accent: "#ff6b00",
  },
  {
    name: "PETER ThieLLM",
    title: "Contrarian Monopolist",
    philosophy: "If everyone\u2019s investing in it, he\u2019s already left the room. Monopoly or nothing. Will fund your secret space laser if the TAM is large enough.",
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
    philosophy: "Take rate, GMV, liquidity density \u2014 say \u201Cblitzscaling\u201D in his presence and he\u2019ll flip the table. Every pick must have unit economics that make him weep with joy.",
    style: "Marketplaces, Unit Economics",
    accent: "#4488ff",
  },
] as const;

const STAGES = [
  { num: "01", stage: "Pre-Seed", allocation: "$5M", checkSize: "$100K", companies: "50" },
  { num: "02", stage: "Seed", allocation: "$15M", checkSize: "$250K", companies: "60" },
  { num: "03", stage: "Series A", allocation: "$25M", checkSize: "$500K", companies: "50" },
  { num: "04", stage: "Growth", allocation: "$30M", checkSize: "$1M", companies: "30" },
  { num: "05", stage: "Pre-IPO", allocation: "$25M", checkSize: "$2.5M", companies: "10" },
] as const;

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/fund/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isSubmitting}
          className="flex-1 bg-transparent border-b border-white/20 px-0 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ffb700]/50 transition-colors"
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="font-mono text-sm text-black bg-[#ffb700] px-6 py-3 hover:bg-[#ffb700]/90 transition-colors uppercase min-h-[44px] flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "success" && (
        <p className="font-mono text-[10px] text-[#ffb700] uppercase tracking-wider mt-3">You&apos;re in. First update drops soon.</p>
      )}
      {status === "error" && (
        <p className="font-mono text-[10px] text-red-400 uppercase tracking-wider mt-3">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

export default function FundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb700] selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between mix-blend-difference">
        <Link href="/" className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center">
          AARTE
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/signup" className="font-mono text-xs text-black bg-white px-3 sm:px-4 py-2 hover:bg-white/90 transition-colors uppercase min-h-[44px] flex items-center">
            Get Started
          </Link>
          <Link href="/" className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center">
            Back [&larr;]
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-12 sm:mb-16"
          >
            <span className="font-mono text-xs text-white/40">2.5</span>
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-mono text-xs text-white/40">aarte capital</span>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-8 sm:gap-12">
            <div className="md:col-span-7">
              <motion.h1
                className="text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: EASE_OUT_EXPO }}
              >
                <span className="block">Fantasy</span>
                <span className="block text-[#ffb700]">Venture</span>
                <span className="block text-[#ffb700]">Capital</span>
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
              >
                An AI-managed $100M fantasy venture fund. Five AI partners with wildly different investment philosophies research, argue, and pick startups.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT_EXPO }}
                className="max-w-md"
              >
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-3">Get weekly portfolio updates</div>
                <NewsletterForm />
              </motion.div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-between">
              <motion.div
                className="grid grid-cols-2 gap-px bg-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE_OUT_EXPO }}
              >
                {[
                  { value: "$100M", label: "Fund Size" },
                  { value: "35-40", label: "Companies" },
                  { value: "5", label: "AI Partners" },
                  { value: "12mo", label: "Track Period" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#0a0a0a] p-5">
                    <div className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] mb-1">{stat.value}</div>
                    <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
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

      {/* Sample Portfolio */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="01" title="sample portfolio" />

          <div className="grid md:grid-cols-12 gap-8 sm:gap-12 mb-16">
            <div className="md:col-span-5">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 overflow-hidden">
                <SplitTextReveal text="If We Picked" className="block" />
                <SplitTextReveal text="Today..." className="block" delay={0.15} />
              </h3>
              <FadeIn delay={0.2}>
                <p className="text-white/50 leading-relaxed">Five AI partners have analyzed 2,400+ companies this year. Here are the picks if we deployed capital today.</p>
              </FadeIn>
            </div>
            <div className="md:col-span-7">
              <FadeIn delay={0.3}>
                <div className="space-y-3">
                  {[
                    { name: "Arcade", stage: "Seed", check: "$250K", sector: "Dev Tools", partner: "MARC" },
                    { name: "Ponder", stage: "Series A", check: "$500K", sector: "AI Infrastructure", partner: "PETER" },
                    { name: "Milo", stage: "Pre-Seed", check: "$100K", sector: "Consumer", partner: "GARY" },
                    { name: "Synth", stage: "Seed", check: "$250K", sector: "Deep Tech", partner: "PETER" },
                    { name: "Flow", stage: "Series A", check: "$500K", sector: "Marketplace", partner: "BILL" },
                    { name: "Hype", stage: "Pre-Seed", check: "$100K", sector: "Consumer", partner: "PAUL" },
                    { name: "Cipher", stage: "Growth", check: "$1M", sector: "Infrastructure", partner: "MARC" },
                    { name: "Bloom", stage: "Seed", check: "$250K", sector: "Climate", partner: "GARY" },
                  ].map((co, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 items-center border border-white/10 p-4 hover:border-[#ffb700]/30 transition-colors group">
                      <div className="col-span-4">
                        <span className="text-white font-medium">{co.name}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-mono text-xs text-white/40">{co.stage}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-mono text-xs text-[#ffb700]">{co.check}</span>
                      </div>
                      <div className="col-span-3">
                        <span className="font-mono text-xs text-white/30">{co.sector}</span>
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="font-mono text-xs text-white/20 group-hover:text-white/40 transition-colors">{co.partner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Allocation */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="03" title="portfolio allocation" />

          <div className="grid md:grid-cols-12 gap-8 sm:gap-12 mb-16">
            <div className="md:col-span-5">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 overflow-hidden">
                <SplitTextReveal text="Five Stages," className="block" />
                <SplitTextReveal text="One Fund" className="block" delay={0.3} />
              </h3>
              <FadeIn delay={0.2}>
                <p className="text-white/50 leading-relaxed">Performance tracked publicly over 12 months against the S&amp;P 500 and top-quartile VC benchmarks. No fees. No LP meetings. Just picks.</p>
              </FadeIn>
            </div>
            <div className="md:col-span-7">
              <FadeIn delay={0.3}>
                <div className="border border-white/10">
                  <div className="grid grid-cols-5 gap-0 border-b border-white/10 px-4 sm:px-6 py-3">
                    {["", "Stage", "Allocation", "Check Size", "Cos."].map((h) => (
                      <div key={h} className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{h}</div>
                    ))}
                  </div>
                  {STAGES.map((s) => (
                    <div key={s.num} className="grid grid-cols-5 gap-0 border-b border-white/6 px-4 sm:px-6 py-4 hover:bg-white/3 transition-colors">
                      <div className="font-mono text-xs text-white/30">{s.num}</div>
                      <div className="font-mono text-sm text-white">{s.stage}</div>
                      <div className="font-mono text-sm text-white">{s.allocation}</div>
                      <div className="font-mono text-sm text-white/60">{s.checkSize}</div>
                      <div className="font-mono text-sm text-white/60">{s.companies}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="04" title="how it works" />

          <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 overflow-hidden">
                <SplitTextReveal text="Research." className="block" />
                <SplitTextReveal text="Argue." className="block" delay={0.15} />
                <SplitTextReveal text="Pick." className="block" delay={0.3} />
              </h3>
              <FadeIn delay={0.2}>
                <p className="text-lg sm:text-xl text-white/50 leading-relaxed">Five AI partners analyze thousands of companies, debate in real-time, and make investment decisions based on fundamentals, not hype.</p>
              </FadeIn>
            </div>
            <div className="space-y-6">
              {[
                { num: "01", title: "AI Researches", desc: "Analyzes thousands of companies across all stages \u2014 metrics, team quality, market size, competitive position." },
                { num: "02", title: "Partners Debate", desc: "Five AI partners with opposing philosophies argue the merits. Every pick has a champion and a skeptic." },
                { num: "03", title: "Track Performance", desc: "Mark-to-market through funding rounds, acquisitions, and IPOs. Benchmarked against S&P 500 and top-quartile VC." },
              ].map((step, i) => (
                <FadeIn key={step.num} delay={0.3 + i * 0.1}>
                  <div className="border border-white/10 p-6">
                    <div className="text-[#ffb700] font-mono text-sm mb-2">{step.num}</div>
                    <h4 className="text-lg font-medium mb-2">{step.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Partners */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="05" title="the partners" />

          <h3 className="text-[clamp(2rem,6vw,4rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8">
            <LineReveal>Five Minds,</LineReveal>
            <LineReveal delay={0.15}>One Fund</LineReveal>
          </h3>
          <FadeIn delay={0.1}>
            <p className="text-lg sm:text-xl text-white/50 max-w-3xl mb-12 sm:mb-16 leading-relaxed">Every week, the partners debate. You get the unfiltered transcript.</p>
          </FadeIn>

          <div className="space-y-0">
            {PARTNERS.map((partner, i) => (
              <FadeIn key={partner.name} delay={0.1 * i}>
                <div className="flex items-start gap-4 sm:gap-6 py-6 border-t border-white/10">
                  <div
                    className="w-10 h-10 shrink-0 flex items-center justify-center font-mono text-sm font-bold text-black"
                    style={{ backgroundColor: partner.accent }}
                  >
                    {partner.name.charAt(0)}
                  </div>
                  <div className="flex-1 grid sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-3">
                      <h4 className="text-lg font-medium">{partner.name}</h4>
                      <div className="font-mono text-xs mt-1" style={{ color: partner.accent }}>{partner.title}</div>
                    </div>
                    <div className="sm:col-span-6">
                      <p className="text-white/50 text-sm leading-relaxed">{partner.philosophy}</p>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider">Focus</div>
                      <div className="font-mono text-xs text-white/50 mt-1">{partner.style}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="06" title="methodology" />

          <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
            <FadeIn>
              <div>
                <h4 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-6">Scoring System</h4>
                {[
                  "Entry valuation based on last round pricing",
                  "Mark-to-market updates on new funding rounds",
                  "Secondary market pricing for pre-IPO companies",
                  "IPO and acquisition prices for realized returns",
                ].map((item) => (
                  <div key={item} className="flex items-center py-3 border-t border-white/6">
                    <span className="text-white/50 text-sm">{item}</span>
                  </div>
                ))}
                <div className="border-t border-white/6" />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <h4 className="font-mono text-xs text-white/40 uppercase tracking-wider mb-6">Benchmarks</h4>
                {[
                  "S&P 500 total return index",
                  "Cambridge Associates VC Index",
                  "Top Quartile VC performance",
                  "Industry-specific growth metrics",
                ].map((item) => (
                  <div key={item} className="flex items-center py-3 border-t border-white/6">
                    <span className="text-white/50 text-sm">{item}</span>
                  </div>
                ))}
                <div className="border-t border-white/6" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-lg">
            <FadeIn>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6">
                First portfolio drop coming soon.
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">Subscribe to get it first. Weekly updates, new picks, performance reports, and the unfiltered partner debates.</p>
              <NewsletterForm />
              <div className="flex items-center gap-4 mt-6">
                <Link href="/" className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider min-h-[44px] flex items-center">
                  &larr; Back to aarte.co
                </Link>
                <div className="flex-1 h-px bg-white/6" />
                <a href="mailto:aarte@aarte.co" className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider min-h-[44px] flex items-center">
                  Contact
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Corner brackets */}
      <div className="fixed inset-0 pointer-events-none z-30" aria-hidden="true">
        <svg className="absolute bottom-12 left-4 sm:left-6 w-3 h-3 text-white/20" viewBox="0 0 14 14" fill="none">
          <rect y="13" width="14" height="1" fill="currentColor" />
          <rect width="1" height="14" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-12 right-4 sm:right-6 w-3 h-3 text-white/20" viewBox="0 0 14 14" fill="none">
          <rect y="13" width="14" height="1" fill="currentColor" />
          <rect x="13" width="1" height="14" fill="currentColor" />
        </svg>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-2 px-4 sm:px-6">
        <div className="flex items-center justify-between font-mono text-[10px] text-white/30">
          <span>&copy; AARTE &mdash; Applied Artificial Intelligence</span>
          <span>// aarte-capital.loaded</span>
        </div>
      </footer>
    </div>
  );
}
