"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showChars, setShowChars] = useState(false);

  useEffect(() => {
    const charTimer = setTimeout(() => setShowChars(true), 300);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return Math.min(prev + Math.random() * 6 + 2, 100);
      });
    }, 60);
    return () => {
      clearInterval(interval);
      clearTimeout(charTimer);
    };
  }, [onComplete]);

  const dialTypes = ["y", ...Array(3).fill("white"), ...Array(3).fill("gray"), ...Array(3).fill("dark"), "white"];
  const dialColors = { y: "bg-[#ffb700]", white: "bg-[#999]", gray: "bg-[#444]", dark: "bg-[#222]" };
  const statusText = "[status:active]";
  const statusChars = new Set(["s", "t", "a", "u"]);

  return (
    <motion.div
      className="fixed inset-0 z-60 bg-[#0a0a0a] p-4 sm:p-6"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading AARTE"
    >
      <div className="absolute inset-0 flex justify-center items-center" aria-hidden="true">
        <motion.div
          className="w-px bg-[#222] h-full origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-wider flex" aria-live="polite">
        {statusText.split("").map((char, i) => (
          <motion.span
            key={i}
            className={`inline-block ${statusChars.has(char) ? "text-white/60" : "text-white"}`}
            initial={{ opacity: 0 }}
            animate={showChars ? { opacity: [0, 1, 0.3, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.03, ease: "easeInOut" }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <div className="absolute right-4 sm:right-6 top-0 bottom-0 w-[1.4rem] flex flex-col justify-between py-4 sm:py-6 overflow-hidden" aria-hidden="true">
        {dialTypes.map((type, i) => (
          <motion.div
            key={i}
            className={`h-px w-full ${dialColors[type as keyof typeof dialColors]}`}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: [0.76, 0, 0.24, 1] }}
          />
        ))}
      </div>

      <motion.div
        className="absolute left-4 sm:left-6 max-w-[90vw]"
        style={{ bottom: `${progress * 0.5}%` }}
        aria-hidden="true"
      >
        <motion.span
          className="font-mono text-[clamp(4rem,18vw,14rem)] font-medium text-white leading-none"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {Math.round(progress)}%
        </motion.span>
      </motion.div>

      <motion.div
        className="absolute left-4 sm:left-6 top-[50svh] flex flex-col gap-8 sm:gap-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex gap-1" aria-hidden="true">
          <motion.div
            className="w-[0.8rem] h-[0.8rem] bg-[#ffb700]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <div className="w-[0.8rem] h-[0.8rem] border border-[#444] bg-transparent" />
        </div>

        <p className="font-mono text-xs text-white/40">©AARTE — 2025</p>

        <div className="font-mono text-xs text-white/30 space-y-0.5">
          <p className="text-white/40">prjct by</p>
          <p className="text-white/60">AARTE</p>
        </div>

        <div className="font-mono text-[10px] text-white/30 space-y-0.5">
          <p className="text-white/40">// site.loading</p>
          <p>[f] Scripts() {"{"}</p>
          <p className="pl-3">initLenis();</p>
          <p className="pl-3">initNav();</p>
          <p className="pl-3">initLoader();</p>
          <p>{"}"}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
