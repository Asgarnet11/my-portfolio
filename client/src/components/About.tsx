import { motion, type Variants } from "framer-motion";
import { Terminal, Sparkles, Building, Database } from "lucide-react";

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
        className="rounded-[20px] p-6 sm:p-10 transition-all duration-300 relative overflow-hidden border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--box-shadow)",
        }}
      >
        {/* Subtle Ambient Background Gradient */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-20 blur-3xl -z-10"
          style={{
            background: "var(--card-glow)",
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
                background: "var(--badge-bg)",
                border: "1px solid var(--badge-border)",
                color: "var(--color-accent)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              BACKGROUND & PROFILE
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                color: "var(--color-ink)",
                lineHeight: 1.2,
              }}
            >
              {title || "Architecting Dependable Software"}
            </motion.h2>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-sm leading-relaxed font-normal"
                style={{ color: "var(--color-muted)" }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Professional Highlights */}
            <div className="pt-2 hidden sm:grid grid-cols-2 gap-3 text-left font-mono">
              <div
                className="p-3 rounded-xl border"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--color-muted)" }}>
                  <Building className="w-3 h-3" />
                  INSTITUSI
                </div>
                <span className="text-xs font-semibold block mt-0.5" style={{ color: "var(--color-ink)" }}>
                  BPVP Kendari
                </span>
              </div>
              <div
                className="p-3 rounded-xl border"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--color-muted)" }}>
                  <Database className="w-3 h-3" />
                  KEAHLIAN
                </div>
                <span className="text-xs font-semibold block mt-0.5" style={{ color: "var(--color-accent)" }}>
                  Full-Stack / DB
                </span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Bio & Core Technologies */}
          <div className="md:col-span-8 space-y-7 min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-base leading-relaxed font-normal break-words whitespace-pre-line"
              style={{ color: "var(--color-ink)" }}
            >
              {data?.bio ||
                "Saya adalah lulusan Sistem Informasi yang memiliki ketertarikan kuat pada Web Development, Sistem Informasi, dan Data Management. Saat ini saya bekerja sebagai Pranata Komputer di BPVP Kendari, dengan pengalaman dalam mengembangkan dan memelihara sistem informasi, membangun dashboard monitoring, mengelola database dan API, serta menyelesaikan berbagai permasalahan teknis untuk mendukung digitalisasi proses kerja."}
            </motion.p>

            {data?.skills && data.skills.length > 0 && (
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                  <span
                    className="text-xs font-mono font-medium uppercase tracking-wider"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Core Technologies & Skills
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
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 cursor-default border shadow-sm"
                      style={{
                        background: "var(--bg-surface-elevated)",
                        borderColor: "var(--border-color)",
                        color: "var(--color-ink)",
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
