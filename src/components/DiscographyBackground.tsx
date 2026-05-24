"use client";

/**
 * DiscographyBackground
 * ---------------------
 * Floating, softly-animated blob gradient using BINI member accent colours.
 * Renders as an absolute-fill layer — place it as the first child of a
 * `position: relative` container and it will sit behind all content.
 *
 * Blobs are pure CSS animations so there is zero JS overhead at runtime.
 */
export default function DiscographyBackground() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="disc-bg" aria-hidden="true">
        {BLOBS.map((b, i) => (
          <div key={i} className={`disc-blob disc-blob--${i + 1}`} />
        ))}
        {/* Frosted-glass diffusion layer keeps blobs soft */}
        <div className="disc-blur" />
        {/* Light cream wash on top so the section stays readable */}
        <div className="disc-wash" />
      </div>
    </>
  );
}

/* ── Blob definitions ─────────────────────────────────────────────────
   Each blob gets a colour from the member palette, a size, a starting
   position, and its own drift animation so they never look in sync.     */
const BLOBS = [
  { color: "var(--c-stacey)" },   // hot pink   — Stacey
  { color: "var(--c-colet)" },    // lime        — Colet
  { color: "var(--c-maloi)" },    // yellow      — Maloi
  { color: "var(--c-teal)" },     // teal        — brand
  { color: "var(--c-gwen)" },     // orange      — Gwen
  { color: "var(--c-sheena)" },   // plum        — Sheena
  { color: "var(--c-mikha)" },    // red         — Mikha
  { color: "var(--c-jhoanna)" },  // navy        — Jhoanna
];

