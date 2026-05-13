"use client";

import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function StreamCounter({
  value,
}: {
  value: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const motionValue = useMotionValue(0);

  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  const formatted = useMotionValue(0);

  spring.on("change", (latest) => {
    if (ref.current) {
      ref.current.textContent = `${Math.floor(latest).toLocaleString()}+`;
    }
  });

  return <span ref={ref}>0</span>;
}