import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoachellaSection from "@/components/CoachellaSection";
import Profile from "@/components/Profile";

import { sanityFetch } from "@/sanity/lib/fetch";
import { COACHELLA_GALLERY_QUERY } from "@/sanity/lib/queries";

interface CoachellaImage {
  _id: string;
  title?: string;
  featured?: boolean;
  imageUrl: string;
  lqip?: string;
}

export default async function BiniPage() {
  const members = [
    {
      _id: "aiah",
      stageName: "Aiah",
      fullName: "Maraiah Queen Arceta",
      birthday: "January 27",
      zodiac: "Aquarius",
      roles: ["Visual", "Main Rapper"],
      signatureColor: "var(--c-aiah)",
      profileImage: "/members/aiah.jpg",
    },
    {
      _id: "colet",
      stageName: "Colet",
      fullName: "Ma. Nicolette Vergara",
      birthday: "September 14",
      zodiac: "Virgo",
      roles: ["Main Vocalist", "Leader"],
      signatureColor: "var(--c-colet)",
      profileImage: "/members/colet.jpg",
    },
    {
      _id: "maloi",
      stageName: "Maloi",
      fullName: "Mary Loi Yves Ricalde",
      birthday: "May 27",
      zodiac: "Gemini",
      roles: ["Main Vocalist"],
      signatureColor: "var(--c-maloi)",
      profileImage: "/members/maloi.jpg",
    },
    {
      _id: "gwen",
      stageName: "Gwen",
      fullName: "Gweneth L. Apuli",
      birthday: "June 19",
      zodiac: "Gemini",
      roles: ["Lead Vocalist", "Lead Rapper"],
      signatureColor: "var(--c-gwen)",
      profileImage: "/members/gwen.jpg",
    },
    {
      _id: "stacey",
      stageName: "Stacey",
      fullName: "Stacey Aubrey Sevilleja",
      birthday: "July 13",
      zodiac: "Cancer",
      roles: ["Main Rapper", "Lead Dancer"],
      signatureColor: "var(--c-stacey)",
      profileImage: "/members/stacey.jpg",
    },
    {
      _id: "mikha",
      stageName: "Mikha",
      fullName: "Mikhaela Janna Lim",
      birthday: "November 8",
      zodiac: "Scorpio",
      roles: ["Main Rapper", "Visual"],
      signatureColor: "var(--c-mikha)",
      profileImage: "/members/mikha.jpg",
    },
    {
      _id: "jhoanna",
      stageName: "Jhoanna",
      fullName: "Jhoanna Robles",
      birthday: "May 26",
      zodiac: "Gemini",
      roles: ["Leader", "Lead Vocalist"],
      signatureColor: "var(--c-jhoanna)",
      profileImage: "/members/jhoanna.jpg",
    },
    {
      _id: "sheena",
      stageName: "Sheena",
      fullName: "Sheena Mae Catacutan",
      birthday: "May 9",
      zodiac: "Taurus",
      roles: ["Main Dancer", "Maknae"],
      signatureColor: "var(--c-sheena)",
      profileImage: "/members/sheena.jpg",
    },
  ];

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

  const coachellaImages = (await sanityFetch({
    query: COACHELLA_GALLERY_QUERY,
  })) as CoachellaImage[];

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