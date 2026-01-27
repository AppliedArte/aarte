"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollHorizontalText({
  children,
  direction = "left",
  speed = 100,
  className = ""
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const xValue = direction === "left" ? `-${speed}%` : `${speed}%`;
    const fromX = direction === "left" ? "0%" : `-${speed}%`;

    gsap.fromTo(inner, { x: fromX }, {
      x: xValue,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.trigger === container && t.kill());
  }, [direction, speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="whitespace-nowrap">
        {children}
      </div>
    </div>
  );
}
