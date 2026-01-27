"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_TEXT_REVEAL } from "@/lib/constants";

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  getColorClass?: (index: number) => string;
}

export function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
  duration = 1.5,
  getColorClass
}: SplitTextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block ${getColorClass?.(i) || ""}`}
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          initial={{ y: "100%", opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: EASE_TEXT_REVEAL
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// Color animated title variant
export function ColorAnimatedTitle({ text, className = "" }: { text: string; className?: string }) {
  const getColorClass = (index: number): string => {
    const pattern = [true, false, true, true, false, false];
    return pattern[index % pattern.length] ? "text-white" : "text-white/40";
  };
  return <SplitTextReveal text={text} className={className} duration={1.2} stagger={0.03} getColorClass={getColorClass} />;
}

// Design+Dev title variant
export function DesignDevTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  const getColorClass = (index: number): string => {
    const pattern = [false, true, false, true, false, true, true, false, true, false];
    return pattern[index % pattern.length] ? "text-black" : "text-black/40";
  };
  return <SplitTextReveal text={text} delay={delay} duration={1.2} stagger={0.04} getColorClass={getColorClass} />;
}
