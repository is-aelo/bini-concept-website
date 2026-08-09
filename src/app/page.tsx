import React from "react";
import Header from "@/components/Header";
import CoachellaSection from "@/components/CoachellaSection";
import IridescentMesh from "@/components/TourBackground";
import Profile from "@/components/Profile";
import Concept from "@/components/Concept";
import { Discography } from "@/components/discography/Discography";
import Tour from "@/components/Tour";
import { Gallery } from "@/components/Gallery";
import Membership from "@/components/Membership";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

import { sanityFetch } from "@/sanity/lib/fetch";

import {
  COACHELLA_GALLERY_QUERY,
  ALL_MEMBERS_QUERY,
  ALL_TEASERS_QUERY,
  ALL_TOURS_QUERY,
  ALL_SIGNALS_TOUR_IMAGES_QUERY,
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

interface SignalsTourImageItem {
  _id: string;
  caption: string;
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

export default async function BiniPage() {
  const [
    coachellaImages,
    sanityMembersData,
    featuredTeasers,
    tours,
    signalsTourImages,
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
      query: ALL_TOURS_QUERY,
    }),

    sanityFetch({
      query: ALL_SIGNALS_TOUR_IMAGES_QUERY,
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

  return (
    <div className="relative">
      <Header />
      <Concept teaser={featuredTeaser} />
      <IridescentMesh />
      <ScrollReveal as="section" id="profile" className="scroll-mt-24" delay={0.02}>
        <Profile members={members} />
      </ScrollReveal>
      <ScrollReveal as="section" className="scroll-mt-24" delay={0.06}>
        <CoachellaSection
          images={(coachellaImages as CoachellaImage[]) || []}
        />
      </ScrollReveal>
      <ScrollReveal as="section" id="disco" className="scroll-mt-24" delay={0.1}>
        <Discography />
      </ScrollReveal>
      <ScrollReveal as="section" id="tour" className="scroll-mt-24" delay={0.14}>
        <Tour
          tours={
            ((tours as Partial<TourEvent>[]) || []).map((t) => ({
              ...t,
              status: t.status || "confirmed",
              country: t.country || "PH",
            })) as TourEvent[]
          }
        />
      </ScrollReveal>
      <ScrollReveal as="section" id="gallery" className="scroll-mt-24" delay={0.18}>
        <Gallery items={(signalsTourImages as SignalsTourImageItem[]) || []} />
      </ScrollReveal>
      <ScrollReveal as="section" className="scroll-mt-24" delay={0.22}>
        <Membership />
      </ScrollReveal>
      <Footer />
    </div>
  );
}

