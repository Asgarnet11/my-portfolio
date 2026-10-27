import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { api } from "../lib/api";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  description: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchExperiences = async () => {
      try {
        const res = await api.get("/experiences/public");
        if (isMounted) setExperiences(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data experience:", err);
      }
    };
    fetchExperiences();
    return () => {
      isMounted = false;
    };
  }, []);

  if (experiences.length === 0) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Sekarang";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section
      id="experience"
      className="py-16 sm:py-20 relative"
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      {/* Bento Container */}
      <div
        className="rounded-[20px] p-6 sm:p-10 transition-all duration-300 relative overflow-hidden border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--box-shadow)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Header Column */}
          <div className="md:col-span-4 space-y-3">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
              style={{
                background: "var(--badge-bg)",
                border: "1px solid var(--badge-border)",
                color: "var(--color-accent)",
              }}
            >
              <Briefcase className="w-3 h-3" />
              CAREER & MILESTONES
            </div>
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                color: "var(--color-ink)",
              }}
            >
              Work Experience
            </h2>
            <p
              className="text-sm font-normal leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              Riwayat kontribusi profesional, tanggung jawab rekayasa sistem informasi, dan pengelolaan data teknologi.
            </p>
          </div>

          {/* Timeline Column */}
          <div className="md:col-span-8 min-w-0">
            <div
              className="relative ml-2 pl-6 sm:pl-8 space-y-10"
              style={{
                borderLeft: "1px solid var(--border-color)",
              }}
            >
              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.08,
                    ease: "easeOut",
                  }}
                  className="relative space-y-2"
                >
                  {/* Glowing Node Dot */}
                  <div
                    className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{
                      background: "var(--color-accent)",
                      boxShadow: "0 0 10px var(--color-accent)",
                    }}
                  />

                  {/* Header: Role & Company */}
                  <div className="space-y-1">
                    <h3
                      className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-1.5"
                      style={{
                        fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                        color: "var(--color-ink)",
                      }}
                    >
                      <span>{exp.role}</span>
                      <span style={{ color: "var(--color-accent)" }}>@</span>
                      <span>{exp.company}</span>
                    </h3>

                    {/* Meta: Date & Location */}
                    <div
                      className="flex flex-wrap items-center gap-3 text-xs font-mono"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed font-normal whitespace-pre-line pt-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
