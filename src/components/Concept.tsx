"use client";

import type { ReactNode } from "react";

interface TeaserVideo {
  _id: string;
  title?: string;
  main?: string;
  subtext?: string;
  featured?: boolean;
  videoUrl: string;
  mimeType?: string;
  lqip?: string;
}

export default function Concept({
  teaser,
  children,
}: {
  teaser?: TeaserVideo;
  children?: ReactNode;
}) {
  if (!teaser?.videoUrl) return null;

  return (
    <section
      id="concept-section"
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#000" }}
    >
      <video
        src={teaser.videoUrl}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        poster={teaser.lqip || undefined}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <a
        href="#hero"
        aria-label="Scroll to hero"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(24px, 5vw, 32px)",
          transform: "translateX(-50%)",
          zIndex: 2,
          width: "40px",
          height: "40px",
          borderRadius: "9999px",
          background: "rgba(0, 0, 0, 0.35)",
          border: "1px solid var(--c-teal)",
          color: "var(--c-teal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          fontSize: "1.25rem",
          lineHeight: 1,
        }}
      >
        ↓
      </a>

      {children && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
