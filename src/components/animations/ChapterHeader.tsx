"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ChapterHeader({ number, title }: { number: string; title: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex items-center gap-4 mb-12 sm:mb-16"
    >
      <span className="font-mono text-xs text-white/40">{number}</span>
      <div className="flex-1 h-px bg-white/10" />
      <span className="font-mono text-xs text-white/40">{title}</span>
    </motion.div>
  );
}
