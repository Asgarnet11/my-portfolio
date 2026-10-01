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
      className="min-h-[85vh] flex flex-col justify-center pt-24 sm:pt-28 pb-16 relative overflow-hidden"
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      {/* Background Ambient Gradients */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[var(--color-primary,#00E559)] opacity-[0.08] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500 opacity-[0.05] rounded-full blur-[150px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kolom Kiri: Teks & CTA */}
        <div className="lg:col-span-7 space-y-8 min-w-0">
          {/* Top Status & Telemetry Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium shadow-[0_0_15px_rgba(0,229,89,0.1)] backdrop-blur-md"
              style={{
                background: "rgba(0, 229, 89, 0.05)",
                border: "1px solid rgba(0, 229, 89, 0.2)",
                color: "var(--color-primary, #00E559)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full shadow-[0_0_8px_#00E559] animate-pulse shrink-0"
                style={{ background: "var(--color-primary, #00E559)" }}
              />
              <span className="tracking-wide">{data?.statusBadge || "AVAILABLE FOR WORK"}</span>
            </motion.div>

            {/* AI Engine Telemetry Chip */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-zinc-300 backdrop-blur-md"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span className="tracking-wider">Engine: Neural-X</span>
            </motion.div>
          </div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
            style={{
              fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            }}
          >
            {title ? (
              title
            ) : (
              <>
                Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary,#00E559)] to-emerald-300">AI-driven</span>
                <br /> software & modern interfaces.
              </>
            )}
          </motion.h1>

          {/* Subtitle / Bio summary */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="text-lg sm:text-xl leading-relaxed text-zinc-400/90 max-w-xl font-light"
          >
            {subtitle ||
              "Full-stack engineer crafting high-throughput systems, resilient backend APIs, and tactile interactive web experiences."}
          </motion.p>

          {/* AI Workflow Meta Chips (Glassmorphism) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-2.5 pt-2 text-[11px] font-mono tracking-wide"
          >
            <span className="px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-zinc-300 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-[var(--color-primary,#00E559)]" /> Mode: Precision
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-zinc-300 shadow-sm">
              Model: X4 32-Tok
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 shadow-sm">
              Visual Mood Exp +2
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            className="pt-6 flex flex-wrap gap-4 items-center"
          >
            <motion.a
              href={data?.ctaPrimaryLink || "#projects"}
              onClick={(e) => handleScrollTo(e, data?.ctaPrimaryLink || "#projects")}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                background: "var(--color-primary, #00E559)",
                color: "#000",
                boxShadow: "0 8px 32px -8px var(--color-primary, #00E559)",
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">{data?.ctaPrimaryText || "View Projects"}</span>
              <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>

            <motion.a
              href={data?.ctaSecondaryLink || "#contact-form"}
              onClick={(e) => handleScrollTo(e, data?.ctaSecondaryLink || "#contact-form")}
              whileHover={{ scale: 1.03, y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-medium text-sm transition-all duration-300 cursor-pointer text-white bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 shadow-lg"
            >
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>{data?.ctaSecondaryText || "Contact Me"}</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Kolom Kanan: Bento Avatar Card with Float Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
        >
          {/* Floating effect container */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
            className="relative w-64 sm:w-72 md:w-[340px] z-20"
          >
            {/* Ambient Backlight Glow */}
            <div
              className="absolute -inset-4 rounded-[32px] opacity-30 blur-2xl transition-all duration-700 mix-blend-screen"
              style={{
                background: "radial-gradient(circle, var(--color-primary,#00E559) 0%, rgba(56, 189, 248, 0.2) 50%, transparent 70%)",
              }}
            />

            {/* Bento Card Surface (Glassmorphism) */}
            <div className="relative w-full rounded-[24px] overflow-hidden p-4 space-y-4 bg-zinc-950/60 backdrop-blur-xl border border-white/10 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)]">
              {/* Card Header Telemetry */}
              <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono tracking-wider">
                <span className="flex items-center gap-2 text-zinc-300">
                  <Activity className="w-3.5 h-3.5 text-[var(--color-primary,#00E559)]" />
                  TELEMETRY
                </span>
                <span className="text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">LATENCY 14ms</span>
              </div>

              {/* Avatar Image Frame */}
              <div className="relative w-full aspect-[4/5] rounded-[18px] overflow-hidden bg-zinc-900 shadow-inner group">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent z-10 opacity-60 mix-blend-multiply" />
                {data?.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt="Profile"
                    width={600}
                    height={750}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-zinc-900/60 backdrop-blur-sm">
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-lg">
                      <User className="w-8 h-8 text-zinc-300" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono font-medium text-white tracking-widest">
                        OPERATOR NODE
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Atur avatarUrl di Site Customizer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Bottom Tag (Glassmorphic) */}
              <div className="py-2.5 px-4 rounded-2xl flex items-center justify-between font-mono text-[11px] bg-white/5 border border-white/10 shadow-inner">
                <span className="text-zinc-300 font-medium tracking-widest">DEV // KND</span>
                <span
                  className="inline-flex items-center gap-1.5 font-bold tracking-widest text-[10px] px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,229,89,0.15)]"
                  style={{
                    background: "rgba(0, 229, 89, 0.1)",
                    color: "var(--color-primary, #00E559)",
                    border: "1px solid rgba(0, 229, 89, 0.2)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_#00E559] animate-pulse" style={{ background: "var(--color-primary, #00E559)" }} />
                  ACTIVE
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
