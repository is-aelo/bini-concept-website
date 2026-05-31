"use client";

import type { ReactNode } from "react";

interface TeaserVideo {
  _id: string;
  title?: string;
  main?: string;
  subtext?: string;
  featured?: boolean;
  videoUrl: string;
  youtubeLink?: string;
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
          filter: "contrast(1.2) saturate(1.3) brightness(1.05) sepia(0.1)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Subtle Film Overlay / Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />

      {teaser.youtubeLink && (
        <a
          href={teaser.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="concept-link"
          style={{
            position: "absolute",
            zIndex: 2,
            color: "var(--c-surface)",
            textDecoration: "none",
            fontSize: "1rem",
            fontWeight: 400,
            fontFamily: "var(--f-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
            padding: "8px 16px",
            right: "48px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          [ WATCH FULL CONCEPT FILM ]
        </a>
      )}

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

      <style jsx>{`
        @media (max-width: 768px) {
          .concept-link {
            top: auto !important;
            right: 50% !important;
            bottom: 5em !important;
            transform: translateX(50%) !important;
          }
        }
      `}</style>
    </section>
  );
}
