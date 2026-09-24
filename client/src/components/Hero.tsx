import { motion } from "framer-motion";
import { ArrowUpRight, Terminal, User } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  data?: {
    statusBadge?: string;
    avatarUrl?: string;
    ctaPrimaryText?: string;
    ctaPrimaryLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
  };
}

// Primary = filled with --bg-secondary, so its text MUST use --on-accent
// (not --color-ink) since --color-ink isn't guaranteed to contrast with
// --bg-secondary in every theme (see theme.css note on the terminal theme).
// Secondary = outlined on --bg-accent, so --color-ink is safe there.
function PixelButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: ReactNode;
}) {
  const isPrimary = variant === "primary";
  return (
    <motion.a
      href={href}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm"
      style={{
        fontFamily: "var(--font-heading, monospace)",
        fontSize: "10px",
        color: isPrimary
          ? "var(--on-accent, #4A3B52)"
          : "var(--color-ink, #4A3B52)",
        background: isPrimary
          ? "var(--bg-secondary, #FFD873)"
          : "var(--bg-accent, #D6C9F5)",
        border: "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
        borderRadius: "var(--border-radius, 0px)",
      }}
      initial={{
        boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
        x: 0,
        y: 0,
      }}
      whileHover={{
        x: -1,
        y: -1,
        boxShadow: "var(--box-shadow-hover, 4px 4px 0 0 #4A3B52)",
      }}
      whileTap={{ x: 3, y: 3, boxShadow: "none" }}
      transition={{ duration: 0.08 }}
    >
      {children}
    </motion.a>
  );
}

export default function Hero({ title, subtitle, data }: HeroProps) {
  return (
    <section
      className="min-h-[85vh] flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 border-b-4"
      style={{
        borderColor: "var(--color-ink, #4A3B52)",
        background: "var(--bg-primary, #FFF6E9)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Kolom Kiri: Teks & CTA */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 min-w-0">
          {data?.statusBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs"
              style={{
                fontFamily: "var(--font-heading, monospace)",
                fontSize: "9px",
                color: "var(--color-ink, #4A3B52)",
                background: "var(--badge-bg, #E3F5E9)",
                border:
                  "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                borderRadius: "var(--border-radius, 0px)",
                boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
              }}
            >
              <span
                className="w-2 h-2 animate-pulse shrink-0"
                style={{
                  background: "var(--badge-dot, #2C6B47)",
                  borderRadius: "var(--node-radius, 0px)",
                }}
              />
              {data.statusBadge}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="tracking-tight break-words"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              fontSize: "clamp(22px, 6vw, 44px)",
              lineHeight: 1.4,
            }}
          >
            {title || "Hi, I am Asgar"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg font-normal leading-relaxed max-w-xl"
            style={{
              fontFamily: "var(--font-body, monospace)",
              color: "var(--color-muted, #504159)",
            }}
          >
            {subtitle ||
              "Building clean backends and responsive user interfaces."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center"
          >
            <PixelButton
              href={data?.ctaPrimaryLink || "#projects"}
              variant="primary"
            >
              {data?.ctaPrimaryText || "View Projects"}
              <ArrowUpRight className="w-4 h-4" />
            </PixelButton>
            <PixelButton
              href={data?.ctaSecondaryLink || "#contact-form"}
              variant="secondary"
            >
              <Terminal className="w-4 h-4" />
              {data?.ctaSecondaryText || "Contact Me"}
            </PixelButton>
          </motion.div>
        </div>

        {/* Kolom Kanan: Frame Gambar / Signature Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          {/* idle bobbing wrapper - GPU CSS animation eliminates JS forced reflow */}
          <div className="relative w-56 sm:w-64 md:w-72 animate-hero-bob">
            <div
              className="relative w-full aspect-[4/5] overflow-hidden flex items-center justify-center p-2"
              style={{
                background: "var(--card-frame-bg, #FFC7D6)",
                border:
                  "var(--border-width-lg, 4px) solid var(--color-ink, #4A3B52)",
                borderRadius: "var(--border-radius, 0px)",
                boxShadow: "var(--box-shadow-lg, 6px 6px 0 0 #4A3B52)",
              }}
            >
              {data?.avatarUrl ? (
                <img
                  src={data.avatarUrl}
                  alt="Profile"
                  width={600}
                  height={750}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{
                    border:
                      "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                    imageRendering:
                      "var(--img-rendering, auto)" as CSSProperties["imageRendering"],
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3"
                  style={{
                    background: "var(--bg-primary, #FFF6E9)",
                    border:
                      "var(--border-width, 3px) dashed var(--color-ink, #4A3B52)",
                  }}
                >
                  <div
                    className="p-3"
                    style={{
                      background: "var(--bg-accent, #D6C9F5)",
                      border:
                        "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                    }}
                  >
                    <User
                      className="w-7 h-7 sm:w-8 sm:h-8"
                      style={{ color: "var(--color-ink, #4A3B52)" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <div
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-heading, monospace)",
                        fontSize: "9px",
                        color: "var(--color-ink, #4A3B52)",
                      }}
                    >
                      Photo Slot
                    </div>
                    <p
                      className="text-[10px] sm:text-[11px] leading-tight"
                      style={{ color: "var(--color-muted, #504159)" }}
                    >
                      Atur `avatarUrl` di JSON Site Customizer
                    </p>
                  </div>
                </div>
              )}

              {/* Tag teknis di sudut frame */}
              <div
                className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 py-1.5 px-2.5 flex items-center justify-between"
                style={{
                  fontFamily: "var(--font-heading, monospace)",
                  fontSize: "9px",
                  background: "var(--bg-primary, #FFF6E9)",
                  border: "2px solid var(--color-ink, #4A3B52)",
                  color: "var(--color-ink, #4A3B52)",
                }}
              >
                <span className="font-bold">DEV // KND</span>
                <span
                  className="inline-flex items-center gap-1.5 font-bold"
                  style={{ color: "var(--badge-dot, #1B4D31)" }}
                >
                  <span
                    className="w-1.5 h-1.5 animate-pulse shrink-0"
                    style={{
                      background: "var(--badge-dot, #1B4D31)",
                      borderRadius: "var(--node-radius, 0px)",
                    }}
                  />
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
