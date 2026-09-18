import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Code2, Layers, BookOpen } from "lucide-react";

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

export interface ProjectDetail {
  id: string;
  title: string;
  summary: string;
  cover_image?: string;
  tech_stack: string[];
  live_url?: string;
  repo_url?: string;
  case_study?: string | null;
}

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 p-5 sm:p-7 space-y-6"
            style={{
              background: "var(--bg-primary, #FFF6E9)",
              color: "var(--color-ink, #4A3B52)",
              border: "var(--border-width-lg, 4px) solid var(--color-ink, #4A3B52)",
              boxShadow: "var(--box-shadow-lg, 8px 8px 0 0 #4A3B52)",
              borderRadius: "var(--border-radius, 0px)",
              fontFamily: "var(--font-body, monospace)",
            }}
          >
            {/* Header with Title and Close Button */}
            <div className="flex items-start justify-between gap-4 border-b-2 pb-4" style={{ borderColor: "var(--color-ink, #4A3B52)" }}>
              <div className="space-y-1">
                <span
                  className="inline-block text-[9px] px-2 py-0.5 uppercase tracking-wider"
                  style={{
                    fontFamily: "var(--font-heading, monospace)",
                    background: "var(--bg-secondary, #FFD873)",
                    color: "var(--on-accent, #4A3B52)",
                    border: "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                  }}
                >
                  Technical Case Study
                </span>
                <h2
                  className="text-lg sm:text-xl font-bold tracking-tight pt-1"
                  style={{
                    fontFamily: "var(--font-heading, monospace)",
                    color: "var(--color-ink, #4A3B52)",
                  }}
                >
                  {project.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Tutup jendela studi kasus"
                className="p-1.5 hover:opacity-70 transition-transform active:translate-y-0.5"
                style={{
                  background: "var(--card-frame-bg, #FFC7D6)",
                  border: "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                  boxShadow: "var(--box-shadow, 2px 2px 0 0 #4A3B52)",
                  cursor: "pointer",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cover Image */}
            {project.cover_image && (
              <div
                className="w-full h-48 sm:h-64 overflow-hidden"
                style={{
                  border: "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                  boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
                }}
              >
                <img
                  src={project.cover_image}
                  alt={`Screenshot ${project.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Quick Action Links */}
            <div className="flex flex-wrap gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-heading, monospace)",
                    fontSize: "10px",
                    background: "var(--bg-secondary, #FFD873)",
                    color: "var(--on-accent, #4A3B52)",
                    border: "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                    boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
                    textDecoration: "none",
                  }}
                >
                  <span>Buka Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-heading, monospace)",
                    fontSize: "10px",
                    background: "var(--bg-accent, #D6C9F5)",
                    color: "var(--color-ink, #4A3B52)",
                    border: "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                    boxShadow: "var(--box-shadow, 3px 3px 0 0 #4A3B52)",
                    textDecoration: "none",
                  }}
                >
                  <span>Repositori GitHub</span>
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Overview / Problem Solved */}
            <div className="space-y-2">
              <h3
                className="text-xs uppercase flex items-center gap-2 font-bold"
                style={{ fontFamily: "var(--font-heading, monospace)" }}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#74489D]" />
                <span>Ringkasan & Tujuan Proyek</span>
              </h3>
              <p
                className="text-sm leading-relaxed p-3.5"
                style={{
                  background: "var(--card-accent-2, #B8E6C9)",
                  border: "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                  borderRadius: "var(--border-radius, 0px)",
                }}
              >
                {project.summary}
              </p>
            </div>

            {/* Technical Architecture & Case Study */}
            <div className="space-y-2">
              <h3
                className="text-xs uppercase flex items-center gap-2 font-bold"
                style={{ fontFamily: "var(--font-heading, monospace)" }}
              >
                <Layers className="w-3.5 h-3.5 text-[#74489D]" />
                <span>Keputusan Arsitektur & Rekayasa</span>
              </h3>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap p-4 text-justify"
                style={{
                  background: "var(--bg-primary, #FFF6E9)",
                  border: "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                  borderRadius: "var(--border-radius, 0px)",
                  boxShadow: "inset 2px 2px 0 0 rgba(74,59,82,0.1)",
                }}
              >
                {project.case_study ||
                  "Proyek ini dirancang dengan fokus pada skalabilitas backend, pemisahan dependensi monorepo yang rapi, serta pengalaman pengguna yang responsif. Menggunakan prinsip clean architecture, query database terindeks, dan penanganan status asinkron yang tangguh."}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2">
              <h3
                className="text-xs uppercase flex items-center gap-2 font-bold"
                style={{ fontFamily: "var(--font-heading, monospace)" }}
              >
                <Code2 className="w-3.5 h-3.5 text-[#74489D]" />
                <span>Teknologi yang Digunakan</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1"
                    style={{
                      fontFamily: "var(--font-heading, monospace)",
                      fontSize: "9px",
                      background: "var(--card-accent-3, #D6C9F5)",
                      color: "var(--color-ink, #4A3B52)",
                      border: "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                      borderRadius: "var(--border-radius, 0px)",
                    }}
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
