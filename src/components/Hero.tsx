import { Asterisk } from "@phosphor-icons/react/dist/ssr";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HERO_GALLERY_QUERY } from "@/sanity/lib/queries";
import AuroraShader from "./AuroraShader";
import HeroCarousel from "./HeroCarousel";
import LatestReleaseBar from "./LatestReleaseBar";

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

export default async function Hero({ latestAlbum }: { latestAlbum?: Album | null }) {
  const heroImages = await sanityFetch<HeroImage[]>({
    query: HERO_GALLERY_QUERY,
    tags: ["gallery"],
  });
  const validImages = heroImages?.filter(img => img.imageUrl) || [];
  const displayData = validImages.slice(0, 8);

  if (displayData.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-(--c-surface)">
        <h1 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(80px,14vw,200px)", lineHeight: 0.85, color: "#3AAAB6" }}>
          BINI
        </h1>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-(--c-surface) overflow-hidden flex flex-col border-b border-(--c-border)">
      <AuroraShader />

      <LatestReleaseBar album={latestAlbum} streamCount={20000000} />

      <div className="relative z-10 flex flex-col flex-1 w-full max-w-350 mx-auto px-4 sm:px-8 md:px-16 pt-24 sm:pt-28 md:pt-24 pb-0">
        <div className="flex-1 flex items-center justify-center w-full">
          <HeroCarousel images={displayData} />
        </div>

        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 pb-8 sm:pb-10 pt-4 sm:pt-6">
          <div className="flex items-center gap-2">
            <Asterisk
              size={11}
              className="animate-spin text-(--c-bloom,#f4a7c3)"
              style={{ animationDuration: "12s" }}
            />
            <span
              style={{ fontFamily: "var(--f-mono)" }}
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 text-(--c-ink)"
            >
              Mabuhay! we are
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--f-display)",
              fontSize: "clamp(56px, 10vw, 140px)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: "var(--c-ink)",
            }}
          >
            BINI
          </h1>

          <p
            className="text-(--c-ink) opacity-70 max-w-[320px] sm:max-w-105 leading-relaxed font-regular"
            style={{
              fontFamily: "var(--f-body)",
              fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)",
            }}
          >
            An 8-member Filipino girl group redefining P-pop and bringing modern
            Filipino talent to the global stage.
          </p>
        </div>
      </div>

    </section>
  );
}
