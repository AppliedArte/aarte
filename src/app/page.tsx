"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Easing functions
const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
const EASE_IN_DROP = [0.6, 0, 0.4, 1] as const;
const EASE_TEXT_REVEAL = [0.23, 0.32, 0.23, 0.2] as const;
const EASE_BUTTON_HOVER = [0.16, 1, 0.3, 1] as const;
const EASE_SMOOTH = [0.87, 0, 0.13, 1] as const;

// Shared barcode SVG paths
const BARCODE_PATHS = [
  "M0 109V0H5.54237V109H0ZM11.0847 109V0H16.6271V109H11.0847ZM22.1695 109V0H38.7966V109H22.1695ZM44.339 109V0H60.9661V109H44.339ZM77.5932 109V0H83.1356V109H77.5932Z",
  "M83.2222 109V0H99.8493V109H83.2222ZM105.392 109V0H110.934V109H105.392ZM116.476 109V0H122.019V109H116.476ZM138.646 109V0H155.273V109H138.646ZM160.815 109V0H166.358V109H160.815Z",
  "M166.444 109V0H183.072V109H166.444ZM188.614 109V0H194.156V109H188.614ZM199.699 109V0H216.326V109H199.699ZM232.953 109V0H238.495V109H232.953ZM244.038 109V0H249.58V109H244.038Z",
  "M249.667 109V0H255.209V109H249.667ZM271.836 109V0H288.463V109H271.836ZM294.006 109V0H299.548V109H294.006ZM305.09 109V0H321.717V109H305.09ZM327.26 109V0H332.802V109H327.26Z",
] as const;

// Barcode SVG component
function BarcodeSVG({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333 109" fill="none" className={className} aria-label="AARTE barcode" {...props}>
      {BARCODE_PATHS.map((d, i) => <path key={i} d={d} fill="currentColor" />)}
    </svg>
  );
}

// Shared className constants
const MONO_XS = "font-mono text-xs";
const MONO_XS_MUTED = "font-mono text-xs text-white/40";
const MONO_XS_DIM = "font-mono text-xs text-white/30";
const MIN_TOUCH = "min-h-[44px]";

// Resource link component
function ResourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block text-white/40 hover:text-white transition-colors py-1">
      {children}
    </a>
  );
}

// Pixelated cursor trail canvas
function PixelTrailCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<{ x: number; y: number; opacity: number; size: number }[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateSize();

    const pixelSize = 20;
    const maxPixels = 100;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) return;

      const x = Math.floor(mouseX / pixelSize) * pixelSize;
      const y = Math.floor(mouseY / pixelSize) * pixelSize;

      if (!lastPosRef.current || lastPosRef.current.x !== x || lastPosRef.current.y !== y) {
        lastPosRef.current = { x, y };
        pixelsRef.current.push({ x, y, opacity: 1, size: pixelSize });
        if (pixelsRef.current.length > maxPixels) pixelsRef.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pixelsRef.current = pixelsRef.current.filter((pixel) => {
        pixel.opacity -= 0.02;
        if (pixel.opacity <= 0) return false;
        ctx.fillStyle = `rgba(255, 255, 255, ${pixel.opacity})`;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
        return true;
      });
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);

    window.addEventListener("resize", updateSize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-30 mix-blend-difference pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

// Scramble text component for menu
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";

function ScrambleText({ text, isActive, delay = 0 }: { text: string; isActive: boolean; delay?: number }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const totalIterations = text.length * 2;
    let interval: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(
          text.split("").map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 2) return text[index];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join("")
        );

        iteration++;
        if (iteration >= totalIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, 25);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, isActive, delay]);

  return <span>{displayText}</span>;
}

// Preloader
function Preloader({ onComplete }: { onComplete: () => void }) {
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
      {/* Middle vertical line */}
      <div className="absolute inset-0 flex justify-center items-center" aria-hidden="true">
        <motion.div
          className="w-px bg-[#222] h-full origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      {/* Status text */}
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

      {/* Dials */}
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

      {/* Percentage */}
      <motion.div
        className="absolute right-[52%] flex items-end gap-1"
        style={{ bottom: `${progress * 0.5}%` }}
        aria-hidden="true"
      >
        <motion.span
          className="font-mono text-2xl sm:text-3xl font-medium text-white"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {Math.round(progress)}%
        </motion.span>
      </motion.div>

      {/* Details */}
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

// Native smooth scroll
function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [enabled]);
}

// Line reveal animation
function LineReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

