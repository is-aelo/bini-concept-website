// src/components/StreamCounter.tsx
"use client";

import { useMotionValue, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface StreamCounterProps {
  value: number;
  className?: string;
}

export default function StreamCounter({ value, className }: StreamCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(128);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration: 3.5,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.floor(latest).toLocaleString()}+`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, count]);

  return (
    <span ref={ref} className={className}>
      128+
    </span>
  );
}