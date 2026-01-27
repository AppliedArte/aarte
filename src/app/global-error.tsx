"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between">
          <a
            href="/"
            className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase"
          >
            AARTE
          </a>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333 109" fill="none" className="h-12 w-auto text-white/20 mx-auto mb-8">
              <path d="M0 109V0H5.54237V109H0ZM11.0847 109V0H16.6271V109H11.0847ZM22.1695 109V0H38.7966V109H22.1695ZM44.339 109V0H60.9661V109H44.339ZM77.5932 109V0H83.1356V109H77.5932Z" fill="currentColor" />
              <path d="M83.2222 109V0H99.8493V109H83.2222ZM105.392 109V0H110.934V109H105.392ZM116.476 109V0H122.019V109H116.476ZM138.646 109V0H155.273V109H138.646ZM160.815 109V0H166.358V109H160.815Z" fill="currentColor" />
              <path d="M166.444 109V0H183.072V109H166.444ZM188.614 109V0H194.156V109H188.614ZM199.699 109V0H216.326V109H199.699ZM232.953 109V0H238.495V109H232.953ZM244.038 109V0H249.58V109H244.038Z" fill="currentColor" />
              <path d="M249.667 109V0H255.209V109H249.667ZM271.836 109V0H288.463V109H271.836ZM294.006 109V0H299.548V109H294.006ZM305.09 109V0H321.717V109H305.09ZM327.26 109V0H332.802V109H327.26Z" fill="currentColor" />
            </svg>

            <h1 className="font-mono text-[10px] text-white/40 uppercase mb-4 tracking-wider">
              Critical Error
            </h1>
            <h2 className="text-4xl font-medium leading-[0.9] tracking-[-0.04em] mb-6">
              Something went wrong
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto font-mono text-sm">
              A critical error occurred. Please try again.
            </p>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-white text-black font-mono text-sm uppercase px-6 py-4 hover:bg-white/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>

        <footer className="border-t border-white/10 py-3 px-4">
          <div className="flex items-center justify-between font-mono text-[10px] text-white/30">
            <span>&copy; AARTE &mdash; Applied Artificial Intelligence</span>
            <span>[0] aarte.co</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