// Split text reveal - generic implementation
function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
  duration = 1.5,
  getColorClass
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  getColorClass?: (index: number) => string;
}) {
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

// Fade in animation
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

// Chapter header
function ChapterHeader({ number, title }: { number: string; title: string }) {
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

// Infinite scroll marquee with GSAP
function InfiniteMarquee({ children, speed = 50, direction = "left" }: { children: React.ReactNode; speed?: number; direction?: "left" | "right" }) {
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

// Interactive grid demo
const GRID_LAYOUTS = [
  [{ span: 4, start: 1 }, { span: 4, start: 5 }, { span: 4, start: 9 }],
  [{ span: 6, start: 1 }, { span: 6, start: 7 }],
  [{ span: 3, start: 1 }, { span: 6, start: 4 }, { span: 3, start: 10 }],
];

function GridDemo({ layout }: { layout: number }) {
  return (
    <div className="grid grid-cols-12 gap-2 h-40 bg-white/5 rounded-lg p-4">
      {GRID_LAYOUTS[layout].map((item, i) => (
        <motion.div
          key={`${layout}-${i}`}
          className="bg-white/10 rounded flex items-center justify-center font-mono text-xs text-white/40 border border-white/10"
          style={{ gridColumn: `${item.start} / span ${item.span}` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          {item.span} col
        </motion.div>
      ))}
    </div>
  );
}

// Hover button with text swap
function HoverButton({ children }: { children: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="group relative px-6 sm:px-8 py-3 sm:py-4 border border-white/20 rounded overflow-hidden font-mono text-sm min-h-[44px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      aria-label={children}
    >
      <span className="relative block overflow-hidden h-5">
        <motion.span
          className="block"
          animate={{ y: isHovered ? "-100%" : "0%" }}
          transition={{ duration: 0.45, ease: EASE_BUTTON_HOVER }}
        >
          {children}
        </motion.span>
        <motion.span
          className="absolute top-full left-0 block w-full"
          animate={{ y: isHovered ? "-100%" : "0%" }}
          transition={{ duration: 0.45, ease: EASE_BUTTON_HOVER }}
        >
          {children}
        </motion.span>
      </span>
    </motion.button>
  );
}

// Link with arrow
function CWMLink({ href, children, external = true }: { href: string; children: string; external?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.a
      href={href}
      {...linkProps}
      className="group flex items-center justify-between py-3 border-b border-white/10 min-h-[44px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={children}
    >
      <motion.span
        className="text-sm text-white/60"
        animate={{ color: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)" }}
        transition={{ duration: 0.3, ease: EASE_BUTTON_HOVER }}
      >
        {children}
      </motion.span>
      <motion.span
        className="text-white/40"
        animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE_BUTTON_HOVER }}
        aria-hidden="true"
      >
        ↗
      </motion.span>
    </motion.a>
  );
}


// Scroll-linked horizontal text movement
function ScrollHorizontalText({
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

// Stagger animation demo
function StaggerDemo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="border border-white/10 rounded-lg p-6 sm:p-8 cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
      role="button"
      tabIndex={0}
      aria-label="Stagger effect demo"
    >
      <div className="text-xs text-white/40 mb-4">Stagger effect</div>
      <div className="text-2xl font-medium mb-6 overflow-hidden">
        {"STAGGER".split("").map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{ y: isHovered ? [20, 0] : 0, opacity: isHovered ? [0, 1] : 1 }}
            transition={{ duration: 0.6, delay: i * 0.025, ease: EASE_SMOOTH }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <div className="font-mono text-xs text-white/30 space-y-1">
        <div>Duration: .6 sec</div>
        <div>Stagger: 0.025 sec</div>
        <div>Method: per-char delay</div>
      </div>
    </motion.div>
  );
}

// Color swatch grid
function ColorSwatchGrid({ colors }: { colors: Array<{ color: string; name: string }> }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {colors.map((c) => (
        <div key={c.color}>
          <div className="h-20 sm:h-24 rounded-lg mb-2" style={{ backgroundColor: c.color }} />
          <div className="font-mono text-xs text-white/40">{c.color}</div>
          <div className="text-xs text-white/30">{c.name}</div>
        </div>
      ))}
    </div>
  );
}

// About section with GSAP ScrollTrigger pin
function AboutSection() {
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
        { width: "30%", height: "50%" },
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
    <section
      ref={sectionRef}
      id="about"
      className="panel min-h-[250vh] bg-[#0a0a0a]"
    >
      <div
        ref={cardRef}
        className="h-screen w-full flex items-center justify-center"
      >
        <div
          ref={containerRef}
          className="relative bg-[#e8e8e8] overflow-hidden rounded-lg"
          style={{ width: "30%", height: "50%" }}
        >
          {/* Eyebrows */}
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

          {/* Main content */}
          <div className="absolute inset-0 flex flex-col items-center justify-between px-3 sm:px-4 py-6 sm:py-8 z-20">
            <div className="w-full">
              <h2
                ref={(el) => { creativityCharsRef.current[0] = el; }}
                className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[1.2] tracking-[-0.02em] text-black max-w-[90%]"
              >
                {creativityTextLine1}
              </h2>
              <p
                ref={(el) => { creativityCharsRef.current[1] = el; }}
                className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[1.2] tracking-[-0.02em] text-black max-w-[90%] mt-4 relative z-30"
              >
                {creativityTextLine2}
              </p>
              <p
                ref={(el) => { creativityCharsRef.current[2] = el; }}
                className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[1.2] tracking-[-0.02em] text-black max-w-[90%] mt-4 relative z-30"
              >
                {creativityTextLine3}
              </p>
            </div>

            {/* Rotating icon */}
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 95 95"
                fill="none"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24"
                aria-label="AARTE icon"
              >
                <rect width="95" height="95" rx="47.5" fill="black" />
                <path
                  ref={iconPathRef}
                  d="M45.6 49H22.9V45.7H45.6L45.5 21.9H49.3L49.1 45.7H71.9V49H49.1L49.3 72.9H45.5L45.6 49Z"
                  fill="#e8e8e8"
                  style={{ transformOrigin: "47.4px 47.4px" }}
                />
              </svg>
            </div>

            {/* Bottom text */}
            <div className="w-full flex justify-center">
              <p className="text-[clamp(3rem,15vw,10rem)] font-pixel leading-[0.9] tracking-tight text-black">
                {techText.split("").map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => { techCharsRef.current[i] = el; }}
                    className="inline-block"
                    style={{ opacity: 0 }}
                  >
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

// Pixel transition effect
const PIXEL_CONFIG = { size: 24, gap: 2, cols: 32, rows: 19 };
const TOTAL_PIXELS = PIXEL_CONFIG.cols * PIXEL_CONFIG.rows;

function PixelTransition() {
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
          <div
            key={i}
            ref={(el) => { pixelsRef.current[i] = el; }}
            className="aspect-square w-full"
            style={{ backgroundColor: "#0a0a0a" }}
          />
        ))}
      </div>
    </div>
  );
}

// Brick blocks
const BRICK_ROWS = [
  [
    { w: 70, h: 45, color: "#3a3a3a" },
    { w: 220, h: 45, color: "#4a4a4a" },
    { w: 35, h: 45, color: "#2a2a2a" },
    { w: 90, h: 45, color: "#3a3a3a" },
  ],
  [
    { w: 160, h: 55, color: "#4a4a4a" },
    { w: 100, h: 55, color: "#3a3a3a" },
    { w: 260, h: 55, color: "#505050" },
  ],
  [
    { w: 80, h: 50, color: "#3a3a3a" },
    { w: 130, h: 50, color: "#4a4a4a" },
    { w: 180, h: 50, color: "#3a3a3a" },
  ],
];

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
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-[3px] z-20"
      style={{ transform: "translateY(20%)" }}
      aria-hidden="true"
    >
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

// Color animated title - reuses SplitTextReveal
function ColorAnimatedTitle({ text, className = "" }: { text: string; className?: string }) {
  const getColorClass = (index: number): string => {
    const pattern = [true, false, true, true, false, false];
    return pattern[index % pattern.length] ? "text-white" : "text-white/40";
  };
  return <SplitTextReveal text={text} className={className} duration={1.2} stagger={0.03} getColorClass={getColorClass} />;
}

// Design+Dev title - reuses SplitTextReveal
function DesignDevTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  const getColorClass = (index: number): string => {
    const pattern = [false, true, false, true, false, true, true, false, true, false];
    return pattern[index % pattern.length] ? "text-black" : "text-black/40";
  };
  return <SplitTextReveal text={text} delay={delay} duration={1.2} stagger={0.04} getColorClass={getColorClass} />;
}

