"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_TEXT_REVEAL } from "@/lib/constants";

export function LineReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isInView ? 0 : "100%" }}
        transition={{ duration: 1.5, delay, ease: EASE_TEXT_REVEAL }}
      >
        {children}
      </motion.div>
    </div>
  );
}
