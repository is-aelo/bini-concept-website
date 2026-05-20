import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoachellaSection from "@/components/CoachellaSection";
import Profile from "@/components/Profile";
import Discography from "@/components/Discography";

import { sanityFetch } from "@/sanity/lib/fetch";
import { COACHELLA_GALLERY_QUERY, ALL_MEMBERS_QUERY } from "@/sanity/lib/queries";

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

export default async function BiniPage() {
  // 1. Fetch Dynamic CMS Assets from Sanity
  const coachellaImages = (await sanityFetch({
    query: COACHELLA_GALLERY_QUERY,
  })) as CoachellaImage[];

  const sanityMembersData = (await sanityFetch({
    query: ALL_MEMBERS_QUERY,
  })) as SanityMember[];

  // 2. Static UI configurations to map onto the incoming CMS data
  const localUiMeta: Record<string, { signatureColor: string }> = {
    aiah: { signatureColor: "var(--c-aiah)" },
    colet: { signatureColor: "var(--c-colet)" },
    maloi: { signatureColor: "var(--c-maloi)" },
    gwen: { signatureColor: "var(--c-gwen)" },
    stacey: { signatureColor: "var(--c-stacey)" },
    mikha: { signatureColor: "var(--c-mikha)" },
    jhoanna: { signatureColor: "var(--c-jhoanna)" },
    sheena: { signatureColor: "var(--c-sheena)" },
  };

  // 3. Normalize and enrich CMS records with local UI metadata
  const members = sanityMembersData.map((cmsMember) => {
    const lookupKey = cmsMember.stageName.toLowerCase();
    const meta = localUiMeta[lookupKey];

    return {
      ...cmsMember,
      signatureColor: cmsMember.signatureColor || meta?.signatureColor || "var(--c-teal)",
    };
  });

  return (
    <div className="relative">
      <Header />
      <Hero />

      <CoachellaSection images={coachellaImages} />

      {/* PROFILE */}
      <Profile members={members} />

      {/* DISCOGRAPHY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Discography</h2>
          <Discography />
        </div>
      </section>
      
      {/* REST OF PAGE UNCHANGED */}
    </div>
  );
}