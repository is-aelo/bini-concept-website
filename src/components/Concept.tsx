"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
        }
      },
      {
        rootMargin: "400px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    video.load();
    video.play().catch(() => {
      // Autoplay can still be blocked by some browsers; the poster remains visible.
    });
  }, [shouldLoadVideo]);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;

    if (!section || !frame || !media) {
      return;
    }

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;

    const applyTransform = () => {
      rafId = 0;

      if (reduceMotion) {
        frame.style.transform = "translate3d(0, 0, 0)";
        media.style.transform = "translate3d(0, 0, 0) scale3d(1, 1, 1)";
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const rawProgress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const progress = Math.min(1, Math.max(0, rawProgress));
      const pressure = Math.sin(progress * Math.PI);
      const easedPressure = pressure * pressure;

      const frameLift = (0.5 - progress) * 18;
      const frameDrift = (progress - 0.5) * 8;

      const mediaScaleX = 1 + easedPressure * 0.018;
      const mediaScaleY = 1 + easedPressure * 0.05;

      frame.style.transform = "translate3d(0, 0, 0)";
      media.style.transform = `translate3d(${frameDrift}px, ${frameLift}px, 0) scale3d(${mediaScaleX}, ${mediaScaleY}, 1)`;
    };

    const scheduleTransform = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(applyTransform);
    };

    scheduleTransform();

    window.addEventListener("scroll", scheduleTransform, { passive: true });
    window.addEventListener("resize", scheduleTransform);

    return () => {
      window.removeEventListener("scroll", scheduleTransform);
      window.removeEventListener("resize", scheduleTransform);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  if (!teaser?.videoUrl) return null;

  return (
    <section
      ref={sectionRef}
      id="concept-section"
      className="relative w-screen h-screen overflow-hidden scroll-mt-24"
      style={{ background: "#000" }}
    >
      <div
        ref={frameRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transformOrigin: "center center",
          willChange: "transform",
          background: "#000",
        }}
      >
        <div
          ref={mediaRef}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "center center",
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
          }}
        >
          <video
            ref={videoRef}
            src={shouldLoadVideo ? teaser.videoUrl : undefined}
            autoPlay={shouldLoadVideo}
            loop={shouldLoadVideo}
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload={shouldLoadVideo ? "auto" : "none"}
            poster={teaser.lqip || undefined}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: shouldLoadVideo ? 1 : 0.92,
              transform: "scale(1.03)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "radial-gradient(circle at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.32) 100%), linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.18) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

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
