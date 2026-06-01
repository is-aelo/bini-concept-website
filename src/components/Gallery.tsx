"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import GalleryBackground from "./GalleryBackground";
import ImageLightbox, { LightboxImage } from "./ImageLightbox";

type GalleryItem = {
  _id: string;
  title?: string;
  featured?: boolean;
  imageUrl: string;
  lqip?: string;
  aspectRatio?: number;
};

type GalleryProps = {
  items: GalleryItem[];
};

const ROW_HEIGHT = 280;
const INITIAL_ROWS = 3;
const GAP = 10;

function buildJustifiedRows(items: GalleryItem[], containerWidth: number) {
  const rows: GalleryItem[][] = [];
  let current: GalleryItem[] = [];
  let currentWidth = 0;

  for (const item of items) {
    const ratio = item.aspectRatio ?? 16 / 9;
    const w = ratio * ROW_HEIGHT;
    currentWidth += w + (current.length > 0 ? GAP : 0);

    current.push(item);

    if (currentWidth >= containerWidth * 0.85) {
      rows.push(current);
      current = [];
      currentWidth = 0;
    }
  }

  if (current.length > 0) {
    rows.push(current);
  }

  return rows;
}

function MobileSlider({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const didSwipe = useRef(false);

  const prev = useCallback(() => setActive((a) => Math.max(0, a - 1)), []);
  const next = useCallback(
    () => setActive((a) => Math.min(items.length - 1, a + 1)),
    [items.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const item = items[active];

  return (
    <div className="ms-wrap">
      <div
        className="ms-main"
        onClick={() => {
          if (!didSwipe.current) onOpen(active);
          didSwipe.current = false;
        }}
        onTouchStart={(e) => {
          didSwipe.current = false;
          touchStartX.current = e.changedTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          touchEndX.current = e.changedTouches[0].clientX;
          const diff = touchStartX.current - touchEndX.current;
          didSwipe.current = Math.abs(diff) > 40;
          if (diff > 40) next();
          if (diff < -40) prev();
        }}
      >
        <div className="ms-img-frame" key={item._id}>
          <Image
            src={item.imageUrl}
            alt={item.title || "BINI"}
            fill
            className="ms-img"
            sizes="100vw"
            placeholder={item.lqip ? "blur" : "empty"}
            blurDataURL={item.lqip}
            priority={active === 0}
          />
        </div>

        <button
          className="ms-arrow ms-arrow-left"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          disabled={active === 0}
          aria-label="Previous photo"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="ms-arrow ms-arrow-right"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          disabled={active === items.length - 1}
          aria-label="Next photo"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="ms-counter" aria-live="polite">
          {active + 1} <span>/</span> {items.length}
        </div>
      </div>

      <div className="ms-thumbs" role="list" aria-label="Photo thumbnails">
        {items.map((img, i) => (
          <button
            key={img._id}
            className={`ms-thumb ${i === active ? "ms-thumb-active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === active}
            role="listitem"
          >
            <div className="ms-thumb-img-wrap">
              <Image
                src={img.imageUrl}
                alt=""
                fill
                className="ms-thumb-img"
                sizes="80px"
                placeholder={img.lqip ? "blur" : "empty"}
                blurDataURL={img.lqip}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function JustifiedFilmstrip({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (index: number) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1280);
  const wrapRef = useRef<HTMLDivElement>(null);
  const indexById = useMemo(
    () => new Map(items.map((item, index) => [item._id, index])),
    [items]
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const allRows = buildJustifiedRows(items, containerWidth);
  const visibleRows = showAll ? allRows : allRows.slice(0, INITIAL_ROWS);
  const hasMore = allRows.length > INITIAL_ROWS;
  const hiddenCount = items.length - visibleRows.flat().length;

  return (
    <div className="jf-wrap" ref={wrapRef}>
      <div className="jf-rows">
        {visibleRows.map((row, ri) => {
          const isLastVisible = ri === visibleRows.length - 1;
          const isLastRow = isLastVisible && !showAll && hasMore;
          const isOrphanRow = isLastVisible && row.length < 3;
          return (
            <div
              key={ri}
              className={`jf-row${isLastRow ? " jf-row-fade" : ""}${isOrphanRow ? " jf-row-orphan" : ""}`}
              style={{ animationDelay: `${ri * 50}ms` }}
            >
              {row.map((item) => {
                const ratio = item.aspectRatio ?? 16 / 9;
                return (
                  <div
                    key={item._id}
                    className="jf-cell"
                    style={
                      isOrphanRow
                        ? { flexGrow: 0, flexShrink: 0, flexBasis: `${ratio * ROW_HEIGHT}px` }
                        : { flexGrow: ratio, flexBasis: `${ratio * ROW_HEIGHT}px` }
                    }
                  >
                    <button
                      className="jf-frame"
                      onClick={() => onOpen(indexById.get(item._id) ?? 0)}
                      aria-label={`Open ${item.title || "BINI photo"} in lightbox`}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "BINI"}
                        fill
                        className="jf-img"
                        sizes="(max-width:768px) 50vw, 33vw"
                        placeholder={item.lqip ? "blur" : "empty"}
                        blurDataURL={item.lqip}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="jf-cta-row">
          <div className="jf-line" aria-hidden="true" />
          <button className="jf-cta" onClick={() => setShowAll((s) => !s)}>
            {showAll ? (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 9L6.5 4L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Show less
              </>
            ) : (
              <>
                View all
                <span className="jf-cta-pill">+{hiddenCount}</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 4L6.5 9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </>
            )}
          </button>
          <div className="jf-line" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

export function Gallery({ items }: GalleryProps) {
  const galleryItems = useMemo(() => items || [], [items]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxImages: LightboxImage[] = useMemo(
    () =>
      galleryItems.map((item) => ({
        src: item.imageUrl,
        alt: item.title || "BINI",
      })),
    [galleryItems]
  );

  if (galleryItems.length === 0) return null;

  return (
    <section className="gallery-section" aria-label="Gallery">
      <GalleryBackground />

      <div className="gallery-container">
        <header className="gallery-header">
          <span className="gallery-label text-label-mono">Photo Archive</span>

          <div className="gallery-heading-row">
            <h2 className="gallery-title">
              In<br />Frame
            </h2>

            <div className="gallery-note" aria-label="BINI and Blooms gallery note">
              <span className="gallery-note-kicker">BINI x Blooms</span>
              <p className="gallery-note-copy">A shared journey of music, memories, and moments made brighter together.</p>
            </div>
          </div>
        </header>

        <div className="gallery-divider" role="separator" />

        <div className="show-desktop">
          <JustifiedFilmstrip items={galleryItems} onOpen={setLightboxIndex} />
        </div>

        <div className="show-mobile">
          <MobileSlider items={galleryItems} onOpen={setLightboxIndex} />
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
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .gallery-header {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
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
        .gallery-title {
          font-family: var(--f-display);
          font-size: clamp(56px, 9vw, 120px);
          line-height: 0.88;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: var(--c-teal-dark);
          margin: 0;
        }
        .gallery-note {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.7rem;
          max-width: 340px;
          padding-bottom: 0.5rem;
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
          line-height: 1.35;
          color: var(--c-ink);
          opacity: 0.68;
        }
        .gallery-divider {
          height: 1.5px;
          background: var(--c-ink);
          margin-bottom: 24px;
        }

        .show-desktop { display: block; }
        .show-mobile  { display: none; }

        @media (max-width: 640px) {
          .show-desktop { display: none; }
          .show-mobile  { display: block; }
          .gallery-section { padding: 3.5rem 0 5rem; }
          .gallery-container { padding: 0 1rem; }
          .gallery-header { margin-bottom: 1.25rem; }
          .gallery-heading-row { gap: 1rem; }
          .gallery-note {
            max-width: 100%;
            padding-bottom: 0;
          }
          .gallery-note-copy { font-size: 13px; }
        }

        /* ── Justified Filmstrip ── */
        .jf-wrap {}

        .jf-rows {
          display: flex;
          flex-direction: column;
          gap: ${GAP}px;
        }

        .jf-row {
          display: flex;
          gap: ${GAP}px;
          height: ${ROW_HEIGHT}px;
          animation: jfRowIn 0.4s ease both;
        }

        .jf-row-orphan {
          justify-content: flex-start;
        }

        .jf-row-fade {
          mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
        }

        @keyframes jfRowIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .jf-cell {
          min-width: 0;
          flex-shrink: 1;
          position: relative;
        }

        .jf-frame {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          border-radius: var(--r-md, 6px);
          background: var(--c-surface-2);
          cursor: zoom-in;
          overflow: hidden;
        }

        .jf-img {
          object-fit: cover;
          border-radius: inherit;
          transition: filter 350ms ease;
        }

        .jf-frame:hover .jf-img {
          filter: brightness(0.88);
        }

        /* CTA row */
        .jf-cta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .jf-line {
          flex: 1;
          height: 0.5px;
          background: var(--c-surface-3);
        }
        .jf-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--f-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--c-ink);
          background: transparent;
          border: 1px solid var(--c-surface-3);
          border-radius: var(--r-full);
          padding: 0.5rem 1.1rem;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 220ms ease, transform 220ms ease;
        }
        .jf-cta:hover {
          border-color: var(--c-teal);
          transform: translateY(-2px);
        }
        .jf-cta-pill {
          background: var(--c-teal-pale);
          color: var(--c-teal-dark);
          border-radius: var(--r-full);
          font-size: 10px;
          padding: 1px 7px;
          font-family: var(--f-mono);
        }

        /* ── Mobile Slider ── */
        .ms-wrap { display: flex; flex-direction: column; gap: 10px; }

        .ms-main {
          position: relative;
          width: 100%;
          background: var(--c-surface-2);
          border-radius: var(--r-md);
          overflow: hidden;
        }

        .ms-img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
        }

        .ms-img {
          object-fit: cover;
        }

        .ms-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(12,12,10,0.40);
          border: 1px solid rgba(255,255,255,0.18);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 200ms ease, transform 200ms ease;
          z-index: 2;
        }
        .ms-arrow:hover:not(:disabled) {
          background: rgba(12,12,10,0.65);
          transform: translateY(-50%) scale(1.08);
        }
        .ms-arrow:disabled { opacity: 0.25; cursor: default; }
        .ms-arrow-left  { left: 10px; }
        .ms-arrow-right { right: 10px; }

        .ms-counter {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--f-mono);
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.1em;
          background: rgba(12,12,10,0.35);
          backdrop-filter: blur(4px);
          padding: 3px 10px;
          border-radius: var(--r-full);
          white-space: nowrap;
        }
        .ms-counter span { opacity: 0.5; margin: 0 3px; }

        .ms-thumbs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .ms-thumbs::-webkit-scrollbar { height: 3px; }
        .ms-thumbs::-webkit-scrollbar-track { background: var(--c-surface-2); border-radius: 2px; }
        .ms-thumbs::-webkit-scrollbar-thumb { background: var(--c-surface-3); border-radius: 2px; }

        .ms-thumb {
          flex: 0 0 72px;
          scroll-snap-align: start;
          background: transparent;
          border: 1.5px solid transparent;
          border-radius: 6px;
          padding: 0;
          cursor: pointer;
          transition: border-color 200ms ease, transform 200ms ease;
          overflow: hidden;
        }
        .ms-thumb-active {
          border-color: var(--c-teal);
          transform: scale(1.05);
        }

        .ms-thumb-img-wrap {
          position: relative;
          width: 72px;
          height: 46px;
          border-radius: 4px;
          overflow: hidden;
          background: var(--c-surface-2);
        }
        .ms-thumb-img {
          object-fit: cover;
        }
      `}</style>
    </section>
  );
}

export default Gallery;
