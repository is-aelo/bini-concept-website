"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Heading from "@/components/Heading";
import TourBackground from "@/components/TourBackground";

const BINI_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/BINIph.official",
    handle: "@BINIph.official",
    icon: "mingcute:facebook-line",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@bini_ph",
    handle: "@bini_ph",
    icon: "mingcute:tiktok-line",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCtOcDBKgyr-f50SgbMErFkQ",
    handle: "BINI Official",
    icon: "mingcute:youtube-line",
  },
];

const CONTACT_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/eloisetalingting/",
    handle: "linkedin.com/in/eloisetalingting",
    icon: "mingcute:linkedin-line",
  },
  {
    label: "Email",
    href: "mailto:talingting.eloise@gmail.com",
    handle: "talingting.eloise@gmail.com",
    icon: "mingcute:mail-line",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@is_aelo",
    handle: "@is_aelo",
    icon: "mingcute:tiktok-line",
  },
];

const STYLES = `
  .footer-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--c-surface-3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.58);
    color: var(--c-ink);
    text-decoration: none;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }

  .footer-link:hover {
    transform: translateY(-1px);
    border-color: var(--c-teal);
    background: rgba(255, 255, 255, 0.84);
  }

  .footer-link:focus-visible {
    outline: 2px solid var(--c-teal-dark);
    outline-offset: 3px;
  }

  .footer-link-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .footer-link-title {
    font-family: var(--f-body);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--c-ink);
  }

  .footer-link-handle {
    font-family: var(--f-body);
    font-size: 12px;
    letter-spacing: 0;
    text-transform: none;
    color: var(--c-ink);
    opacity: 0.72;
    word-break: break-word;
  }

  .footer-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    background: var(--c-surface);
    border: 1px solid var(--c-surface-3);
    color: var(--c-teal-dark);
  }

  .footer-pill {
    display: inline-block;
    align-self: flex-start;
    color: var(--c-surface);
    background: var(--c-teal-dark);
    padding: 3px 10px;
    border-radius: 2px;
  }
`;

function SocialLink({
  href,
  label,
  handle,
  icon,
}: {
  href: string;
  label: string;
  handle: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link"
      aria-label={`${label} link`}
    >
      <span className="footer-link-label">
        <span className="footer-link-title">{label}</span>
        <span className="footer-link-handle">{handle}</span>
      </span>
      <span className="footer-icon-wrap" aria-hidden="true">
        <Icon icon={icon} width="14" height="14" />
      </span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      className="w-full py-6 sm:py-8 relative overflow-hidden"
      style={{ background: "var(--c-surface)" }}
      aria-label="Footer"
    >
      <style>{STYLES}</style>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <TourBackground />
      </div>

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-8 md:px-16">
        <div className="mb-4 sm:mb-5 flex flex-col gap-1">
          <p className="footer-pill text-label-mono">Connect</p>

          <Heading level="section" style={{ color: "var(--c-teal-dark)" }}>
            Links & Contact
          </Heading>
        </div>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: "var(--c-teal-dark)",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--c-ink)",
                  opacity: 0.4,
                }}
              >
                Official BINI pages
              </p>
            </div>

            <div className="grid gap-2">
              {BINI_LINKS.map((link) => (
                <SocialLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  handle={link.handle}
                  icon={link.icon}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: "var(--c-mikha)",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--c-ink)",
                  opacity: 0.4,
                }}
              >
                Contact Eloisa Jane Talingting
              </p>
            </div>

            <div className="grid gap-2">
              {CONTACT_LINKS.map((link) => (
                <SocialLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  handle={link.handle}
                  icon={link.icon}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-4 sm:mt-5 pt-4"
          style={{ borderTop: "1px solid var(--c-surface-3)" }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: "8px",
              lineHeight: 1.5,
              color: "var(--c-ink)",
              opacity: 0.42,
              maxWidth: "56rem",
            }}
          >
            Fan-made portfolio project for educational and design exploration purposes only. It is not affiliated with, endorsed by, or authorized by BINI or ABS-CBN Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
