import { useEffect, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Layers, ExternalLink } from "lucide-react";
import { api } from "../lib/api";
import type { ProjectDetail } from "./ProjectModal";

const ProjectModal = lazy(() => import("./ProjectModal"));

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

export default function Projects() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/public");
        if (isMounted) setProjects(res.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data proyek:", err);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  if (projects.length === 0) return null;

  return (
    <section
      id="projects"
      className="py-16 sm:py-20 relative"
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      <div className="space-y-10">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium"
            style={{
              background: "rgba(0, 229, 89, 0.1)",
              border: "1px solid rgba(0, 229, 89, 0.3)",
              color: "var(--color-primary, #00E559)",
            }}
          >
            <Layers className="w-3 h-3 text-[#00E559]" />
            SELECTED WORKS
          </div>
          <h2
            className="text-3xl sm:text-4xl font-medium tracking-tight text-white"
            style={{
              fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            }}
          >
            Featured Projects
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl font-normal">
            Kumpulan aplikasi, sistem backend terdistribusi, dan eksplorasi antarmuka yang dirancang dengan presisi teknis tinggi.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: idx * 0.08,
                ease: "easeOut",
              }}
              className="rounded-[20px] overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:border-zinc-700"
              style={{
                background: "var(--color-surface, #1A1B1E)",
                border: "1px solid var(--color-border, #27272A)",
                boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Gambar Cover Project */}
              {proj.cover_image && (
                <div
                  onClick={() => setSelectedProject(proj)}
                  className="w-full h-48 sm:h-56 overflow-hidden cursor-pointer relative bg-zinc-900"
                >
                  <img
                    src={proj.cover_image}
                    alt={`Cuplikan antarmuka proyek ${proj.title}`}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <span
                      className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-transform duration-200 group-hover:scale-105"
                      style={{
                        background: "var(--color-primary, #00E559)",
                        color: "#09090B",
                        boxShadow: "0 0 16px rgba(0, 229, 89, 0.4)",
                      }}
                    >
                      Buka Studi Kasus <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h3
                      onClick={() => setSelectedProject(proj)}
                      className="text-lg font-medium text-white cursor-pointer hover:text-[#00E559] transition-colors"
                      style={{
                        fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                      }}
                    >
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {proj.repo_url && (
                        <a
                          href={proj.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`GitHub repo untuk ${proj.title}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="GitHub Repo"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {proj.live_url && (
                        <a
                          href={proj.live_url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Live demo untuk ${proj.title}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-[#00E559] hover:bg-zinc-800 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                    {proj.summary}
                  </p>
                </div>

                <div className="pt-4 space-y-4">
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-full text-zinc-300"
                        style={{
                          background: "rgba(10, 10, 12, 0.7)",
                          border: "1px solid var(--color-border, #27272A)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Case Study Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    className="w-full py-2.5 px-4 rounded-[14px] text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-white hover:text-[#00E559] hover:border-zinc-700"
                    style={{
                      background: "rgba(10, 10, 12, 0.5)",
                      border: "1px solid var(--color-border, #27272A)",
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Baca Studi Kasus Teknis</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
