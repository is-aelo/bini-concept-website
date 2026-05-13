import Image from "next/image";
import Link from "next/link";
import { SpotifyLogo } from "@phosphor-icons/react/dist/ssr";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HERO_GALLERY_QUERY, ALL_ALBUMS_QUERY } from "@/sanity/lib/queries";
import StreamCounter from "./StreamCounter";
import AuroraShader from "./AuroraShader";

interface HeroImage {
  _id: string;
  title: string;
  imageUrl: string | null;
}

interface Album {
  _id: string;
  title: string;
  spotifyLink?: string;
}

const SIGNALS_COLORS = [
  "var(--c-aiah)",    // S — #8BB8D4 blue
  "var(--c-jhoanna)", // I — #4BBFCF teal
  "var(--c-maloi)",   // G — #E8739A rose
  "var(--c-colet)",   // N — #9B72CF purple
  "var(--c-gwen)",    // A — #F2A234 amber
  "var(--c-stacey)",  // L — #EC7FA3 pink
  "var(--c-mikha)",   // S — #D94040 red
];

export default async function Hero() {
  const [heroImages, albums] = await Promise.all([
    sanityFetch<HeroImage[]>({
      query: HERO_GALLERY_QUERY,
      tags: ["gallery"],
    }),
    sanityFetch<Album[]>({
      query: ALL_ALBUMS_QUERY,
      tags: ["albums"],
    }),
  ]);

  const latestAlbum = albums?.[0];
  const imgFull = heroImages.find((img) => img.title === "BINI-Full Hero");

  if (!imgFull) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--c-surface)]">
        <h1 className="text-display-xl text-[var(--c-ink)]">BINI</h1>
      </section>
    );
  }

  return (
    <section className="relative bg-[var(--c-surface)] overflow-hidden">
      <AuroraShader />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 pt-24 md:pt-28 pb-16 md:pb-20">

        {/* TOP EYEBROW */}
        <div className="flex items-center gap-3 mb-10 md:mb-12 animate-mvTextIn">
          <span className="text-label-mono text-[var(--c-ink)]">
            P-POP · Est. 2021
          </span>
          <span className="block h-px w-10 bg-[var(--c-surface-3)]" />
          <span className="text-label-mono text-[var(--c-ink)] opacity-40">
            Philippines
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_auto_0.9fr] gap-12 xl:gap-14 items-start">

          {/* LEFT */}
          <div
            className="flex flex-col gap-10 animate-mvTextIn order-2 xl:order-1"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex flex-col gap-3">
              <span className="text-label-mono text-[var(--c-ink)] opacity-45">
                Mabuhay, we are
              </span>
              <h1
                className="text-display-xl text-[var(--c-ink)]"
                style={{ lineHeight: 0.9 }}
              >
                BINI
              </h1>
            </div>

            <div
              className="inline-flex flex-col gap-1 border-l-2 pl-4 w-fit"
              style={{ borderColor: "var(--c-surface-3)" }}
            >
              <span className="text-label-mono text-[var(--c-ink)] opacity-50">
                Spotify Streams
              </span>
              <span
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(36px, 5vw, 56px)",
                  lineHeight: 1,
                  color: "var(--c-ink)",
                }}
              >
                <StreamCounter value={20000000} />
              </span>
              <span className="text-label-mono text-[var(--c-ink)] opacity-40">
                and counting
              </span>
            </div>
          </div>

          {/* CENTER — PHOTO CARD */}
          <div
            className="animate-mvTextIn order-1 xl:order-2 w-full"
            style={{ animationDelay: "0.05s" }}
          >
            <div
              className="relative overflow-hidden mx-auto w-full max-w-[420px] sm:max-w-[520px] md:max-w-[680px] xl:max-w-[760px]"
              style={{
                border: "1px solid var(--c-surface-3)",
                borderRadius: "var(--r-lg)",
                boxShadow: "var(--shadow-float)",
                aspectRatio: "4.8/4",
              }}
            >
              <Image
                src={imgFull.imageUrl || ""}
                alt={imgFull.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 92vw, (max-width: 1280px) 78vw, 760px"
                className="object-cover object-top"
              />
            </div>

            <div className="mt-5 px-1 max-w-[620px] mx-auto xl:mx-0">
              <p className="text-label-mono text-[var(--c-ink)] opacity-45 mb-3">
                Nation's Girl Group
              </p>
              <p
                style={{
                  color: "var(--c-ink)",
                  opacity: 0.72,
                  fontSize: "0.98rem",
                  lineHeight: 1.7,
                  letterSpacing: "-0.01em",
                }}
              >
                P-pop powerhouse bringing Filipino pop to the global stage.
              </p>
            </div>
          </div>

          {/* RIGHT — ALBUM + CTA */}
          <div
            className="flex flex-col justify-between gap-10 xl:items-end animate-mvTextIn order-3"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="xl:text-right">
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(54px, 8vw, 104px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.06em",
                  fontWeight: 800,
                }}
              >
                {"SIGNALS".split("").map((letter, i) => (
                  <span
                    key={i}
                    style={{
                      color: SIGNALS_COLORS[i],
                      display: "inline-block",
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            {latestAlbum?.spotifyLink && (
              <Link
                href={latestAlbum.spotifyLink}
                target="_blank"
                className="btn-primary xl:self-end"
                style={{
                  transition: "transform 500ms cubic-bezier(0.22,1,0.36,1), filter 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 500ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <SpotifyLogo size={16} weight="fill" />
                Stream on Spotify
              </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}