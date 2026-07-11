"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Heading from "@/components/Heading";
import GalleryBackground from "./GalleryBackground";
import ImageLightbox, { LightboxImage } from "./ImageLightbox";

type SignalsTourImage = {
  _id: string;
  caption: string;
  imageUrl: string;
  lqip?: string;
};

type GalleryProps = {
  items: SignalsTourImage[];
};

function MobileSlider({
  items,
  onOpen,
}: {
  items: SignalsTourImage[];
  onOpen: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const dragStartX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setActive((value) => Math.max(0, value - 1)), []);
  const next = useCallback(
    () => setActive((value) => Math.min(items.length - 1, value + 1)),
    [items.length]
  );

  const item = items[active];

  useEffect(() => {
    const container = carouselRef.current;
    const el = container?.children[active] as HTMLElement | undefined;
    if (container && el) {
      const scrollLeft =
        el.offsetLeft + el.offsetWidth / 2 - container.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div className="signals-mobile">
      <div
        className="relative overflow-hidden rounded-[24px] cursor-grab shadow-[0_18px_40px_rgba(0,0,0,.10)] aspect-[4/3] w-full z-10 border border-[rgba(12,12,10,.08)] bg-[rgba(255,255,255,.18)]"
        onMouseDown={(e) => {
          dragStartX.current = e.clientX;
        }}
        onMouseUp={(e) => {
          const delta = e.clientX - dragStartX.current;

          if (Math.abs(delta) < 5) onOpen(active);
          else {
            if (delta < -40) next();
            if (delta > 40) prev();
          }
        }}
        onTouchStart={(e) => {
          dragStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - dragStartX.current;

          if (Math.abs(delta) < 5) onOpen(active);
          else {
            if (delta < -40) next();
            if (delta > 40) prev();
          }
        }}
      >
        <div className="absolute inset-0" key={item._id}>
          <Image
            src={item.imageUrl}
            alt={item.caption}
            fill
            draggable={false}
            className="object-cover select-none"
            sizes="100vw"
            placeholder={item.lqip ? "blur" : "empty"}
            blurDataURL={item.lqip}
            priority={active === 0}
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
            {item.caption}
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
            aria-live="polite"
          >
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="signals-carousel" ref={carouselRef}>
        {items.map((thumb, i) => (
          <div
            key={thumb._id}
            onClick={() => setActive(i)}
            className={`signals-thumb${i === active ? " signals-thumb--active" : ""}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") setActive(i); }}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={thumb.imageUrl}
              alt={thumb.caption}
              fill
              className="signals-thumb-image"
              sizes="120px"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-5 flex items-center justify-between gap-4 flex-wrap">
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
          <span>&bull;</span>
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
            <CaretRight size={18} weight="bold" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function EditorialImage({
  item,
  index,
  className,
  onOpen,
}: {
  item: SignalsTourImage;
  index: number;
  className: string;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className={className}
      aria-label={`Open ${item.caption} in lightbox`}
    >
      <div className="signals-frame">
        <Image
          src={item.imageUrl}
          alt={item.caption}
          fill
          className="signals-image"
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder={item.lqip ? "blur" : "empty"}
          blurDataURL={item.lqip}
        />

        <div className="signals-overlay" />

        <div className="signals-counter">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="signals-caption signals-caption--overlay">
          {item.caption}
        </div>
      </div>
    </motion.button>
  );
}

export function Gallery({ items }: GalleryProps) {
  const galleryItems = useMemo(() => items || [], [items]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages: LightboxImage[] = useMemo(
    () =>
      galleryItems.map((item) => ({
        src: item.imageUrl,
        alt: item.caption,
      })),
    [galleryItems]
  );

  if (galleryItems.length === 0) return null;

  const lead = galleryItems[0];
  const stack = galleryItems.slice(1, 3);
  const secondary = galleryItems.slice(3, 6);

  return (
    <section className="gallery-section" aria-label="Signals World Tour">
      <GalleryBackground />

      <div className="gallery-container">
        <header className="gallery-header">
          <span className="gallery-label text-label-mono">The Nation's Girl Group On Their</span>

          <div className="gallery-heading-row">
            <Heading level="section" style={{ color: "var(--c-teal-dark)" }}>
              Signals World Tour
            </Heading>
          </div>
        </header>

        <div className="gallery-divider" role="separator" />

        <div className="signals-grid">
          <div className="signals-show-desktop">
            <EditorialImage
              item={lead}
              index={0}
              className="signals-card signals-card--lead"
              onOpen={() => setLightboxIndex(0)}
            />

            <div className="signals-stack">
              {stack.map((item, i) => (
                <EditorialImage
                  key={item._id}
                  item={item}
                  index={i + 1}
                  className="signals-card signals-card--stack"
                  onOpen={() => setLightboxIndex(i + 1)}
                />
              ))}
            </div>

            {secondary.length > 0 && (
              <div className="signals-secondary">
                {secondary.map((item, i) => {
                  const actualIndex = i + 3;
                  return (
                    <EditorialImage
                      key={item._id}
                      item={item}
                      index={actualIndex}
                      className="signals-card signals-card--secondary"
                      onOpen={() => setLightboxIndex(actualIndex)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="signals-show-mobile">
            <MobileSlider items={galleryItems} onOpen={setLightboxIndex} />
          </div>
        </div>
      </div>

      <ImageLightbox
        open={lightboxIndex !== null}
        images={lightboxImages}
        index={lightboxIndex ?? 0}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      <style>{`
        .gallery-section {
          position: relative;
          overflow: hidden;
          background-color: var(--c-surface);
          padding: 6rem 0 8rem;
        }

        .gallery-container {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 2rem;
          overflow: hidden;
        }

        .gallery-header {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .gallery-label {
          display: inline-block;
          align-self: flex-start;
          color: var(--c-surface);
          background: var(--c-teal-dark);
          padding: 3px 10px;
          border-radius: 2px;
        }

        .gallery-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .gallery-note {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.7rem;
          max-width: 360px;
          padding-bottom: 0.35rem;
        }

        .gallery-note-kicker {
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-ink);
          opacity: 0.45;
        }

        .gallery-note-copy {
          margin: 0;
          font-family: var(--f-body);
          font-size: clamp(14px, 1.6vw, 18px);
          line-height: 1.45;
          color: var(--c-ink);
          opacity: 0.68;
        }

        .gallery-divider {
          height: 1.5px;
          background: var(--c-ink);
          margin-bottom: 24px;
        }

        .signals-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 16px;
        }

        .signals-show-desktop {
          display: contents;
        }

          .signals-show-mobile {
            display: none;
          }

        .signals-stack {
          grid-column: span 5;
          display: grid;
          gap: 16px;
        }

        .signals-secondary {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .signals-card {
          position: relative;
          width: 100%;
          padding: 0;
          border: 0;
          border-radius: 0;
          overflow: hidden;
          background: var(--c-surface-2);
          cursor: zoom-in;
          box-shadow: var(--shadow-tactile);
          text-align: left;
        }

        .signals-card--lead {
          grid-column: span 7;
          min-height: 620px;
        }

        .signals-card--stack {
          min-height: 302px;
        }

        .signals-card--secondary {
          min-height: 240px;
        }

        .signals-frame {
          position: absolute;
          inset: 0;
        }

        .signals-image {
          object-fit: cover;
          transition: opacity 260ms ease, filter 260ms ease;
        }

        .signals-card:hover .signals-image {
          opacity: 0.96;
          filter: saturate(0.96) contrast(1.01);
        }

        .signals-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(12,12,10,0.02) 0%, transparent 42%, rgba(12,12,10,0.24) 100%),
            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 28%, transparent 72%, rgba(255,255,255,0.08) 100%);
          opacity: 0.88;
          transition: opacity 260ms ease;
          pointer-events: none;
        }

        .signals-card:hover .signals-overlay {
          opacity: 0.98;
        }

        .signals-counter {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 2;
          font-family: var(--f-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: var(--c-surface);
          opacity: 0.72;
          text-transform: uppercase;
          background: rgba(12,12,10,0.35);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--r-full);
          padding: 5px 8px;
          backdrop-filter: blur(8px);
        }

        .signals-caption {
          font-family: var(--f-mono);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--c-ink);
        }

        .signals-caption--overlay {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          z-index: 2;
          font-size: 10px;
          line-height: 1.5;
          color: rgba(245,243,238,0.92);
          text-shadow: 0 2px 12px rgba(0,0,0,0.45);
        }

        .signals-stack .signals-caption--overlay,
        .signals-secondary .signals-caption--overlay {
          font-size: 9px;
        }

        @media (max-width: 1024px) {
          .signals-grid {
            grid-template-columns: 1fr;
          }

          .signals-stack,
          .signals-secondary,
          .signals-card--lead {
            grid-column: auto;
          }

          .signals-stack {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .signals-secondary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .signals-card--lead {
            min-height: 520px;
          }

          .signals-card--stack,
          .signals-card--secondary {
            min-height: 280px;
          }
        }

        @media (max-width: 640px) {
          .gallery-section {
            padding: 3.5rem 0 5rem;
          }

          .gallery-container {
            padding: 0 1rem;
          }

          .gallery-header {
            margin-bottom: 1.25rem;
          }

          .gallery-heading-row {
            gap: 1rem;
          }

          .gallery-note {
            max-width: 100%;
            padding-bottom: 0;
          }

          .gallery-note-copy {
            font-size: 13px;
          }

          .signals-grid {
            grid-template-columns: 1fr;
            overflow: hidden;
          }

          .signals-show-desktop {
            display: none;
          }

          .signals-show-mobile {
            display: block;
            overflow: hidden;
          }

          .signals-mobile {
            display: block;
            width: 100%;
            overflow: hidden;
          }

          .signals-mobile > div:first-child {
            border-radius: 0 !important;
          }

          .signals-thumb {
            border-radius: 0 !important;
          }

          .signals-card {
            max-width: 100%;
          }
        }

        .signals-carousel {
          display: flex;
          gap: 8px;
          overflow-x: scroll;
          margin-top: 12px;
          padding-bottom: 4px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
          scrollbar-width: none;
        }

        .signals-carousel::-webkit-scrollbar {
          display: none;
        }

        .signals-thumb {
          position: relative;
          flex-shrink: 0;
          width: 72px;
          height: 72px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid transparent;
          outline: none;
          padding: 0;
          cursor: pointer;
          transition: border-color 200ms ease, opacity 200ms ease;
          opacity: 0.55;
          scroll-snap-align: center;
        }

        .signals-thumb--active {
          border-color: var(--c-teal);
          opacity: 1;
        }

        .signals-thumb-image {
          object-fit: cover;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
