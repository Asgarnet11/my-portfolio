import { motion } from "framer-motion";
import { ArrowUpRight, Terminal, User, Code2, Sparkles, Activity } from "lucide-react";

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

export default function Hero({ title, subtitle, data }: HeroProps) {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      className="min-h-[85vh] flex flex-col justify-center pt-20 sm:pt-28 pb-16 relative overflow-hidden"
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      {/* Background Ambient Signal Flare Glow (Modern-Design / Tema-utama) */}
      <div
        className="absolute top-1/4 -left-32 w-[520px] h-[520px] rounded-full blur-[140px] pointer-events-none opacity-40 -z-10"
        style={{
          background: "var(--card-glow)",
        }}
      />
      <div
        className="absolute bottom-10 right-0 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none opacity-25 -z-10"
        style={{
          background: "var(--card-glow)",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kolom Kiri: Teks & CTA */}
        <div className="lg:col-span-7 space-y-7 min-w-0">
          {/* Top Status & Telemetry Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium backdrop-blur-md"
              style={{
                background: "var(--badge-bg)",
                border: "1px solid var(--badge-border)",
                color: "var(--color-accent)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse shrink-0"
                style={{ background: "var(--color-accent)" }}
              />
              <span className="tracking-wide uppercase font-semibold">
                {data?.statusBadge || "AVAILABLE FOR WORK"}
              </span>
            </motion.div>

            {/* Professional Role Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono backdrop-blur-md"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              <Code2 className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
              <span className="tracking-wider">BPVP KENDARI // KEMNAKER RI</span>
            </motion.div>
          </div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08]"
            style={{
              fontFamily: "var(--font-heading, 'Inter', sans-serif)",
              color: "var(--color-ink)",
            }}
          >
            {title ? (
              title
            ) : (
              <>
                Building <span style={{ color: "var(--color-accent)" }}>solid backends</span>
                <br /> & responsive web apps.
              </>
            )}
          </motion.h1>

          {/* Subtitle / Bio summary */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="text-base sm:text-lg leading-relaxed max-w-xl font-normal"
            style={{ color: "var(--color-muted)" }}
          >
            {subtitle ||
              "Full-Stack Web Developer & Pranata Komputer di BPVP Kendari. Fokus pada arsitektur API terstruktur, integrasi database performan, dan antarmuka web interaktif."}
          </motion.p>

          {/* Professional Engineering Telemetry Chips */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-2.5 pt-1 text-[11px] font-mono tracking-wide"
          >
            <span
              className="px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--color-ink)",
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: "var(--color-accent)" }} />
              Stack: React • TypeScript • PHP/Laravel
            </span>
            <span
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              Database: PostgreSQL • MySQL
            </span>
            <span
              className="px-3 py-1.5 rounded-lg hidden sm:inline-flex"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              Location: Kendari, Sulawesi Tenggara
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            className="pt-4 flex flex-wrap gap-3.5 items-center"
          >
            <motion.a
              href={data?.ctaPrimaryLink || "#projects"}
              onClick={(e) => handleScrollTo(e, data?.ctaPrimaryLink || "#projects")}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer overflow-hidden shadow-lg"
              style={{
                background: "var(--color-primary)",
                color: "var(--on-accent)",
              }}
            >
              <span>{data?.ctaPrimaryText || "Lihat Proyek"}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>

            <motion.a
              href={data?.ctaSecondaryLink || "#contact-form"}
              onClick={(e) => handleScrollTo(e, data?.ctaSecondaryLink || "#contact-form")}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-medium text-sm transition-all duration-300 cursor-pointer border shadow-sm"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                color: "var(--color-ink)",
              }}
            >
              <Terminal className="w-4 h-4" style={{ color: "var(--color-muted)" }} />
              <span>{data?.ctaSecondaryText || "Hubungi Saya"}</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Kolom Kanan: Bento Avatar Card with Float Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
        >
          {/* Floating effect container */}
          <div className="relative w-64 sm:w-72 md:w-[340px] z-20 animate-float">
            {/* Ambient Backlight Glow */}
            <div
              className="absolute -inset-4 rounded-[32px] opacity-40 blur-2xl transition-all duration-700 pointer-events-none"
              style={{
                background: "var(--card-glow)",
              }}
            />

            {/* Bento Card Surface */}
            <div
              className="relative w-full rounded-[24px] overflow-hidden p-4 space-y-4 backdrop-blur-xl border"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                boxShadow: "var(--box-shadow)",
              }}
            >
              {/* Card Header Telemetry */}
              <div
                className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono tracking-wider"
                style={{ color: "var(--color-muted)" }}
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                  SYSTEM IDENTITY
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px]"
                  style={{
                    background: "var(--border-subtle)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  DEV // KND
                </span>
              </div>

              {/* Avatar Image Frame */}
              <div
                className="relative w-full aspect-[4/5] rounded-[18px] overflow-hidden group shadow-inner"
                style={{
                  background: "var(--bg-surface-elevated)",
                }}
              >
                {data?.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt="Muh Asgar Fatwahyudi"
                    width={600}
                    height={750}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div
                      className="p-4 rounded-full border"
                      style={{
                        background: "var(--badge-bg)",
                        borderColor: "var(--badge-border)",
                      }}
                    >
                      <User className="w-8 h-8" style={{ color: "var(--color-accent)" }} />
                    </div>
                    <div className="space-y-1.5">
                      <div
                        className="text-xs font-mono font-medium tracking-widest uppercase"
                        style={{ color: "var(--color-ink)" }}
                      >
                        MUH ASGAR FATWAHYUDI
                      </div>
                      <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                        Pranata Komputer & Web Developer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Bottom Tag */}
              <div
                className="py-2.5 px-4 rounded-2xl flex items-center justify-between font-mono text-[11px] border"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                }}
              >
                <span className="font-medium tracking-widest" style={{ color: "var(--color-muted)" }}>
                  STATUS
                </span>
                <span
                  className="inline-flex items-center gap-1.5 font-bold tracking-widest text-[10px] px-2.5 py-1 rounded-full"
                  style={{
                    background: "var(--badge-bg)",
                    color: "var(--color-accent)",
                    border: "1px solid var(--badge-border)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "var(--color-accent)" }}
                  />
                  ACTIVE // VERIFIED
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
