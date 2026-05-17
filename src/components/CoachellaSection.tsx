"use client";

import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import ImageLightbox from "./ImageLightbox";

const BLOB_STYLES = `
  @keyframes blobDrift1 {
    0% { transform:translate(0,0) scale(1);}
    50% { transform:translate(30px,-25px) scale(1.08);}
    100% { transform:translate(0,0) scale(1);}
  }

  @keyframes blobDrift2 {
    0% { transform:translate(0,0) scale(1);}
    50% { transform:translate(-30px,25px) scale(1.05);}
    100% { transform:translate(0,0) scale(1);}
  }

  .coachella-blob1 {
    animation: blobDrift1 18s ease-in-out infinite;
  }

  .coachella-blob2 {
    animation: blobDrift2 24s ease-in-out infinite;
  }
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
  const photos = images.slice(0, 4);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const dragStartX = useRef(0);

  const go = useCallback(
    (next: number) => {
      const clamped =
        (next + photos.length) % photos.length;

      setDirection(next >= index ? 1 : -1);
      setIndex(clamped);
    },
    [index, photos.length]
  );

  const next = useCallback(
    () => go(index + 1),
    [go, index]
  );

  const prev = useCallback(
    () => go(index - 1),
    [go, index]
  );

  const current = photos[index];

  if (!photos.length) return null;

  return (
    <section
      className="relative overflow-hidden py-20 md:py-32"
      style={{
        background: "var(--c-surface)",
      }}
    >
      <style>{BLOB_STYLES}</style>

      <div
        className="coachella-blob1 absolute pointer-events-none"
        style={{
          width: 550,
          height: 550,
          top: -150,
          left: -100,
          filter: "blur(70px)",
          background:
            "radial-gradient(circle, rgba(99,203,214,.18), transparent 70%)",
        }}
      />

      <div
        className="coachella-blob2 absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          bottom: -160,
          right: -120,
          filter: "blur(60px)",
          background:
            "radial-gradient(circle, rgba(139,184,212,.18), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[1280px] mx-auto px-4 md:px-10">

        <div className="mb-8 md:mb-12 text-center">
          <p
            className="text-label-mono mb-4"
            style={{
              color: "var(--c-ink)",
            }}
          >
            Historic Global Moment
          </p>

          <h2
            className="leading-none"
            style={{
              fontSize:
                "clamp(4rem,14vw,11rem)",
            }}
          >
            <span
              style={{
                color: "var(--c-teal)",
              }}
            >
              BINI
            </span>
            <span
              style={{
                color: "var(--c-aiah)",
              }}
            >
              CHELLA
            </span>
          </h2>

          <p
            className="text-editorial-lg mt-4"
            style={{
              color:
                "var(--c-ink)",
              opacity: .75,
              fontSize:
                "clamp(.95rem,2vw,1.2rem)"
            }}
          >
            Mojave Stage · Coachella 2026
          </p>
        </div>

        <div
          className="hero-image-wrapper relative overflow-hidden"
          style={{
            maxWidth: "100%",
            aspectRatio: "unset",
            height:
              "clamp(480px,72vh,860px)",
            cursor: "grab"
          }}
          onMouseDown={(e) => {
            dragStartX.current =
              e.clientX;
          }}
          onMouseUp={(e) => {
            const delta =
              e.clientX -
              dragStartX.current;

            if (Math.abs(delta) < 5) {
              setLightboxOpen(true);
            } else {
              if (delta < -40) next();
              if (delta > 40) prev();
            }
          }}
          onTouchStart={(e) => {
            dragStartX.current =
              e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const delta =
              e.changedTouches[0]
                .clientX -
              dragStartX.current;

            if (Math.abs(delta) < 5) {
              setLightboxOpen(true);
            } else {
              if (delta < -40) next();
              if (delta > 40) prev();
            }
          }}
        >
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="wait"
          >
            <motion.div
              key={current._id}
              initial={{
                opacity: 0,
                scale: 1.08,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: .8,
              }}
              className="absolute inset-0"
            >
              <Image
                src={current.imageUrl}
                alt={
                  current.title ||
                  "BINICHELLA"
                }
                fill
                priority
                draggable={false}
                sizes="100vw"
                className="
                object-cover
                animate-mvZoom
                "
              />

              <div
                className="absolute inset-0"
                style={{
                  background: `
                  linear-gradient(
                  to top,
                  rgba(0,0,0,.85),
                  rgba(0,0,0,.2) 40%,
                  transparent
                  )
                `,
                }}
              />

              <div className="mv-light-sweep" />
            </motion.div>
          </AnimatePresence>

          <div
            className="
            absolute
            inset-x-0
            bottom-0
            z-20
            p-6
            md:p-10
            pointer-events-none
            "
          >
            <div className="max-w-[700px]">
              <span
                style={{
                  fontFamily:
                    "var(--f-mono)",
                  fontSize: 10,
                  color: "white",
                  opacity: .8,
                  letterSpacing:
                    ".12em",
                }}
              >
                FIRST PPOP ACT
              </span>

              <h3
                style={{
                  fontFamily:
                    "var(--f-display)",
                  fontSize:
                    "clamp(2.8rem,8vw,7rem)",
                  color: "white",
                  lineHeight: .9,
                }}
              >
                A GLOBAL
                <br />
                MILESTONE
              </h3>

              <p
                className="mt-4"
                style={{
                  color:
                    "rgba(255,255,255,.72)",
                  maxWidth: 520,
                  lineHeight: 1.7,
                  fontSize:
                    "clamp(.92rem,2vw,1rem)",
                }}
              >
                BINI became the first
                Filipino pop group to
                perform at Coachella —
                opening a new chapter
                for P-pop on the world
                stage.
              </p>
            </div>
          </div>

          <div
            className="
            absolute
            top-5
            right-5
            z-20
            px-4
            py-2
            rounded-full
            "
            style={{
              background:
                "rgba(255,255,255,.12)",
              backdropFilter:
                "blur(14px)",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: 11,
                fontFamily:
                  "var(--f-mono)"
              }}
            >
              {(index + 1)
                .toString()
                .padStart(2, "0")}
              {" / "}
              {photos.length
                .toString()
                .padStart(2, "0")}
            </span>
          </div>

          <div
            className="
            absolute
            left-1/2
            -translate-x-1/2
            bottom-4
            flex
            gap-2
            z-20
            "
          >
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  go(i);
                }}
                className="
                rounded-full
                transition-all
                duration-500
                "
                style={{
                  width:
                    i === index
                      ? 32
                      : 8,
                  height: 8,
                  background:
                    i === index
                      ? "white"
                      : "rgba(255,255,255,.35)"
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="
          flex
          items-center
          justify-center
          gap-4
          mt-6
          md:mt-8
          "
        >
          <motion.button
            onClick={prev}
            whileHover={{
              y: -2,
              scale: 1.03
            }}
            whileTap={{
              scale: .92
            }}
            aria-label="Previous image"
            style={{
              width: 52,
              height: 52,
              borderRadius: "999px",
              background:
                "rgba(255,255,255,.75)",
              backdropFilter:
                "blur(14px)",
              border:
                "1px solid rgba(58,170,182,.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 10px 25px rgba(12,12,10,.06)",
              cursor: "pointer",
            }}
          >
            <CaretLeft
              size={20}
              weight="bold"
              style={{
                color:
                  "var(--c-teal-dark)"
              }}
            />
          </motion.button>

          <div
            style={{
              fontFamily:
                "var(--f-mono)",
              fontSize: 10,
              letterSpacing:
                ".14em",
              opacity: .45,
              textTransform:
                "uppercase",
              userSelect: "none"
            }}
          >
            Swipe / Tap
          </div>

          <motion.button
            onClick={next}
            whileHover={{
              y: -2,
              scale: 1.03
            }}
            whileTap={{
              scale: .92
            }}
            aria-label="Next image"
            style={{
              width: 52,
              height: 52,
              borderRadius:
                "999px",
              background:
                "linear-gradient(135deg,var(--c-teal),var(--c-teal-dark))",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              boxShadow:
                "0 14px 35px rgba(58,170,182,.25)",
              cursor: "pointer",
              border: "none"
            }}
          >
            <CaretRight
              size={20}
              weight="bold"
              color="white"
            />
          </motion.button>
        </div>

      </div>

      <ImageLightbox
        open={lightboxOpen}
        image={current.imageUrl}
        alt={current.title}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}