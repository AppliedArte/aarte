"use client";

import { useEffect, useRef } from "react";

export function PixelTrailCanvas({ className = "" }: { className?: string }) {
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
