"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRICK_ROWS } from "@/lib/constants";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function BrickBlocks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.to(container, {
      y: "-20%",
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.3,
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.trigger === container && t.kill());
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center gap-[3px] z-20" style={{ transform: "translateY(20%)" }} aria-hidden="true">
      {BRICK_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[3px] justify-center">
          {row.map((brick, brickIndex) => (
            <div key={brickIndex} style={{ width: brick.w, height: brick.h, backgroundColor: brick.color }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function IntersectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bricksWrapperRef = useRef<HTMLDivElement>(null);
  const dashesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !bricksWrapperRef.current || !dashesRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, { opacity: 0 }, {
        opacity: 1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 20%", scrub: 0.5 }
      });

      gsap.to(textRef.current, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "bottom 80%", end: "bottom 20%", scrub: 0.5 }
      });

      gsap.fromTo(bricksWrapperRef.current, { y: 100 }, {
        y: -100,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.5 }
      });

      gsap.fromTo(bricksWrapperRef.current, { opacity: 1 }, {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 50%", scrub: 0.3 }
      });

      gsap.set(dashesRef.current, { transformOrigin: "center center" });
      gsap.fromTo(dashesRef.current, { scale: 0.8, rotate: 0 }, {
        scale: 1,
        rotate: 360,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="panel relative min-h-[150vh] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <div ref={dashesRef}>
          {Array.from({ length: 48 }, (_, i) => (
            <div key={i} className="absolute w-0.5 h-8 md:h-12 bg-linear-to-t from-white/20 to-transparent origin-bottom" style={{ transform: `rotate(${i * 7.5}deg) translateY(-280px)` }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
        <div ref={textRef}>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white">
            <span className="text-[#ffb700]">AARTE</span> is your personal AI assistant.
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-2">
            It meets you on the channels you already use.
          </p>
          <p className="text-[clamp(0.875rem,2.5vw,1.8rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white/50 mt-2">
            WhatsApp · Telegram · Slack · iMessage · Discord · Teams + more
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-4">
            Voice on <span className="text-white/50">macOS · iOS · Android</span>
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-2">
            Draw on a live <span className="text-white">Canvas</span> you control.
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-4">
            Learns new skills. <span className="text-[#ffb700]">Train it yourself.</span>
          </p>
        </div>
      </div>

      <div ref={bricksWrapperRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30" style={{ opacity: 1 }} aria-hidden="true">
        <BrickBlocks />
      </div>
    </section>
  );
}
