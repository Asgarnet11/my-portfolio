import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const PIXEL_FONT = "'Press Start 2P', monospace";
const INK = "#4A3B52";
const MUTED = "#8A7A93";
const nodeColors = ["#FFC7D6", "#B8E6C9", "#D6C9F5", "#FFD873"];

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
      className="py-14 sm:py-20 border-b-4"
      style={{ borderColor: INK }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-4 space-y-3">
          <span
            className="inline-block text-[9px] sm:text-[10px] px-2 py-1"
            style={{
              fontFamily: PIXEL_FONT,
              color: INK,
              background: "#D6C9F5",
              border: `3px solid ${INK}`,
              boxShadow: `3px 3px 0 0 ${INK}`,
            }}
          >
            Career Path
          </span>
          <h2
            style={{
              fontFamily: PIXEL_FONT,
              color: INK,
              fontSize: "18px",
              lineHeight: 1.6,
            }}
            className="sm:text-[20px]"
          >
            Experience
          </h2>
          <p className="text-sm" style={{ color: MUTED }}>
            Jejak Pekerjaan Saya
          </p>
        </div>

        <div className="md:col-span-8 min-w-0">
          <div
            className="relative ml-2 pl-6 sm:pl-8 space-y-10 sm:space-y-12"
            style={{ borderLeft: `3px solid ${INK}` }}
          >
            {experiences.map((exp, idx) => {
              const accent = nodeColors[idx % nodeColors.length];
              return (
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
                  className="relative"
                >
                  {/* Bullet node */}
                  <div
                    className="absolute -left-[27px] sm:-left-[35px] top-1 w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{
                      background: accent,
                      border: `3px solid ${INK}`,
                    }}
                  />

                  <div className="space-y-2 min-w-0">
                    {/* Role + company, always own line on mobile so it never fights the date column */}
                    <h3
                      className="break-words"
                      style={{
                        color: INK,
                        fontFamily: PIXEL_FONT,
                        fontSize: "11px",
                        lineHeight: 1.9,
                      }}
                    >
                      {exp.role} <span style={{ color: MUTED }}>@</span>{" "}
                      <span style={{ color: INK }}>{exp.company}</span>
                    </h3>

                    {/* Date + location grouped together, wraps cleanly under the title */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span
                        style={{
                          fontFamily: PIXEL_FONT,
                          fontSize: "8px",
                          color: MUTED,
                        }}
                      >
                        {formatDate(exp.start_date)} —{" "}
                        {formatDate(exp.end_date)}
                      </span>
                      {exp.location && (
                        <>
                          <span style={{ color: MUTED, fontSize: "8px" }}>
                            ·
                          </span>
                          <span
                            style={{
                              fontFamily: PIXEL_FONT,
                              fontSize: "8px",
                              color: MUTED,
                            }}
                          >
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>

                    <p
                      className="text-sm font-normal leading-relaxed pt-1 whitespace-pre-line break-words"
                      style={{ color: INK }}
                    >
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
