import React from "react";

type HeadingLevel = "display" | "section" | "subsection" | "card";

interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  level: HeadingLevel;
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  children: React.ReactNode;
}

const HEADING_STYLES: Record<HeadingLevel, React.CSSProperties> = {
  display: {
    fontFamily: "var(--f-display)",
    fontSize: "clamp(56px, 10vw, 140px)",
    lineHeight: 0.88,
    letterSpacing: "-0.03em",
    textTransform: "uppercase",
    margin: 0,
  },
  section: {
    fontFamily: "var(--f-display)",
    fontSize: "clamp(56px, 9vw, 120px)",
    lineHeight: 0.88,
    letterSpacing: "-0.04em",
    textTransform: "uppercase",
    margin: 0,
  },
  subsection: {
    fontFamily: "var(--f-display)",
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    lineHeight: 0.95,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    margin: 0,
  },
  card: {
    fontFamily: "var(--f-display)",
    fontSize: "clamp(22px, 6vw, 32px)",
    lineHeight: 1,
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    margin: 0,
  },
};

const DEFAULT_TAG: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4"> = {
  display: "h1",
  section: "h2",
  subsection: "h3",
  card: "h4",
};

export default function Heading({ level, as, children, style, ...props }: HeadingProps) {
  const Tag = as || DEFAULT_TAG[level];
  return (
    <Tag style={{ ...HEADING_STYLES[level], ...style }} {...props}>
      {children}
    </Tag>
  );
}
