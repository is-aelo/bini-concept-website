import type { Metadata } from "next";
import { Bebas_Neue, Playfair_Display, Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

// 1. FONT CONFIGURATION (High-End Editorial Mix)
const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--f-display",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--f-serif",
});

const monoFont = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--f-mono",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--f-body",
});

export const metadata: Metadata = {
  title: "BINI — Nation's Girl Group | Portfolio Concept",
  description: "A high-fidelity creative concept for BINI. Experience the first P-Pop group to perform at Coachella.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${displayFont.variable} 
          ${serifFont.variable} 
          ${monoFont.variable} 
          ${bodyFont.variable} 
          antialiased selection:bg-[var(--c-teal)] selection:text-[var(--c-ink)]
        `}
      >
        {/* 2. GLOBAL NOISE FILTER (Required for the grain effect in globals.css) */}
        <svg className="pointer-events-none fixed isolate z-[9999] opacity-0">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
        </svg>

        {/* 3. MAIN WRAPPER */}
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}