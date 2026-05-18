"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Member {
  _id: string;
  stageName: string;
  fullName: string;
  birthday?: string;
  zodiac?: string;
  roles?: string[];
  signatureColor?: string;
  profileImage?: string | null;
}

interface ProfileProps {
  members: Member[];
}

export default function Profile({ members }: ProfileProps) {
  if (!members?.length) return null;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(99, 203, 214, 0.10), transparent 55%), radial-gradient(circle at 80% 70%, rgba(139, 184, 212, 0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-label-mono mb-3">Members Archive</p>

          <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.9]">
            PROFILE CARDS
          </h2>

          <p className="mt-4 text-sm opacity-70 max-w-[520px] mx-auto">
            A collectible-style archive of members — designed like physical
            photocards with signature identity colors.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {members.map((member, index) => {
            const accent = member.signatureColor || "var(--c-teal)";
            const hasValidImage = member.profileImage && member.profileImage.startsWith("http");

            return (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative group"
              >
                <div
                  className="absolute inset-0 translate-y-1 group-hover:translate-y-0 transition duration-500 -z-10 blur-xl opacity-30"
                  style={{ background: accent }}
                />

                <div
                  className="relative rounded-[18px] p-[1px] shadow-[0_20px_60px_-30px_rgba(12,12,10,0.25)]"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.35))`,
                  }}
                >
                  <div className="relative bg-[var(--c-surface)] rounded-[17px] overflow-hidden">
                    <div className="relative w-full aspect-[3/4] bg-[var(--c-surface-2)]">
                      {hasValidImage ? (
                        <Image
                          src={member.profileImage!}
                          alt={member.stageName}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                          priority={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs opacity-40">
                          No Image
                        </div>
                      )}

                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.25), transparent 55%)",
                        }}
                      />
                    </div>

                    <div className="p-4 md:p-5 space-y-4">
                      <div>
                        <h3 className="text-xl md:text-2xl leading-[0.9]">
                          {member.stageName}
                        </h3>

                        <p className="text-xs opacity-60 mt-1 tracking-wide">
                          {member.fullName}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="opacity-50">Birthday</span>
                          <span>{member.birthday || "—"}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="opacity-50">Zodiac</span>
                          <span>{member.zodiac || "—"}</span>
                        </div>

                        <div className="flex justify-between items-start gap-3">
                          <span className="opacity-50">Roles</span>
                          <span className="text-right">
                            {member.roles?.length
                              ? member.roles.join(", ")
                              : "—"}
                          </span>
                        </div>
                      </div>

                      <div
                        className="h-[2px] w-full opacity-40"
                        style={{
                          background: `linear-gradient(90deg, ${accent}, transparent)`,
                        }}
                      />
                    </div>

                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 20%, ${accent}22, transparent 60%)`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}