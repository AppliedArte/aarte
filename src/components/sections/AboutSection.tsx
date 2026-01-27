"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconPathRef = useRef<SVGPathElement>(null);
  const creativityCharsRef = useRef<(HTMLDivElement | null)[]>([]);
  const techCharsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const creativityTextLine1 = "AARTE is your personal AI Assistant.";
  const creativityTextLine2 = "It reads your email, learns your workflow, texts you, and calls your clients.";
  const creativityTextLine3 = "It even learns new skills!";
  const techText = "</AARTE>";

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current || !containerRef.current || !iconPathRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%",
        pin: cardRef.current,
        pinSpacing: true,
      });

      gsap.fromTo(
        containerRef.current,
        { width: "50%", height: "50%" },
        {
          width: "100%",
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            scrub: true,
          },
        }
      );

      const textConfigs = [
        { index: 0, from: { opacity: 0, x: -50 }, start: "top 80%", end: "top 20%" },
        { index: 1, from: { opacity: 0, y: 30 }, start: "top -60%", end: "top -80%" },
        { index: 2, from: { opacity: 0, y: 30 }, start: "top -65%", end: "top -85%" },
      ];

      textConfigs.forEach(({ index, from, start, end }) => {
        const el = creativityCharsRef.current[index];
        if (!el) return;
        gsap.fromTo(el, from, {
          opacity: 1, x: 0, y: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start, end, scrub: true },
        });
      });

      gsap.to(iconPathRef.current, {
        rotation: 360,
        transformOrigin: "center center",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=75%",
          scrub: true,
        },
      });

      techCharsRef.current.forEach((char, i) => {
        if (!char) return;
        gsap.fromTo(
          char,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${30 + i * 5}% top`,
              end: `top+=${35 + i * 5}% top`,
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="panel min-h-[250vh] bg-[#0a0a0a]">
      <div ref={cardRef} className="h-screen w-full flex items-center justify-center">
        <div ref={containerRef} className="relative bg-[#e8e8e8] overflow-hidden rounded-lg" style={{ width: "50%", height: "50%" }}>
          <div className="absolute inset-0 flex flex-col justify-between px-3 sm:px-4 py-2 sm:py-3 pointer-events-none z-10">
            <div className="flex justify-between items-center w-full">
              <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">chapter 1:</p>
              <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">about</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">What is AARTE?</p>
              <p className="font-mono text-[10px] text-black/60" aria-label="Previous">←</p>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8 z-20">
            <div className="flex-1 w-full flex flex-col justify-end pb-4">
              <h2 ref={(el) => { creativityCharsRef.current[0] = el; }} className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[1.2] tracking-[-0.02em] text-black max-w-[90%]">
                {creativityTextLine1}
              </h2>
              <p ref={(el) => { creativityCharsRef.current[1] = el; }} className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[1.2] tracking-[-0.02em] text-black max-w-[90%] mt-4 relative z-30">
                {creativityTextLine2}
              </p>
              <p ref={(el) => { creativityCharsRef.current[2] = el; }} className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[1.2] tracking-[-0.02em] text-black max-w-[90%] mt-4 relative z-30">
                {creativityTextLine3}
              </p>
            </div>

            <div className="flex justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 95" fill="none" className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24" aria-label="AARTE icon">
                <rect width="95" height="95" rx="47.5" fill="black" />
                <path ref={iconPathRef} d="M45.6 49H22.9V45.7H45.6L45.5 21.9H49.3L49.1 45.7H71.9V49H49.1L49.3 72.9H45.5L45.6 49Z" fill="#e8e8e8" style={{ transformOrigin: "47.4px 47.4px" }} />
              </svg>
            </div>

            <div className="flex-1 w-full flex justify-center items-start pt-4">
              <p className="text-[clamp(3rem,15vw,10rem)] font-pixel leading-[0.9] tracking-tight text-black">
                {techText.split("").map((char, i) => (
                  <span key={i} ref={(el) => { techCharsRef.current[i] = el; }} className="inline-block" style={{ opacity: 0 }}>
                    {char}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
