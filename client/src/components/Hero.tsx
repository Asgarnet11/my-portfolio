import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Building2, Layers, CheckCircle2 } from "lucide-react";

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
        fontFamily: "var(--font-heading, 'Inter', sans-serif)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Kolom Kiri: Editorial Copy & CTAs */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          {/* Pill Announcement Banner (Tema-utama.MD signature) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-[460] shadow-xs"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--on-accent)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="tracking-tight">
              {data?.statusBadge || "Magang Hub BPVP Kendari • Prakom"}
            </span>
          </motion.div>

          {/* Headline: Weight 460 (Headlines whisper rather than shout) */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[460] tracking-[-0.025em] leading-[1.12]"
            style={{
              color: "var(--color-ink)",
            }}
          >
            {title ? (
              title
            ) : (
              <>
                Membangun arsitektur backend andal & antarmuka web responsif.
              </>
            )}
          </motion.h1>

          {/* Subtitle / Bio summary */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg leading-relaxed max-w-xl font-normal"
            style={{ color: "var(--color-muted)" }}
          >
            {subtitle ||
              "Muh Asgar Fatwahyudi — Web Developer & peserta Magang Hub sebagai Pranata Komputer (Prakom) di BPVP Kendari. Berfokus pada rekayasa sistem informasi, keandalan API, tata kelola database, dan antarmuka web modern."}
          </motion.p>

          {/* Institutional Trust Pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 pt-1 text-xs"
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-normal"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                color: "var(--color-ink)",
              }}
            >
              <Building2 className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
              Magang Hub BPVP Kendari
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-normal"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              <Layers className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
              React • TypeScript • PHP/Laravel
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-normal"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Prakom (Magang Hub)
            </span>
          </motion.div>

          {/* CTAs (Tema-utama.MD: Midnight Wine primary CTA + Lilac Mist secondary) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="pt-3 flex flex-wrap gap-3.5 items-center"
          >
            {/* Primary Action Button: Midnight Wine #421d24, 16px radius, 48px height, weight 460 */}
            <motion.a
              href={data?.ctaPrimaryLink || "#projects"}
              onClick={(e) => handleScrollTo(e, data?.ctaPrimaryLink || "#projects")}
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 px-6 h-12 rounded-2xl font-[460] text-sm transition-all cursor-pointer shadow-xs hover:opacity-95"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--on-accent)",
              }}
            >
              <span>{data?.ctaPrimaryText || "Lihat Proyek & Karya"}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>

            {/* Outlined Light Button: Lilac Mist #d4c7ff, border 1px, 16px radius, height 48px */}
            <motion.a
              href={data?.ctaSecondaryLink || "#contact-form"}
              onClick={(e) => handleScrollTo(e, data?.ctaSecondaryLink || "#contact-form")}
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 h-12 rounded-2xl font-[460] text-sm transition-all cursor-pointer border shadow-xs"
              style={{
                backgroundColor: "var(--color-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--on-secondary)",
              }}
            >
              <Mail className="w-4 h-4 opacity-80" />
              <span>{data?.ctaSecondaryText || "Hubungi Saya"}</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Kolom Kanan: Portrait Avatar dengan Floating Translucent UI Cards (Tema-utama signature) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
        >
          <div className="relative w-full max-w-[340px]">
            {/* Main Portrait Frame */}
            <div
              className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border shadow-sm"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
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
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                  style={{ backgroundColor: "var(--bg-surface-elevated)" }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg mb-3"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--color-primary)",
                    }}
                  >
                    AF
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--color-ink)" }}>
                    Muh Asgar Fatwahyudi
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                    Prakom • Magang Hub BPVP Kendari
                  </p>
                </div>
              )}
            </div>

            {/* Floating Translucent Product UI Card 1 (Top Left Overlay) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="absolute -top-4 -left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl border shadow-sm backdrop-blur-md max-w-[220px]"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--color-secondary)",
                  color: "var(--color-primary)",
                }}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold truncate" style={{ color: "var(--color-ink)" }}>
                  BPVP Kendari
                </div>
                <div className="text-[10px] truncate" style={{ color: "var(--color-muted)" }}>
                  Magang Hub • Prakom
                </div>
              </div>
            </motion.div>

            {/* Floating Translucent Product UI Card 2 (Bottom Right Overlay) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="absolute -bottom-5 -right-4 sm:-right-6 flex items-center gap-3 p-3.5 rounded-2xl border shadow-sm backdrop-blur-md max-w-[240px]"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--on-accent)",
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold truncate" style={{ color: "var(--color-ink)" }}>
                  Full-Stack Specialist
                </div>
                <div className="text-[10px] truncate" style={{ color: "var(--color-muted)" }}>
                  Laravel • React • PostgreSQL
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
