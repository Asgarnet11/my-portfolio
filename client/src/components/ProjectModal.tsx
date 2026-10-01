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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-8 space-y-6 rounded-[20px]"
            style={{
              background: "var(--color-surface, #1A1B1E)",
              border: "1px solid var(--color-border, #27272A)",
              boxShadow: "0 24px 48px -8px rgba(0, 0, 0, 0.8)",
              fontFamily: "var(--font-body, 'Inter', sans-serif)",
            }}
          >
            {/* Header with Title and Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="space-y-1.5">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium"
                  style={{
                    background: "rgba(0, 229, 89, 0.1)",
                    border: "1px solid rgba(0, 229, 89, 0.3)",
                    color: "var(--color-primary, #00E559)",
                  }}
                >
                  <Sparkles className="w-3 h-3 text-[#00E559]" />
                  TECHNICAL CASE STUDY
                </div>
                <h2
                  className="text-xl sm:text-2xl font-medium tracking-tight text-white pt-1"
                  style={{
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                  }}
                >
                  {project.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Tutup jendela studi kasus"
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cover Image */}
            {project.cover_image && (
              <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    background: "var(--color-primary, #00E559)",
                    color: "#09090B",
                    boxShadow: "0 0 16px rgba(0, 229, 89, 0.3)",
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-white transition-all duration-200"
                  style={{
                    background: "#09090B",
                    border: "1px solid var(--color-border, #27272A)",
                  }}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Repositori GitHub</span>
                </a>
              )}
            </div>

            {/* Overview / Problem Solved */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-medium uppercase text-zinc-400 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Ringkasan & Tujuan Proyek</span>
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-normal">
                {project.summary}
              </p>
            </div>

            {/* Technical Architecture & Case Study */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-medium uppercase text-zinc-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#00E559]" />
                <span>Keputusan Arsitektur & Rekayasa</span>
              </h3>
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-normal">
                {project.case_study ||
                  "Proyek ini dirancang dengan fokus pada skalabilitas backend, isolasi komponen, serta pengalaman interaksi real-time tanpa latensi. Mengadopsi prinsip clean domain architecture, indexing database terstruktur, dan pemrosesan asinkron yang andal."}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono font-medium uppercase text-zinc-400 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Teknologi yang Digunakan</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1 rounded-full text-zinc-300"
                    style={{
                      background: "#09090B",
                      border: "1px solid var(--color-border, #27272A)",
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
