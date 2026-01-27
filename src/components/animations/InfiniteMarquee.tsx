"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function InfiniteMarquee({ children, speed = 50, direction = "left" }: { children: React.ReactNode; speed?: number; direction?: "left" | "right" }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return undefined;

    const totalWidth = inner.scrollWidth / 2;
    if (direction === "right") gsap.set(inner, { x: -totalWidth });

    const tween = gsap.to(inner, {
      x: direction === "left" ? -totalWidth : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const val = parseFloat(x);
          return direction === "left" ? val % totalWidth : (val % totalWidth) - totalWidth;
        })
      }
    });

    return () => { tween.kill(); };
  }, [speed, direction]);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div ref={innerRef} className="inline-flex">
        {children}
        {children}
      </div>
    </div>
  );
}