// Intersection section
function IntersectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bricksWrapperRef = useRef<HTMLDivElement>(null);
  const dashesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !bricksWrapperRef.current || !dashesRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
          }
        }
      );

      gsap.to(textRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: 0.5,
        }
      });

      gsap.fromTo(bricksWrapperRef.current,
        { y: 100 },
        {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          }
        }
      );

      gsap.fromTo(bricksWrapperRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.3,
          }
        }
      );

      gsap.fromTo(dashesRef.current,
        { scale: 0.8 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 0.5,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="panel relative min-h-[150vh] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* Radial dashes */}
      <div
        ref={dashesRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      >
        {Array.from({ length: 48 }, (_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-8 md:h-12 bg-linear-to-t from-white/20 to-transparent origin-bottom"
            style={{
              transform: `rotate(${i * 7.5}deg) translateY(-280px)`,
            }}
          />
        ))}
      </div>

      {/* Text content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
        <div ref={textRef}>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white">
            <span className="text-[#ffb700]">AARTE</span> is your personal AI assistant.
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-2">
            It answers you on the channels you already use
          </p>
          <p className="text-[clamp(0.875rem,2.5vw,1.8rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white/50 mt-2">
            WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, WebChat
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-4">
            plus extension channels like
          </p>
          <p className="text-[clamp(0.875rem,2.5vw,1.8rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white/50 mt-2">
            BlueBubbles, Matrix, Zalo, and Zalo Personal
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-4">
            It can speak and listen on <span className="text-white/50">macOS/iOS/Android</span>
          </p>
          <p className="text-[clamp(1rem,3vw,2.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white mt-2">
            and render a live <span className="text-[#ffb700]">Canvas</span> you control.
          </p>
        </div>
      </div>

      {/* Brick blocks overlay - positioned outside text div for proper z-index */}
      <div
        ref={bricksWrapperRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
        style={{ opacity: 1 }}
        aria-hidden="true"
      >
        <BrickBlocks />
      </div>
    </section>
  );
}

// Main component
export default function CreativeManual() {
  const [loading, setLoading] = useState(true);
  useSmoothScroll(!loading);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLayout, setActiveLayout] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let lastX = 0, lastY = 0;

    const updateMousePos = () => {
      setMousePos(prev => prev.x !== lastX || prev.y !== lastY ? { x: lastX, y: lastY } : prev);
      requestAnimationFrame(updateMousePos);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    const rafId = requestAnimationFrame(updateMousePos);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const content = document.querySelector('.scroll-content') as HTMLElement;
    if (!content) return;

    let isAdjusting = false;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const handleScroll = () => {
      if (isAdjusting) return;

      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (currentScrollY >= maxScroll - 5) {
        isAdjusting = true;
        window.scrollTo({ top: 1, behavior: 'instant' as ScrollBehavior });
        requestAnimationFrame(() => { isAdjusting = false; });
      } else if (currentScrollY <= 5) {
        isAdjusting = true;
        window.scrollTo({ top: maxScroll - 1, behavior: 'instant' as ScrollBehavior });
        requestAnimationFrame(() => { isAdjusting = false; });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const navItems = [
    { label: "About", href: "#about" },
    {
      label: "AARTE",
      href: "#design-dev",
      subItems: ["How it works", "Tech Stack", "Skills", "Integrations"].map((title, i) => ({
        label: `2.${i + 1} ${title}`,
        href: `#${title.toLowerCase().replace(/\s+/g, "-")}`
      }))
    },
    { label: "Get Started", href: "#resources" },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white selection:bg-[#ffb700] selection:text-black">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between mix-blend-difference"
        role="banner"
      >
        <a
          href="/"
          className={`${MONO_XS} text-white hover:text-white/60 transition-colors uppercase ${MIN_TOUCH} flex items-center`}
          aria-label="AARTE Home"
        >
          AARTE
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="/signup"
            className="font-mono text-xs text-black bg-white px-3 sm:px-4 py-2 hover:bg-white/90 transition-colors uppercase min-h-[44px] flex items-center"
            aria-label="Get Started with AARTE"
          >
            Get Started
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${MONO_XS} text-white hover:text-white/60 transition-colors uppercase ${MIN_TOUCH} flex items-center`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "Close [×]" : "Menu [+]"}
          </button>
        </div>
      </header>

      {/* Fixed bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-2" role="contentinfo">
        <InfiniteMarquee speed={40} direction="left">
          <span className="font-mono text-[10px] text-white/30 px-8">
            ©AARTE — 2025 · Applied Artificial Intelligence · // site.loaded · [X].{mousePos.x.toFixed(0)}px [Y].{mousePos.y.toFixed(0)}px ·
          </span>
        </InfiniteMarquee>
      </div>

      {/* Navigation overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="fixed inset-y-0 right-0 z-50 w-full lg:w-1/2 bg-[#0a0a0a] flex flex-col border-l border-white/10"
            aria-label="Main navigation"
          >
            {/* Menu Top */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
              <motion.a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-xs text-white hover:text-white/60 transition-colors min-h-[44px] flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                aria-label="AARTE Home"
              >
                AARTE
              </motion.a>
              <motion.button
                onClick={() => setMenuOpen(false)}
                className="font-mono text-xs text-white hover:text-white/60 transition-colors min-h-[44px] flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                aria-label="Close menu"
              >
                Close [<span className="inline-block">x</span>]
              </motion.button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6">
              {navItems.map((item, i) => (
                <div key={item.label} className="group overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-[clamp(2rem,8vw,4rem)] font-medium leading-[1.1] hover:text-white/40 transition-colors py-2 min-h-[44px]"
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: EASE_IN_DROP }}
                    aria-label={item.label}
                  >
                    <ScrambleText text={item.label} isActive={menuOpen} delay={80 + i * 60} />
                  </motion.a>
                  {"subItems" in item && item.subItems && (
                    <div className="pl-4 mt-2 mb-4 space-y-1 overflow-hidden">
                      {item.subItems.map((subItem, j) => (
                        <motion.a
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => setMenuOpen(false)}
                          className="block font-mono text-sm text-white/50 hover:text-white transition-colors py-1 min-h-[44px] flex items-center"
                          initial={{ opacity: 0, y: -30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ delay: 0.2 + i * 0.06 + j * 0.03, duration: 0.4, ease: EASE_IN_DROP }}
                          aria-label={subItem.label}
                        >
                          <ScrambleText text={subItem.label} isActive={menuOpen} delay={200 + i * 60 + j * 30} />
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Menu Footer */}
            <motion.div
              className="px-4 sm:px-6 py-4 sm:py-6 flex items-end justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col gap-1">
                <p className="font-mono text-xs text-white/40">project by</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white/60">AARTE</span>
                </div>
              </div>
              <BarcodeSVG className="h-12 w-auto text-white/20" aria-hidden="true" />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Scroll content wrapper */}
      <div className="scroll-content">

      {/* HERO */}
      <section id="home" className="panel relative min-h-screen overflow-hidden bg-black">

        <PixelTrailCanvas className="!h-screen" />

        {/* Ghost title */}
        <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none" aria-hidden="true">
          <div
            className="text-[clamp(2rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-transparent"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.06)',
            }}
          >
            AARTE:<br />
            Applied Artificial Intelligence
          </div>
        </div>

        {/* Hero Title */}
        <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-3 sm:pt-4 h-[45vh]">
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
                <span className="inline-block group-hover:opacity-0 transition-opacity duration-300 ease-out">
                  Applied Artificial Intelligence
                </span>
                <span className="absolute left-0 top-0 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  Applied ARTificial intelligencE
                </span>
              </span>
            </motion.h1>
          </div>
        </div>

        {/* Coordinates */}
        <motion.div
          className="absolute left-4 sm:left-6 top-[45%] font-mono text-xs text-white/40 uppercase"
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
          className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6"
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
          <svg className="absolute top-[54%] left-[48%] w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect width="14" height="1" fill="currentColor"/>
            <rect width="1" height="14" fill="currentColor"/>
          </svg>
          <svg className="absolute top-[54%] right-4 sm:right-6 w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect width="14" height="1" fill="currentColor"/>
            <rect x="13" width="1" height="14" fill="currentColor"/>
          </svg>
          <svg className="absolute bottom-4 sm:bottom-6 left-[48%] w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect y="13" width="14" height="1" fill="currentColor"/>
            <rect width="1" height="14" fill="currentColor"/>
          </svg>
          <svg className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect y="13" width="14" height="1" fill="currentColor"/>
            <rect x="13" width="1" height="14" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="absolute top-[56%] left-[48%] text-left pr-4 sm:pr-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-medium text-white leading-[1.25] tracking-[-0.01em] mb-4 sm:mb-6">
            Create Your Personal AARTE Agent
          </p>
          <a
            href="/signup"
            className="inline-block font-mono text-sm text-black bg-white px-4 sm:px-6 py-3 hover:bg-white/90 transition-colors uppercase min-h-[44px]"
            aria-label="Get Started with AARTE"
          >
            Get Started →
          </a>
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-[48%] right-4 sm:right-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {[
            { label: "active ingredients", items: [{ text: "Clawd.bot", href: "https://clawd.bot/", external: true }, "n8n", "VPS"], mb: 4 },
            { label: "chapters", items: [{ text: "01. What is AARTE?", href: "#about", external: false }, { text: "02. design + dev", href: "#design", external: false }], mb: 0 }
          ].map((section, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-2">
                <span className={`${MONO_XS_MUTED} uppercase tracking-wider`}>{section.label}</span>
                {typeof section.items[0] === "object" && "href" in section.items[0] && (
                  <a href={section.items[0].href} {...("external" in section.items[0] && section.items[0].external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${MONO_XS} text-white uppercase tracking-wider hover:text-white/60 transition-colors ${MIN_TOUCH} flex items-center`}>
                    {section.items[0].text}
                  </a>
                )}
              </div>
              <div className="border-b border-white/20 mb-2" />
              {section.items.slice(1).map((item, j) => (
                <div key={j}>
                  <div className="flex justify-end mb-2">
                    {typeof item === "string" ? (
                      <span className={`${MONO_XS} text-white uppercase tracking-wider`}>{item}</span>
                    ) : (
                      <a href={item.href} className={`${MONO_XS} text-white uppercase tracking-wider hover:text-white/60 transition-colors ${MIN_TOUCH} flex items-center`}>{item.text}</a>
                    )}
                  </div>
                  <div className={`border-b border-white/20 ${j === section.items.length - 2 ? `mb-${section.mb}` : "mb-2"}`} />
                </div>
              ))}
            </div>
          ))}
        </motion.div>

      </section>

      {/* CHAPTER 1: ABOUT */}
      <AboutSection />

      {/* INTERSECTION TEXT */}
      <IntersectionSection />

      {/* ABOUT DESCRIPTION */}
      <section className="panel py-24 sm:py-32 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-wider">About</span>
          </div>
          <FadeIn>
            <p className="text-[clamp(1.25rem,5vw,4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
              AI Agents are hard to build. Harder to keep running. AARTE handles the infrastructure so you can focus on what you actually do. When something breaks, we pick up the phone.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* PIXEL TRANSITION */}
      <PixelTransition />

      {/* CHAPTER 2: DESIGN + DEV */}
      <section id="design" className="panel min-h-screen py-6 px-4 md:px-6 bg-[#e8e8e8]">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12 md:mb-16 lg:mb-24">
            <div className="md:flex-1">
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium leading-[0.9] tracking-[-0.03em]">
                <span className="block">
                  <DesignDevTitle text="Design &" />
                </span>
                <span className="block">
                  <DesignDevTitle text="Development" delay={0.3} />
                </span>
              </h2>
            </div>

            <div className="md:w-[280px] lg:w-[360px] md:flex-shrink-0">
              <div className="border-t border-black pt-2">
                <span className="font-mono text-[10px] text-black uppercase tracking-wider">Chapter:</span>
                <div className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-medium leading-[0.78] tracking-[-0.04em] text-black md:text-right">
                  02
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[700px]">
            <FadeIn>
              <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-wider">Chapters</h3>
            </FadeIn>
            <div>
              {["HOW IT WORKS", "TECH STACK", "SKILLS", "INTEGRATIONS"].map((title, i) => {
                const item = { num: `2.${i + 1}`, title, href: `#${title.toLowerCase().replace(/\s+/g, "-")}` };
                return (
                <FadeIn key={item.num} delay={i * 0.1}>
                  <a
                    href={item.href}
                    className="group flex items-center py-3 border-t border-black/20 hover:bg-black/5 transition-colors min-h-[44px]"
                    aria-label={`Chapter ${item.num}: ${item.title}`}
                  >
                    <span className="font-mono text-sm text-black/50 w-12 flex-shrink-0">{item.num}</span>
                    <span className="font-mono text-sm text-black uppercase tracking-wider ml-8 sm:ml-32 md:ml-56">{item.title}</span>
                  </a>
                </FadeIn>
              );
              })}
              <div className="border-t border-black/20" />
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 2.1: HOW IT WORKS - Business Case */}
      <section id="how-it-works" className="panel py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="2.1" title="how it works" />

          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 mb-16">
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 overflow-hidden">
                <SplitTextReveal text="Your AI," className="block" />
                <SplitTextReveal text="Your Way" className="block" delay={0.3} />
              </h3>
              <FadeIn delay={0.2}>
                <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-6">
                  AARTE connects to the apps you already use. Send a message on WhatsApp, get a reply from your AI. No new apps to learn. No complicated setup.
                </p>
                <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-6">
                  Your data stays yours. AARTE runs in your own environment — your conversations, your keys, your privacy.
                </p>
              </FadeIn>
            </div>
            <div className="space-y-6">
              <FadeIn delay={0.3}>
                <div className="border border-white/10 rounded-lg p-6">
                  <div className="text-[#ffb700] text-2xl mb-2">01</div>
                  <h4 className="text-lg font-medium mb-2">You message AARTE</h4>
                  <p className="text-white/50 text-sm">Use WhatsApp, Telegram, Slack, or any channel you prefer. Just text like you would a colleague.</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="border border-white/10 rounded-lg p-6">
                  <div className="text-[#ffb700] text-2xl mb-2">02</div>
                  <h4 className="text-lg font-medium mb-2">AARTE understands context</h4>
                  <p className="text-white/50 text-sm">It remembers your preferences, knows your workflow, and learns what matters to your business.</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="border border-white/10 rounded-lg p-6">
                  <div className="text-[#ffb700] text-2xl mb-2">03</div>
                  <h4 className="text-lg font-medium mb-2">AARTE takes action</h4>
                  <p className="text-white/50 text-sm">Draft emails, schedule meetings, answer customer questions, update spreadsheets — all automatically.</p>
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn>
            <div className="bg-white/5 rounded-lg p-6 sm:p-8 text-center">
              <p className="text-xl sm:text-2xl font-medium mb-4">No coding required. No IT department needed.</p>
              <p className="text-white/50 mb-4">AARTE works out of the box. Just connect your accounts and start chatting.</p>
              <p className="text-white/40 text-sm font-mono">100% private · Self-hosted · Your data never leaves your infrastructure</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CHAPTER 2.2: TECH STACK - Architecture */}
      <section id="tech-stack" className="panel py-24 sm:py-32 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ChapterHeader number="2.2" title="tech stack" />

          <div className="grid md:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-16">
            <div className="md:col-span-6">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-6 sm:mb-8 overflow-hidden">
                <SplitTextReveal text="The" className="block" />
                <SplitTextReveal text="Architecture" className="block" delay={0.3} />
              </h3>
              <FadeIn delay={0.2}>
                <p className="text-white/50 leading-relaxed mb-6">
                  AARTE runs on a Gateway process that owns all your channel connections. Messages from WhatsApp, Telegram, Discord, Slack, and more flow into a central WebSocket control plane.
                </p>
                <p className="text-white/50 leading-relaxed mb-6">
                  The Gateway routes messages to AI agents running in RPC mode, maintaining isolated workspaces per conversation. Direct chats share context; groups stay isolated.
                </p>
              </FadeIn>
            </div>

            <div className="md:col-span-6">
              <FadeIn delay={0.3}>
                <div className="border border-white/10 rounded-lg p-4 sm:p-6">
                  <div className="font-mono text-xs text-white/40 mb-6">message flow</div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 sm:w-24 text-right font-mono text-xs text-white/60">Channels</div>
                      <div className="flex-1 h-px bg-white/20" />
                      <div className="font-mono text-xs text-white text-right sm:text-left">WhatsApp, Telegram, Discord, Slack, iMessage</div>
                    </div>
                    <div className="flex items-center justify-center" aria-hidden="true">
                      <span className="font-mono text-xs text-white/40">↓</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 sm:w-24 text-right font-mono text-xs text-white/60">Gateway</div>
                      <div className="flex-1 h-px bg-white/20" />
                      <div className="font-mono text-xs text-white text-right sm:text-left">WebSocket control plane @ :18789</div>
                    </div>
                    <div className="flex items-center justify-center" aria-hidden="true">
                      <span className="font-mono text-xs text-white/40">↓</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 sm:w-24 text-right font-mono text-xs text-white/60">AI Agent</div>
                      <div className="flex-1 h-px bg-white/20" />
                      <div className="font-mono text-xs text-white text-right sm:text-left">Claude / GPT in RPC mode</div>
                    </div>
                    <div className="flex items-center justify-center" aria-hidden="true">
                      <span className="font-mono text-xs text-white/40">↓</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 sm:w-24 text-right font-mono text-xs text-white/60">Canvas</div>
                      <div className="flex-1 h-px bg-white/20" />
                      <div className="font-mono text-xs text-white text-right sm:text-left">HTTP file server @ :18793</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
              {[
                { label: "Runtime", value: "Node.js ≥ 22" },
                { label: "Config", value: "~/.clawdbot/clawdbot.json" },
                { label: "Service", value: "launchd / systemd" },
                { label: "Network", value: "Loopback + Tailscale" },
              ].map((item) => (
                <div key={item.label} className="border border-white/10 p-3 sm:p-4 rounded">
                  <div className="font-mono text-[10px] text-white/40 uppercase mb-1">{item.label}</div>
                  <div className="font-mono text-xs sm:text-sm text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-white/40 text-sm mb-4">
                AARTE is powered by <a href="https://clawd.bot" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#ffb700] transition-colors">Clawdbot</a> — the open-source AI assistant framework.
              </p>
              <a
                href="https://github.com/clawdbot/clawdbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs text-white/60 hover:text-white transition-colors min-h-[44px]"
                aria-label="View Clawdbot on GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CHAPTER 2.3: SKILLS */}
      <section id="skills" className="panel py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="2.3" title="skills" />

          <h3 className="text-[clamp(2rem,6vw,4rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8">
            <LineReveal>Teach AARTE</LineReveal>
            <LineReveal delay={0.15}>New Skills</LineReveal>
          </h3>

          <FadeIn delay={0.1}>
            <p className="text-lg sm:text-xl text-white/50 max-w-3xl mb-12 sm:mb-16 leading-relaxed">
              AARTE learns how your business works. Show it once, and it handles it forever.
              Skills are modular capabilities you can add, customize, or build from scratch.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-16">
            <FadeIn delay={0.2}>
              <div className="border border-white/10 rounded-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#EA4335]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#EA4335]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium">Gmail Skill</h4>
                </div>
                <p className="text-white/50 mb-6">
                  &ldquo;When I get an email from a client asking for a quote, draft a response using our pricing template and flag it for my review.&rdquo;
                </p>
                <div className="font-mono text-xs text-white/40 space-y-1">
                  <div>Trigger: New email from client domain</div>
                  <div>Action: Draft reply + add label</div>
                  <div>Review: Notify on WhatsApp</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="border border-white/10 rounded-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium">WhatsApp / Telegram Skill</h4>
                </div>
                <p className="text-white/50 mb-6">
                  &ldquo;Answer customer questions about our business hours, pricing, and services. If they want to book, send them our calendar link.&rdquo;
                </p>
                <div className="font-mono text-xs text-white/40 space-y-1">
                  <div>Trigger: Message containing question</div>
                  <div>Action: AI response from knowledge base</div>
                  <div>Escalate: Forward to human if unsure</div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="bg-white/5 rounded-lg p-6 sm:p-8">
              <h4 className="text-lg font-medium mb-4">Build Your Own Skills</h4>
              <p className="text-white/50 mb-6">
                Skills are just natural language instructions. Describe what you want, and AARTE figures out the rest.
                No coding. No complex workflows. Just tell it what to do.
              </p>
              <div className="font-mono text-sm text-white/60 bg-black/30 p-4 rounded">
                <span className="text-[#ffb700]">You:</span> &ldquo;When someone messages asking about project status, check our Notion board and summarize what&apos;s in progress.&rdquo;
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CHAPTER 2.4: INTEGRATIONS */}
      <section id="integrations" className="panel py-24 sm:py-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="2.4" title="integrations" />

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-16">
            <div>
              <h3 className="text-[clamp(2rem,6vw,4rem)] font-medium leading-[0.9] tracking-[-0.02em] mb-6 sm:mb-8">
                <LineReveal>Connect</LineReveal>
                <LineReveal delay={0.15}>Everything</LineReveal>
              </h3>
              <FadeIn delay={0.4}>
                <p className="text-white/50 leading-relaxed">
                  AARTE works with the tools you already use. No migration needed.
                  Just connect your accounts and start chatting.
                </p>
              </FadeIn>
            </div>
          </div>

          {/* Messaging Channels */}
          <FadeIn>
            <div className="mb-12">
              <h4 className="font-mono text-xs text-white/40 uppercase mb-6">Messaging Channels</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {[
                  { name: "WhatsApp", color: "#25D366", icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
                  { name: "Telegram", color: "#0088cc", icon: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
                  { name: "Discord", color: "#5865F2", icon: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" },
                  { name: "Slack", color: "#4A154B", icon: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" },
                  { name: "iMessage", color: "#34C759", icon: "M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.5 1.5 0 0 0 4 22h.2l3.032-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" },
                  { name: "Signal", color: "#3A76F0", icon: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" },
                ].map((channel) => (
                  <div key={channel.name} className="border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/30 transition-colors">
                    <svg className="w-8 h-8 mb-2" style={{ color: channel.color }} viewBox="0 0 24 24" fill="currentColor">
                      <path d={channel.icon} />
                    </svg>
                    <span className="font-mono text-[10px] text-white/60">{channel.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Business Tools */}
          <FadeIn delay={0.2}>
            <div className="mb-12">
              <h4 className="font-mono text-xs text-white/40 uppercase mb-6">Business Tools</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {[
                  { name: "Gmail", color: "#EA4335" },
                  { name: "Calendar", color: "#4285F4" },
                  { name: "Notion", color: "#FFFFFF" },
                  { name: "Sheets", color: "#34A853" },
                  { name: "Drive", color: "#FBBC04" },
                  { name: "GitHub", color: "#FFFFFF" },
                ].map((tool) => (
                  <div key={tool.name} className="border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/30 transition-colors">
                    <div className="w-8 h-8 mb-2 rounded flex items-center justify-center text-lg font-bold" style={{ color: tool.color }}>
                      {tool.name.charAt(0)}
                    </div>
                    <span className="font-mono text-[10px] text-white/60">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Extension Channels */}
          <FadeIn delay={0.3}>
            <div className="mb-12">
              <h4 className="font-mono text-xs text-white/40 uppercase mb-6">Extension Channels</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: "Matrix", desc: "Decentralized chat" },
                  { name: "BlueBubbles", desc: "iMessage bridge" },
                  { name: "Zalo", desc: "Vietnam messaging" },
                  { name: "Mattermost", desc: "Self-hosted chat" },
                ].map((ext) => (
                  <div key={ext.name} className="border border-white/10 rounded-lg p-4 hover:border-white/30 transition-colors">
                    <span className="font-mono text-sm text-white block">{ext.name}</span>
                    <span className="font-mono text-[10px] text-white/40">{ext.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <p className="text-white/50 text-sm">
                Need a custom integration?
                <a href="mailto:support@aarte.ai" className="text-[#ffb700] hover:underline ml-1">Contact us →</a>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CHAPTER 3: RESOURCES */}
      <section id="resources" className="panel py-24 sm:py-32 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ChapterHeader number="03" title="final word" />
        </div>

        <div className="mb-16 sm:mb-24">
          <FadeIn>
            <p className="text-white/40 mb-8 text-center">Everyone will have their own Applied Artificial Intelligence. Welcome to the future.</p>
          </FadeIn>

          <ScrollHorizontalText direction="right" speed={20}>
            <h3 className="text-[clamp(3rem,15vw,12rem)] font-medium leading-[0.9] tracking-[-0.04em] text-white/10">
              Applied Artificial Intelligence. Applied Artificial Intelligence.&nbsp;
            </h3>
          </ScrollHorizontalText>
          <ScrollHorizontalText direction="left" speed={25} className="mt-2">
            <h3 className="text-[clamp(2.5rem,12vw,10rem)] font-medium leading-[0.9] tracking-[-0.04em]">
              Applied Artificial Intelligence. Applied Artificial Intelligence.&nbsp;
            </h3>
          </ScrollHorizontalText>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-24">
            <FadeIn delay={0.2}>
              <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
                Build custom workflows, teach AARTE new skills, and watch your productivity multiply.
                The more you train it, the smarter it gets. Connect your tools, automate the boring stuff,
                and focus on what matters.
              </p>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="font-mono text-xs text-white/40 mb-12">RESOURCES CURATED BY AARTE</div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn>
              <div>
                <h4 className="text-sm text-white/60 mb-6">Inspiration</h4>
                <div className="space-y-1">
                  <ResourceLink href="https://clawd.bot">Clawd.bot</ResourceLink>
                  <ResourceLink href="https://anthropic.com">Anthropic</ResourceLink>
                  <ResourceLink href="https://claude.ai">Claude.ai</ResourceLink>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <h4 className="text-sm text-white/60 mb-6">Resources</h4>
                <div className="space-y-1">
                  <ResourceLink href="https://docs.anthropic.com/en/docs/build-with-claude/tool-use">Claude Skills Documentation</ResourceLink>
                  <ResourceLink href="https://clawd.bot/docs">Clawd.bot Docs</ResourceLink>
                  <ResourceLink href="https://docs.anthropic.com">Anthropic API Docs</ResourceLink>
                  <ResourceLink href="https://github.com/anthropics/anthropic-cookbook">Anthropic Cookbook</ResourceLink>
                  <ResourceLink href="https://console.anthropic.com">Anthropic Console</ResourceLink>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="panel pt-16 sm:pt-24 pb-24 sm:pb-32 px-4 sm:px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-8 mb-12 sm:mb-16">
            <div>
              <div className="font-mono text-xs text-white/40 mb-2">©AARTE — 2025</div>
              <div className="font-mono text-xs text-white/40">
                Applied Artificial Intelligence
              </div>
            </div>

            <BarcodeSVG
              className="h-12 sm:h-16 w-auto text-white/20"
              {...{ initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.8, delay: 0.4 } } as any}
            />
          </div>

          <motion.div
            className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="font-mono text-[10px] text-white/30">
              // site.loaded · initLenis(); initNav(); initLoader();
            </div>
            <div className="font-mono text-[10px] text-white/30">
              [0] aarte.co · [active].status
            </div>
          </motion.div>
        </div>
      </footer>

      </div>

      {/* Duplicate content for seamless infinite scroll */}
      <div className="scroll-content-clone" aria-hidden="true">
        <section className="panel relative min-h-screen overflow-hidden bg-black">
          <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
            <div
              className="text-[clamp(2rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-transparent"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.06)' }}
            >
              AARTE:<br />
              Applied Artificial Intelligence
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 pt-3 sm:pt-4 h-[45vh]">
            <div className="relative w-full h-full">
              <h1 className="text-[clamp(2rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
                AARTE:<br />
                Applied Artificial Intelligence
              </h1>
            </div>
          </div>
          <div className="absolute top-[56%] left-[48%] text-left pr-4 sm:pr-6">
            <p className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-medium text-white leading-[1.25] tracking-[-0.01em] mb-4 sm:mb-6">
              Create Your Personal AARTE Agent
            </p>
            <a
              href="/signup"
              className="inline-block font-mono text-sm text-black bg-white px-4 sm:px-6 py-3 hover:bg-white/90 transition-colors uppercase min-h-[44px]"
            >
              Get Started →
            </a>
          </div>
        </section>
      </div>

    </div>
    </>
  );
}
