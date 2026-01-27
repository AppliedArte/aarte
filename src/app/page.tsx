"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// CWM exact easing functions
const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
const EASE_IN_DROP = [0.6, 0, 0.4, 1] as const; // For menu drop-in animation
const EASE_TEXT_REVEAL = [0.23, 0.32, 0.23, 0.2] as const; // CWM text animation easing
const EASE_BUTTON_HOVER = [0.16, 1, 0.3, 1] as const; // CWM button hover easing
const EASE_SMOOTH = [0.87, 0, 0.13, 1] as const; // CWM micro-interactions

// Pixelated cursor trail canvas - CWM style effect with inverse blend
function PixelTrailCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<{ x: number; y: number; opacity: number; size: number }[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match parent
    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Larger pixel size for CWM effect
    const pixelSize = 20;
    const maxPixels = 100;

    // Use window-level mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      // Check if mouse is within canvas bounds
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) {
        return;
      }

      const x = Math.floor(mouseX / pixelSize) * pixelSize;
      const y = Math.floor(mouseY / pixelSize) * pixelSize;

      // Only add pixel if position changed
      if (!lastPosRef.current || lastPosRef.current.x !== x || lastPosRef.current.y !== y) {
        lastPosRef.current = { x, y };

        // Add new pixel
        pixelsRef.current.push({
          x,
          y,
          opacity: 1,
          size: pixelSize
        });

        // Keep max pixels
        if (pixelsRef.current.length > maxPixels) {
          pixelsRef.current.shift();
        }
      }
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and fade pixels
      pixelsRef.current = pixelsRef.current.filter((pixel) => {
        pixel.opacity -= 0.02;
        if (pixel.opacity <= 0) return false;

        // Solid white squares that fade out
        ctx.fillStyle = `rgba(255, 255, 255, ${pixel.opacity})`;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
        return true;
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Listen on window for reliable mouse tracking
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
      className={`absolute inset-0 z-30 mix-blend-difference ${className}`}
    />
  );
}

// Scramble text component for menu
function ScrambleText({ text, isActive, delay = 0 }: { text: string; isActive: boolean; delay?: number }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const totalIterations = text.length * 4;
    let interval: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration / 4) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        iteration++;
        if (iteration >= totalIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, 50);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, isActive, delay]);

  return <span>{displayText}</span>;
}

// Preloader - exact CWM style
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

  const dialTypes = ["y", "white", "white", "white", "gray", "gray", "gray", "dark", "dark", "dark", "white"];
  const dialColors = { y: "bg-[#ffb700]", white: "bg-[#999]", gray: "bg-[#444]", dark: "bg-[#222]" };
  const statusText = "[status:active]";
  const statusChars = new Set(["s", "t", "a", "u"]);

  return (
    <motion.div
      className="fixed inset-0 z-60 bg-[#0a0a0a] p-6"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Middle vertical line - loader-midline */}
      <div className="absolute inset-0 flex justify-center items-center">
        <motion.div
          className="w-px bg-[#222] h-full origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      {/* Status text - loader_text with character blink */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-wider flex">
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

      {/* Dials - loader-dials: right side, 1.4rem wide */}
      <div className="absolute right-6 top-0 bottom-0 w-[1.4rem] flex flex-col justify-between py-6 overflow-hidden">
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

      {/* Percentage - moves from bottom to center, left of midline */}
      <motion.div
        className="absolute right-[52%] flex items-end gap-1"
        style={{
          bottom: `${progress * 0.5}%`, // 0% -> bottom, 100% -> 50% (center)
        }}
      >
        <motion.span
          className="font-mono loader-percent font-medium text-white"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {Math.round(progress)}%
        </motion.span>
      </motion.div>

      {/* Details - loader-details-wrap: left side at 50% from top */}
      <motion.div
        className="absolute left-6 top-[50svh] flex flex-col gap-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Blocks - loader-details-blocks */}
        <div className="flex gap-1">
          <motion.div
            className="w-[0.8rem] h-[0.8rem] bg-[#ffb700]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <div className="w-[0.8rem] h-[0.8rem] border border-[#444] bg-transparent" />
        </div>

        {/* Copyright */}
        <p className="font-mono text-xs text-white/40">©CWM — FW25</p>

        {/* Credits */}
        <div className="font-mono text-xs text-white/30 space-y-0.5">
          <p className="text-white/40">prjct by</p>
          <p className="text-white/60">huy + ivor</p>
        </div>

        {/* Code */}
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

// Native smooth scroll - Lenis removed for performance
function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    // Use native CSS smooth scroll instead of JS-based solution
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [enabled]);
}

// Line reveal animation - CWM style with 1.5s duration
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

// Split text reveal - CWM style with staggered character animation
function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
  duration = 1.5
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
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

