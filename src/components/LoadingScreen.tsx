"use client";

import { useEffect, useState, useRef } from "react";

const MEMBERS = [
  { name: "aiah",    cssVar: "var(--c-aiah)" },
  { name: "colet",   cssVar: "var(--c-colet)" },
  { name: "maloi",   cssVar: "var(--c-maloi)" },
  { name: "gwen",    cssVar: "var(--c-gwen)" },
  { name: "stacey",  cssVar: "var(--c-stacey)" },
  { name: "mikha",   cssVar: "var(--c-mikha)" },
  { name: "jhoanna", cssVar: "var(--c-jhoanna)" },
  { name: "sheena",  cssVar: "var(--c-sheena)" },
];

const BAR_HEIGHTS = [28, 40, 52, 64, 64, 52, 40, 28];

const STATUS_MESSAGES = [
  "Scanning frequency...",
  "Tuning signal...",
  "Acquiring source...",
  "Boosting gain...",
  "Locking channel...",
  "Decoding stream...",
  "Amplifying signal...",
  "Signal acquired...",
];

const TOTAL_BARS = MEMBERS.length;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [detected, setDetected] = useState(false);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleLoad = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setStatusIndex(STATUS_MESSAGES.length - 1);
      setTimeout(() => setDetected(true), 200);
      setTimeout(() => setVisible(false), 2400);
    };

    if (document.readyState === "complete") {
      handleLoad();
      return;
    }

    let current = 0;

    intervalRef.current = setInterval(() => {
      const increment = Math.random() * 3.5 + 0.8;
      current = Math.min(current + increment, 92);
      setProgress(current);

      const targetMsg = Math.floor((current / 100) * (STATUS_MESSAGES.length - 1));
      setStatusIndex(targetMsg);
    }, 80);

    window.addEventListener("load", handleLoad);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (!visible) return null;

  const litBars = Math.floor((progress / 100) * TOTAL_BARS);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--c-ink, #080808)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        opacity: detected ? 0 : 1,
        transition: detected ? "opacity 0.6s ease 1.6s" : "none",
        pointerEvents: "all",
      }}
      aria-live="polite"
      aria-label="Loading BINI website"
    >
      <NoiseGrid />
      <ScanLine />
      <CornerBrackets />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--f-display, 'Bebas Neue', sans-serif)",
            fontWeight: 400,
            fontSize: "13px",
            letterSpacing: "0.6em",
            color: "rgba(255,255,255,0.15)",
            textTransform: "uppercase",
          }}
        >
          BINI
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "6px",
            height: "64px",
          }}
          aria-hidden="true"
        >
          {MEMBERS.map((member, i) => {
            const isLit = i < litBars;
            return (
              <div
                key={member.name}
                style={{
                  width: "10px",
                  height: `${BAR_HEIGHTS[i]}px`,
                  borderRadius: "2px 2px 0 0",
                  background: isLit ? member.cssVar : "var(--c-surface-3)",
                  opacity: isLit ? 1 : 0.5,
                  animation: isLit ? "none" : `bini-pulse 1.6s ease-in-out ${i * 0.12}s infinite`,
                  transition: "background 0.3s ease, opacity 0.3s ease",
                }}
              />
            );
          })}
        </div>

        <span
          style={{
            fontFamily: "var(--f-mono, 'Space Mono', monospace)",
            fontSize: "10px",
            fontWeight: 400,
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
        >
          Singles — EP
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "1px",
              background: "var(--c-surface-3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, var(--c-aiah), var(--c-colet), var(--c-maloi), var(--c-gwen), var(--c-stacey), var(--c-mikha), var(--c-jhoanna), var(--c-sheena))",
                width: `${progress}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--f-mono, 'Space Mono', monospace)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            {Math.floor(progress)}%
          </span>
        </div>

        <span
          style={{
            fontFamily: "var(--f-mono, 'Space Mono', monospace)",
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            minHeight: "18px",
            opacity: detected ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {STATUS_MESSAGES[statusIndex]}
        </span>

        <span
          style={{
            fontFamily: "var(--f-mono, 'Space Mono', monospace)",
            fontSize: "13px",
            letterSpacing: "0.3em",
            color: "var(--c-teal-dark)",
            textTransform: "uppercase",
            opacity: detected ? 1 : 0,
            transition: "opacity 0.4s ease",
            textShadow: detected ? "0 0 16px var(--c-teal)" : "none",
            minHeight: "20px",
          }}
        >
          {detected ? "Signal Detected!" : ""}
        </span>
      </div>

      <style>{`
        @keyframes bini-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes bini-scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

function NoiseGrid() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }}
    />
  );
}

function ScanLine() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06), transparent)",
        animation: "bini-scan 2.4s linear infinite",
        opacity: 0.8,
        pointerEvents: "none",
      }}
    />
  );
}

function CornerBrackets() {
  const base: React.CSSProperties = {
    position: "absolute",
    width: "18px",
    height: "18px",
    opacity: 0.25,
  };
  return (
    <>
      <div aria-hidden="true" style={{ ...base, top: 24, left: 24, borderTop: "1px solid rgba(255,255,255,0.4)", borderLeft: "1px solid rgba(255,255,255,0.4)" }} />
      <div aria-hidden="true" style={{ ...base, top: 24, right: 24, borderTop: "1px solid rgba(255,255,255,0.4)", borderRight: "1px solid rgba(255,255,255,0.4)" }} />
      <div aria-hidden="true" style={{ ...base, bottom: 24, left: 24, borderBottom: "1px solid rgba(255,255,255,0.4)", borderLeft: "1px solid rgba(255,255,255,0.4)" }} />
      <div aria-hidden="true" style={{ ...base, bottom: 24, right: 24, borderBottom: "1px solid rgba(255,255,255,0.4)", borderRight: "1px solid rgba(255,255,255,0.4)" }} />
    </>
  );
}