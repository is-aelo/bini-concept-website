// src/components/Header.tsx

import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const settings = await sanityFetch<any>({
    query: SITE_SETTINGS_QUERY,
  });

  const navLinks = [
    { name: "Artists", href: "/members" },
    { name: "Gallery", href: "/gallery" },
    { name: "Discography", href: "/discography" },
    { name: "Tour", href: "/tours" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-3 pt-3 md:px-5">
      <nav className="bini-glass mx-auto w-full max-w-[1440px] rounded-[2rem]">
        <div className="flex h-16 items-center justify-between px-5 md:h-[74px] md:px-8">
          
          {/* LEFT */}
          <div className="flex min-w-0 flex-1 items-center">
            <Link
              href="/"
              className="group flex items-center transition-opacity duration-300 hover:opacity-90"
            >
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="h-8 w-auto object-contain md:h-9"
                />
              ) : (
                <span className="font-heading text-[1.1rem] font-bold tracking-[-0.04em] text-bini-teal">
                  {settings?.title || "BINI"}
                </span>
              )}
            </Link>
          </div>

          {/* CENTER */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/40 bg-white/35 px-2 py-2 backdrop-blur-md">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-full px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 transition-all duration-300 hover:bg-white/70 hover:text-bini-pink"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <Link
              href="/community"
              className="hidden h-10 items-center justify-center rounded-full bg-bini-teal px-6 font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#00958b] md:flex"
            >
              Community
            </Link>

            <div className="md:hidden">
              <MobileMenu
                logo={settings?.logoUrl}
                siteTitle={settings?.title || "BINI"}
                links={[...navLinks, { name: "Community", href: "/community" }]}
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}