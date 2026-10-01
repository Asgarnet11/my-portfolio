import { motion } from "framer-motion";
import { ArrowUpRight, Terminal, User, Cpu, Sparkles, Activity } from "lucide-react";

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
      className="min-h-[85vh] flex flex-col justify-center pt-24 sm:pt-28 pb-16 relative"
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Kolom Kiri: Teks, Telemetri AI, & CTA */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          {/* Top Status & Telemetry Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium"
              style={{
                background: "rgba(0, 229, 89, 0.1)",
                border: "1px solid rgba(0, 229, 89, 0.3)",
                color: "var(--color-primary, #00E559)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse shrink-0"
                style={{ background: "var(--color-primary, #00E559)" }}
              />
              <span>{data?.statusBadge || "AVAILABLE FOR WORK"}</span>
            </motion.div>

            {/* AI Engine Telemetry Chip */}
            <div
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono text-zinc-400"
              style={{
                background: "rgba(26, 27, 30, 0.8)",
                border: "1px solid var(--color-border, #27272A)",
              }}
            >
              <Cpu className="w-3 h-3 text-[#38BDF8]" />
              <span>Engine: Neural-X</span>
            </div>
          </div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white"
            style={{
              fontFamily: "var(--font-heading, 'Inter', sans-serif)",
              lineHeight: 1.08,
            }}
          >
            {title ? (
              title
            ) : (
              <>
                Building <span style={{ color: "var(--color-primary, #00E559)" }}>AI-driven</span> software & modern interfaces.
              </>
            )}
          </motion.h1>

          {/* Subtitle / Bio summary */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg leading-relaxed text-zinc-400 max-w-xl font-normal"
          >
            {subtitle ||
              "Full-stack engineer crafting high-throughput systems, resilient backend APIs, and tactile interactive web experiences."}
          </motion.p>

          {/* AI Workflow Meta Chips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-zinc-400"
          >
            <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#00E559]" /> Mode: Precision
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800">
              Model: X4 32-Tok
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-500">
              Visual Mood Experiment +2
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
            className="pt-4 flex flex-wrap gap-4 items-center"
          >
            <motion.a
              href={data?.ctaPrimaryLink || "#projects"}
              onClick={(e) => handleScrollTo(e, data?.ctaPrimaryLink || "#projects")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[20px] font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg"
              style={{
                background: "var(--color-primary, #00E559)",
                color: "#09090B",
                boxShadow: "0 0 24px rgba(0, 229, 89, 0.25)",
              }}
            >
              <span>{data?.ctaPrimaryText || "View Projects"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              href={data?.ctaSecondaryLink || "#contact-form"}
              onClick={(e) => handleScrollTo(e, data?.ctaSecondaryLink || "#contact-form")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[20px] font-medium text-sm transition-all duration-200 cursor-pointer text-white"
              style={{
                background: "var(--color-surface, #1A1B1E)",
                border: "1px solid var(--color-border, #27272A)",
              }}
            >
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>{data?.ctaSecondaryText || "Contact Me"}</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Kolom Kanan: Bento Avatar Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative w-64 sm:w-72 md:w-80">
            {/* Ambient Backlight Glow */}
            <div
              className="absolute -inset-1 rounded-[24px] opacity-40 blur-xl transition-all duration-500"
              style={{
                background: "radial-gradient(circle, rgba(0, 229, 89, 0.3) 0%, rgba(56, 189, 248, 0.15) 60%, transparent 80%)",
              }}
            />

            {/* Bento Card Surface */}
            <div
              className="relative w-full rounded-[20px] overflow-hidden p-3.5 space-y-3 transition-all duration-300"
              style={{
                background: "var(--color-surface, #1A1B1E)",
                border: "1px solid var(--color-border, #27272A)",
                boxShadow: "0 16px 36px -4px rgba(0, 0, 0, 0.7)",
              }}
            >
              {/* Card Header Telemetry */}
              <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00E559]" />
                  TELEMETRY
                </span>
                <span className="text-zinc-500">LATENCY 14ms</span>
              </div>

              {/* Avatar Image Frame */}
              <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden bg-zinc-900 border border-zinc-800">
                {data?.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt="Profile"
                    width={600}
                    height={750}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-zinc-900/60">
                    <div className="p-3 rounded-full bg-zinc-800 border border-zinc-700">
                      <User className="w-8 h-8 text-zinc-300" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-medium text-white">
                        Operator Node
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Atur avatarUrl di Site Customizer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Bottom Tag */}
              <div
                className="py-2 px-3 rounded-xl flex items-center justify-between font-mono text-[11px]"
                style={{
                  background: "rgba(10, 10, 12, 0.8)",
                  border: "1px solid var(--color-border, #27272A)",
                }}
              >
                <span className="text-zinc-400 font-medium">DEV // KND</span>
                <span
                  className="inline-flex items-center gap-1.5 font-semibold text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0, 229, 89, 0.12)",
                    color: "var(--color-primary, #00E559)",
                    border: "1px solid rgba(0, 229, 89, 0.25)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E559] animate-pulse" />
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