// Corner bracket SVG helper
function CornerBracket({ position, className = "", delay = 0 }: { position: "tl" | "tr" | "bl" | "br"; className?: string; delay?: number }) {
  const paths = {
    tl: "M8 4H4v4M4 4v16",
    tr: "M16 4h4v4M20 4v16",
    bl: "M4 20V4M4 20h4",
    br: "M20 20V4M20 20h-4"
  };

  return (
    <motion.svg
      className={`absolute w-8 h-8 text-white/20 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d={paths[position]} />
    </motion.svg>
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
      className="flex items-center gap-4 mb-16"
    >
      <span className="font-mono text-xs text-white/40">{number}</span>
      <div className="flex-1 h-px bg-white/10" />
      <span className="font-mono text-xs text-white/40">{title}</span>
    </motion.div>
  );
}

// Infinite scroll marquee with GSAP
function InfiniteMarquee({ children, speed = 50, direction = "left" }: { children: React.ReactNode; speed?: number; direction?: "left" | "right" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const inner = innerRef.current;
    const totalWidth = inner.scrollWidth / 2;

    // Set initial position based on direction
    if (direction === "right") {
      gsap.set(inner, { x: -totalWidth });
    }

    const tween = gsap.to(inner, {
      x: direction === "left" ? -totalWidth : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const val = parseFloat(x);
          if (direction === "left") {
            return val % totalWidth;
          } else {
            return (val % totalWidth) - totalWidth;
          }
        })
      }
    });

    return () => {
      tween.kill();
    };
  }, [speed, direction]);

  return (
    <div ref={containerRef} className="overflow-hidden whitespace-nowrap">
      <div ref={innerRef} className="inline-flex">
        {children}
        {children}
      </div>
    </div>
  );
}

// Interactive grid demo
function GridDemo({ layout }: { layout: number }) {
  const layouts = [
    [{ span: 4, start: 1 }, { span: 4, start: 5 }, { span: 4, start: 9 }],
    [{ span: 6, start: 1 }, { span: 6, start: 7 }],
    [{ span: 3, start: 1 }, { span: 6, start: 4 }, { span: 3, start: 10 }],
  ];
  const currentLayout = layouts[layout];

  return (
    <div className="grid grid-cols-12 gap-2 h-40 bg-white/5 rounded-lg p-4">
      {currentLayout.map((item, i) => (
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

// Hover button with text swap - CWM exact styling
function HoverButton({ children }: { children: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="group relative px-8 py-4 border border-white/20 rounded overflow-hidden font-mono text-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
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

// CWM-style link with arrow and text slide
function CWMLink({
  href,
  children,
  external = true
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between py-3 border-b border-white/10 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative block overflow-hidden">
        <motion.span
          className="block text-sm text-white/60"
          animate={{ x: isHovered ? 10 : 0, color: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)" }}
          transition={{ duration: 0.45, ease: EASE_BUTTON_HOVER }}
        >
          {children}
        </motion.span>
      </span>
      <motion.span
        className="text-white/40"
        animate={{
          x: isHovered ? 0 : -10,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.45, ease: EASE_BUTTON_HOVER }}
      >
        ↗
      </motion.span>
    </motion.a>
  );
}

// Resource link with arrow - uses CWMLink
function ResourceLink({ href, children }: { href: string; children: string }) {
  return <CWMLink href={href}>{children}</CWMLink>;
}


// Scroll-linked horizontal text movement component - GSAP version
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
    if (!containerRef.current || !innerRef.current) return;

    const xValue = direction === "left" ? `-${speed}%` : `${speed}%`;
    const fromX = direction === "left" ? "0%" : `-${speed}%`;

    gsap.fromTo(
      innerRef.current,
      { x: fromX },
      {
        x: xValue,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, [direction, speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="whitespace-nowrap">
        {children}
      </div>
    </div>
  );
}

// Stagger animation demo component
function StaggerDemo() {
  const [isHovered, setIsHovered] = useState(false);
  const letters = "STAGGER".split("");

  return (
    <motion.div
      className="border border-white/10 rounded-lg p-8 cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
    >
      <div className="text-xs text-white/40 mb-4">Stagger effect</div>
      <div className="text-2xl font-medium mb-6 overflow-hidden">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{
              y: isHovered ? [20, 0] : 0,
              opacity: isHovered ? [0, 1] : 1
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.025,
              ease: EASE_SMOOTH
            }}
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
    <div className="grid grid-cols-3 gap-4">
      {colors.map((c) => (
        <div key={c.color}>
          <div className="h-24 rounded-lg mb-2" style={{ backgroundColor: c.color }} />
          <div className="font-mono text-xs text-white/40">{c.color}</div>
          <div className="text-xs text-white/30">{c.name}</div>
        </div>
      ))}
    </div>
  );
}

// Pixelated text component - CWM style dithered effect
function PixelatedText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontFamily: "var(--font-mono), monospace",
        letterSpacing: "-0.02em",
        textRendering: "geometricPrecision",
        WebkitFontSmoothing: "none",
        filter: "contrast(1.1)",
      }}
    >
      {text}
    </span>
  );
}

// About section with GSAP ScrollTrigger pin - CWM exact style
function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconPathRef = useRef<SVGPathElement>(null);
  const creativityCharsRef = useRef<(HTMLDivElement | null)[]>([]);
  const techCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const creativityText = "CREATIVITY";
  const techText = "</TECHNICALITY>";

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current || !containerRef.current || !iconPathRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the card section like CWM does
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%",
        pin: cardRef.current,
        pinSpacing: true,
      });

      // Animate container from 30% width/50% height to 100%/100%
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

      // CREATIVITY letters drop down from above (Y from -100% to 0%)
      creativityCharsRef.current.forEach((char, i) => {
        if (!char) return;
        gsap.fromTo(
          char,
          { yPercent: -100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${5 + i * 3}% top`,
              end: `top+=${15 + i * 3}% top`,
              scrub: true,
            },
          }
        );
      });

      // Rotate the + path to × (45 degrees)
      gsap.to(iconPathRef.current, {
        rotation: 45,
        transformOrigin: "center center",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: true,
        },
      });

      // Character reveal animation for </TECHNICALITY> - CWM style
      techCharsRef.current.forEach((char, i) => {
        if (!char) return;
        // Skip < / space > characters - they're always visible
        const alwaysVisible = [0, 1, 2, 14]; // <, /, space, >
        if (alwaysVisible.includes(i)) return;

        gsap.fromTo(
          char,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${40 + (i * 4)}% top`,
              end: `top+=${50 + (i * 4)}% top`,
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
      {/* Card wrapper - this gets pinned */}
      <div
        ref={cardRef}
        className="h-screen w-full flex items-center justify-center"
      >
        {/* Inner container - starts small (30% x 50%) and scales to full */}
        <div
          ref={containerRef}
          className="relative bg-[#e8e8e8] overflow-hidden rounded-lg"
          style={{ width: "30%", height: "50%" }}
        >
          {/* Eyebrows container - full height, vertical flex with justify-between */}
          <div className="absolute inset-0 flex flex-col justify-between px-4 py-3 pointer-events-none z-10">
            {/* Top eyebrow row */}
            <div className="flex justify-between items-center w-full">
              <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">chapter 1:</p>
              <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">about</p>
            </div>
            {/* Bottom eyebrow row */}
            <div className="flex justify-between items-center w-full">
              <p className="font-mono text-[10px] text-black/60 uppercase tracking-wider">Why creative websites?</p>
              <p className="font-mono text-[10px] text-black/60">←</p>
            </div>
          </div>

          {/* Main content - CWM style: CREATIVITY at top, × icon center, </TECHNICALITY> at bottom */}
          <div className="absolute inset-0 flex flex-col items-center justify-between px-4 py-12 overflow-hidden">
            {/* CREATIVITY text - letters drop from above */}
            <div className="w-full overflow-hidden">
              <h2 className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[0.9] tracking-[-0.03em] text-black flex">
                {creativityText.split("").map((char, i) => (
                  <div
                    key={i}
                    ref={(el) => { creativityCharsRef.current[i] = el; }}
                    className="inline-block"
                    style={{ transform: "translateY(-100%)" }}
                  >
                    {char}
                  </div>
                ))}
              </h2>
            </div>

            {/* Rotating +/X icon - CWM exact SVG */}
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 95 95"
                fill="none"
                className="w-12 h-12 md:w-16 md:h-16"
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

            {/* </TECHNICALITY> - CWM pixel style with scroll-based character reveal */}
            <div className="w-full flex justify-center overflow-hidden">
              <span className="text-[clamp(1rem,3vw,2.5rem)] font-pixel leading-none tracking-tight text-black whitespace-nowrap">
                {techText.split("").map((char, i) => {
                  // < / space > are always visible
                  const alwaysVisible = [0, 1, 2, 14];
                  return (
                    <span
                      key={i}
                      ref={(el) => { techCharsRef.current[i] = el; }}
                      className="inline-block"
                      style={{ opacity: alwaysVisible.includes(i) ? 1 : 0 }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pixel transition effect - CWM style full-width dithered transition
function PixelTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Full width grid - responsive columns
  const cols = 10;
  const rows = 9;
  const totalPixels = cols * rows;

  // Pattern for which pixels are black (creates dithered look)
  const blackPixels = new Set([1, 3, 6, 12, 24, 66, 79, 85]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each pixel with staggered timing based on row position
      pixelsRef.current.forEach((pixel, i) => {
        if (!pixel) return;

        const row = Math.floor(i / cols);
        // Bottom rows appear first (row 8 = 0 delay, row 0 = max delay)
        // Add random offset for organic dithered feel
        const rowDelay = ((rows - 1 - row) / rows) * 0.6 + Math.random() * 0.1;

        gsap.fromTo(
          pixel,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top-=${50 - rowDelay * 100}% bottom`,
              end: `center-=${rowDelay * 50}% center`,
              scrub: 0.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full py-16 md:py-24 bg-[#0a0a0a]"
    >
      <div
        className="w-full grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: "3px",
        }}
      >
        {Array.from({ length: totalPixels }, (_, i) => (
          <div
            key={i}
            ref={(el) => { pixelsRef.current[i] = el; }}
            className={`aspect-[1.5] ${blackPixels.has(i) ? "bg-black" : "bg-[#e8e8e8]"}`}
            style={{ opacity: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

// Radial dashed lines decoration - CWM style
function RadialDashes({ className = "" }: { className?: string }) {
  const dashes = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
      {dashes.map((angle) => (
        <div
          key={angle}
          className="absolute w-px h-24 bg-gradient-to-t from-white/20 to-transparent origin-bottom"
          style={{ transform: `rotate(${angle}deg) translateY(-150px)` }}
        />
      ))}
    </div>
  );
}

// Brick blocks - CWM style grid pattern - GSAP version
function BrickBlocks() {
  const containerRef = useRef<HTMLDivElement>(null);

  // CWM-style brick wall pattern
  const brickRows = [
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

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      y: "-20%",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.3,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-[3px] z-20"
      style={{ transform: "translateY(20%)" }}
    >
      {brickRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[3px] justify-center">
          {row.map((brick, brickIndex) => (
            <div
              key={brickIndex}
              style={{
                width: brick.w,
                height: brick.h,
                backgroundColor: brick.color,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Letter-by-letter color animation title - CWM style
function ColorAnimatedTitle({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Deterministic pattern based on character index (alternating with variation)
  const getColorClass = (index: number): string => {
    // Pattern: white, gray, white, white, gray, gray (repeating)
    const pattern = [true, false, true, true, false, false];
    return pattern[index % pattern.length] ? "text-white" : "text-white/40";
  };

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block ${getColorClass(i)}`}
          initial={{ y: 100, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{
            duration: 1.2,
            delay: i * 0.03,
            ease: EASE_TEXT_REVEAL
          }}
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// Design+Dev title with letter color animation - CWM style (black/gray on light bg)
function DesignDevTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // CWM pattern: some letters are darker (black), some lighter (gray)
  // Pattern observed: D(gray), e(black), s(gray), i(black), g(gray), n(black), etc.
  const getColorClass = (index: number): string => {
    const pattern = [false, true, false, true, false, true, true, false, true, false];
    return pattern[index % pattern.length] ? "text-black" : "text-black/40";
  };

  return (
    <span ref={ref}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block ${getColorClass(i)}`}
          initial={{ y: 80, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
          transition={{
            duration: 1.2,
            delay: delay + i * 0.04,
            ease: EASE_TEXT_REVEAL
          }}
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// Intersection text section with brick blocks overlay - GSAP version
function IntersectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bricksWrapperRef = useRef<HTMLDivElement>(null);
  const dashesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !bricksWrapperRef.current || !dashesRef.current) return;

    const ctx = gsap.context(() => {
      // Text opacity animation
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

      // Fade out text at end
      gsap.to(textRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 80%",
          end: "bottom 20%",
          scrub: 0.5,
        }
      });

      // Bricks Y animation
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

      // Dashes scale animation
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
      {/* Radial dashes circle */}
      <div
        ref={dashesRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div ref={textRef}>
          <p className="text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
            Creative websites are the
          </p>
          <p className="text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
            intersection of <span className="text-white/50">creativity</span>
          </p>
          <p className="text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
            and <span className="text-white/50">technicality</span> to form
          </p>
          <p className="text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
            bespoke digital experiences
          </p>
          <p className="text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
            that spark <span className="text-[#ffb700]">emotion</span>.
          </p>
        </div>

        {/* Brick blocks overlay */}
        <div
          ref={bricksWrapperRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <BrickBlocks />
        </div>
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
    let rafId: number;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };

    // Update state at 30fps max to reduce re-renders
    const updateMousePos = () => {
      setMousePos(prev => {
        if (prev.x !== lastX || prev.y !== lastY) {
          return { x: lastX, y: lastY };
        }
        return prev;
      });
      rafId = requestAnimationFrame(updateMousePos);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateMousePos);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Disabled infinite scroll - causes issues with initial positioning
  // The infinite scroll was causing the page to start at the footer instead of hero

  const navItems = [
    { label: "About", href: "#about" },
    {
      label: "Design + Dev",
      href: "#design-dev",
      subItems: [
        { label: "2.1 Grids & layouts", href: "#grids" },
        { label: "2.2 typography", href: "#typography" },
        { label: "2.3 color", href: "#color" },
        { label: "2.4 motion", href: "#motion" },
      ]
    },
    { label: "Resources", href: "#resources" },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb700] selection:text-black">
      {/* Header - CWM exact style */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-end mix-blend-difference"
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase"
        >
          {menuOpen ? "Close [×]" : "Menu [+]"}
        </button>
      </header>

      {/* Fixed bottom status bar - CWM style with infinite marquee */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm py-2">
        <InfiniteMarquee speed={40} direction="left">
          <span className="font-mono text-[10px] text-white/30 px-8">
            ©CWM — FW25 · prjct by huy + ivor · [l] vn.us · // site.loaded · [X].{mousePos.x.toFixed(0)}px [Y].{mousePos.y.toFixed(0)}px ·
          </span>
        </InfiniteMarquee>
      </div>

      {/* Navigation overlay - CWM Style */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="fixed inset-y-0 right-0 z-50 w-full lg:w-1/2 bg-[#0a0a0a] flex flex-col border-l border-white/10"
          >
            {/* Menu Top - Home & Close */}
            <div className="flex items-center justify-between px-6 py-4">
              <motion.a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-xs text-white hover:text-white/60 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                ©CWM
              </motion.a>
              <motion.button
                onClick={() => setMenuOpen(false)}
                className="font-mono text-xs text-white hover:text-white/60 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Close [<span className="inline-block">x</span>]
              </motion.button>
            </div>

            {/* Menu Links - Drop-in animation with text scramble */}
            <div className="flex-1 flex flex-col justify-center px-6">
              {navItems.map((item, i) => (
                <div key={item.label} className="group overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-[clamp(2rem,8vw,4rem)] font-medium leading-[1.1] hover:text-white/40 transition-colors py-2"
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: EASE_IN_DROP }}
                  >
                    <ScrambleText text={item.label} isActive={menuOpen} delay={150 + i * 120} />
                  </motion.a>
                  {/* Sub-items for Design + Dev */}
                  {"subItems" in item && item.subItems && (
                    <div className="pl-4 mt-2 mb-4 space-y-1 overflow-hidden">
                      {item.subItems.map((subItem, j) => (
                        <motion.a
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => setMenuOpen(false)}
                          className="block font-mono text-sm text-white/50 hover:text-white transition-colors py-1"
                          initial={{ opacity: 0, y: -30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ delay: 0.4 + i * 0.12 + j * 0.06, duration: 0.6, ease: EASE_IN_DROP }}
                        >
                          <ScrambleText text={subItem.label} isActive={menuOpen} delay={400 + i * 120 + j * 60} />
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Menu Footer - Credits & Barcode */}
            <motion.div
              className="px-6 py-6 flex items-end justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col gap-1">
                <p className="font-mono text-xs text-white/40">project by</p>
                <div className="flex items-center gap-2">
                  <a href="https://bymonolog.com/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-white/60 hover:text-white transition-colors">
                    huy
                  </a>
                  <span className="font-mono text-xs text-white/40">+</span>
                  <a href="https://www.ivorjian.com/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-white/60 hover:text-white transition-colors">
                    ivor
                  </a>
                </div>
              </div>
              {/* Barcode SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333 109" fill="none" className="h-12 w-auto text-white/20">
                <path d="M0 109V0H5.54237V109H0ZM11.0847 109V0H16.6271V109H11.0847ZM22.1695 109V0H38.7966V109H22.1695ZM44.339 109V0H60.9661V109H44.339ZM77.5932 109V0H83.1356V109H77.5932Z" fill="currentColor" />
                <path d="M83.2222 109V0H99.8493V109H83.2222ZM105.392 109V0H110.934V109H105.392ZM116.476 109V0H122.019V109H116.476ZM138.646 109V0H155.273V109H138.646ZM160.815 109V0H166.358V109H160.815Z" fill="currentColor" />
                <path d="M166.444 109V0H183.072V109H166.444ZM188.614 109V0H194.156V109H188.614ZM199.699 109V0H216.326V109H199.699ZM232.953 109V0H238.495V109H232.953ZM244.038 109V0H249.58V109H244.038Z" fill="currentColor" />
                <path d="M249.667 109V0H255.209V109H249.667ZM271.836 109V0H288.463V109H271.836ZM294.006 109V0H299.548V109H294.006ZM305.09 109V0H321.717V109H305.09ZM327.26 109V0H332.802V109H327.26Z" fill="currentColor" />
              </svg>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ==================== HERO ==================== */}
      <section id="home" className="panel relative min-h-screen overflow-hidden bg-[#070707]">
        {/* CWM-style warm gradient border/vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: 'inset 0 0 200px 80px rgba(139, 69, 19, 0.2), inset 0 0 100px 40px rgba(101, 67, 33, 0.15), inset 0 -100px 150px -50px rgba(60, 30, 10, 0.3)',
          }}
        />

        {/* Ghost/outline title behind main text - CWM style */}
        <div className="absolute top-0 left-0 right-0 px-6 pt-4 pointer-events-none">
          <div
            className="text-[clamp(3rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-transparent"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.06)',
            }}
          >
            AARTE<br />
            Applied AI<span className="text-[0.5em] align-super">™</span>
          </div>
        </div>

        {/* Hero Main Title - AARTE with pixel trail */}
        <div className="absolute top-0 left-0 right-0 px-6 pt-4 h-[45vh]">
          <div className="relative w-full h-full">
            <motion.h1
              className="text-[clamp(3rem,12vw,9rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: EASE_OUT_EXPO }}
            >
              AARTE<br />
              Applied AI<span className="text-[0.5em] align-super">™</span>
            </motion.h1>
            {/* Pixelated cursor trail overlay - covers title area with inverse blend */}
            <PixelTrailCanvas />
          </div>
        </div>

        {/* Left side - Coordinates */}
        <motion.div
          className="absolute left-6 top-[45%] font-mono text-xs text-white/40 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
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

        {/* Left bottom - Project Credits with Barcode */}
        <motion.div
          className="absolute bottom-6 left-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="font-mono text-[10px] text-white/30 uppercase mb-1">project by</div>
          <div className="flex items-center gap-2 mb-4">
            <a href="https://bymonolog.com/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-white/60 hover:text-white transition-colors uppercase">huy</a>
            <span className="font-mono text-xs text-white/30">+</span>
            <a href="https://www.ivorjian.com/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-white/60 hover:text-white transition-colors uppercase">ivor</a>
          </div>
          {/* Barcode SVG - CWM exact style */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333 109" fill="none" className="h-20 w-auto text-white">
            <path d="M0 109V0H5.54237V109H0ZM11.0847 109V0H16.6271V109H11.0847ZM22.1695 109V0H38.7966V109H22.1695ZM44.339 109V0H60.9661V109H44.339ZM77.5932 109V0H83.1356V109H77.5932Z" fill="currentColor" />
            <path d="M83.2222 109V0H99.8493V109H83.2222ZM105.392 109V0H110.934V109H105.392ZM116.476 109V0H122.019V109H116.476ZM138.646 109V0H155.273V109H138.646ZM160.815 109V0H166.358V109H160.815Z" fill="currentColor" />
            <path d="M166.444 109V0H183.072V109H166.444ZM188.614 109V0H194.156V109H188.614ZM199.699 109V0H216.326V109H199.699ZM232.953 109V0H238.495V109H232.953ZM244.038 109V0H249.58V109H244.038Z" fill="currentColor" />
            <path d="M249.667 109V0H255.209V109H249.667ZM271.836 109V0H288.463V109H271.836ZM294.006 109V0H299.548V109H294.006ZM305.09 109V0H321.717V109H305.09ZM327.26 109V0H332.802V109H327.26Z" fill="currentColor" />
          </svg>
        </motion.div>

        {/* CWM-style corner brackets - positioned around right content area (subtitle + info) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Top left bracket - marks left edge of subtitle area */}
          <svg className="absolute top-[54%] left-[48%] w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect width="14" height="1" fill="currentColor"/>
            <rect width="1" height="14" fill="currentColor"/>
          </svg>
          {/* Top right bracket - right edge near screen edge */}
          <svg className="absolute top-[54%] right-6 w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect width="14" height="1" fill="currentColor"/>
            <rect x="13" width="1" height="14" fill="currentColor"/>
          </svg>
          {/* Bottom left bracket */}
          <svg className="absolute bottom-6 left-[48%] w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect y="13" width="14" height="1" fill="currentColor"/>
            <rect width="1" height="14" fill="currentColor"/>
          </svg>
          {/* Bottom right bracket */}
          <svg className="absolute bottom-6 right-6 w-3 h-3 text-white/30" viewBox="0 0 14 14" fill="none">
            <rect y="13" width="14" height="1" fill="currentColor"/>
            <rect x="13" width="1" height="14" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Right side - Subtitle - CWM style (inside bracket area) */}
        <motion.div
          className="absolute top-[56%] left-[48%] text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-[clamp(1.5rem,2.5vw,2.5rem)] font-medium text-white leading-[1.25] tracking-[-0.01em]">
            The creative process of<br />
            crafting stand-out websites
          </p>
        </motion.div>

        {/* Right side - Info Section - CWM exact layout */}
        <motion.div
          className="absolute bottom-8 left-[48%] right-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {/* Active Ingredients row */}
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">active ingredients</span>
            <span className="font-mono text-xs text-white uppercase tracking-wider">webflow</span>
          </div>
          <div className="border-b border-white/20 mb-2" />

          {/* GSAP row */}
          <div className="flex justify-end mb-2">
            <span className="font-mono text-xs text-white uppercase tracking-wider">gsap</span>
          </div>
          <div className="border-b border-white/20 mb-4" />

          {/* Chapters row */}
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">chapters</span>
            <span className="font-mono text-xs text-white uppercase tracking-wider">01. about</span>
          </div>
          <div className="border-b border-white/20 mb-2" />

          {/* Design + Dev row */}
          <div className="flex justify-end mb-2">
            <span className="font-mono text-xs text-white uppercase tracking-wider">02. design + dev</span>
          </div>
          <div className="border-b border-white/20" />
        </motion.div>

      </section>

      {/* ==================== CHAPTER 1: ABOUT ==================== */}
      <AboutSection />

      {/* ==================== INTERSECTION TEXT WITH BRICK BLOCKS ==================== */}
      <IntersectionSection />

      {/* ==================== ABOUT DESCRIPTION SECTION ==================== */}
      <section className="panel py-32 px-6 bg-[#0a0a0a]">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-wider">About</span>
          </div>
          <FadeIn>
            <p className="text-[clamp(1.5rem,5vw,4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
              This project is dedicated to the methodology behind crafting websites that pushes boundaries. Our process values curiosity iteration, and experimentation. View some of our techniques on creating projects that leave a lasting impression.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ==================== PIXEL TRANSITION TO CHAPTER 2 ==================== */}
      <PixelTransition />

      {/* ==================== CHAPTER 2: DESIGN + DEV ==================== */}
      <section id="design" className="panel min-h-screen py-6 px-4 md:px-6 bg-[#e8e8e8]">
        <div className="w-full">
          {/* Main header area - CWM layout: title left, chapter number right */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-16 md:mb-24">
            {/* Left side - Title - CWM uses massive text with letter color animation */}
            <div className="md:flex-1">
              <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium leading-[0.9] tracking-[-0.03em]">
                <span className="block">
                  <DesignDevTitle text="Design &" />
                </span>
                <span className="block">
                  <DesignDevTitle text="Development" delay={0.3} />
                </span>
              </h2>
            </div>

            {/* Right side - Chapter number - CWM style with line above */}
            <div className="md:w-[280px] lg:w-[360px] md:flex-shrink-0">
              <div className="border-t border-black pt-2">
                <span className="font-mono text-[10px] text-black uppercase tracking-wider">Chapter:</span>
                <div className="text-6xl md:text-8xl lg:text-9xl font-medium leading-[0.78] tracking-[-0.04em] text-black md:text-right">
                  02
                </div>
              </div>
            </div>
          </div>

          {/* Chapters list - CWM style with horizontal lines - number left, title middle */}
          <div className="max-w-[700px]">
            <FadeIn>
              <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-wider">Chapters</h3>
            </FadeIn>
            <div>
              {[
                { num: "2.1", title: "GRIDS & LAYOUTS", href: "#grids" },
                { num: "2.2", title: "TYPOGRAPHY", href: "#typography" },
                { num: "2.3", title: "COLOR", href: "#color" },
                { num: "2.4", title: "ANIMATION", href: "#motion" }
              ].map((item, i) => (
                <FadeIn key={item.num} delay={i * 0.1}>
                  <a
                    href={item.href}
                    className="group flex items-center py-3 border-t border-black/20 hover:bg-black/5 transition-colors"
                  >
                    <span className="font-mono text-sm text-black/50 w-12 flex-shrink-0">{item.num}</span>
                    <span className="font-mono text-sm text-black uppercase tracking-wider ml-32 md:ml-56">{item.title}</span>
                  </a>
                </FadeIn>
              ))}
              <div className="border-t border-black/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CHAPTER 2.1: GRIDS ==================== */}
      <section id="grids" className="panel py-32 px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="2.1" title="grids & layouts" />

          <div className="grid md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <h3 className="text-4xl md:text-5xl font-medium leading-[1.1] tracking-[-0.02em] mb-8 overflow-hidden">
                <SplitTextReveal text="Grids &" className="block" />
                <SplitTextReveal text="Layouts" className="block" delay={0.3} />
              </h3>
              <FadeIn delay={0.2}>
                <p className="text-white/50 leading-relaxed mb-8">
                  Using a grid can assist in creative cohesive, precise and satisfying layouts by
                  aligning and grouping elements within the grid.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="font-mono text-xs text-white/40 space-y-1">
                  <div>columns: 12</div>
                  <div>rows: auto</div>
                  <div>gutter / gap: 1rem / 16px</div>
                </div>
              </FadeIn>
            </div>

            <div className="md:col-span-7">
              <FadeIn delay={0.2}>
                <div className="border border-white/10 rounded-lg p-6">
                  <div className="font-mono text-xs text-white/40 mb-4">try these different layouts</div>
                  <div className="flex gap-2 mb-6">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => setActiveLayout(i)}
                        className={`px-4 py-2 border rounded font-mono text-xs transition-all ${
                          activeLayout === i
                            ? "border-white bg-white text-black"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        Layout {i + 1}
                      </button>
                    ))}
                  </div>
                  <GridDemo layout={activeLayout} />
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn>
            <p className="text-white/40 text-center max-w-2xl mx-auto text-sm">
              However, grids are just guidelines—breaking out of a grid can form completely different and interesting designs.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ==================== CHAPTER 2.2: TYPOGRAPHY ==================== */}
      <section id="typography" className="panel py-32 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeader number="2.2" title="type fundamentals" />
        </div>

        {/* CWM-style Large Typography marquee - scrolls on scroll */}
        <div className="mb-24">
          <ScrollHorizontalText direction="left" speed={30}>
            <h3 className="text-[clamp(6rem,20vw,16rem)] font-medium leading-[0.85] tracking-[-0.04em] text-white/10">
              Typography. Typography. Typography. Typography.&nbsp;
            </h3>
          </ScrollHorizontalText>
          <ScrollHorizontalText direction="right" speed={25} className="mt-4">
            <h3 className="text-[clamp(4rem,15vw,12rem)] font-medium leading-[0.85] tracking-[-0.04em]">
              Typography. Typography. Typography. Typography.&nbsp;
            </h3>
          </ScrollHorizontalText>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 mb-24">
            <div className="md:col-span-6">
              <FadeIn>
                <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-8">
                  Typography sets the foundation of any creative websites, period. Whether you're trying
                  to establish a strong first impression or communicating a message to a target audience,
                  your type has to be dialed in and align with your story and identity.
                </p>
              </FadeIn>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <FadeIn delay={0.1}>
                <div className="font-mono text-xs text-white/40 space-y-2">
                  <div>Typeface: PP Neue Montreal</div>
                  <div>Letter Spacing: -3%</div>
                  <div>Line Height: 1.1 em</div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Type hierarchy demo - CWM style with staggered reveal */}
          <div className="mb-24">
            <FadeIn>
              <div className="text-sm text-white/40 mb-8">Type hierarchy demonstration</div>
            </FadeIn>
            <div className="space-y-8">
              <div className="overflow-hidden">
                <LineReveal>
                  <div className="text-6xl md:text-8xl font-medium tracking-[-0.03em]">Display</div>
                </LineReveal>
              </div>
              <div className="overflow-hidden">
                <LineReveal delay={0.15}>
                  <div className="text-4xl md:text-5xl font-medium text-white/70 tracking-[-0.02em]">Headline</div>
                </LineReveal>
              </div>
              <div className="overflow-hidden">
                <LineReveal delay={0.3}>
                  <div className="text-xl text-white/50">Body copy — The quick brown fox jumps over the lazy dog.</div>
                </LineReveal>
              </div>
              <div className="overflow-hidden">
                <LineReveal delay={0.45}>
                  <div className="text-sm font-mono text-white/40">CAPTION / MONO — Supporting information and metadata</div>
                </LineReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CHAPTER 2.3: COLORS ==================== */}
      <section id="color" className="panel py-32 px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="2.3" title="color theory" />

          <h3 className="text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.9] tracking-[-0.03em] mb-8">
            <LineReveal>Colors</LineReveal>
          </h3>

          <FadeIn delay={0.1}>
            <p className="text-xl text-white/50 max-w-2xl mb-20 leading-relaxed">
              Every award-winning site shares one thing: intentional color. It's not picked from a palette—
              it's designed to evoke, to direct, and to tell a story.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <FadeIn>
              <div>
                <h4 className="text-sm text-white/40 mb-4">Cool tones</h4>
                <p className="text-white/50 mb-8">Evoke emotions such as calm, sophistication, and trust.</p>
                <ColorSwatchGrid colors={[
                  { color: "#1e3a5f", name: "Deep blue" },
                  { color: "#2d4a3e", name: "Forest" },
                  { color: "#4a4a6a", name: "Slate" },
                ]} />
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <h4 className="text-sm text-white/40 mb-4">Warm tones</h4>
                <p className="text-white/50 mb-8">Evoke emotions such as energy, passion, and anger.</p>
                <ColorSwatchGrid colors={[
                  { color: "#c9562b", name: "Burnt orange" },
                  { color: "#d4a574", name: "Sand" },
                  { color: "#8b4557", name: "Wine" },
                ]} />
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <p className="text-white/40 text-center max-w-2xl mx-auto text-sm">
              Colors on a website are rarely picked randomly. Rather, it's a combination of carefully
              using accent colors to highlight specific elements and using secondary colors to support.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ==================== CHAPTER 2.4: MOTION ==================== */}
      <section id="motion" className="panel py-32 px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <ChapterHeader number="2.4" title="motion & animation" />

          <div className="grid md:grid-cols-2 gap-12 mb-24">
            <div>
              <h3 className="text-[clamp(2rem,6vw,4rem)] font-medium leading-[0.9] tracking-[-0.02em] mb-8">
                <LineReveal>Motion /</LineReveal>
                <LineReveal delay={0.15}>Animation /</LineReveal>
                <LineReveal delay={0.3}>Interaction</LineReveal>
              </h3>
              <FadeIn delay={0.4}>
                <p className="text-white/50 leading-relaxed">
                  Animations can truly make a website come to life. It can tastefully enhance the user
                  experience by drawing attention and establishing a feeling of a website.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <div className="font-mono text-xs text-white/40 space-y-2">
                <div>Duration: 1.5 sec</div>
                <div>Easing: [0.23, 0.32, 0.23, 0.2]</div>
                <div>Stagger: 0.025 sec</div>
              </div>
            </FadeIn>
          </div>

          {/* Animation methods - CWM style with hover states */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {[
              { num: "01", label: "text", desc: "Split & stagger" },
              { num: "02", label: "hover", desc: "Overlap & follow" },
              { num: "03", label: "icons", desc: "Scale & rotate" },
              { num: "04", label: "scroll", desc: "Trigger & parallax" }
            ].map((method, i) => (
              <FadeIn key={method.num} delay={i * 0.1}>
                <motion.div
                  className="group relative p-6 border border-white/10 rounded overflow-hidden cursor-pointer"
                  whileHover={{ borderColor: "rgba(255,255,255,0.3)" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/5"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.6, ease: EASE_SMOOTH }}
                  />
                  <div className="relative">
                    <span className="font-mono text-xs text-white/60 block">{method.num}: {method.label}</span>
                    <span className="font-mono text-[10px] text-white/30 mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">{method.desc}</span>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Interactive demos - CWM style */}
          <FadeIn>
            <div className="text-sm text-white/40 mb-8">Use delays, staggers, and easings to make more organic animations</div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Text reveal demo */}
            <FadeIn>
              <motion.div
                className="border border-white/10 rounded-lg p-8 h-full"
                whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                <div className="text-xs text-white/40 mb-4">Text reveal</div>
                <HoverButton>HOVER ME</HoverButton>
                <div className="font-mono text-xs text-white/30 mt-6 space-y-1">
                  <div>Duration: .45 sec</div>
                  <div>Easing: 0.16, 1, 0.3, 1</div>
                  <div>Method: translateY swap</div>
                </div>
              </motion.div>
            </FadeIn>

            {/* Scale demo */}
            <FadeIn delay={0.1}>
              <motion.div
                className="border border-white/10 rounded-lg p-8 cursor-pointer h-full"
                whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.3)" }}
                transition={{ duration: 0.45, ease: EASE_BUTTON_HOVER }}
              >
                <div className="text-xs text-white/40 mb-4">Scale + follow through</div>
                <motion.div
                  className="text-2xl font-medium mb-6"
                  whileHover={{ letterSpacing: "0.05em" }}
                  transition={{ duration: 0.6, ease: EASE_SMOOTH }}
                >
                  TRANSFORM
                </motion.div>
                <div className="font-mono text-xs text-white/30 space-y-1">
                  <div>Duration: .45 sec</div>
                  <div>Easing: 0.16, 1, 0.3, 1</div>
                  <div>Method: scale + spacing</div>
                </div>
              </motion.div>
            </FadeIn>

            {/* Stagger demo */}
            <FadeIn delay={0.2}>
              <StaggerDemo />
            </FadeIn>
          </div>

          <FadeIn>
            <p className="text-white/40 text-center max-w-2xl mx-auto text-sm">
              Just like in nature, nothing moves in straight lines. Every motion influences the next.
              Delays and easings create that organic rhythm, turning motion into flow.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ==================== CHAPTER 3: RESOURCES ==================== */}
      <section id="resources" className="panel py-32 border-t border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeader number="03" title="final word" />
        </div>

        {/* CWM-style large scrolling text */}
        <div className="mb-24">
          <FadeIn>
            <p className="text-white/40 mb-8 text-center">And last but not least, it is important for you to constantly...</p>
          </FadeIn>

          <ScrollHorizontalText direction="right" speed={20}>
            <h3 className="text-[clamp(4rem,15vw,12rem)] font-medium leading-[0.9] tracking-[-0.04em] text-white/10">
              Put in the reps. Put in the reps. Put in the reps.&nbsp;
            </h3>
          </ScrollHorizontalText>
          <ScrollHorizontalText direction="left" speed={25} className="mt-2">
            <h3 className="text-[clamp(3rem,12vw,10rem)] font-medium leading-[0.9] tracking-[-0.04em]">
              Put in the reps. Put in the reps. Put in the reps.&nbsp;
            </h3>
          </ScrollHorizontalText>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <FadeIn delay={0.2}>
              <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
                Create passion projects, experiment with animations, and explore new design ideas.
                The more you build, break, and refine, the sharper your creative instincts get.
                Make connections, refine your taste, and have fun making websites.
              </p>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="font-mono text-xs text-white/40 mb-12">RESOURCES CURATED BY HUY AND IVOR</div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Books */}
            <FadeIn>
              <div>
                <h4 className="text-sm text-white/60 mb-6">Books</h4>
                <div className="space-y-1">
                  <ResourceLink href="#">SANS-in-USE</ResourceLink>
                  <ResourceLink href="#">display-in-use</ResourceLink>
                  <ResourceLink href="#">Serif-in-use</ResourceLink>
                  <ResourceLink href="#">Grid Systems in Graphic Design</ResourceLink>
                  <ResourceLink href="#">New Utilitarian</ResourceLink>
                  <ResourceLink href="#">Thinking with Type</ResourceLink>
                  <ResourceLink href="#">The Design of Everyday Things</ResourceLink>
                  <ResourceLink href="#">Don't Make Me Think</ResourceLink>
                </div>
              </div>
            </FadeIn>

            {/* Inspiration */}
            <FadeIn delay={0.1}>
              <div>
                <h4 className="text-sm text-white/60 mb-6">Inspiration</h4>
                <div className="space-y-1">
                  <ResourceLink href="#">INSPO.page</ResourceLink>
                  <ResourceLink href="#">AWWWARDS.com</ResourceLink>
                  <ResourceLink href="#">FOOTER.DESIGN</ResourceLink>
                  <ResourceLink href="#">minimal.gallery</ResourceLink>
                  <ResourceLink href="#">maxibestof.one</ResourceLink>
                  <ResourceLink href="#">muzli.me</ResourceLink>
                  <ResourceLink href="#">fontsinuse.com</ResourceLink>
                  <ResourceLink href="#">Grids by obys agency</ResourceLink>
                  <ResourceLink href="#">Motion by Zajno</ResourceLink>
                  <ResourceLink href="#">savee.com</ResourceLink>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="panel pt-24 pb-32 px-6 border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          {/* Footer content - CWM style */}
          <div className="flex flex-wrap items-end justify-between gap-8 mb-16">
            {/* Left side - Copyright and credits */}
            <div>
              <div className="font-mono text-xs text-white/40 mb-2">©CWM — FW25</div>
              <div className="font-mono text-xs text-white/40">
                prjct by{" "}
                <a href="https://bymonolog.com/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">huy</a>
                {" + "}
                <a href="https://www.ivorjian.com/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">ivor</a>
              </div>
            </div>

            {/* Right side - Barcode */}
            <motion.svg
              className="h-16 w-auto text-white/20"
              viewBox="0 0 333 109"
              fill="none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <path d="M0 109V0H5.54237V109H0ZM11.0847 109V0H16.6271V109H11.0847ZM22.1695 109V0H38.7966V109H22.1695ZM44.339 109V0H60.9661V109H44.339ZM77.5932 109V0H83.1356V109H77.5932Z" fill="currentColor" />
              <path d="M83.2222 109V0H99.8493V109H83.2222ZM105.392 109V0H110.934V109H105.392ZM116.476 109V0H122.019V109H116.476ZM138.646 109V0H155.273V109H138.646ZM160.815 109V0H166.358V109H160.815Z" fill="currentColor" />
              <path d="M166.444 109V0H183.072V109H166.444ZM188.614 109V0H194.156V109H188.614ZM199.699 109V0H216.326V109H199.699ZM232.953 109V0H238.495V109H232.953ZM244.038 109V0H249.58V109H244.038Z" fill="currentColor" />
              <path d="M249.667 109V0H255.209V109H249.667ZM271.836 109V0H288.463V109H271.836ZM294.006 109V0H299.548V109H294.006ZM305.09 109V0H321.717V109H305.09ZM327.26 109V0H332.802V109H327.26Z" fill="currentColor" />
            </motion.svg>
          </div>

          {/* Bottom credits */}
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
              [l] vn.us · [active].status
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
    </>
  );
}
