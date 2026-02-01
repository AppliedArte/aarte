"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
    >
      <h2 className="text-2xl font-medium mb-6 text-white">{title}</h2>
      {children}
    </motion.section>
  );
}

export default function KimiGuidePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <Link href="/" className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase">
          AARTE
        </Link>
        <div className="font-mono text-xs text-white/40">
          Guides / Kimi K2
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        >
          <div className="mb-4">
            <span className="font-mono text-xs text-[#ffb700] uppercase tracking-wider">Guide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.1] tracking-[-0.02em] mb-6">
            Use Kimi K2 Instead of Claude Opus
          </h1>
          <p className="text-xl text-white/50 mb-12 max-w-2xl">
            Switch your AARTE AI brain to Moonshot&apos;s Kimi K2 model — up to 30x cheaper than Claude Opus with 262K context.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <Section title="Cost Comparison">
          <div className="overflow-x-auto">
            <table className="w-full border border-white/10 rounded-lg overflow-hidden">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left font-mono text-xs text-white/60 uppercase px-4 py-3">Model</th>
                  <th className="text-right font-mono text-xs text-white/60 uppercase px-4 py-3">Input / 1M</th>
                  <th className="text-right font-mono text-xs text-white/60 uppercase px-4 py-3">Output / 1M</th>
                  <th className="text-right font-mono text-xs text-white/60 uppercase px-4 py-3">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="bg-[#ffb700]/10">
                  <td className="px-4 py-3 font-medium">Kimi K2.5</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-[#00ff88]">$0.50</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-[#00ff88]">$2.80</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">262K</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Kimi K2 Thinking</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-[#00ff88]">$0.40</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-[#00ff88]">$1.75</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">262K</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Kimi K2 (Free Tier)</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-[#00ff88]">FREE</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-[#00ff88]">FREE</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">32K</td>
                </tr>
                <tr className="bg-white/5">
                  <td className="px-4 py-3 text-white/50">Claude Opus 4.5</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-white/50">$15.00</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-white/50">$75.00</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-white/50">200K</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-white/40 text-sm">
            Kimi K2.5 is <span className="text-[#00ff88]">~30x cheaper</span> on input and <span className="text-[#00ff88]">~27x cheaper</span> on output than Claude Opus.
          </p>
        </Section>

        {/* Option 1: OpenRouter */}
        <Section title="Option 1: Via OpenRouter (Easiest)">
          <p className="text-white/60 mb-6">
            If you already use OpenRouter, just change your model setting. No new API keys needed.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-sm text-white/80 mb-3">Step 1: Set up OpenRouter (if not already)</h3>
              <CodeBlock title="Terminal">{`clawdbot onboard --auth-choice apiKey \\
  --token-provider openrouter \\
  --token "sk-or-your-key-here"`}</CodeBlock>
            </div>

            <div>
              <h3 className="font-mono text-sm text-white/80 mb-3">Step 2: Update your agent config</h3>
              <CodeBlock title="clawdbot.json">{`{
  "agents": {
    "list": [{
      "id": "webchat",
      "model": "openrouter/moonshotai/kimi-k2.5"
    }]
  }
}`}</CodeBlock>
            </div>

            <div>
              <h3 className="font-mono text-sm text-white/80 mb-3">Available models on OpenRouter:</h3>
              <ul className="space-y-2 text-white/60">
                <li className="font-mono text-sm">• <code className="text-[#ffb700]">openrouter/moonshotai/kimi-k2.5</code> — Latest, 262K context</li>
                <li className="font-mono text-sm">• <code className="text-[#ffb700]">openrouter/moonshotai/kimi-k2-thinking</code> — With reasoning (like o1)</li>
                <li className="font-mono text-sm">• <code className="text-[#ffb700]">openrouter/moonshotai/kimi-k2:free</code> — Free tier, 32K context</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Option 2: Direct Moonshot API */}
        <Section title="Option 2: Direct Moonshot API">
          <p className="text-white/60 mb-6">
            Connect directly to Moonshot for potentially lower latency, especially from Asia.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-sm text-white/80 mb-3">Step 1: Get an API key</h3>
              <p className="text-white/50 mb-3">
                Sign up at <a href="https://platform.moonshot.ai" target="_blank" rel="noopener noreferrer" className="text-[#ffb700] hover:underline">platform.moonshot.ai</a> (or <a href="https://platform.moonshot.cn" target="_blank" rel="noopener noreferrer" className="text-[#ffb700] hover:underline">platform.moonshot.cn</a> for China).
              </p>
            </div>

            <div>
              <h3 className="font-mono text-sm text-white/80 mb-3">Step 2: Run the onboard command</h3>
              <CodeBlock title="Terminal">{`clawdbot onboard --auth-choice moonshot-api-key`}</CodeBlock>
            </div>

            <div>
              <h3 className="font-mono text-sm text-white/80 mb-3">Step 3: Update your config</h3>
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

            <div>
              <h3 className="font-mono text-sm text-white/80 mb-3">Available direct models:</h3>
              <ul className="space-y-2 text-white/60">
                <li className="font-mono text-sm">• <code className="text-[#ffb700]">moonshot/kimi-k2-0905-preview</code> — Latest stable</li>
                <li className="font-mono text-sm">• <code className="text-[#ffb700]">moonshot/kimi-k2-turbo-preview</code> — Faster responses</li>
                <li className="font-mono text-sm">• <code className="text-[#ffb700]">moonshot/kimi-k2-thinking</code> — With chain-of-thought reasoning</li>
                <li className="font-mono text-sm">• <code className="text-[#ffb700]">moonshot/kimi-k2-thinking-turbo</code> — Fast reasoning</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Things to Know */}
        <Section title="Things to Know">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-lg p-6">
              <div className="text-2xl mb-3">✅</div>
              <h3 className="font-medium mb-2">What works great</h3>
              <ul className="text-white/50 text-sm space-y-1">
                <li>• Long context (262K tokens)</li>
                <li>• OpenAI-compatible API</li>
                <li>• Reasoning mode available</li>
                <li>• Much lower cost</li>
              </ul>
            </div>
            <div className="border border-white/10 rounded-lg p-6">
              <div className="text-2xl mb-3">⚠️</div>
              <h3 className="font-medium mb-2">Things to test</h3>
              <ul className="text-white/50 text-sm space-y-1">
                <li>• Tool calling compatibility</li>
                <li>• System prompt handling</li>
                <li>• Personality/tone differences</li>
                <li>• Edge case behaviors</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-white/40 text-sm">
            We recommend testing with a secondary agent before switching your main AI brain.
          </p>
        </Section>

        {/* CTA */}
        <motion.div
          className="mt-16 p-8 bg-white/5 rounded-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          <h3 className="text-xl font-medium mb-4">Need help switching?</h3>
          <p className="text-white/50 mb-6">
            We can configure your AARTE instance to use Kimi K2 — or any other model.
          </p>
          <a
            href="mailto:aarte@aarte.co"
            className="inline-block px-6 py-3 bg-white text-black font-mono text-sm uppercase hover:bg-white/90 transition-colors"
          >
            Contact Us →
          </a>
        </motion.div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs text-white/40">
              ©AARTE — 2025
            </div>
            <Link href="/" className="font-mono text-xs text-white/40 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
