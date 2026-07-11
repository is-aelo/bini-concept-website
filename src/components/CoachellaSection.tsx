"use client";

import Image from "next/image";
import { useState, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Heading from "@/components/Heading";
import ImageLightbox, { LightboxImage } from "./ImageLightbox";

const BLOB_STYLES = `
@keyframes blobDrift1{
0%{transform:translate(0,0) scale(1)}
50%{transform:translate(40px,-30px) scale(1.1)}
100%{transform:translate(0,0) scale(1)}
}

@keyframes blobDrift2{
0%{transform:translate(0,0) scale(1)}
50%{transform:translate(-40px,30px) scale(1.08)}
100%{transform:translate(0,0) scale(1)}
}

@keyframes blobDrift3{
0%{transform:translate(0,0) scale(1)}
50%{transform:translate(20px,20px) scale(1.06)}
100%{transform:translate(0,0) scale(1)}
}

.coachella-blob1{animation:blobDrift1 18s ease-in-out infinite;}
.coachella-blob2{animation:blobDrift2 22s ease-in-out infinite;}
.coachella-blob3{animation:blobDrift3 26s ease-in-out infinite;}
`;

interface CoachellaImage {
  _id: string;
  title?: string;
  featured?: boolean;
  imageUrl: string;
}

interface CoachellaSectionProps {
  images: CoachellaImage[];
}

export default function CoachellaSection({
  images,
}: CoachellaSectionProps) {
  const photos = useMemo(() => images.slice(0, 4), [images]);
  const lightboxImages: LightboxImage[] = useMemo(
    () =>
      photos.map((photo) => ({
        src: photo.imageUrl,
        alt: photo.title || "BINICHELLA",
      })),
    [photos]
  );

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const dragStartX = useRef(0);

  const go = useCallback(
    (next: number) => {
      const clamped = (next + photos.length) % photos.length;
      setIndex(clamped);
    },
    [photos.length]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  if (!photos.length) return null;

  const current = photos[index];

  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16 lg:py-24"
      style={{ background: "var(--c-surface)" }}
    >
      <style>{`
        ${BLOB_STYLES}
        @media (max-width: 640px) {
          .coachella-card {
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0 opacity-70">
        <div
          className="coachella-blob1 absolute"
          style={{
            width: 520,
            height: 520,
            top: -170,
            left: -160,
            filter: "blur(110px)",
            background:
              "radial-gradient(circle, var(--c-teal) 0%, transparent 70%)",
            opacity: 0.12,
          }}
        />

        <div
          className="coachella-blob2 absolute"
          style={{
            width: 500,
            height: 500,
            bottom: -180,
            right: -170,
            filter: "blur(110px)",
            background:
              "radial-gradient(circle, var(--c-aiah) 0%, transparent 70%)",
            opacity: 0.12,
          }}
        />

        <div
          className="coachella-blob3 absolute"
          style={{
            width: 420,
            height: 420,
            top: "28%",
            left: "34%",
            filter: "blur(120px)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)",
            opacity: 0.08,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 flex flex-col items-start text-left gap-2">
          <span
            className="text-label-mono"
            style={{
              display: "inline-block",
              alignSelf: "flex-start",
              color: "var(--c-surface)",
              background: "var(--c-teal-dark)",
              padding: "3px 10px",
              borderRadius: "2px",
            }}
          >
            MOJAVE STAGE &bull; COACHELLA 2026
          </span>

          <Heading level="section" style={{ color: "var(--c-teal-dark)" }}>
            A GLOBAL MILESTONE
          </Heading>

          <p
            className="max-w-[34rem]"
            style={{
              color: "var(--c-ink)",
              opacity: 0.72,
              lineHeight: 1.7,
              fontSize: "clamp(0.82rem, 1.8vw, 0.98rem)",
            }}
          >
            BINI became the first Filipino pop group to perform at Coachella,
            opening a new chapter for P-pop on the world stage.
          </p>
        </div>

        <div
          className="coachella-card relative overflow-hidden rounded-[24px] cursor-grab shadow-[0_18px_40px_rgba(0,0,0,.10)] aspect-[4/3] md:aspect-video w-full z-10 border border-[rgba(12,12,10,.08)] bg-[rgba(255,255,255,.18)]"
          onMouseDown={(e) => (dragStartX.current = e.clientX)}
          onMouseUp={(e) => {
            const delta = e.clientX - dragStartX.current;
            if (Math.abs(delta) < 5) setLightboxOpen(true);
            else {
              if (delta < -40) next();
              if (delta > 40) prev();
            }
          }}
          onTouchStart={(e) =>
            (dragStartX.current = e.touches[0].clientX)
          }
          onTouchEnd={(e) => {
            const delta =
              e.changedTouches[0].clientX - dragStartX.current;

            if (Math.abs(delta) < 5) setLightboxOpen(true);
            else {
              if (delta < -40) next();
              if (delta > 40) prev();
            }
          }}
        >
          <div className="absolute inset-0">
            <Image
              key={current._id}
              fill
              priority
              draggable={false}
              src={current.imageUrl}
              alt={current.title || "BINICHELLA"}
              className="object-cover select-none"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,.18) 42%, transparent)",
              }}
            />

            <div
              className="absolute bottom-4 right-4 z-20"
              style={{
                color: "var(--c-surface)",
                fontFamily: "var(--f-mono)",
                fontSize: "clamp(0.55rem, 1.2vw, 0.72rem)",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                textShadow: "0 2px 12px rgba(0,0,0,.4)",
              }}
            >
              #BINICHELLA
            </div>
          </div>

          <div
            className="absolute top-4 right-4 z-20 px-3 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,.12)",
              backdropFilter: "blur(14px)",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: 11,
                fontFamily: "var(--f-mono)",
              }}
            >
              {(index + 1).toString().padStart(2, "0")} /{" "}
              {photos.length.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2 z-20">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  go(i);
                }}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === index ? 28 : 8,
                  height: 8,
                  background:
                    i === index ? "white" : "rgba(255,255,255,.35)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-4 flex-wrap">
          <div
            className="flex items-center gap-3"
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              letterSpacing: ".12em",
              color: "var(--c-ink)",
              opacity: 0.55,
              textTransform: "uppercase",
            }}
          >
            <span>Swipe through moments</span>
            <span>•</span>
            <span>Tap to open</span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={prev}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="h-11 w-11 rounded-full flex items-center justify-center border border-[rgba(12,12,10,.08)]"
              style={{
                background: "rgba(255,255,255,.82)",
                backdropFilter: "blur(14px)",
              }}
            >
              <CaretLeft size={18} weight="bold" />
            </motion.button>

            <motion.button
              onClick={next}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="h-11 w-11 rounded-full flex items-center justify-center border border-[rgba(12,12,10,.08)]"
              style={{
                background: "linear-gradient(135deg,var(--c-teal),var(--c-teal-dark))",
              }}
            >
              <CaretRight size={18} color="white" weight="bold" />
            </motion.button>
          </div>
        </div>
      </div>

      <ImageLightbox
        open={lightboxOpen}
        images={lightboxImages}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
