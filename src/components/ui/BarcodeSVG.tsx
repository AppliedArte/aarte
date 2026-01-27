"use client";

import { BARCODE_PATHS } from "@/lib/constants";

export function BarcodeSVG({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333 109" fill="none" className={className} aria-label="AARTE barcode" {...props}>
      {BARCODE_PATHS.map((d, i) => <path key={i} d={d} fill="currentColor" />)}
    </svg>
  );
}
