import { motion, type Variants } from "framer-motion";
import { Terminal, Sparkles } from "lucide-react";

interface AboutProps {
  title?: string;
  subtitle?: string;
  data?: {
    bio?: string;
    skills?: string[];
  };
}

const skillContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const skillItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
};

export default function About({ title, subtitle, data }: AboutProps) {
  return (
    <section
      id="about"
      className="py-16 sm:py-20 relative"
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      {/* Bento Grid Container */}
      <div
        className="rounded-[20px] p-6 sm:p-10 transition-all duration-300 relative overflow-hidden"
        style={{
          background: "var(--color-surface, #1A1B1E)",
          border: "1px solid var(--color-border, #27272A)",
          boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Subtle Ambient Background Gradient */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-20 blur-3xl -z-10"
          style={{
            background: "radial-gradient(circle, rgba(0, 229, 89, 0.4) 0%, rgba(56, 189, 248, 0.2) 60%, transparent 80%)",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Kolom Kiri: Metadata & Heading */}
          <div className="md:col-span-4 space-y-4 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
              style={{
                background: "rgba(0, 229, 89, 0.1)",
                border: "1px solid rgba(0, 229, 89, 0.3)",
                color: "var(--color-primary, #00E559)",
              }}
            >
              <Sparkles className="w-3 h-3 text-[#00E559]" />
              BACKGROUND
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-2xl sm:text-3xl font-medium tracking-tight text-white"
              style={{
                fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                lineHeight: 1.2,
              }}
            >
              {title || "Architecting Modern Systems"}
            </motion.h2>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-sm text-zinc-400 leading-relaxed font-normal"
              >
                {subtitle}
              </motion.p>
            )}

            {/* AI Workflow Quick Metrics */}
            <div className="pt-2 hidden sm:grid grid-cols-2 gap-3 text-left font-mono">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">PRECISION</span>
                <span className="text-xs font-semibold text-white">Production 99.9%</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">PARADIGM</span>
                <span className="text-xs font-semibold text-[#00E559]">Event-Driven</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Bio & Core Technologies */}
          <div className="md:col-span-8 space-y-8 min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-base text-zinc-300 leading-relaxed font-normal break-words whitespace-pre-line"
            >
              {data?.bio ||
                "Specialized in constructing dependable backend architectures, high-performance web applications, and immersive digital interfaces. Focused on code correctness, clean domain design, and sub-second interaction latency."}
            </motion.p>

            {data?.skills && data.skills.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
                    Core Technologies & Tools
                  </span>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-2.5"
                  variants={skillContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {data.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={skillItem}
                      whileHover={{
                        scale: 1.04,
                        borderColor: "rgba(0, 229, 89, 0.6)",
                        color: "#00E559",
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-zinc-300 transition-all duration-200 cursor-default"
                      style={{
                        background: "rgba(10, 10, 12, 0.6)",
                        border: "1px solid var(--color-border, #27272A)",
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
