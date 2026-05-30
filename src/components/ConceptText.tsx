"use client";

import { useEffect, useState } from "react";

interface ConceptTextProps {
  mainTitle: string; // e.g., "DETECTED"
  subtext: string;
}

const glitchStyles = `
  @keyframes cinematic-flicker {
    0%, 12%, 35%, 100% {
      opacity: 1;
      transform: translateX(0);
      text-shadow: none;
    }
    13% {
      opacity: 0.88;
      transform: translateX(-1px);
      text-shadow: 2px 0 #00fff9, -2px 0 #ff00c1;
    }
    17% {
      opacity: 1;
      transform: translateX(0);
    }
    45% {
      opacity: 0.96;
      transform: translateX(1px);
      text-shadow: -1px 0 #00fff9, 1px 0 #ff00c1;
    }
    48% {
      opacity: 1;
      transform: translateX(0);
    }
    80% {
      opacity: 0.92;
      transform: translateX(-0.5px) skewX(-1deg);
      text-shadow: 1px 0 #00fff9, -1px 0 #ff00c1;
    }
    83% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789X∀ƎℲפHIſKʞWNOԀὉᴚS┴∩ΛMX⅄Z!@#$%&";

export default function ConceptText({ mainTitle, subtext }: ConceptTextProps) {
  const [displayText, setDisplayText] = useState(mainTitle);

  useEffect(() => {
    let frame = 0;
    const targetText = `${mainTitle}!`;
    
    // Increase frames so the jumbling/decoding effect runs slower
    const totalFrames = 140;
    let animationFrameId: number;

    const tick = () => {
      frame++;
      
      if (frame <= totalFrames) {
        const progress = frame / totalFrames;
        const currentString = targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return char;
            
            // Adjusted logic to naturally prolong the jumble time per character
            if (index / targetText.length < progress && Math.random() > 0.08) {
              return char;
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");

        setDisplayText(currentString);
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setDisplayText(targetText);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mainTitle]);

  return (
    <>
      <style>{glitchStyles}</style>
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "clamp(24px, 5vw, 64px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* Main Title on top line (H2 scale, tight spacing) */}
          <h2
            style={{
              fontFamily: "var(--f-body)",
              fontWeight: 700,
              fontSize: "clamp(1.2rem, 2.5vw, 2.5rem)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 1,
              margin: 0,
              animation: "cinematic-flicker 12s ease-in-out infinite",
              willChange: "opacity, transform",
            }}
          >
            {displayText}
          </h2>

          {/* Subtext on next line */}
          <p
            style={{
              fontFamily: "'Geist Mono', 'Geist', monospace",
              fontSize: "clamp(10px, 1.1vw, 12px)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              margin: 0,
            }}
          >
            {subtext}
          </p>
        </div>
      </div>
    </>
  );
}
