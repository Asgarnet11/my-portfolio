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
    const fetchExperiences = async () => {
      try {
        const res = await api.get("/experiences/public");
        setExperiences(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data experience:", err);
      }
    };
    fetchExperiences();
  }, []);

  if (experiences.length === 0) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
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
        className="rounded-[20px] p-6 sm:p-10 transition-all duration-300 relative overflow-hidden"
        style={{
          background: "var(--color-surface, #1A1B1E)",
          border: "1px solid var(--color-border, #27272A)",
          boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.7)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Header Column */}
          <div className="md:col-span-4 space-y-3">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
              style={{
                background: "rgba(0, 229, 89, 0.1)",
                border: "1px solid rgba(0, 229, 89, 0.3)",
                color: "var(--color-primary, #00E559)",
              }}
            >
              <Briefcase className="w-3 h-3 text-[#00E559]" />
              CAREER PATH
            </div>
            <h2
              className="text-2xl sm:text-3xl font-medium tracking-tight text-white"
              style={{
                fontFamily: "var(--font-heading, 'Inter', sans-serif)",
              }}
            >
              Work Experience
            </h2>
            <p className="text-sm text-zinc-400 font-normal leading-relaxed">
              Riwayat kontribusi profesional, kepemimpinan tim rekayasa perangkat lunak, dan pengembangan produk.
            </p>
          </div>

          {/* Timeline Column */}
          <div className="md:col-span-8 min-w-0">
            <div
              className="relative ml-2 pl-6 sm:pl-8 space-y-10"
              style={{
                borderLeft: "1px solid var(--color-border, #27272A)",
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
                      background: "var(--color-primary, #00E559)",
                      boxShadow: "0 0 10px rgba(0, 229, 89, 0.6)",
                    }}
                  />

                  {/* Header: Role & Company */}
                  <div className="space-y-1">
                    <h3
                      className="text-base sm:text-lg font-medium text-white flex flex-wrap items-center gap-1.5"
                      style={{
                        fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                      }}
                    >
                      <span>{exp.role}</span>
                      <span className="text-[#38BDF8] font-normal">@</span>
                      <span className="text-zinc-200">{exp.company}</span>
                    </h3>

                    {/* Meta: Date & Location */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-300 leading-relaxed font-normal whitespace-pre-line pt-1">
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
