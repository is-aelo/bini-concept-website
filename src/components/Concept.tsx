// src/components/Concept.tsx
"use client";

import ConceptText from "./ConceptText";

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

export default function Concept({ teaser }: { teaser?: TeaserVideo }) {
  if (!teaser?.videoUrl) return null;

  return (
    <section
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
        // @ts-expect-error — non-standard but widely supported
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

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.38) 100%)",
          zIndex: 1,
        }}
      />

      <ConceptText
        mainTitle={teaser.main || teaser.title || "UNTITLED"}
        subtext={teaser.subtext || ""}
      />
    </section>
  );
}