"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

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

const MARQUEE_ITEMS = [...MEMBERS, ...MEMBERS];
const MARQUEE_DURATION = 28;

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
    gap: clamp(18px, 3vw, 36px);
    will-change: transform;
    transform: translate3d(0, 0, 0);
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

  .bloom-benefit-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: var(--c-teal-dark);
    flex-shrink: 0;
    margin-top: 1px;
  }

  .bloom-benefit-copy {
    min-width: 0;
  }

  .bloom-benefit-detail {
    display: block;
  }

  @media (max-width: 640px) {
    .bloom-benefit-row {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.68);
    }

    .bloom-benefit-copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
    }

    .bloom-benefit-dot {
      display: none;
    }

    .bloom-benefit-title {
      display: block;
      width: 100%;
    }

    .bloom-benefit-detail {
      display: block;
      width: 100%;
      line-height: 1.4;
      margin-top: 0;
    }
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
    transition: background 0.25s ease, transform 0.2s ease, width 0.2s ease;
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

  .bloom-cta-desktop {
    display: inline-flex;
    align-self: flex-start;
  }

  .bloom-cta-mobile {
    display: none;
    width: 100%;
  }

  @media (max-width: 1023px) {
    .bloom-cta-desktop {
      display: none;
    }

    .bloom-cta-mobile {
      display: inline-flex;
      width: 100%;
    }
  }
`;

function Marquee() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bloom-marquee-mask">
      <div className="bloom-marquee-viewport">
        <motion.div
          className="bloom-marquee-track"
          animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: MARQUEE_DURATION,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                }
          }
          initial={false}
        >
          {MARQUEE_ITEMS.map((member, index) => (
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
        <div className="mb-10 flex flex-col gap-1">
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

          <div className="flex items-end justify-between gap-6 flex-wrap">
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

            <a
              href="https://shop.weverse.io/en/shop/USD/artists/285/sales/55705"
              target="_blank"
              rel="noopener noreferrer"
              className="bloom-cta bloom-cta-desktop"
              aria-label="Join BLOOM on Weverse"
            >
              Join BLOOM
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid gap-8 lg:gap-16 lg:grid-cols-2 lg:items-end">
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
                <div className="bloom-benefit-copy">
                  <div className="bloom-benefit-dot" />
                  <div style={{ minWidth: 0 }}>
                    <span
                      className="bloom-benefit-title"
                      style={{
                        display: "block",
                        fontFamily: "var(--f-body)",
                        fontSize: "clamp(12px, 1.5vw, 14px)",
                        fontWeight: 500,
                        color: "var(--c-ink)",
                        lineHeight: 1.25,
                      }}
                    >
                      {benefit.label}
                    </span>
                    <span
                      className="bloom-benefit-detail"
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: "9px",
                        letterSpacing: "0.06em",
                        color: "var(--c-ink)",
                        opacity: 0.45,
                        marginTop: "4px",
                      }}
                    >
                      {benefit.detail}
                    </span>
                  </div>
                </div>
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
            className="bloom-cta bloom-cta-mobile w-full"
            aria-label="Join BLOOM on Weverse"
          >
            Join BLOOM
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
