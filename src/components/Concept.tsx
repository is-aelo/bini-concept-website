"use client";

import type { ReactNode } from "react";
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

      <ConceptText
        mainTitle={teaser.main || teaser.title || "UNTITLED"}
        subtext={teaser.subtext || ""}
      />

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
