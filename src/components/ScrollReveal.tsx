"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  as?: "div" | "section";
  children: ReactNode;
  delay?: number;
};

export function ScrollReveal({
  as = "div",
  children,
  className,
  delay = 0,
  ...props
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = as === "section" ? motion.section : motion.div;

  return (
    <MotionTag
      initial={
        shouldReduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 18, scale: 0.99 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