/* ── Styles ───────────────────────────────────────────────────────── */
const STYLES = `
  .disc-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Shared blob shape ── */
  .disc-blob {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    mix-blend-mode: multiply;
  }

  /* ── Individual blobs: size · position · colour · animation ── */

  /* Stacey — large pink anchor, top-left */
  .disc-blob--1 {
    width: 55vw;
    height: 55vw;
    max-width: 700px;
    max-height: 700px;
    top: -18%;
    left: -12%;
    background: radial-gradient(circle at 40% 45%, var(--c-stacey) 0%, transparent 70%);
    opacity: 0.22;
    animation: drift1 18s ease-in-out infinite;
  }

  /* Colet — medium lime, top-right */
  .disc-blob--2 {
    width: 40vw;
    height: 40vw;
    max-width: 520px;
    max-height: 520px;
    top: -10%;
    right: -8%;
    background: radial-gradient(circle at 55% 40%, var(--c-colet) 0%, transparent 68%);
    opacity: 0.18;
    animation: drift2 22s ease-in-out infinite;
  }

  /* Maloi — yellow, centre-left floating */
  .disc-blob--3 {
    width: 38vw;
    height: 38vw;
    max-width: 480px;
    max-height: 480px;
    top: 25%;
    left: 5%;
    background: radial-gradient(circle at 50% 50%, var(--c-maloi) 0%, transparent 65%);
    opacity: 0.16;
    animation: drift3 26s ease-in-out infinite;
  }

  /* Teal — mid-page accent */
  .disc-blob--4 {
    width: 36vw;
    height: 36vw;
    max-width: 460px;
    max-height: 460px;
    top: 20%;
    right: 15%;
    background: radial-gradient(circle at 45% 55%, var(--c-teal) 0%, transparent 68%);
    opacity: 0.14;
    animation: drift4 20s ease-in-out infinite;
  }

  /* Gwen — orange, bottom-left */
  .disc-blob--5 {
    width: 44vw;
    height: 44vw;
    max-width: 560px;
    max-height: 560px;
    bottom: -15%;
    left: -5%;
    background: radial-gradient(circle at 50% 50%, var(--c-gwen) 0%, transparent 66%);
    opacity: 0.17;
    animation: drift5 24s ease-in-out infinite;
  }

  /* Sheena — plum, bottom-centre */
  .disc-blob--6 {
    width: 35vw;
    height: 35vw;
    max-width: 440px;
    max-height: 440px;
    bottom: -10%;
    left: 35%;
    background: radial-gradient(circle at 50% 45%, var(--c-sheena) 0%, transparent 65%);
    opacity: 0.15;
    animation: drift6 28s ease-in-out infinite;
  }

  /* Mikha — red, bottom-right */
  .disc-blob--7 {
    width: 38vw;
    height: 38vw;
    max-width: 480px;
    max-height: 480px;
    bottom: -12%;
    right: -6%;
    background: radial-gradient(circle at 45% 50%, var(--c-mikha) 0%, transparent 68%);
    opacity: 0.14;
    animation: drift7 21s ease-in-out infinite;
  }

  /* Jhoanna — navy, centre-right small accent */
  .disc-blob--8 {
    width: 28vw;
    height: 28vw;
    max-width: 340px;
    max-height: 340px;
    top: 50%;
    right: -4%;
    background: radial-gradient(circle at 50% 50%, var(--c-jhoanna) 0%, transparent 65%);
    opacity: 0.13;
    animation: drift8 30s ease-in-out infinite;
  }

  /* ── Diffusion layer: heavy blur turns hard circles into soft clouds ── */
  .disc-blur {
    position: absolute;
    inset: -60px;
    backdrop-filter: blur(0px);
    /* The real blurring is done with a CSS filter on the wrapper */
    filter: blur(64px) saturate(1.3);
    pointer-events: none;
  }

  /* ── Cream wash: ensures text readability over the blobs ── */
  .disc-wash {
    position: absolute;
    inset: 0;
    background: rgba(245, 243, 238, 0.72);
    pointer-events: none;
  }

  /* ── Drift keyframes — organic, never perfectly looping ── */
  @keyframes drift1 {
    0%   { transform: translate(0,    0)    scale(1);    }
    30%  { transform: translate(4%,   6%)   scale(1.06); }
    60%  { transform: translate(-3%,  3%)   scale(0.97); }
    100% { transform: translate(0,    0)    scale(1);    }
  }
  @keyframes drift2 {
    0%   { transform: translate(0,    0)    scale(1);    }
    25%  { transform: translate(-5%,  4%)   scale(1.04); }
    55%  { transform: translate(3%,  -3%)   scale(0.96); }
    100% { transform: translate(0,    0)    scale(1);    }
  }
  @keyframes drift3 {
    0%   { transform: translate(0,    0)    scale(1);    }
    35%  { transform: translate(5%,  -5%)   scale(1.07); }
    70%  { transform: translate(-2%,  4%)   scale(0.95); }
    100% { transform: translate(0,    0)    scale(1);    }
  }
  @keyframes drift4 {
    0%   { transform: translate(0,    0)    scale(1);    }
    40%  { transform: translate(-4%,  6%)   scale(1.05); }
    75%  { transform: translate(3%,  -2%)   scale(0.97); }
    100% { transform: translate(0,    0)    scale(1);    }
  }
  @keyframes drift5 {
    0%   { transform: translate(0,    0)    scale(1);    }
    30%  { transform: translate(6%,  -4%)   scale(1.06); }
    65%  { transform: translate(-3%,  3%)   scale(0.96); }
    100% { transform: translate(0,    0)    scale(1);    }
  }
  @keyframes drift6 {
    0%   { transform: translate(0,    0)    scale(1);    }
    45%  { transform: translate(-5%,  5%)   scale(1.04); }
    80%  { transform: translate(4%,  -3%)   scale(0.98); }
    100% { transform: translate(0,    0)    scale(1);    }
  }
  @keyframes drift7 {
    0%   { transform: translate(0,    0)    scale(1);    }
    35%  { transform: translate(-4%,  -5%)  scale(1.05); }
    70%  { transform: translate(5%,   4%)   scale(0.96); }
    100% { transform: translate(0,    0)    scale(1);    }
  }
  @keyframes drift8 {
    0%   { transform: translate(0,    0)    scale(1);    }
    50%  { transform: translate(4%,   6%)   scale(1.08); }
    100% { transform: translate(0,    0)    scale(1);    }
  }

  /* ── Reduce motion: static blobs, no animation ── */
  @media (prefers-reduced-motion: reduce) {
    .disc-blob { animation: none !important; }
  }
`;