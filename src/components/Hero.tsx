import Image from "next/image";
import Link from "next/link";
import { SpotifyLogo, Asterisk } from "@phosphor-icons/react/dist/ssr";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HERO_GALLERY_QUERY, ALL_ALBUMS_QUERY } from "@/sanity/lib/queries";
import StreamCounter from "./StreamCounter";
import AuroraShader from "./AuroraShader";
import HeroCarousel from "./HeroCarousel";

interface HeroImage {
  _id: string;
  title: string;
  imageUrl: string | null;
}

interface Album {
  _id: string;
  title: string;
  type?: string;
  releaseDate?: string;
  coverUrl: string | null;
  tracklist?: string[];
  spotifyLink?: string;
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

export default async function Hero() {
  const [heroImages, albums] = await Promise.all([
    sanityFetch<HeroImage[]>({ query: HERO_GALLERY_QUERY, tags: ["gallery"] }),
    sanityFetch<Album[]>({ query: ALL_ALBUMS_QUERY, tags: ["albums"] }),
  ]);

  const latestAlbum = albums?.[0];
  const validImages = heroImages?.filter(img => img.imageUrl) || [];
  const displayData = validImages.slice(0, 8);

  if (displayData.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--c-surface)]">
        <h1 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(80px,14vw,200px)", lineHeight: 0.85, color: "#3AAAB6" }}>
          BINI
        </h1>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-[var(--c-surface)] overflow-hidden flex flex-col border-b border-[var(--c-border)]">
      <AuroraShader />

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-16 pt-28 md:pt-24 pb-0">
        <div className="flex-1 flex items-center justify-center w-full">
          <HeroCarousel images={displayData} />
        </div>

        <div className="flex flex-col items-center text-center gap-3 pb-10 pt-6">
          <div className="flex items-center gap-2">
            <Asterisk
              size={11}
              className="animate-spin text-[var(--c-bloom,#f4a7c3)]"
              style={{ animationDuration: "12s" }}
            />
            <span
              style={{ fontFamily: "var(--f-mono)" }}
              className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 text-[var(--c-ink)]"
            >
              Mabuhay! we are
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(72px, 10vw, 140px)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: "var(--c-ink)",
            }}
          >
            BINI
          </h1>

<p
  className="text-[var(--c-ink)] opacity-70 max-w-[420px] leading-relaxed font-regular"
  style={{
    fontFamily: "var(--f-body)",
    fontSize: "0.95rem",
  }}
>
  An 8-member Filipino girl group redefining P-pop and bringing modern
  Filipino talent to the global stage.
</p>
        </div>
      </div>

      <div
        className="relative z-20 w-full flex items-center gap-5 px-6 md:px-16"
        style={{
          height: 72,
          background: "rgba(245, 243, 238, 0.8)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          borderTop: "1px solid rgba(12,12,10,0.07)",
        }}
      >
        {latestAlbum?.coverUrl && (
          <div
            className="relative flex-shrink-0 rounded-lg overflow-hidden"
            style={{ width: 46, height: 46, boxShadow: "0 4px 12px rgba(0,0,0,0.10)" }}
          >
            <Image
              src={latestAlbum.coverUrl}
              alt={latestAlbum.title || "Latest Album"}
              fill
              sizes="46px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <span
            style={{ fontFamily: "var(--f-mono)" }}
            className="text-[9px] font-bold uppercase tracking-[0.14em] opacity-40 text-[var(--c-ink)]"
          >
            Latest Release
          </span>
          <span
            className="text-[21px] font-black leading-none tracking-wide"
            style={{ fontFamily: "var(--f-display)" }}
          >
            {(latestAlbum?.title || "SIGNALS").split("").map((letter, i) => (
              <span key={i} style={{ color: MEMBER_COLORS[i % MEMBER_COLORS.length] }}>
                {letter}
              </span>
            ))}
          </span>
        </div>

        <div
          className="flex-shrink-0"
          style={{ width: 1, height: 32, background: "rgba(12,12,10,0.10)" }}
        />

        <div className="hidden sm:flex flex-col gap-0.5 flex-shrink-0">
          <StreamCounter value={20000000} className="text-[18px] font-bold tracking-tight text-[var(--c-ink)]" />
          <span
            style={{ fontFamily: "var(--f-mono)" }}
            className="text-[8px] font-bold uppercase tracking-[0.12em] opacity-40 text-[var(--c-ink)]"
          >
            Spotify Streams
          </span>
        </div>

        <div className="flex-1" />

        {latestAlbum?.spotifyLink && (
          <Link
            href={latestAlbum.spotifyLink}
            target="_blank"
            className="flex-shrink-0 inline-flex items-center gap-2 font-bold text-black transition-all duration-200 hover:-translate-y-px active:scale-[0.98]"
            style={{
              height: 38,
              padding: "0 18px",
              borderRadius: 9999,
              background: "var(--c-teal)",
              fontSize: 13,
              letterSpacing: "0.02em",
              boxShadow: "0 4px 16px rgba(30,215,96,0.22)",
              fontFamily: "var(--f-body)",
            }}
          >
            <SpotifyLogo size={15} weight="fill" />
            Stream Now
          </Link>
        )}
      </div>
    </section>
  );
}