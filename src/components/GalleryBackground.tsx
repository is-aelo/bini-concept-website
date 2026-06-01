export default function GalleryBackground() {
  return (
    <>
      <style>{`
        @keyframes galleryDriftA {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(32px, -24px, 0) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes galleryDriftB {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-28px, 22px, 0) scale(1.05); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes galleryDriftC {
          0% { transform: translate3d(0, 0, 0) rotate(10deg); }
          50% { transform: translate3d(18px, 14px, 0) rotate(14deg); }
          100% { transform: translate3d(0, 0, 0) rotate(10deg); }
        }

        .gallery-bg-orbit-a {
          animation: galleryDriftA 20s ease-in-out infinite;
        }

        .gallery-bg-orbit-b {
          animation: galleryDriftB 24s ease-in-out infinite;
        }

        .gallery-bg-sheen {
          animation: galleryDriftC 18s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(229, 248, 250, 0.28) 0%, rgba(245, 243, 238, 0.2) 56%, rgba(235, 233, 228, 0.26) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(12, 12, 10, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(12, 12, 10, 0.03) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            opacity: 0.12,
            maskImage:
              "radial-gradient(circle at center, black 24%, transparent 86%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 24%, transparent 86%)",
          }}
        />

        <div
          className="gallery-bg-orbit-a absolute"
          style={{
            width: 760,
            height: 760,
            top: -260,
            right: -220,
            borderRadius: "9999px",
            filter: "blur(110px)",
            background:
              "radial-gradient(circle, rgba(99, 203, 214, 0.12) 0%, rgba(99, 203, 214, 0) 68%)",
            opacity: 0.55,
          }}
        />

        <div
          className="gallery-bg-orbit-b absolute"
          style={{
            width: 680,
            height: 680,
            left: -240,
            bottom: -260,
            borderRadius: "9999px",
            filter: "blur(120px)",
            background:
              "radial-gradient(circle, rgba(255, 196, 12, 0.08) 0%, rgba(255, 196, 12, 0) 70%)",
            opacity: 0.45,
          }}
        />

        <div
          className="gallery-bg-sheen absolute"
          style={{
            inset: "18% 10%",
            borderRadius: "42px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 24%, transparent 50%, rgba(255,255,255,0.05) 76%, rgba(255,255,255,0.1) 100%)",
            mixBlendMode: "soft-light",
            opacity: 0.2,
            filter: "blur(6px)",
          }}
        />
      </div>
    </>
  );
}
