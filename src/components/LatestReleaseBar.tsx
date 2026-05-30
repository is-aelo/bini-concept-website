import Image from "next/image";
import Link from "next/link";
import { SpotifyLogo } from "@phosphor-icons/react/dist/ssr";
import StreamCounter from "./StreamCounter";

interface Album {
  _id: string;
  title: string;
  type?: string;
  releaseDate?: string;
  coverUrl: string | null;
  tracklist?: string[];
  spotifyLink?: string;
}

interface LatestReleaseBarProps {
  album?: Album | null;
  streamCount: number;
}

const MEMBER_COLORS = [
  "var(--c-aiah)",
  "var(--c-jhoanna)",
  "var(--c-maloi)",
  "var(--c-colet)",
  "var(--c-gwen)",
  "var(--c-stacey)",
  "var(--c-mikha)",
  "var(--c-sheena)",
];

export default function LatestReleaseBar({ album, streamCount }: LatestReleaseBarProps) {
  return (
    <div
      className="relative z-20 w-full flex items-center gap-2 sm:gap-4 md:gap-5 px-3 sm:px-6 md:px-16"
      style={{
        minHeight: 64,
        height: "auto",
        paddingTop: 10,
        paddingBottom: 10,
        background: "rgba(245, 243, 238, 0.8)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderTop: "1px solid rgba(12,12,10,0.07)",
      }}
    >
      {album?.coverUrl && (
        <div
          className="relative shrink-0 rounded-lg overflow-hidden"
          style={{ width: 38, height: 38, boxShadow: "0 4px 12px rgba(0,0,0,0.10)" }}
        >
          <Image
            src={album.coverUrl}
            alt={album.title || "Latest Album"}
            fill
            sizes="38px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      <div className="flex flex-col gap-0.5 shrink-0 min-w-0">
        <span
          style={{ fontFamily: "var(--f-mono)" }}
          className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] opacity-40 text-(--c-ink)"
        >
          Latest Release
        </span>
        <span
          className="font-black leading-none tracking-wide"
          style={{
            fontFamily: "var(--f-display)",
            fontSize: "clamp(14px, 4vw, 21px)",
          }}
        >
          {(album?.title || "SIGNALS").split("").map((letter, i) => (
            <span key={`${letter}-${i}`} style={{ color: MEMBER_COLORS[i % MEMBER_COLORS.length] }}>
              {letter}
            </span>
          ))}
        </span>
      </div>

      <div
        className="shrink-0 hidden xs:block"
        style={{ width: 1, height: 28, background: "rgba(12,12,10,0.10)" }}
      />

      <div className="hidden md:flex flex-col gap-0.5 shrink-0">
        <StreamCounter
          value={streamCount}
          className="text-[16px] sm:text-[18px] font-bold tracking-tight text-(--c-ink)"
        />
        <span
          style={{ fontFamily: "var(--f-mono)" }}
          className="text-[8px] font-bold uppercase tracking-[0.12em] opacity-40 text-(--c-ink)"
        >
          Spotify Streams
        </span>
      </div>

      <div className="flex-1" />

      {album?.spotifyLink && (
        <Link
          href={album.spotifyLink}
          target="_blank"
          className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 font-bold text-black transition-all duration-200 hover:-translate-y-px active:scale-[0.98] whitespace-nowrap"
          style={{
            height: 36,
            padding: "0 12px",
            borderRadius: 9999,
            background: "var(--c-teal)",
            fontSize: "clamp(11px, 2.5vw, 13px)",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 16px rgba(30,215,96,0.22)",
            fontFamily: "var(--f-body)",
          }}
        >
          <SpotifyLogo size={14} weight="fill" className="shrink-0" />
          Stream Now
        </Link>
      )}
    </div>
  );
}
