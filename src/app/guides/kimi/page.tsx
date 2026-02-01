"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Constants
import { EASE_OUT_EXPO, EASE_IN_DROP } from "@/lib/constants";

// UI Components
import { BarcodeSVG, Preloader, ScrambleText } from "@/components/ui";

// Animation Components
import { ChapterHeader, FadeIn, InfiniteMarquee, LineReveal, ScrollHorizontalText, SplitTextReveal } from "@/components/animations";

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="bg-black/50 border border-white/10 rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b border-white/10 font-mono text-xs text-white/40">
          {title}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-white/80">{children}</code>
      </pre>
    </div>
  );
}

export default function KimiGuidePage() {
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let lastX = 0, lastY = 0;
    const updateMousePos = () => {
      setMousePos(prev => prev.x !== lastX || prev.y !== lastY ? { x: lastX, y: lastY } : prev);
      requestAnimationFrame(updateMousePos);
    };
    const handleMouseMove = (e: MouseEvent) => { lastX = e.clientX; lastY = e.clientY; };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    const rafId = requestAnimationFrame(updateMousePos);
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white selection:bg-[#ffb700] selection:text-black">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between mix-blend-difference" role="banner">
          <Link href="/" className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center">
            AARTE
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="font-mono text-xs text-white/40 hidden sm:block">Guides / Kimi K2</span>
            <Link href="/signup" className="font-mono text-xs text-black bg-white px-3 sm:px-4 py-2 hover:bg-white/90 transition-colors uppercase min-h-[44px] flex items-center">
              Get Started
            </Link>
          </div>
        </header>

        {/* Fixed bottom status bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-2" role="contentinfo">
          <InfiniteMarquee speed={40} direction="left">
            <span className="font-mono text-[10px] text-white/30 px-8">
              ©AARTE — 2025 · Kimi K2 Guide · // guide.loaded · [X].{mousePos.x.toFixed(0)}px [Y].{mousePos.y.toFixed(0)}px · 30x cheaper than Opus ·
            </span>
          </InfiniteMarquee>
        </div>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-20 pb-32 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 50 : 0 }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#ffb700]" />
                <span className="font-mono text-xs text-white/60 uppercase tracking-wider">Guide</span>
              </div>
              
              <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-8">
                <SplitTextReveal text="Use Kimi K2" className="block" />
                <SplitTextReveal text="Instead of" className="block text-white/40" delay={0.2} />
                <SplitTextReveal text="Claude Opus" className="block" delay={0.4} />
              </h1>
              
              <FadeIn delay={0.6}>
                <p className="text-xl sm:text-2xl text-white/50 max-w-2xl leading-relaxed">
                  Switch your AARTE AI brain to Moonshot&apos;s Kimi K2 model — up to <span className="text-[#00ff88]">30x cheaper</span> than Claude Opus with 262K context.
                </p>
              </FadeIn>
            </motion.div>

            <motion.div
              className="mt-16 flex items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <BarcodeSVG className="h-16 w-auto text-white/20" />
              <div className="font-mono text-xs text-white/30">
                <div>GUIDE.001</div>
                <div>MODEL.SWITCH</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Horizontal Scroll Text */}
        <div className="py-8 border-y border-white/10 bg-black overflow-hidden">
          <ScrollHorizontalText direction="right" speed={30}>
            <span className="text-[clamp(2rem,6vw,5rem)] font-medium tracking-[-0.03em] text-white/10">
              30x cheaper · 262K context · OpenAI compatible · Reasoning mode · 30x cheaper · 262K context ·&nbsp;
            </span>
          </ScrollHorizontalText>
        </div>

        {/* Cost Comparison */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto">
            <ChapterHeader number="01" title="cost comparison" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-12 overflow-hidden">
              <LineReveal>The Numbers</LineReveal>
              <LineReveal delay={0.15}>Don&apos;t Lie</LineReveal>
            </h2>

            <FadeIn>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border border-white/10 rounded-lg overflow-hidden">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left font-mono text-xs text-white/60 uppercase px-4 py-4">Model</th>
                      <th className="text-right font-mono text-xs text-white/60 uppercase px-4 py-4">Input / 1M</th>
                      <th className="text-right font-mono text-xs text-white/60 uppercase px-4 py-4">Output / 1M</th>
                      <th className="text-right font-mono text-xs text-white/60 uppercase px-4 py-4">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="bg-[#ffb700]/10">
                      <td className="px-4 py-4 font-medium">Kimi K2.5</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-[#00ff88]">$0.50</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-[#00ff88]">$2.80</td>
                      <td className="px-4 py-4 text-right font-mono text-sm">262K</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4">Kimi K2 Thinking</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-[#00ff88]">$0.40</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-[#00ff88]">$1.75</td>
                      <td className="px-4 py-4 text-right font-mono text-sm">262K</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4">Kimi K2 (Free)</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-[#00ff88]">FREE</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-[#00ff88]">FREE</td>
                      <td className="px-4 py-4 text-right font-mono text-sm">32K</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="px-4 py-4 text-white/50">Claude Opus 4.5</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-white/50">$15.00</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-white/50">$75.00</td>
                      <td className="px-4 py-4 text-right font-mono text-sm text-white/50">200K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Input Savings", value: "30x", color: "#00ff88" },
                  { label: "Output Savings", value: "27x", color: "#00ff88" },
                  { label: "Context Window", value: "262K", color: "#ffb700" },
                  { label: "Free Tier", value: "Yes", color: "#ffb700" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-white/10 rounded-lg p-4 text-center">
                    <div className="font-mono text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="font-mono text-xs text-white/40 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Option 1: OpenRouter */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto">
            <ChapterHeader number="02" title="via openrouter" />
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 overflow-hidden">
                  <LineReveal>Easiest</LineReveal>
                  <LineReveal delay={0.15}>Setup</LineReveal>
                </h2>
                <FadeIn delay={0.2}>
                  <p className="text-white/50 leading-relaxed">
                    If you already use OpenRouter, just change your model setting. No new API keys needed. One line change.
                  </p>
                </FadeIn>
              </div>
            </div>

            <div className="space-y-8">
              <FadeIn>
                <div>
                  <h3 className="font-mono text-sm text-white/80 mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ffb700] text-black flex items-center justify-center text-xs font-bold">1</span>
                    Set up OpenRouter (if not already)
                  </h3>
                  <CodeBlock title="Terminal">{`clawdbot onboard --auth-choice apiKey \\
  --token-provider openrouter \\
  --token "sk-or-your-key-here"`}</CodeBlock>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <h3 className="font-mono text-sm text-white/80 mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ffb700] text-black flex items-center justify-center text-xs font-bold">2</span>
                    Update your agent config
                  </h3>
                  <CodeBlock title="clawdbot.json">{`{
  "agents": {
    "list": [{
      "id": "webchat",
      "model": "openrouter/moonshotai/kimi-k2.5"
    }]
  }
}`}</CodeBlock>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="font-mono text-sm text-white/80 mb-4">Available on OpenRouter:</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { model: "moonshotai/kimi-k2.5", desc: "Latest, 262K context" },
                      { model: "moonshotai/kimi-k2-thinking", desc: "With reasoning (like o1)" },
                      { model: "moonshotai/kimi-k2:free", desc: "Free tier, 32K context" },
                      { model: "moonshotai/kimi-dev-72b", desc: "Developer model" },
                    ].map((item) => (
                      <div key={item.model} className="border border-white/10 rounded p-3">
                        <code className="text-[#ffb700] text-sm block mb-1">{item.model}</code>
                        <span className="text-white/40 text-xs">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Option 2: Direct API */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto">
            <ChapterHeader number="03" title="direct moonshot api" />
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 overflow-hidden">
                  <LineReveal>Lower</LineReveal>
                  <LineReveal delay={0.15}>Latency</LineReveal>
                </h2>
                <FadeIn delay={0.2}>
                  <p className="text-white/50 leading-relaxed">
                    Connect directly to Moonshot for potentially lower latency, especially from Asia. Requires a Moonshot API key.
                  </p>
                </FadeIn>
              </div>
            </div>

            <div className="space-y-8">
              <FadeIn>
                <div>
                  <h3 className="font-mono text-sm text-white/80 mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ffb700] text-black flex items-center justify-center text-xs font-bold">1</span>
                    Get an API key
                  </h3>
                  <p className="text-white/50 mb-4">
                    Sign up at{" "}
                    <a href="https://platform.moonshot.ai" target="_blank" rel="noopener noreferrer" className="text-[#ffb700] hover:underline">
                      platform.moonshot.ai
                    </a>{" "}
                    or{" "}
                    <a href="https://platform.moonshot.cn" target="_blank" rel="noopener noreferrer" className="text-[#ffb700] hover:underline">
                      platform.moonshot.cn
                    </a>{" "}
                    for China.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <h3 className="font-mono text-sm text-white/80 mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ffb700] text-black flex items-center justify-center text-xs font-bold">2</span>
                    Run the onboard command
                  </h3>
                  <CodeBlock title="Terminal">{`clawdbot onboard --auth-choice moonshot-api-key`}</CodeBlock>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div>
                  <h3 className="font-mono text-sm text-white/80 mb-4 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#ffb700] text-black flex items-center justify-center text-xs font-bold">3</span>
                    Update your config
                  </h3>
                  <CodeBlock title="clawdbot.json">{`{
  "env": { 
    "MOONSHOT_API_KEY": "sk-your-key-here" 
  },
  "agents": {
    "list": [{
      "id": "webchat",
      "model": "moonshot/kimi-k2-0905-preview"
    }]
  },
  "models": {
    "mode": "merge",
    "providers": {
      "moonshot": {
        "baseUrl": "https://api.moonshot.ai/v1",
        "apiKey": "\${MOONSHOT_API_KEY}",
        "api": "openai-completions"
      }
    }
  }
}`}</CodeBlock>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Things to Know */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto">
            <ChapterHeader number="04" title="things to know" />
            
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.1] tracking-[-0.02em] mb-12 overflow-hidden">
              <LineReveal>Before You</LineReveal>
              <LineReveal delay={0.15}>Switch</LineReveal>
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <FadeIn>
                <div className="border border-[#00ff88]/30 bg-[#00ff88]/5 rounded-lg p-6">
                  <div className="text-3xl mb-4">✅</div>
                  <h3 className="font-medium text-lg mb-4">What works great</h3>
                  <ul className="text-white/60 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#00ff88]">→</span>
                      Long context (262K tokens)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00ff88]">→</span>
                      OpenAI-compatible API
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00ff88]">→</span>
                      Reasoning mode available
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00ff88]">→</span>
                      Much lower cost
                    </li>
                  </ul>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.1}>
                <div className="border border-[#ffb700]/30 bg-[#ffb700]/5 rounded-lg p-6">
                  <div className="text-3xl mb-4">⚠️</div>
                  <h3 className="font-medium text-lg mb-4">Things to test</h3>
                  <ul className="text-white/60 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffb700]">→</span>
                      Tool calling compatibility
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffb700]">→</span>
                      System prompt handling
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffb700]">→</span>
                      Personality/tone differences
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ffb700]">→</span>
                      Edge case behaviors
                    </li>
                  </ul>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <p className="text-white/50">
                  We recommend testing with a secondary agent before switching your main AI brain.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollHorizontalText direction="left" speed={25} className="mb-12">
              <span className="text-[clamp(2rem,8vw,6rem)] font-medium tracking-[-0.03em] text-white/5">
                Need help? Need help? Need help? Need help?&nbsp;
              </span>
            </ScrollHorizontalText>

            <FadeIn>
              <h2 className="text-3xl sm:text-4xl font-medium mb-6">Need help switching?</h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                We can configure your AARTE instance to use Kimi K2 — or any other model. Just reach out.
              </p>
              <a
                href="mailto:aarte@aarte.co"
                className="inline-block px-8 py-4 bg-white text-black font-mono text-sm uppercase hover:bg-white/90 transition-colors"
              >
                Contact Us →
              </a>
            </FadeIn>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-8 mb-12">
              <div>
                <div className="font-mono text-xs text-white/40 mb-2">©AARTE — 2025</div>
                <div className="font-mono text-xs text-white/40">Applied Artificial Intelligence</div>
              </div>
              <BarcodeSVG className="h-12 sm:h-16 w-auto text-white/20" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-white/10">
              <div className="font-mono text-[10px] text-white/30">
                // guide.kimi.loaded · model.switch.ready
              </div>
              <Link href="/" className="font-mono text-[10px] text-white/30 hover:text-white transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
