"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";

const MEMBERS = [
  { name: "Aiah", color: "var(--c-aiah)" },
  { name: "Colet", color: "var(--c-colet)" },
  { name: "Maloi", color: "var(--c-maloi)" },
  { name: "Gwen", color: "var(--c-gwen)" },
  { name: "Stacey", color: "var(--c-stacey)" },
  { name: "Mikha", color: "var(--c-mikha)" },
  { name: "Jhoanna", color: "var(--c-jhoanna)" },
  { name: "Sheena", color: "var(--c-sheena)" },
];

const BENEFITS = [
  { label: "Exclusive content", detail: "Member-only posts, photos & videos" },
  { label: "Priority access", detail: "First dibs on concert tickets & merch" },
  { label: "Digital membership card", detail: "Your official BLOOM card on Weverse" },
  { label: "Member-only fan meets", detail: "Special invites & events" },
];

const GAP = 36;
const SPEED = 60;

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const [loopWidth, setLoopWidth] = useState(0);

  useEffect(() => {
    if (!trackRef.current) return;
    const children = Array.from(trackRef.current.children) as HTMLElement[];
    const half = Math.floor(children.length / 2);
    let w = 0;
    for (let i = 0; i < half; i++) {
      w += children[i].offsetWidth + GAP;
    }
    setLoopWidth(w);
  }, []);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || loopWidth === 0) return;
    let next = x.get() - (delta / 1000) * SPEED;
    if (next <= -loopWidth) next += loopWidth;
    x.set(next);
  });

  const items = [...MEMBERS, ...MEMBERS, ...MEMBERS, ...MEMBERS];

  return (
    <div className="bloom-marquee-mask">
      <div className="bloom-marquee-viewport">
        <motion.div
          ref={trackRef}
          style={{
            display: "flex",
            width: "max-content",
            gap: `${GAP}px`,
            x,
            willChange: "transform",
          }}
          className="bloom-marquee-track"
        >
          {items.map((member, index) => (
            <span
              key={`${member.name}-${index}`}
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "clamp(11px, 1.8vw, 16px)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: member.color,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {member.name}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const STYLES = `
  .bloom-marquee-mask {
    -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
    mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  }

  .bloom-marquee-viewport {
    overflow: hidden;
  }

  .bloom-marquee-track {
    display: flex;
    width: max-content;
  }

  .bloom-benefit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 16px;
    border: 1px solid var(--c-surface-3);
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.5);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .bloom-benefit-row:hover {
    background: rgba(255, 255, 255, 0.84);
    border-color: var(--c-teal);
    transform: translateY(-1px);
  }

  .bloom-benefit-label {
    font-family: var(--f-body);
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 500;
    color: var(--c-ink);
    line-height: 1.25;
    flex-shrink: 0;
  }

  .bloom-benefit-detail {
    font-family: var(--f-mono);
    font-size: 9px;
    letter-spacing: 0.06em;
    color: var(--c-ink);
    opacity: 0.45;
    text-align: right;
  }

  .bloom-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 24px;
    border-radius: 9999px;
    background: var(--c-ink);
    color: var(--c-surface);
    font-family: var(--f-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.2s ease;
    white-space: nowrap;
  }

  .bloom-cta:hover {
    background: var(--c-teal-dark);
    transform: translateY(-1px);
  }

  .bloom-cta:active {
    transform: translateY(0);
  }

  .bloom-cta:focus-visible {
    outline: 2px solid var(--c-teal-dark);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    .bloom-benefit-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      padding: 14px 16px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.68);
    }

    .bloom-benefit-detail {
      text-align: left;
    }
  }
`;

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Membership() {
  return (
    <section
      className="w-full py-16 sm:py-20 relative overflow-hidden"
      style={{ background: "var(--c-surface)" }}
      aria-label="BINI BLOOM Membership"
    >
      <style>{STYLES}</style>

      <div
        className="mb-10 sm:mb-14"
        aria-hidden="true"
        style={{
          borderTop: "1px solid var(--c-surface-3)",
          borderBottom: "1px solid var(--c-surface-3)",
          padding: "10px 0",
        }}
      >
        <Marquee />
      </div>

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-8 md:px-16">
        <div className="mb-8 sm:mb-10 flex flex-col gap-1">
          <p
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
            BINI On Weverse
          </p>

          <h2
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(56px, 9vw, 120px)",
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
              color: "var(--c-teal-dark)",
              textTransform: "uppercase",
            }}
          >
            Exclusive<br />Membership
          </h2>
        </div>

        <div className="grid gap-8 lg:gap-16 lg:grid-cols-2 lg:items-start">
          <div className="hidden lg:flex flex-col gap-4">
            <a
              href="https://shop.weverse.io/en/shop/USD/artists/285/sales/55705"
              target="_blank"
              rel="noopener noreferrer"
              className="bloom-cta w-full"
              aria-label="Join BLOOM on Weverse"
            >
              Be An Exclusive Member
              <ArrowIcon />
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--c-ink)",
                opacity: 0.4,
                marginBottom: "4px",
              }}
            >
              What&apos;s included
            </p>

            {BENEFITS.map((benefit) => (
              <div key={benefit.label} className="bloom-benefit-row">
                <span className="bloom-benefit-label">{benefit.label}</span>
                <span className="bloom-benefit-detail">{benefit.detail}</span>
              </div>
            ))}

            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: "9px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--c-ink)",
                opacity: 0.35,
                paddingTop: "6px",
              }}
            >
              USD $22.46 - 365 days - Weverse Shop
            </p>
          </div>
        </div>

        <div className="mt-8 lg:hidden">
          <a
            href="https://shop.weverse.io/en/shop/USD/artists/285/sales/55705"
            target="_blank"
            rel="noopener noreferrer"
            className="bloom-cta w-full"
            aria-label="Join BLOOM on Weverse"
          >
            Be An Exclusive Member
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}