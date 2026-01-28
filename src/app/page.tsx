"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Constants
import { EASE_OUT_EXPO, EASE_IN_DROP, NAV_ITEMS, MESSAGING_CHANNELS, BUSINESS_TOOLS, EXTENSION_CHANNELS, TECH_STACK_ITEMS } from "@/lib/constants";

// UI Components
import { BarcodeSVG, Preloader, ScrambleText } from "@/components/ui";

// Animation Components
import { ChapterHeader, FadeIn, InfiniteMarquee, LineReveal, ScrollHorizontalText, SplitTextReveal, DesignDevTitle } from "@/components/animations";

// Section Components
import { AboutSection, HeroSection, HeroClone, IntersectionSection, PixelTransition } from "@/components/sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, [enabled]);
}

function ResourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block text-white/40 hover:text-white transition-colors py-1">
      {children}
    </a>
  );
}

export default function CreativeManual() {
  const [loading, setLoading] = useState(true);
  useSmoothScroll(!loading);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { data: session } = useSession();

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

  useEffect(() => {
    if (loading) return;
    const content = document.querySelector('.scroll-content') as HTMLElement;
    if (!content) return;

    let isAdjusting = false;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const handleScroll = () => {
      if (isAdjusting) return;
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (currentScrollY >= maxScroll - 5) {
        isAdjusting = true;
        window.scrollTo({ top: 1, behavior: 'instant' as ScrollBehavior });
        requestAnimationFrame(() => { isAdjusting = false; });
      } else if (currentScrollY <= 5) {
        isAdjusting = true;
        window.scrollTo({ top: maxScroll - 1, behavior: 'instant' as ScrollBehavior });
        requestAnimationFrame(() => { isAdjusting = false; });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white selection:bg-[#ffb700] selection:text-black">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between mix-blend-difference" role="banner">
          <a href="/" className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center" aria-label="AARTE Home">AARTE</a>
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="/chat" className="font-mono text-xs text-white border border-white px-3 sm:px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase min-h-[44px] flex items-center" aria-label="Chat with AARTE">Chat with AARTE</a>
            {session ? (
              <a href="/signup" className="font-mono text-xs text-black bg-white px-3 sm:px-4 py-2 hover:bg-white/90 transition-colors uppercase min-h-[44px] flex items-center" aria-label="Get Started with AARTE">Get Started</a>
            ) : (
              <button onClick={() => signIn("google", { callbackUrl: "/signup" })} className="font-mono text-xs text-black bg-white px-3 sm:px-4 py-2 hover:bg-white/90 transition-colors uppercase min-h-[44px] flex items-center" aria-label="Sign in to get started">Get Started</button>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
              {menuOpen ? "Close [×]" : "Menu [+]"}
            </button>
          </div>
        </header>

        {/* Fixed bottom status bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-2" role="contentinfo">
          <InfiniteMarquee speed={40} direction="left">
            <span className="font-mono text-[10px] text-white/30 px-8">
              ©AARTE — 2025 · Applied Artificial Intelligence · // site.loaded · [X].{mousePos.x.toFixed(0)}px [Y].{mousePos.y.toFixed(0)}px ·
            </span>
          </InfiniteMarquee>
        </div>

        {/* Navigation overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="fixed inset-y-0 right-0 z-50 w-full lg:w-1/2 bg-[#0a0a0a] flex flex-col border-l border-white/10"
              aria-label="Main navigation"
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <motion.a href="#home" onClick={() => setMenuOpen(false)} className="font-mono text-xs text-white hover:text-white/60 transition-colors min-h-[44px] flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} aria-label="AARTE Home">AARTE</motion.a>
                <motion.button onClick={() => setMenuOpen(false)} className="font-mono text-xs text-white hover:text-white/60 transition-colors min-h-[44px] flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} aria-label="Close menu">
                  Close [<span className="inline-block">x</span>]
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-4 sm:px-6">
                {NAV_ITEMS.map((item, i) => (
                  <div key={item.label} className="group overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-[clamp(2rem,8vw,4rem)] font-medium leading-[1.1] hover:text-white/40 transition-colors py-2 min-h-[44px]"
                      initial={{ opacity: 0, y: -60 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: EASE_IN_DROP }}
                      aria-label={item.label}
                    >
                      <ScrambleText text={item.label} isActive={menuOpen} delay={80 + i * 60} />
                    </motion.a>
                    {"subItems" in item && item.subItems && (
                      <div className="pl-4 mt-2 mb-4 space-y-1 overflow-hidden">
                        {item.subItems.map((subItem, j) => (
                          <motion.a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setMenuOpen(false)}
                            className="block font-mono text-sm text-white/50 hover:text-white transition-colors py-1 min-h-[44px] flex items-center"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ delay: 0.2 + i * 0.06 + j * 0.03, duration: 0.4, ease: EASE_IN_DROP }}
                            aria-label={subItem.label}
                          >
                            <ScrambleText text={subItem.label} isActive={menuOpen} delay={200 + i * 60 + j * 30} />
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <motion.div className="px-4 sm:px-6 py-4 sm:py-6 flex items-end justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-xs text-white/40">project by</p>
                  <span className="font-mono text-xs text-white/60">AARTE</span>
                  {session && (
                    <button
                      onClick={() => signOut()}
                      className="font-mono text-xs text-white/40 hover:text-white transition-colors text-left mt-2"
                    >
                      Sign out ({session.user?.email})
                    </button>
                  )}
                </div>
                <BarcodeSVG className="h-12 w-auto text-white/20" aria-hidden="true" />
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Scroll content wrapper */}
        <div className="scroll-content">
          <HeroSection mousePos={mousePos} />
          <AboutSection />
          <IntersectionSection />

          {/* About Description */}
          <section className="panel py-24 sm:py-32 px-4 sm:px-6 bg-[#0a0a0a]">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span className="font-mono text-xs text-white/60 uppercase tracking-wider">About</span>
              </div>
              <FadeIn>
                <p className="text-[clamp(1.25rem,5vw,4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
                  AI Agents are hard to build. Harder to keep running. AARTE handles the infrastructure so you can focus on what you actually do. When something breaks, we pick up the phone.
                </p>
              </FadeIn>
            </div>
          </section>

          <PixelTransition />

          {/* Chapter 2: Design + Dev */}
          <section id="design" className="panel min-h-screen py-6 px-4 md:px-6 bg-[#e8e8e8]">
            <div className="w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12 md:mb-16 lg:mb-24">
                <div className="md:flex-1">
                  <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium leading-[0.9] tracking-[-0.03em]">
                    <span className="block"><DesignDevTitle text="Design &" /></span>
                    <span className="block"><DesignDevTitle text="Development" delay={0.3} /></span>
                  </h2>
                </div>
                <div className="md:w-[280px] lg:w-[360px] md:flex-shrink-0">
                  <div className="border-t border-black pt-2">
                    <span className="font-mono text-[10px] text-black uppercase tracking-wider">Chapter:</span>
                    <div className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-medium leading-[0.78] tracking-[-0.04em] text-black md:text-right">02</div>
                  </div>
                </div>
              </div>
              <div className="max-w-[700px]">
                <FadeIn><h3 className="text-sm font-medium text-black mb-2 uppercase tracking-wider">Chapters</h3></FadeIn>
                <div>
                  {["HOW IT WORKS", "TECH STACK", "SKILLS", "INTEGRATIONS"].map((title, i) => (
                    <FadeIn key={title} delay={i * 0.1}>
                      <a href={`#${title.toLowerCase().replace(/\s+/g, "-")}`} className="group flex items-center py-3 border-t border-black/20 hover:bg-black/5 transition-colors min-h-[44px]" aria-label={`Chapter 2.${i + 1}: ${title}`}>
                        <span className="font-mono text-sm text-black/50 w-12 flex-shrink-0">2.{i + 1}</span>
                        <span className="font-mono text-sm text-black uppercase tracking-wider ml-8 sm:ml-32 md:ml-56">{title}</span>
                      </a>
                    </FadeIn>
                  ))}
                  <div className="border-t border-black/20" />
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 2.1: How it Works */}
          <section id="how-it-works" className="panel py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
              <ChapterHeader number="2.1" title="how it works" />
              <div className="grid md:grid-cols-2 gap-12 sm:gap-16 mb-16">
                <div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 overflow-hidden">
                    <SplitTextReveal text="Your AI," className="block" />
                    <SplitTextReveal text="Your Way" className="block" delay={0.3} />
                  </h3>
                  <FadeIn delay={0.2}>
                    <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-6">AARTE connects to the apps you already use. Send a message on WhatsApp, get a reply from your AI. No new apps to learn. No complicated setup.</p>
                    <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-6">Your data stays yours. AARTE runs in your own environment — your conversations, your keys, your privacy.</p>
                  </FadeIn>
                </div>
                <div className="space-y-6">
                  {[
                    { num: "01", title: "You message AARTE", desc: "Use WhatsApp, Telegram, Slack, or any channel you prefer. Just text like you would a colleague." },
                    { num: "02", title: "AARTE understands context", desc: "It remembers your preferences, knows your workflow, and learns what matters to your business." },
                    { num: "03", title: "AARTE takes action", desc: "Draft emails, schedule meetings, answer customer questions, update spreadsheets — all automatically." },
                  ].map((step, i) => (
                    <FadeIn key={step.num} delay={0.3 + i * 0.1}>
                      <div className="border border-white/10 rounded-lg p-6">
                        <div className="text-[#ffb700] text-2xl mb-2">{step.num}</div>
                        <h4 className="text-lg font-medium mb-2">{step.title}</h4>
                        <p className="text-white/50 text-sm">{step.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
              <FadeIn>
                <div className="bg-white/5 rounded-lg p-6 sm:p-8 text-center">
                  <p className="text-xl sm:text-2xl font-medium mb-4">No coding required. No IT department needed.</p>
                  <p className="text-white/50 mb-4">AARTE works out of the box. Just connect your accounts and start chatting.</p>
                  <p className="text-white/40 text-sm font-mono">100% private · Self-hosted · Your data never leaves your infrastructure</p>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Chapter 2.2: Tech Stack */}
          <section id="tech-stack" className="panel py-24 sm:py-32 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <ChapterHeader number="2.2" title="tech stack" />
              <div className="grid md:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-16">
                <div className="md:col-span-6">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 overflow-hidden">
                    <SplitTextReveal text="The" className="block" />
                    <SplitTextReveal text="Architecture" className="block" delay={0.3} />
                  </h3>
                  <FadeIn delay={0.2}>
                    <p className="text-white/50 leading-relaxed mb-6">AARTE runs on a Gateway process that owns all your channel connections. Messages from WhatsApp, Telegram, Discord, Slack, and more flow into a central WebSocket control plane.</p>
                    <p className="text-white/50 leading-relaxed mb-6">The Gateway routes messages to AI agents running in RPC mode, maintaining isolated workspaces per conversation. Direct chats share context; groups stay isolated.</p>
                  </FadeIn>
                </div>
                <div className="md:col-span-6">
                  <FadeIn delay={0.3}>
                    <div className="border border-white/10 rounded-lg p-4 sm:p-6">
                      <div className="font-mono text-xs text-white/40 mb-6">message flow</div>
                      <div className="space-y-4">
                        {[
                          { label: "Channels", value: "WhatsApp, Telegram, Discord, Slack, iMessage" },
                          { label: "Gateway", value: "WebSocket control plane @ :18789" },
                          { label: "AI Agent", value: "Claude / GPT in RPC mode" },
                          { label: "Canvas", value: "HTTP file server @ :18793" },
                        ].map((row, i) => (
                          <div key={row.label}>
                            {i > 0 && <div className="flex items-center justify-center mb-4" aria-hidden="true"><span className="font-mono text-xs text-white/40">↓</span></div>}
                            <div className="flex items-center gap-4">
                              <div className="w-20 sm:w-24 text-right font-mono text-xs text-white/60">{row.label}</div>
                              <div className="flex-1 h-px bg-white/20" />
                              <div className="font-mono text-xs text-white text-right sm:text-left">{row.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
              <FadeIn>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
                  {TECH_STACK_ITEMS.map((item) => (
                    <div key={item.label} className="border border-white/10 p-3 sm:p-4 rounded">
                      <div className="font-mono text-[10px] text-white/40 uppercase mb-1">{item.label}</div>
                      <div className="font-mono text-xs sm:text-sm text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="border-t border-white/10 pt-8 text-center">
                  <p className="text-white/40 text-sm mb-4">AARTE is powered by <a href="https://molt.bot" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#ffb700] transition-colors">Moltbot</a> — the open-source AI assistant framework.</p>
                  <a href="https://github.com/molt-bot/clawdbot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-xs text-white/60 hover:text-white transition-colors min-h-[44px]" aria-label="View Moltbot on GitHub">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    View on GitHub
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Chapter 2.3: Skills */}
          <section id="skills" className="panel py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
              <ChapterHeader number="2.3" title="skills" />
              <h3 className="text-[clamp(2rem,6vw,4rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8">
                <LineReveal>Teach AARTE</LineReveal>
                <LineReveal delay={0.15}>New Skills</LineReveal>
              </h3>
              <FadeIn delay={0.1}>
                <p className="text-lg sm:text-xl text-white/50 max-w-3xl mb-12 sm:mb-16 leading-relaxed">AARTE learns how your business works. Show it once, and it handles it forever. Skills are modular capabilities you can add, customize, or build from scratch.</p>
              </FadeIn>
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-16">
                <FadeIn delay={0.2}>
                  <div className="border border-white/10 rounded-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#EA4335]/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#EA4335]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                      </div>
                      <h4 className="text-lg font-medium">Gmail Skill</h4>
                    </div>
                    <p className="text-white/50 mb-6">&ldquo;When I get an email from a client asking for a quote, draft a response using our pricing template and flag it for my review.&rdquo;</p>
                    <div className="font-mono text-xs text-white/40 space-y-1">
                      <div>Trigger: New email from client domain</div>
                      <div>Action: Draft reply + add label</div>
                      <div>Review: Notify on WhatsApp</div>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <div className="border border-white/10 rounded-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                      <h4 className="text-lg font-medium">WhatsApp / Telegram Skill</h4>
                    </div>
                    <p className="text-white/50 mb-6">&ldquo;Answer customer questions about our business hours, pricing, and services. If they want to book, send them our calendar link.&rdquo;</p>
                    <div className="font-mono text-xs text-white/40 space-y-1">
                      <div>Trigger: Message containing question</div>
                      <div>Action: AI response from knowledge base</div>
                      <div>Escalate: Forward to human if unsure</div>
                    </div>
                  </div>
                </FadeIn>
              </div>
              <FadeIn delay={0.4}>
                <div className="bg-white/5 rounded-lg p-6 sm:p-8">
                  <h4 className="text-lg font-medium mb-4">Build Your Own Skills</h4>
                  <p className="text-white/50 mb-6">Skills are just natural language instructions. Describe what you want, and AARTE figures out the rest. No coding. No complex workflows. Just tell it what to do.</p>
                  <div className="font-mono text-sm text-white/60 bg-black/30 p-4 rounded">
                    <span className="text-[#ffb700]">You:</span> &ldquo;When someone messages asking about project status, check our Notion board and summarize what&apos;s in progress.&rdquo;
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Chapter 2.4: Integrations */}
          <section id="integrations" className="panel py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
              <ChapterHeader number="2.4" title="integrations" />
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-16">
                <div>
                  <h3 className="text-[clamp(2rem,6vw,4rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8">
                    <LineReveal>Connect</LineReveal>
                    <LineReveal delay={0.15}>Everything</LineReveal>
                  </h3>
                  <FadeIn delay={0.4}><p className="text-white/50 leading-relaxed">AARTE works with the tools you already use. No migration needed. Just connect your accounts and start chatting.</p></FadeIn>
                </div>
              </div>

              <FadeIn>
                <div className="mb-12">
                  <h4 className="font-mono text-xs text-white/40 uppercase mb-6">Messaging Channels</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {MESSAGING_CHANNELS.map((channel) => (
                      <div key={channel.name} className="border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/30 transition-colors">
                        <svg className="w-8 h-8 mb-2" style={{ color: channel.color }} viewBox="0 0 24 24" fill="currentColor"><path d={channel.icon} /></svg>
                        <span className="font-mono text-[10px] text-white/60">{channel.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="mb-12">
                  <h4 className="font-mono text-xs text-white/40 uppercase mb-6">Business Tools</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {BUSINESS_TOOLS.map((tool) => (
                      <div key={tool.name} className="border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/30 transition-colors">
                        <div className="w-8 h-8 mb-2 rounded flex items-center justify-center text-lg font-bold" style={{ color: tool.color }}>{tool.name.charAt(0)}</div>
                        <span className="font-mono text-[10px] text-white/60">{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mb-12">
                  <h4 className="font-mono text-xs text-white/40 uppercase mb-6">Extension Channels</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {EXTENSION_CHANNELS.map((ext) => (
                      <div key={ext.name} className="border border-white/10 rounded-lg p-4 hover:border-white/30 transition-colors">
                        <span className="font-mono text-sm text-white block">{ext.name}</span>
                        <span className="font-mono text-[10px] text-white/40">{ext.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <p className="text-white/50 text-sm">Need a custom integration?<a href="mailto:aarte@aarte.co" className="text-[#ffb700] hover:underline ml-1">Contact us →</a></p>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Chapter 3: Resources */}
          <section id="resources" className="panel py-24 sm:py-32 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <ChapterHeader number="03" title="final word" />
            </div>
            <div className="mb-16 sm:mb-24">
              <FadeIn><p className="text-white/40 mb-8 text-center">Everyone will have their own Applied Artificial Intelligence. Welcome to the future.</p></FadeIn>
              <ScrollHorizontalText direction="right" speed={20}>
                <h3 className="text-[clamp(3rem,15vw,12rem)] font-medium leading-[0.9] tracking-[-0.04em] text-white/10">Applied Artificial Intelligence. Applied Artificial Intelligence.&nbsp;</h3>
              </ScrollHorizontalText>
              <ScrollHorizontalText direction="left" speed={25} className="mt-2">
                <h3 className="text-[clamp(2.5rem,12vw,10rem)] font-medium leading-[0.9] tracking-[-0.04em]">Applied Artificial Intelligence. Applied Artificial Intelligence.&nbsp;</h3>
              </ScrollHorizontalText>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-16 sm:mb-24">
                <FadeIn delay={0.2}><p className="text-white/50 max-w-2xl mx-auto leading-relaxed">Build custom workflows, teach AARTE new skills, and watch your productivity multiply. The more you train it, the smarter it gets. Connect your tools, automate the boring stuff, and focus on what matters.</p></FadeIn>
              </div>
              <FadeIn><div className="font-mono text-xs text-white/40 mb-12">RESOURCES CURATED BY AARTE</div></FadeIn>
              <div className="grid md:grid-cols-2 gap-12">
                <FadeIn>
                  <div>
                    <h4 className="text-sm text-white/60 mb-6">Inspiration</h4>
                    <div className="space-y-1">
                      <ResourceLink href="https://molt.bot">Molt.bot</ResourceLink>
                      <ResourceLink href="https://anthropic.com">Anthropic</ResourceLink>
                      <ResourceLink href="https://claude.ai">Claude.ai</ResourceLink>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div>
                    <h4 className="text-sm text-white/60 mb-6">Resources</h4>
                    <div className="space-y-1">
                      <ResourceLink href="https://docs.anthropic.com/en/docs/build-with-claude/tool-use">Claude Skills Documentation</ResourceLink>
                      <ResourceLink href="https://molt.bot/docs">Molt.bot Docs</ResourceLink>
                      <ResourceLink href="https://docs.anthropic.com">Anthropic API Docs</ResourceLink>
                      <ResourceLink href="https://github.com/anthropics/anthropic-cookbook">Anthropic Cookbook</ResourceLink>
                      <ResourceLink href="https://console.anthropic.com">Anthropic Console</ResourceLink>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="panel pt-16 sm:pt-24 pb-24 sm:pb-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-end justify-between gap-8 mb-12 sm:mb-16">
                <div>
                  <div className="font-mono text-xs text-white/40 mb-2">©AARTE — 2025</div>
                  <div className="font-mono text-xs text-white/40">Applied Artificial Intelligence</div>
                </div>
                <BarcodeSVG className="h-12 sm:h-16 w-auto text-white/20" />
              </div>
              <motion.div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-white/10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
                <div className="font-mono text-[10px] text-white/30">// site.loaded · initLenis(); initNav(); initLoader();</div>
                <div className="font-mono text-[10px] text-white/30">[0] aarte.co · [active].status</div>
              </motion.div>
            </div>
          </footer>
        </div>

        {/* Duplicate content for seamless infinite scroll */}
        <div className="scroll-content-clone" aria-hidden="true">
          <HeroClone />
        </div>
      </div>
    </>
  );
}
