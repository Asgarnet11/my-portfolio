import { motion, type Variants } from "framer-motion";
import { Building2, Code2, GraduationCap, CheckCircle } from "lucide-react";

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
    transition: { staggerChildren: 0.03 },
  },
};

const skillItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function About({ title, subtitle, data }: AboutProps) {
  return (
    <section
      id="about"
      className="py-16 sm:py-20 relative"
      style={{
        fontFamily: "var(--font-heading, 'Inter', sans-serif)",
      }}
    >
      {/* Paper White Surface Card (Tema-utama.MD: 16px radius, #ffffff surface, 1px #e3e3e2 border) */}
      <div
        className="rounded-2xl p-6 sm:p-10 transition-all duration-300 relative border shadow-xs"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Kolom Kiri: Metadata & Editorial Heading */}
          <div className="md:col-span-5 space-y-5 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-[460]"
              style={{
                backgroundColor: "var(--color-secondary)",
                color: "var(--on-secondary)",
              }}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Profil & Institusi</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-[460] tracking-[-0.025em] leading-[1.16]"
              style={{
                color: "var(--color-ink)",
              }}
            >
              {title || "Mewujudkan Sistem Informasi yang Terstruktur & Andal"}
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

            {/* Institutional Profile Cards (Editorial Dual-Card) */}
            <div className="pt-2 space-y-3">
              <div
                className="p-4 rounded-xl border flex items-start gap-3"
                style={{
                  backgroundColor: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-primary)",
                  }}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--color-ink)" }}>
                    BPVP Kendari • Kemnaker RI
                  </div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    Balai Pelatihan Vokasi dan Produktivitas Kendari — Ditjen Binalavotas.
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-xl border flex items-start gap-3"
                style={{
                  backgroundColor: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--on-accent)",
                  }}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--color-ink)" }}>
                    Sistem Informasi & Rekayasa Web
                  </div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    Spesialisasi pada arsitektur database, REST API, dan tata kelola digital.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Narasi Bio & Keahlian Utama */}
          <div className="md:col-span-7 space-y-6 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line space-y-4"
              style={{ color: "var(--color-ink)" }}
            >
              <p>
                {data?.bio ||
                  "Saya adalah lulusan Sistem Informasi yang berfokus pada Web Development, Arsitektur Sistem, dan Pengelolaan Database. Saat ini saya bertugas sebagai Pranata Komputer di BPVP Kendari (Kementerian Ketenagakerjaan Republik Indonesia), merancang dan memelihara aplikasi web, dashboard monitoring, serta integrasi API guna mendukung efisiensi operasional dan digitalisasi layanan pelatihan vokasi."}
              </p>
            </motion.div>

            {data?.skills && data.skills.length > 0 && (
              <div className="space-y-3 pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Keahlian Teknis & Alat
                  </span>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={skillContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {data.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={skillItem}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-xs transition-colors"
                      style={{
                        backgroundColor: "var(--bg-surface-elevated)",
                        borderColor: "var(--border-color)",
                        color: "var(--color-ink)",
                      }}
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{skill}</span>
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
