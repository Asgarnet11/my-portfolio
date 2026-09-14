import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";

const PIXEL_FONT = "'Press Start 2P', monospace";
const INK = "#4A3B52";
const MUTED = "#8A7A93";

const cardColors = ["#FFC7D6", "#B8E6C9", "#D6C9F5", "#FFD873"];

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
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
      className="py-20 border-b-4"
      style={{ borderColor: INK }}
    >
      <div className="space-y-12">
        <div className="space-y-2">
          <span
            className="inline-block text-[10px] px-2 py-1"
            style={{
              fontFamily: PIXEL_FONT,
              color: INK,
              background: "#B8E6C9",
              border: `3px solid ${INK}`,
              boxShadow: `3px 3px 0 0 ${INK}`,
            }}
          >
            Selected Works
          </span>
          <h2
            className="text-2xl tracking-tight"
            style={{
              fontFamily: PIXEL_FONT,
              color: INK,
              fontSize: "20px",
              lineHeight: 1.6,
            }}
          >
            Featured Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="overflow-hidden flex flex-col justify-between"
                style={{
                  background: "#FFF6E9",
                  border: `3px solid ${INK}`,
                  boxShadow: `4px 4px 0 0 ${INK}`,
                }}
              >
                {/* Gambar Cover Project */}
                {proj.cover_image && (
                  <div
                    className="w-full h-48 sm:h-52 overflow-hidden"
                    style={{
                      borderBottom: `3px solid ${INK}`,
                      background: accent,
                    }}
                  >
                    <img
                      src={proj.cover_image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <h3
                        style={{
                          fontFamily: PIXEL_FONT,
                          color: INK,
                          fontSize: "13px",
                          lineHeight: 1.6,
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
                            style={{ color: INK }}
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
                            style={{ color: INK }}
                            className="hover:opacity-60 transition-opacity"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p
                      className="text-sm font-normal leading-relaxed"
                      style={{ color: MUTED }}
                    >
                      {proj.summary}
                    </p>
                  </div>

                  <div className="pt-6 flex flex-wrap gap-2">
                    {proj.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] px-2 py-1"
                        style={{
                          fontFamily: PIXEL_FONT,
                          color: INK,
                          background: accent,
                          border: `2px solid ${INK}`,
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
