"use client";

import { motion } from "framer-motion";
import { PixelTrailCanvas } from "@/components/ui/PixelTrailCanvas";
import { BarcodeSVG } from "@/components/ui/BarcodeSVG";
import { EASE_OUT_EXPO } from "@/lib/constants";

interface HeroSectionProps {
  mousePos: { x: number; y: number };
}

export function HeroSection({ mousePos }: HeroSectionProps) {
  return (
    <section id="home" className="panel relative min-h-screen overflow-hidden bg-black">
      <PixelTrailCanvas className="!h-screen" />

      {/* Ghost title */}
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-20 sm:pt-4 pointer-events-none" aria-hidden="true">
        <div className="text-[clamp(2rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.06)' }}>
          AARTE:<br />
          Applied Artificial Intelligence
        </div>
      </div>

      {/* Hero Title */}
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-20 sm:pt-4 z-20">
        <div className="relative w-full h-full">
          <motion.h1
            className="text-[clamp(2rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white cursor-pointer group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE_OUT_EXPO }}
          >
            <span className="inline-block">AARTE:</span>
            <br />
            <span className="relative inline-block">
              <span className="inline-block group-hover:opacity-0 transition-opacity duration-300 ease-out">Applied Artificial Intelligence</span>
              <span className="absolute left-0 top-0 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">Applied ARTificial intelligencE</span>
            </span>
          </motion.h1>
        </div>
      </div>

      {/* Coordinates */}
      <motion.div
        className="hidden sm:block absolute left-4 sm:left-6 top-[54%] font-mono text-xs text-white/40 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        aria-label={`Mouse position X: ${mousePos.x} pixels, Y: ${mousePos.y} pixels`}
      >
        <div className="flex items-center gap-1">
          <span className="text-white/30">[X]</span>
          <span>.{mousePos.x.toFixed(0)}PX</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/30">[Y]</span>
          <span>.{mousePos.y.toFixed(0)}PX</span>
        </div>
      </motion.div>

      {/* Credits with Barcode */}
      <motion.div
        className="hidden sm:block absolute bottom-4 sm:bottom-6 left-4 sm:left-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="font-mono text-[10px] text-white/30 uppercase mb-1">project by</div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-white/60 uppercase">AARTE</span>
        </div>
        <BarcodeSVG className="h-16 sm:h-20 w-auto text-white" />
      </motion.div>

      {/* Corner brackets */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        aria-hidden="true"
      >
        <svg className="absolute top-[31%] sm:top-[54%] left-4 sm:left-[48%] w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
          <rect width="14" height="1" fill="currentColor"/>
          <rect width="1" height="14" fill="currentColor"/>
        </svg>
        <svg className="absolute top-[31%] sm:top-[54%] right-4 sm:right-6 w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
          <rect width="14" height="1" fill="currentColor"/>
          <rect x="13" width="1" height="14" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-4 sm:bottom-6 left-4 sm:left-[48%] w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
          <rect y="13" width="14" height="1" fill="currentColor"/>
          <rect width="1" height="14" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
          <rect y="13" width="14" height="1" fill="currentColor"/>
          <rect x="13" width="1" height="14" fill="currentColor"/>
        </svg>
      </motion.div>

      {/* Hero Content Box */}
      <motion.div
        className="absolute top-[32%] sm:top-[54%] bottom-4 sm:bottom-8 left-4 right-4 sm:left-[48%] sm:right-6 z-10 overflow-y-auto p-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-medium text-white leading-[1.25] tracking-[-0.01em] mb-4 sm:mb-6">
          Create Your Personal Moltbot <span className="text-white/60">(formerly Clawdbot)</span>
        </p>
        <div className="flex flex-wrap gap-3 mb-6 sm:mb-8">
          <a href="/signup" className="inline-block font-mono text-sm text-black bg-white px-4 sm:px-6 py-3 hover:bg-white/90 transition-colors uppercase min-h-[44px]" aria-label="Get Started with AARTE">
            Get Started →
          </a>
        </div>

        {/* Info Lists */}
        {[
          { label: "active ingredients", items: [{ text: "Molt.bot", href: "https://molt.bot/", external: true }, "n8n", "VPS"], mb: 4 },
          { label: "chapters", items: [{ text: "01. What is AARTE?", href: "#about", external: false }, { text: "02. design + dev", href: "#design", external: false }], mb: 0 }
        ].map((section, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-mono text-xs text-white/40 uppercase tracking-wider">{section.label}</span>
              {typeof section.items[0] === "object" && "href" in section.items[0] && (
                <a href={section.items[0].href} {...("external" in section.items[0] && section.items[0].external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-mono text-xs text-white uppercase tracking-wider hover:text-white/60 transition-colors min-h-[44px] flex items-center">
                  {section.items[0].text}
                </a>
              )}
            </div>
            <div className="border-b border-white/20 mb-2" />
            {section.items.slice(1).map((item, j) => (
              <div key={j}>
                <div className="flex justify-end mb-2">
                  {typeof item === "string" ? (
                    <span className="font-mono text-xs text-white uppercase tracking-wider">{item}</span>
                  ) : (
                    <a href={item.href} className="font-mono text-xs text-white uppercase tracking-wider hover:text-white/60 transition-colors min-h-[44px] flex items-center">{item.text}</a>
                  )}
                </div>
                <div className={`border-b border-white/20 ${j === section.items.length - 2 ? `mb-${section.mb}` : "mb-2"}`} />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export function HeroClone() {
  return (
    <section className="panel relative min-h-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-20 sm:pt-4 pointer-events-none">
        <div className="text-[clamp(2rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.06)' }}>
          AARTE:<br />
          Applied Artificial Intelligence
        </div>
      </div>
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-20 sm:pt-4 z-20">
        <h1 className="text-[clamp(2rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
          AARTE:<br />
          Applied Artificial Intelligence
        </h1>
      </div>
      <div className="absolute top-[32%] sm:top-[54%] bottom-4 sm:bottom-8 left-4 right-4 sm:left-[48%] sm:right-6 z-10 overflow-y-auto p-1">
        <p className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-medium text-white leading-[1.25] tracking-[-0.01em] mb-4 sm:mb-6">
          Create Your Personal AARTE Agent
        </p>
        <a href="/signup" className="inline-block font-mono text-sm text-black bg-white px-4 sm:px-6 py-3 hover:bg-white/90 transition-colors uppercase min-h-[44px]">
          Get Started →
        </a>
      </div>
    </section>
  );
}
