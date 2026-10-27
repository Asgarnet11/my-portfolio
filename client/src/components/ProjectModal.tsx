import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Code2, Layers, BookOpen, Sparkles } from "lucide-react";

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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-8 space-y-6 rounded-[20px] border"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--box-shadow)",
              fontFamily: "var(--font-body, 'Inter', sans-serif)",
            }}
          >
            {/* Header with Title and Close Button */}
            <div
              className="flex items-start justify-between gap-4 border-b pb-4"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="space-y-1.5">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium"
                  style={{
                    background: "var(--badge-bg)",
                    border: "1px solid var(--badge-border)",
                    color: "var(--color-accent)",
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  TECHNICAL CASE STUDY
                </div>
                <h2
                  className="text-xl sm:text-2xl font-semibold tracking-tight pt-1"
                  style={{
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                    color: "var(--color-ink)",
                  }}
                >
                  {project.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Tutup jendela studi kasus"
                className="p-2 rounded-full transition-colors cursor-pointer border"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                  color: "var(--color-muted)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cover Image */}
            {project.cover_image && (
              <div
                className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden border"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-md"
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--on-accent)",
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-200 border"
                  style={{
                    background: "var(--bg-surface-elevated)",
                    borderColor: "var(--border-color)",
                    color: "var(--color-ink)",
                  }}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Repositori GitHub</span>
                </a>
              )}
            </div>

            {/* Overview / Problem Solved */}
            <div className="space-y-2">
              <h3
                className="text-xs font-mono font-medium uppercase flex items-center gap-2"
                style={{ color: "var(--color-muted)" }}
              >
                <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                <span>Ringkasan & Tujuan Proyek</span>
              </h3>
              <p
                className="text-sm leading-relaxed p-4 rounded-xl border font-normal"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                  color: "var(--color-ink)",
                }}
              >
                {project.summary}
              </p>
            </div>

            {/* Technical Architecture & Case Study */}
            <div className="space-y-2">
              <h3
                className="text-xs font-mono font-medium uppercase flex items-center gap-2"
                style={{ color: "var(--color-muted)" }}
              >
                <Layers className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                <span>Keputusan Arsitektur & Rekayasa</span>
              </h3>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl border font-normal"
                style={{
                  background: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-color)",
                  color: "var(--color-ink)",
                }}
              >
                {project.case_study ||
                  "Proyek ini dirancang dengan fokus pada skalabilitas backend, isolasi komponen, serta antarmuka yang cepat dan responsif. Mengadopsi prinsip clean architecture, indexing database terstruktur, dan tata kelola kode yang teruji."}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2.5">
              <h3
                className="text-xs font-mono font-medium uppercase flex items-center gap-2"
                style={{ color: "var(--color-muted)" }}
              >
                <Code2 className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                <span>Teknologi yang Digunakan</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1 rounded-full border"
                    style={{
                      background: "var(--bg-surface-elevated)",
                      borderColor: "var(--border-color)",
                      color: "var(--color-ink)",
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
