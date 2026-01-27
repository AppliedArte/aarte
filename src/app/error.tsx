"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

function BarcodeSVG({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333 109" fill="none" className={className}>
      <path d="M0 109V0H5.54237V109H0ZM11.0847 109V0H16.6271V109H11.0847ZM22.1695 109V0H38.7966V109H22.1695ZM44.339 109V0H60.9661V109H44.339ZM77.5932 109V0H83.1356V109H77.5932Z" fill="currentColor" />
      <path d="M83.2222 109V0H99.8493V109H83.2222ZM105.392 109V0H110.934V109H105.392ZM116.476 109V0H122.019V109H116.476ZM138.646 109V0H155.273V109H138.646ZM160.815 109V0H166.358V109H160.815Z" fill="currentColor" />
      <path d="M166.444 109V0H183.072V109H166.444ZM188.614 109V0H194.156V109H188.614ZM199.699 109V0H216.326V109H199.699ZM232.953 109V0H238.495V109H232.953ZM244.038 109V0H249.58V109H244.038Z" fill="currentColor" />
      <path d="M249.667 109V0H255.209V109H249.667ZM271.836 109V0H288.463V109H271.836ZM294.006 109V0H299.548V109H294.006ZM305.09 109V0H321.717V109H305.09ZM327.26 109V0H332.802V109H327.26Z" fill="currentColor" />
    </svg>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb700] selection:text-black flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase"
        >
          AARTE
        </Link>
        <Link
          href="/"
          className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase"
        >
          Back [&larr;]
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <BarcodeSVG className="h-12 sm:h-16 w-auto text-white/20 mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            <h1 className="font-mono text-[10px] text-white/40 uppercase mb-4 tracking-wider">
              Error
            </h1>
            <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-medium leading-[0.9] tracking-[-0.04em] mb-6">
              Something went wrong
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto font-mono text-sm">
              An unexpected error occurred. Please try again.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT_EXPO }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-white text-black font-mono text-sm uppercase px-6 py-4 hover:bg-white/90 transition-colors"
            >
              <span>Try Again</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-mono text-sm uppercase px-6 py-4 hover:bg-white/10 transition-colors"
            >
              <span>Back to Home</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-3 px-4 sm:px-6">
        <div className="flex items-center justify-between font-mono text-[10px] text-white/30">
          <span>&copy; AARTE &mdash; Applied Artificial Intelligence</span>
          <span>[0] aarte.co</span>
        </div>
      </footer>
    </div>
  );
}
