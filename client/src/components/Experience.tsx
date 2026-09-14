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

const nodeColors = [
  "var(--card-accent-1, #FFC7D6)",
  "var(--card-accent-2, #B8E6C9)",
  "var(--card-accent-3, #D6C9F5)",
  "var(--card-accent-4, #FFD873)",
];

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
      className="py-14 sm:py-20 border-b-4 transition-colors duration-300"
      style={{ borderColor: "var(--color-ink, #4A3B52)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-4 space-y-3">
          {/* card-accent-3 stays dark/light-neutral in every theme, never
              collides with --color-ink text — unlike --bg-secondary. */}
          <span
            className="inline-block text-[9px] sm:text-[10px] px-2 py-1"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              background: "var(--card-accent-3, #D6C9F5)",
              border:
                "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
              boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
              borderRadius: "var(--border-radius, 0px)",
            }}
          >
            Career Path
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              fontSize: "18px",
              lineHeight: 1.6,
            }}
            className="sm:text-[20px]"
          >
            Experience
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-body, monospace)",
              color: "var(--color-muted, #504159)",
            }}
          >
            Jejak Pekerjaan Saya
          </p>
        </div>

        <div className="md:col-span-8 min-w-0">
          <div
            className="relative ml-2 pl-6 sm:pl-8 space-y-10 sm:space-y-12"
            style={{
              borderLeft:
                "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
            }}
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
                    className="absolute -left-[27px] sm:-left-[35px] top-1 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all"
                    style={{
                      background: accent,
                      border:
                        "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                      borderRadius: "var(--node-radius, 0px)",
                    }}
                  />

                  <div className="space-y-2 min-w-0">
                    <h3
                      className="break-words"
                      style={{
                        color: "var(--color-ink, #4A3B52)",
                        fontFamily: "var(--font-heading, monospace)",
                        fontSize: "11px",
                        lineHeight: 1.9,
                      }}
                    >
                      {exp.role}{" "}
                      <span style={{ color: "var(--color-muted, #504159)" }}>
                        @
                      </span>{" "}
                      <span style={{ color: "var(--color-ink, #4A3B52)" }}>
                        {exp.company}
                      </span>
                    </h3>

                    {/* Date + location */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span
                        style={{
                          fontFamily: "var(--font-heading, monospace)",
                          fontSize: "8px",
                          color: "var(--color-muted, #504159)",
                        }}
                      >
                        {formatDate(exp.start_date)} —{" "}
                        {formatDate(exp.end_date)}
                      </span>
                      {exp.location && (
                        <>
                          <span
                            style={{
                              color: "var(--color-muted, #504159)",
                              fontSize: "8px",
                            }}
                          >
                            ·
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-heading, monospace)",
                              fontSize: "8px",
                              color: "var(--color-muted, #504159)",
                            }}
                          >
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>

                    <p
                      className="text-sm font-normal leading-relaxed pt-1 whitespace-pre-line break-words"
                      style={{
                        fontFamily: "var(--font-body, monospace)",
                        color: "var(--color-ink, #4A3B52)",
                      }}
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
