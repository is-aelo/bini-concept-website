"use client";

import Image from "next/image";
import { groq } from "next-sanity";
import React, { useState, useEffect, useCallback, useRef } from "react";

export const ALL_GALLERY_QUERY = groq`
  *[_type == "gallery"] | order(_createdAt desc) {
    _id,
    title,
    featured,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio
  }
`;

export const NON_FEATURED_GALLERY_QUERY = groq`
  *[_type == "gallery" && featured == false] | order(_createdAt desc) {
    _id,
    title,
    featured,
    "imageUrl": image.asset->url,
    "lqip": image.asset->metadata.lqip,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio
  }
`;

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

// ─── Row patterns: alternates wide-left / wide-right ───────────────────────
// Each pattern is [colSpan per cell] in a 4-col grid
const ROW_PATTERNS = [
  [2, 1, 1], // wide left
  [1, 1, 2], // wide right
];

function buildRows(items: GalleryItem[]) {
  const rows: { spans: number[]; items: GalleryItem[] }[] = [];
  let i = 0;
  let pi = 0;
  while (i < items.length) {
    const spans = ROW_PATTERNS[pi % ROW_PATTERNS.length];
    const chunk = items.slice(i, i + spans.length);
    if (!chunk.length) break;
    // pad spans to match chunk length (last row may be shorter)
    rows.push({ spans: spans.slice(0, chunk.length), items: chunk });
    i += chunk.length;
    pi++;
  }
  return rows;
}

