import { motion } from "framer-motion";
import { ArrowUpRight, Terminal, User } from "lucide-react";

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

const PIXEL_FONT = "'Press Start 2P', monospace";
const INK = "#4A3B52";
// Warna kontras tinggi untuk teks sekunder (lulus uji WCAG AA)
const MUTED = "#504159";

export default function Hero({ title, subtitle, data }: HeroProps) {
  return (
    <section
      className="min-h-[85vh] flex flex-col justify-center pt-24 pb-16 border-b-4"
      style={{ borderColor: INK, background: "#FFF6E9" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Kolom Kiri: Teks & CTA */}
        <div className="lg:col-span-7 space-y-6">
          {data?.statusBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs"
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "9px",
                color: INK,
                background: "#E3F5E9",
                border: `3px solid ${INK}`,
                boxShadow: `3px 3px 0 0 ${INK}`,
              }}
            >
              <span
                className="w-2 h-2 animate-pulse"
                style={{ background: "#2C6B47" }}
              />
              {data.statusBadge}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-5xl tracking-tight leading-[1.4]"
            style={{ fontFamily: PIXEL_FONT, color: INK }}
          >
            {title || "Hi, I am Asgar"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="text-lg font-normal leading-relaxed max-w-xl"
            style={{ color: MUTED }}
          >
            {subtitle ||
              "Building clean backends and responsive user interfaces."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="pt-2 flex flex-wrap gap-4 items-center"
          >
            <a
              href={data?.ctaPrimaryLink || "#projects"}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "10px",
                color: INK,
                background: "#FFD873",
                border: `3px solid ${INK}`,
                boxShadow: `3px 3px 0 0 ${INK}`,
              }}
            >
              {data?.ctaPrimaryText || "View Projects"}
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={data?.ctaSecondaryLink || "#contact-form"}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: "10px",
                color: INK,
                background: "#D6C9F5",
                border: `3px solid ${INK}`,
                boxShadow: `3px 3px 0 0 ${INK}`,
              }}
            >
              <Terminal className="w-4 h-4" style={{ color: INK }} />
              {data?.ctaSecondaryText || "Contact Me"}
            </a>
          </motion.div>
        </div>

        {/* Kolom Kanan: Frame Gambar / Signature Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div
              className="relative w-64 h-80 sm:w-72 sm:h-96 overflow-hidden flex items-center justify-center p-2"
              style={{
                background: "#FFC7D6",
                border: `4px solid ${INK}`,
                boxShadow: `6px 6px 0 0 ${INK}`,
              }}
            >
              {data?.avatarUrl ? (
                <img
                  src={data.avatarUrl}
                  alt="Profile Avatar Muh Asgar Fatwahyudi"
                  width={300}
                  height={380}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                  style={{
                    border: `3px solid ${INK}`,
                    imageRendering: "pixelated",
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3"
                  style={{ background: "#FFF6E9", border: `3px dashed ${INK}` }}
                >
                  <div
                    className="p-3"
                    style={{
                      background: "#D6C9F5",
                      border: `3px solid ${INK}`,
                    }}
                  >
                    <User className="w-8 h-8" style={{ color: INK }} />
                  </div>
                  <div className="space-y-1">
                    <div
                      className="text-xs"
                      style={{
                        fontFamily: PIXEL_FONT,
                        fontSize: "9px",
                        color: INK,
                      }}
                    >
                      Photo Slot
                    </div>
                    <p
                      className="text-[11px] leading-tight"
                      style={{ color: MUTED }}
                    >
                      Atur avatar di Site Customizer
                    </p>
                  </div>
                </div>
              )}

              {/* Tag teknis di sudut frame */}
              <div
                className="absolute bottom-4 left-4 right-4 py-1.5 px-2.5 flex justify-between"
                style={{
                  fontFamily: PIXEL_FONT,
                  fontSize: "8px",
                  background: "#FFF6E9",
                  border: `2px solid ${INK}`,
                  color: INK,
                }}
              >
                <span>DEV // KND</span>
                <span style={{ color: "#2C6B47" }}>ACTIVE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
