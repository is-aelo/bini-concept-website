"use client";

import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import ImageLightbox from "./ImageLightbox";

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

.coachella-blob1{
animation:blobDrift1 18s ease-in-out infinite;
}

.coachella-blob2{
animation:blobDrift2 22s ease-in-out infinite;
}

.coachella-blob3{
animation:blobDrift3 26s ease-in-out infinite;
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
      const clamped = (next + photos.length) % photos.length;
      setDirection(next >= index ? 1 : -1);
      setIndex(clamped);
    },
    [index, photos.length]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  if (!photos.length) return null;

  const current = photos[index];

  return (
    <section
      className="relative overflow-hidden py-14 md:py-24"
      style={{ background: "var(--c-surface)" }}
    >
      <style>{BLOB_STYLES}</style>

      {/* MESH LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* teal blob */}
        <div
          className="coachella-blob1 absolute"
          style={{
            width: 650,
            height: 650,
            top: -180,
            left: -140,
            filter: "blur(90px)",
            background:
              "radial-gradient(circle, var(--c-teal) 0%, transparent 70%)",
            opacity: 0.22,
          }}
        />

        {/* aiah blue blob */}
        <div
          className="coachella-blob2 absolute"
          style={{
            width: 600,
            height: 600,
            bottom: -180,
            right: -160,
            filter: "blur(90px)",
            background:
              "radial-gradient(circle, var(--c-aiah) 0%, transparent 70%)",
            opacity: 0.22,
          }}
        />

        {/* blend mid blob for depth */}
        <div
          className="coachella-blob3 absolute"
          style={{
            width: 520,
            height: 520,
            top: "35%",
            left: "30%",
            filter: "blur(110px)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)",
            opacity: 0.18,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-label-mono mb-4" style={{ color: "#0C0C0A" }}>
            Historic Global Moment
          </p>

          <h2
            className="leading-[.9]"
            style={{ fontSize: "clamp(3rem,9vw,8rem)" }}
          >
            <span style={{ color: "var(--c-teal)" }}>BINI</span>
            <span style={{ color: "var(--c-aiah)" }}>CHELLA</span>
          </h2>

          <p
            className="mt-4"
            style={{
              color: "#0C0C0A",
              opacity: 0.75,
              fontSize: "clamp(.9rem,1.5vw,1.1rem)",
            }}
          >
            Mojave Stage · Coachella 2026
          </p>
        </div>

        {/* mobile text (shows only on mobile, placed before image frame) */}
        <div className="md:hidden mb-8">
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              letterSpacing: ".12em",
              color: "var(--c-ink)",
              opacity: 0.75,
            }}
          >
            FIRST PPOP ACT
          </span>

          <h3
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "2.2rem",
              lineHeight: 0.95,
              color: "var(--c-teal-dark)",
              marginTop: 8,
            }}
          >
            A GLOBAL
            <br />
            MILESTONE
          </h3>

          <p
            className="mt-4"
            style={{
              color: "var(--c-ink)",
              opacity: 0.7,
              lineHeight: 1.6,
              fontSize: ".9rem",
              maxWidth: 520,
            }}
          >
            BINI became the first Filipino pop group to perform at Coachella —
            opening a new chapter for P-pop on the world stage.
          </p>
        </div>

        {/* image frame */}
        <div
          className="relative overflow-hidden rounded-[30px] cursor-grab shadow-[0_25px_60px_rgba(0,0,0,.14)] aspect-video w-full z-10"
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current._id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                fill
                priority
                draggable={false}
                src={current.imageUrl}
                alt={current.title || "BINICHELLA"}
                className="object-cover select-none animate-mvZoom"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.88), rgba(0,0,0,.2) 40%, transparent)",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* counter */}
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

          {/* dots */}
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

        {/* context description layer & controls */}
        <div className="mt-10 sm:mt-12 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          {/* desktop text (hidden on mobile to prevent duplication) */}
          <div className="hidden md:block">
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "var(--c-ink)",
                opacity: 0.75,
              }}
            >
              FIRST PPOP ACT
            </span>

            <h3
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                lineHeight: 0.95,
                color: "var(--c-teal-dark)",
                marginTop: 8,
              }}
            >
              A GLOBAL
              <br />
              MILESTONE
            </h3>

            <p
              className="mt-4"
              style={{
                color: "var(--c-ink)",
                opacity: 0.7,
                lineHeight: 1.6,
                fontSize: "clamp(.9rem, 1.2vw, 1.05rem)",
                maxWidth: 520,
              }}
            >
              BINI became the first Filipino pop group to perform at Coachella —
              opening a new chapter for P-pop on the world stage.
            </p>
          </div>

          {/* controls */}
          <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-auto md:mt-1">
            <motion.button
              onClick={prev}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,.75)",
                backdropFilter: "blur(14px)",
              }}
            >
              <CaretLeft size={18} weight="bold" />
            </motion.button>

            <div
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                opacity: 0.45,
              }}
            >
              Swipe / Tap
            </div>

            <motion.button
              onClick={next}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg,var(--c-teal),var(--c-teal-dark))",
              }}
            >
              <CaretRight size={18} color="white" weight="bold" />
            </motion.button>
          </div>
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