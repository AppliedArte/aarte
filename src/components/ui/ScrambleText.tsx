"use client";

import { useEffect, useState } from "react";
import { SCRAMBLE_CHARS } from "@/lib/constants";

export function ScrambleText({ text, isActive, delay = 0 }: { text: string; isActive: boolean; delay?: number }) {
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
