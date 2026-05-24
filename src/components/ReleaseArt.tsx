interface ReleaseArtProps {
  src: string | null;
  alt: string;
  /** Size in px — both width and height. Defaults to 64. */
  size?: number;
  /** Border radius. Defaults to 6. */
  radius?: number;
  /** Show the teal selection ring */
  selected?: boolean;
}

export function ReleaseArt({
  src,
  alt,
  size = 64,
  radius = 6,
  selected = false,
}: ReleaseArtProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--c-surface-2)",
        border: selected
          ? "2px solid var(--c-teal-dark)"
          : "2px solid transparent",
        transition: "border-color 0.15s ease",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        /* Placeholder when no art is available */
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--c-surface-3)",
          }}
        >
          <svg
            width={size * 0.35}
            height={size * 0.35}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--c-ink)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.3}
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="9" />
          </svg>
        </div>
      )}
    </div>
  );
}