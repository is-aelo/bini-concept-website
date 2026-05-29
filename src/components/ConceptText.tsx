// src/components/ConceptText.tsx
"use client";

interface ConceptTextProps {
  mainTitle: string;
  subtext: string;
}

const glitchKeyframes = `
  @keyframes cinematic-flicker {
    0%   { opacity: 1;    transform: translateX(0); }
    7%   { opacity: 0.88; transform: translateX(-1px); }
    8%   { opacity: 1;    transform: translateX(0); }
    45%  { opacity: 1;    transform: translateX(0); }
    46%  { opacity: 0.82; transform: translateX(1.5px); }
    47%  { opacity: 1;    transform: translateX(0); }
    91%  { opacity: 1;    transform: translateX(0); }
    92%  { opacity: 0.9;  transform: translateX(-0.5px); }
    93%  { opacity: 1;    transform: translateX(0); }
    100% { opacity: 1;    transform: translateX(0); }
  }
`;

export default function ConceptText({ mainTitle, subtext }: ConceptTextProps) {
  return (
    <>
      <style>{glitchKeyframes}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 5vw, 64px)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Geist', 'Geist Sans', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(3.2rem, 11vw, 10rem)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#fff",
            textAlign: "center",
            lineHeight: 1,
            margin: 0,
            animation: "cinematic-flicker 6s ease-in-out infinite",
            willChange: "opacity, transform",
          }}
        >
          {mainTitle}
        </h1>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "clamp(24px, 4vw, 48px)",
          left: "clamp(24px, 4vw, 48px)",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: "'Geist Mono', 'Geist', monospace",
            fontSize: "clamp(10px, 1.1vw, 12px)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            margin: 0,
          }}
        >
          {subtext}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "clamp(20px, 4vw, 44px)",
          right: "clamp(24px, 4vw, 48px)",
          zIndex: 2,
        }}
      >
        <button
          style={{
            fontFamily: "'Geist Mono', 'Geist', monospace",
            fontSize: "clamp(9px, 1vw, 11px)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#fff",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.35)",
            padding: "10px 20px",
            cursor: "pointer",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(255,255,255,0.35)";
          }}
        >
          VIEW PROJECT
        </button>
      </div>
    </>
  );
}