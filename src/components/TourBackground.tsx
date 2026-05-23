"use client";

import React, { useState, useEffect } from "react";
import { motion, Easing } from "framer-motion";

export default function TourBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null or a static placeholder during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const blobTransition = {
    duration: 15,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as Easing,
  };

  const blobStyle: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(100px)",
    willChange: "transform",
    pointerEvents: "none",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "var(--c-surface-1)",
      }}
    >
      {/* Top Right Blob */}
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0],
        }}
        transition={blobTransition}
        style={{
          ...blobStyle,
          top: "-10%",
          right: "-10%",
          width: "30vw",
          height: "30vw",
          background: "var(--c-teal)",
          opacity: 0.25,
        }}
      />

      {/* Bottom Left Blob */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.3, 1],
          rotate: [0, -10, 0],
        }}
        transition={{ ...blobTransition, duration: 18 }}
        style={{
          ...blobStyle,
          bottom: "-10%",
          left: "-10%",
          width: "25vw",
          height: "25vw",
          background: "var(--c-teal-pale)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}