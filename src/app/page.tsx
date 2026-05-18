import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoachellaSection from "@/components/CoachellaSection";
import Profile from "@/components/Profile";

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
      // Prioritize Sanity field input, fallback to matching UI local variable configuration
      signatureColor: cmsMember.signatureColor || meta?.signatureColor || "var(--c-teal)",
    };
  });

  const albums = [
    { title: "Signals", type: "EP", year: "2026" },
    { title: "FLAMES", type: "Album", year: "2025" },
    { title: "Talaarawan", type: "EP", year: "2024" },
    { title: "Feel Good", type: "Album", year: "2022" },
  ];

  const tours = [
    { event: "Summer Sonic 2026", city: "Tokyo", status: "Upcoming" },
    { event: "Signals World Tour", city: "Manila", status: "Upcoming" },
    { event: "Coachella 2026", city: "California", status: "Past" },
    { event: "Grand BINIverse", city: "Bulacan", status: "Past" },
    { event: "Signals World Tour", city: "Singapore", status: "Upcoming" },
  ];

  return (
    <div className="relative">
      <Header />
      <Hero />

      <CoachellaSection images={coachellaImages} />

      {/* PROFILE */}
      <Profile members={members} />

      {/* REST OF PAGE UNCHANGED */}
    </div>
  );
}