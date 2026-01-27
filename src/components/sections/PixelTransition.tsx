"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIXEL_CONFIG, TOTAL_PIXELS } from "@/lib/constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PixelTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const pixelData = useMemo(() =>
    Array.from({ length: TOTAL_PIXELS }, () => ({
      delay: Math.random(),
      instant: Math.random() < 0.3,
    })), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      pixelsRef.current.forEach((pixel, i) => {
        if (!pixel) return;
        const data = pixelData[i];
        const config = data.instant
          ? {
              backgroundColor: "#e8e8e8",
              duration: 0.1,
              scrollTrigger: {
                trigger: container,
                start: `top ${50 - data.delay * 40}%`,
                toggleActions: "play none none reverse",
              },
            }
          : {
              backgroundColor: "#e8e8e8",
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: `top ${70 - data.delay * 20}%`,
                end: `bottom ${-20 + data.delay * 40}%`,
                scrub: true,
              },
            };
        gsap.fromTo(pixel, { backgroundColor: "#0a0a0a" }, config);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [pixelData]);

  return (
    <div ref={containerRef} className="w-full pt-12 pb-0 bg-[#0a0a0a] overflow-hidden" aria-hidden="true">
      <div className="grid w-full" style={{ gridTemplateColumns: `repeat(${PIXEL_CONFIG.cols}, 1fr)`, gap: `${PIXEL_CONFIG.gap}px` }}>
        {Array.from({ length: TOTAL_PIXELS }, (_, i) => (
          <div key={i} ref={(el) => { pixelsRef.current[i] = el; }} className="aspect-square w-full" style={{ backgroundColor: "#0a0a0a" }} />
        ))}
      </div>
    </div>
  );
}