// ─── Mobile Slider ─────────────────────────────────────────────────────────
function MobileSlider({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const prev = useCallback(() => setActive((a) => Math.max(0, a - 1)), []);
  const next = useCallback(() => setActive((a) => Math.min(items.length - 1, a + 1)), [items.length]);

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
      {/* Main image */}
      <div
        className="ms-main"
        onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].clientX; }}
        onTouchEnd={(e) => {
          touchEndX.current = e.changedTouches[0].clientX;
          const diff = touchStartX.current - touchEndX.current;
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

        {/* Arrows */}
        <button
          className="ms-arrow ms-arrow-left"
          onClick={prev}
          disabled={active === 0}
          aria-label="Previous photo"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className="ms-arrow ms-arrow-right"
          onClick={next}
          disabled={active === items.length - 1}
          aria-label="Next photo"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M7 3L13 9L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Counter */}
        <div className="ms-counter" aria-live="polite">
          {active + 1} <span>/</span> {items.length}
        </div>
      </div>

      {/* Thumbnail strip */}
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

// ─── Desktop Masonry ───────────────────────────────────────────────────────
function DesktopMasonry({ items }: { items: GalleryItem[] }) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_ROWS = 2;

  const allRows = buildRows(items);
  const visibleRows = showAll ? allRows : allRows.slice(0, INITIAL_ROWS);
  const hasMore = allRows.length > INITIAL_ROWS;

  return (
    <div className="dm-wrap">
      <div className="dm-rows">
        {visibleRows.map((row, ri) => (
          <div
            key={ri}
            className={`dm-row ${ri % 2 === 1 ? "dm-row-reversed" : ""}`}
            style={{ animationDelay: `${ri * 60}ms` }}
          >
            {row.items.map((item, ci) => {
              const span = row.spans[ci];
              const isWide = span === 2;

              return (
                <div
                  key={item._id}
                  className={`dm-cell ${isWide ? "dm-cell-wide" : "dm-cell-narrow"}`}
                >
                  <div className="dm-frame">
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "BINI"}
                      fill
                      className="dm-img"
                      sizes={isWide
                        ? "(max-width:1280px) 60vw, 768px"
                        : "(max-width:1280px) 30vw, 384px"
                      }
                      placeholder={item.lqip ? "blur" : "empty"}
                      blurDataURL={item.lqip}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="dm-cta-row">
          <div className="dm-line" aria-hidden="true" />
          <button
            className="dm-cta"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 9L6.5 4L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Show less
              </>
            ) : (
              <>
                View all
                <span className="dm-cta-pill">{items.length}</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 4L6.5 9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
          <div className="dm-line" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

// ─── Main Gallery ─────────────────────────────────────────────────────────
export function Gallery({ items }: GalleryProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="gallery-section" aria-label="Gallery">
      <div className="gallery-container">
        {/* Header */}
        <header className="gallery-header">
          <span className="text-label-mono">Gallery</span>
          <div className="gallery-headline">
            <h2 className="gallery-title">BINI</h2>
            <span className="gallery-amp">&amp; Blooms</span>
          </div>
          <p className="gallery-tagline">moments worth keeping</p>
        </header>

        {/* Desktop: staggered masonry */}
        <div className="show-desktop">
          <DesktopMasonry items={items} />
        </div>

        {/* Mobile: full-width slider */}
        <div className="show-mobile">
          <MobileSlider items={items} />
        </div>
      </div>

      <style>{`
        /* ── Section shell ── */
        .gallery-section {
          background-color: var(--c-surface);
          padding: 6rem 0 8rem;
        }
        .gallery-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── Header ── */
        .gallery-header { margin-bottom: 3rem; }
        .gallery-headline {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }
        .gallery-title {
          font-family: var(--f-display);
          font-size: clamp(56px, 10vw, 120px);
          line-height: 0.9;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: var(--c-ink);
          margin: 0;
        }
        .gallery-amp {
          font-family: var(--f-display);
          font-size: clamp(22px, 4vw, 48px);
          color: var(--c-teal);
          line-height: 1;
        }
        .gallery-tagline {
          font-family: var(--f-serif);
          font-style: italic;
          color: var(--c-ink);
          opacity: 0.45;
          margin-top: 0.75rem;
          font-size: clamp(14px, 1.8vw, 18px);
        }

        /* ── Responsive show/hide ── */
        .show-desktop { display: block; }
        .show-mobile  { display: none; }

        @media (max-width: 640px) {
          .show-desktop { display: none; }
          .show-mobile  { display: block; }
          .gallery-section { padding: 3.5rem 0 5rem; }
          .gallery-container { padding: 0 1rem; }
          .gallery-header { margin-bottom: 1.75rem; }
        }

        /* ════════════════════════════════
           DESKTOP MASONRY
        ════════════════════════════════ */
        .dm-wrap {}

        .dm-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dm-row {
          display: grid;
          /* wide cell = 2fr, narrow = 1fr, always 4 total cols */
          grid-template-columns: 2fr 1fr 1fr;
          gap: 10px;
          animation: dmRowIn 0.45s var(--ease-smooth) both;
        }

        /* Reversed row: narrow narrow wide — achieved by CSS order */
        .dm-row-reversed {
          grid-template-columns: 1fr 1fr 2fr;
        }

        @keyframes dmRowIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dm-cell { position: relative; min-width: 0; }
        .dm-cell-wide   { /* inherits grid col from parent template */ }
        .dm-cell-narrow { }

        /* Frame: contains the image, letterboxed with contain */
        .dm-frame {
          position: relative;
          width: 100%;
          /* 
            16:9 aspect for wide cells feels right for landscape photos.
            We keep a fixed height per row so all cells in the row align.
            object-fit: contain ensures no crop ever.
          */
          height: 300px;
          background: var(--c-surface-2);
          border-radius: var(--r-md);
          overflow: hidden;
          transition: transform 380ms var(--ease-smooth), box-shadow 380ms var(--ease-smooth);
        }

        .dm-frame:hover {
          transform: translateY(-4px) scale(1.003);
          box-shadow: var(--shadow-float);
        }

        .dm-img {
          object-fit: contain;   /* ← no crop, full image always visible */
          transition: transform 600ms cubic-bezier(0.22,1,0.36,1);
          padding: 0; /* no padding — image fills frame edge-to-edge within contain bounds */
        }

        .dm-frame:hover .dm-img {
          transform: scale(1.04);
        }

        /* Tablet tweak */
        @media (max-width: 1024px) {
          .dm-frame { height: 230px; }
        }

        /* CTA row */
        .dm-cta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2.25rem;
        }
        .dm-line {
          flex: 1;
          height: 0.5px;
          background: var(--c-surface-3);
        }
        .dm-cta {
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
          transition: border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease;
        }
        .dm-cta:hover {
          border-color: var(--c-teal);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99,203,214,0.15);
        }
        .dm-cta-pill {
          background: var(--c-teal-pale);
          color: var(--c-teal-dark);
          border-radius: var(--r-full);
          font-size: 10px;
          padding: 1px 7px;
          font-family: var(--f-mono);
        }

        /* ════════════════════════════════
           MOBILE SLIDER
        ════════════════════════════════ */
        .ms-wrap { display: flex; flex-direction: column; gap: 10px; }

        /* Main stage */
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
          /* 
            16:9 aspect ratio for the stage.
            object-fit:contain inside → full image, letterboxed if needed.
          */
          aspect-ratio: 16 / 9;
        }

        .ms-img {
          object-fit: contain; /* ← no crop */
        }

        /* Arrows */
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

        /* Counter */
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

        /* Thumbnail strip */
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
          height: 46px; /* 16:9-ish */
          border-radius: 4px;
          overflow: hidden;
          background: var(--c-surface-2);
        }
        .ms-thumb-img {
          object-fit: contain; /* full thumb, no crop */
        }
      `}</style>
    </section>
  );
}

export default Gallery;