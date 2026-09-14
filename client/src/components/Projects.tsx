import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";

const cardColors = [
  "var(--card-accent-1, #FFC7D6)",
  "var(--card-accent-2, #B8E6C9)",
  "var(--card-accent-3, #D6C9F5)",
  "var(--card-accent-4, #FFD873)",
];

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  id: string;
  title: string;
  summary: string;
  cover_image?: string;
  tech_stack: string[];
  live_url?: string;
  repo_url?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/public");
        setProjects(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data proyek:", err);
      }
    };
    fetchProjects();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section
      id="projects"
      className="py-14 sm:py-20 border-b-4 transition-colors duration-300"
      style={{ borderColor: "var(--color-ink, #4A3B52)" }}
    >
      <div className="space-y-10 sm:space-y-12">
        <div className="space-y-2">
          {/* card-accent-2 (mint/blue/dark-teal depending on theme) always
              stays safe with --color-ink text — unlike --bg-secondary,
              this token isn't neon in any theme. No on-accent bug here. */}
          <span
            className="inline-block text-[9px] sm:text-[10px] px-2 py-1"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              background: "var(--card-accent-2, #B8E6C9)",
              border:
                "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
              boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
              borderRadius: "var(--border-radius, 0px)",
            }}
          >
            Selected Works
          </span>
          <h2
            className="tracking-tight break-words"
            style={{
              fontFamily: "var(--font-heading, monospace)",
              color: "var(--color-ink, #4A3B52)",
              fontSize: "clamp(16px, 4vw, 20px)",
              lineHeight: 1.6,
            }}
          >
            Featured Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {projects.map((proj, idx) => {
            const accent = cardColors[idx % cardColors.length];
            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.08,
                  ease: "easeOut",
                }}
                className="overflow-hidden flex flex-col justify-between transition-all min-w-0"
                style={{
                  background: "var(--bg-primary, #FFF6E9)",
                  border:
                    "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                  boxShadow: "var(--box-shadow-lg, 4px 4px 0 0 #4A3B52)",
                  borderRadius: "var(--border-radius, 0px)",
                }}
              >
                {/* Gambar Cover Project */}
                {proj.cover_image && (
                  <div
                    className="w-full h-44 sm:h-52 overflow-hidden"
                    style={{
                      borderBottom:
                        "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                      background: accent,
                    }}
                  >
                    <img
                      src={proj.cover_image}
                      alt={`Cuplikan antarmuka proyek ${proj.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      style={{
                        imageRendering:
                          "var(--img-rendering, pixelated)" as CSSProperties["imageRendering"],
                      }}
                    />
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <h3
                        className="break-words"
                        style={{
                          fontFamily: "var(--font-heading, monospace)",
                          color: "var(--color-ink, #4A3B52)",
                          fontSize: "12px",
                          lineHeight: 1.7,
                        }}
                      >
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-3 shrink-0">
                        {proj.repo_url && (
                          <a
                            href={proj.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Lihat repositori GitHub untuk ${proj.title}`}
                            style={{ color: "var(--color-ink, #4A3B52)" }}
                            className="hover:opacity-60 transition-opacity"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                        {proj.live_url && (
                          <a
                            href={proj.live_url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Kunjungi situs langsung untuk ${proj.title}`}
                            style={{ color: "var(--color-ink, #4A3B52)" }}
                            className="hover:opacity-60 transition-opacity"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p
                      className="text-sm font-normal leading-relaxed break-words"
                      style={{
                        fontFamily: "var(--font-body, monospace)",
                        color: "var(--color-muted, #504159)",
                      }}
                    >
                      {proj.summary}
                    </p>
                  </div>

                  <div className="pt-4 sm:pt-6 flex flex-wrap gap-2">
                    {proj.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] px-2 py-1"
                        style={{
                          fontFamily: "var(--font-heading, monospace)",
                          color: "var(--color-ink, #4A3B52)",
                          background: accent,
                          border:
                            "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                          borderRadius: "var(--border-radius, 0px)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
