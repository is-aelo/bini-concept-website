import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoachellaSection from "@/components/CoachellaSection";
import IridescentMesh from "@/components/TourBackground";
import Profile from "@/components/Profile";
import Concept from "@/components/Concept";
import { Discography } from "@/components/discography/Discography";
import Tour from "@/components/Tour";
import { Gallery } from "@/components/Gallery";
import Membership from "@/components/Membership";
import Footer from "@/components/Footer";

import { sanityFetch } from "@/sanity/lib/fetch";

import {
  COACHELLA_GALLERY_QUERY,
  ALL_MEMBERS_QUERY,
  ALL_ALBUMS_QUERY,
  ALL_TEASERS_QUERY,
  ALL_TOURS_QUERY,
  NON_FEATURED_GALLERY_QUERY,
} from "@/sanity/lib/queries";

interface CoachellaImage {
  _id: string;
  title?: string;
  featured?: boolean;
  imageUrl: string;
  lqip?: string;
}

interface SanityMember {
  _id: string;
  stageName: string;
  fullName: string;
  birthday?: string;
  zodiac?: string;
  roles?: string[];
  signatureColor?: string;
  profileImage?: string | null;
  galleryImage?: string | null;
}

interface TourEvent {
  _id: string;
  eventName: string;
  location: string;
  date: string;
  status: "confirmed" | "on-sale" | "sold-out";
  ticketLink?: string;
  country: "PH" | "INTL";
  memberKey?: string;
}

interface GalleryItem {
  _id: string;
  title?: string;
  featured?: boolean;
  imageUrl: string;
  lqip?: string;
}

interface TeaserItem {
  _id: string;
  title?: string;
  featured?: boolean;
  videoUrl: string;
  mimeType?: string;
  lqip?: string;
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

export default async function BiniPage() {
  const [
    coachellaImages,
    sanityMembersData,
    featuredTeasers,
    albums,
    tours,
    galleryItems,
  ] = await Promise.all([
    sanityFetch({
      query: COACHELLA_GALLERY_QUERY,
    }),

    sanityFetch({
      query: ALL_MEMBERS_QUERY,
    }),

    sanityFetch({
      query: ALL_TEASERS_QUERY,
    }),

    sanityFetch({
      query: ALL_ALBUMS_QUERY,
    }),

    sanityFetch({
      query: ALL_TOURS_QUERY,
    }),

    sanityFetch({
      query: NON_FEATURED_GALLERY_QUERY,
    }),
  ]);

  const localUiMeta: Record<
    string,
    { signatureColor: string }
  > = {
    aiah: { signatureColor: "var(--c-aiah)" },
    colet: { signatureColor: "var(--c-colet)" },
    maloi: { signatureColor: "var(--c-maloi)" },
    gwen: { signatureColor: "var(--c-gwen)" },
    stacey: { signatureColor: "var(--c-stacey)" },
    mikha: { signatureColor: "var(--c-mikha)" },
    jhoanna: { signatureColor: "var(--c-jhoanna)" },
    sheena: { signatureColor: "var(--c-sheena)" },
  };

  const members = (
    (sanityMembersData as SanityMember[]) || []
  ).map((cmsMember) => {
    const lookupKey = cmsMember.stageName.toLowerCase();
    const meta = localUiMeta[lookupKey];

    return {
      ...cmsMember,
      signatureColor:
        cmsMember.signatureColor ||
        meta?.signatureColor ||
        "var(--c-teal)",
    };
  });

  const featuredTeaser = ((featuredTeasers as TeaserItem[]) || [])[0];
  const latestAlbum = ((albums as Album[]) || [])[0];

  return (
      <div className="relative">
      <Header />
      <div id="concept-section" className="scroll-mt-24">
        <Concept teaser={featuredTeaser} />
      </div>
      <Hero latestAlbum={latestAlbum} />
      <IridescentMesh />
      <div id="profile" className="scroll-mt-24">
        <Profile members={members} />
      </div>
      <CoachellaSection
        images={(coachellaImages as CoachellaImage[]) || []}
      />
      <div id="disco" className="scroll-mt-24">
        <Discography />
      </div>
      <div id="tour" className="scroll-mt-24">
        <Tour
          tours={
            ((tours as Partial<TourEvent>[]) || []).map((t) => ({
              ...t,
              status: t.status || "confirmed",
              country: t.country || "PH",
            })) as TourEvent[]
          }
        />
      </div>
      <div id="gallery" className="scroll-mt-24">
        <Gallery items={(galleryItems as GalleryItem[]) || []} />
      </div>
      <Membership />
      <Footer />
    </div>
  );
}

