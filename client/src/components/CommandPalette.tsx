import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  Moon,
  Sun,
  User,
  Briefcase,
  FolderKanban,
  Mail,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Navigasi" | "Tema Tampilan" | "Aksi Cepat";
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const copyEmail = (emailStr = "afatwahyudi@gmail.com") => {
    navigator.clipboard.writeText(emailStr);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  const scrollToSection = (id: string) => {
    onClose();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const commands: CommandItem[] = [
    // Navigasi
    {
      id: "nav-about",
      category: "Navigasi",
      label: "Lompat ke About Me",
      icon: <User className="w-4 h-4" style={{ color: "var(--color-accent)" }} />,
      action: () => scrollToSection("about"),
    },
    {
      id: "nav-experience",
      category: "Navigasi",
      label: "Lompat ke Work Experience",
      icon: <Briefcase className="w-4 h-4" style={{ color: "var(--color-accent)" }} />,
      action: () => scrollToSection("experience"),
    },
    {
      id: "nav-projects",
      category: "Navigasi",
      label: "Lompat ke Featured Projects",
      icon: <FolderKanban className="w-4 h-4" style={{ color: "var(--color-accent)" }} />,
      action: () => scrollToSection("projects"),
    },
    {
      id: "nav-contact",
      category: "Navigasi",
      label: "Lompat ke Hubungi Saya",
      icon: <Mail className="w-4 h-4" style={{ color: "var(--color-accent)" }} />,
      action: () => scrollToSection("contact-form"),
    },

    // Tema
    {
      id: "theme-terminal",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Midnight Terminal (Dark - Modern-Design.MD)",
      icon: <Moon className="w-4 h-4" style={{ color: "var(--color-accent)" }} />,
      action: () => {
        setTheme("terminal");
        onClose();
      },
    },
    {
      id: "theme-editorial",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Editorial Dashboard (Light - Tema-utama.MD)",
      icon: <Sun className="w-4 h-4" style={{ color: "var(--color-accent)" }} />,
      action: () => {
        setTheme("editorial");
        onClose();
      },
    },

    // Aksi Cepat
    {
      id: "action-copy-email",
      category: "Aksi Cepat",
      label: copied ? "Email Berhasil Disalin!" : "Salin Email (afatwahyudi@gmail.com)",
      icon: copied ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <Copy className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
      ),
      action: () => copyEmail(),
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );


  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? (filtered.length || 1) - 1 : prev - 1,
        );
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl z-10 border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            boxShadow: "var(--box-shadow)",
            fontFamily: "var(--font-heading, 'Inter', sans-serif)",
          }}
        >
          {/* Search Header */}
          <div
            className="flex items-center px-4 py-3.5 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <Search className="w-4 h-4 mr-3 shrink-0" style={{ color: "var(--color-muted)" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Ketik perintah atau navigasi (e.g. Proyek, Tema, Email)..."
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{
                color: "var(--color-ink)",
              }}
            />
            <kbd
              className="text-[10px] font-mono px-2 py-0.5 rounded border ml-2"
              style={{
                background: "var(--border-subtle)",
                borderColor: "var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              ESC
            </kbd>
          </div>

          {/* List Commands */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div
                className="py-8 text-center text-xs font-mono"
                style={{ color: "var(--color-muted)" }}
              >
                Tidak ada aksi yang sesuai dengan &ldquo;{query}&rdquo;
              </div>
            ) : (
              filtered.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-left transition-all cursor-pointer"
                    style={{
                      background: isSelected ? "var(--border-subtle)" : "transparent",
                      color: isSelected ? "var(--color-ink)" : "var(--color-muted)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">{cmd.icon}</div>
                      <span className="font-medium truncate">{cmd.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase"
                        style={{
                          background: "var(--bg-surface-elevated)",
                          borderColor: "var(--border-color)",
                          color: "var(--color-muted)",
                        }}
                      >
                        {cmd.category}
                      </span>
                      {isSelected && (
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div
            className="px-4 py-2.5 text-[11px] font-mono flex items-center justify-between border-t"
            style={{
              background: "var(--bg-surface-elevated)",
              borderColor: "var(--border-color)",
              color: "var(--color-muted)",
            }}
          >
            <span>Gunakan tombol ↑ ↓ untuk memilih</span>
            <span>↵ untuk konfirmasi</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
