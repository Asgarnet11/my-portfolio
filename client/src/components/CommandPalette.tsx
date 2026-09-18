import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  Sliders,
  User,
  Briefcase,
  FolderKanban,
  Mail,
  Copy,
  Check,
  Globe,
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

  const copyEmail = (emailStr = "asgarfatwahyudi@gmail.com") => {
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
      icon: <User className="w-3.5 h-3.5" />,
      action: () => scrollToSection("about"),
    },
    {
      id: "nav-experience",
      category: "Navigasi",
      label: "Lompat ke Pengalaman Kerja",
      icon: <Briefcase className="w-3.5 h-3.5" />,
      action: () => scrollToSection("experience"),
    },
    {
      id: "nav-projects",
      category: "Navigasi",
      label: "Lompat ke Featured Projects",
      icon: <FolderKanban className="w-3.5 h-3.5" />,
      action: () => scrollToSection("projects"),
    },
    {
      id: "nav-contact",
      category: "Navigasi",
      label: "Lompat ke Hubungi Saya",
      icon: <Mail className="w-3.5 h-3.5" />,
      action: () => scrollToSection("contact-form"),
    },

    // Tema
    {
      id: "theme-pixel",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Retro Pixel (Default)",
      icon: <Sliders className="w-3.5 h-3.5" />,
      action: () => {
        setTheme("pixel");
        onClose();
      },
    },
    {
      id: "theme-modern",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Modern Clean",
      icon: <Sliders className="w-3.5 h-3.5" />,
      action: () => {
        setTheme("modern");
        onClose();
      },
    },
    {
      id: "theme-terminal",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Dark Terminal",
      icon: <Sliders className="w-3.5 h-3.5" />,
      action: () => {
        setTheme("terminal");
        onClose();
      },
    },

    // Aksi Cepat
    {
      id: "copy-email",
      category: "Aksi Cepat",
      label: copied ? "Email Berhasil Tersalin!" : "Salin Alamat Email ke Clipboard",
      icon: copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />,
      action: () => copyEmail(),
    },
    {
      id: "open-github",
      category: "Aksi Cepat",
      label: "Kunjungi GitHub Profil Asgar",
      icon: <Globe className="w-3.5 h-3.5" />,
      action: () => {
        window.open("https://github.com/Asgarnet11", "_blank");
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(0);
        setQuery("");
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? filteredCommands.length - 1 : prev - 1,
        );
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg overflow-hidden z-10"
            style={{
              background: "var(--bg-primary, #FFF6E9)",
              border: "var(--border-width-lg, 4px) solid var(--color-ink, #4A3B52)",
              boxShadow: "var(--box-shadow-lg, 8px 8px 0 0 #4A3B52)",
              borderRadius: "var(--border-radius, 0px)",
              fontFamily: "var(--font-body, monospace)",
            }}
          >
            {/* Search Input Bar */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 border-b-2"
              style={{ borderColor: "var(--color-ink, #4A3B52)" }}
            >
              <Search className="w-4 h-4 opacity-70" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ketik perintah atau cari (About, Tema, Proyek)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full text-xs sm:text-sm bg-transparent outline-none"
                style={{
                  color: "var(--color-ink, #4A3B52)",
                  fontFamily: "var(--font-body, monospace)",
                }}
              />
              <span
                className="text-[9px] px-1.5 py-0.5 border"
                style={{
                  fontFamily: "var(--font-heading, monospace)",
                  background: "var(--bg-secondary, #FFD873)",
                  color: "var(--on-accent, #4A3B52)",
                  borderColor: "var(--color-ink, #4A3B52)",
                }}
              >
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredCommands.map((cmd, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs cursor-pointer transition-colors"
                    style={{
                      background: isSelected ? "var(--bg-secondary, #FFD873)" : "transparent",
                      color: isSelected ? "var(--on-accent, #4A3B52)" : "var(--color-ink, #4A3B52)",
                      border: isSelected
                        ? "var(--border-width, 2px) solid var(--color-ink, #4A3B52)"
                        : "var(--border-width, 2px) solid transparent",
                      borderRadius: "var(--border-radius, 0px)",
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0">{cmd.icon}</span>
                      <span className="truncate">{cmd.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 opacity-70">
                      <span
                        className="text-[8px] uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-heading, monospace)" }}
                      >
                        {cmd.category}
                      </span>
                      {isSelected && <ArrowRight className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}

              {filteredCommands.length === 0 && (
                <div className="p-6 text-center text-xs opacity-60">
                  Tidak ada perintah yang cocok dengan &quot;{query}&quot;
                </div>
              )}
            </div>

            {/* Footer Shortcut Hints */}
            <div
              className="px-4 py-2 text-[9px] flex items-center justify-between border-t"
              style={{
                borderColor: "var(--color-ink, #4A3B52)",
                color: "var(--color-muted, #504159)",
                fontFamily: "var(--font-heading, monospace)",
                background: "var(--bg-primary, #FFF6E9)",
              }}
            >
              <span>↑↓ Navigasi</span>
              <span>↵ Jalankan</span>
              <span>ESC Tutup</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
