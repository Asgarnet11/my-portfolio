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
      icon: <User className="w-4 h-4 text-[#38BDF8]" />,
      action: () => scrollToSection("about"),
    },
    {
      id: "nav-experience",
      category: "Navigasi",
      label: "Lompat ke Work Experience",
      icon: <Briefcase className="w-4 h-4 text-[#38BDF8]" />,
      action: () => scrollToSection("experience"),
    },
    {
      id: "nav-projects",
      category: "Navigasi",
      label: "Lompat ke Featured Projects",
      icon: <FolderKanban className="w-4 h-4 text-[#38BDF8]" />,
      action: () => scrollToSection("projects"),
    },
    {
      id: "nav-contact",
      category: "Navigasi",
      label: "Lompat ke Hubungi Saya",
      icon: <Mail className="w-4 h-4 text-[#38BDF8]" />,
      action: () => scrollToSection("contact-form"),
    },

    // Tema
    {
      id: "theme-neuform",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Neuform AI (Default DESIGN.md)",
      icon: <Sliders className="w-4 h-4 text-[#00E559]" />,
      action: () => {
        setTheme("pixel");
        onClose();
      },
    },
    {
      id: "theme-modern",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Modern Clean",
      icon: <Sliders className="w-4 h-4 text-[#00E559]" />,
      action: () => {
        setTheme("modern");
        onClose();
      },
    },
    {
      id: "theme-terminal",
      category: "Tema Tampilan",
      label: "Aktifkan Tema: Dark Terminal",
      icon: <Sliders className="w-4 h-4 text-[#00E559]" />,
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
      icon: copied ? <Check className="w-4 h-4 text-[#00E559]" /> : <Copy className="w-4 h-4 text-[#00E559]" />,
      action: () => copyEmail(),
    },
    {
      id: "open-github",
      category: "Aksi Cepat",
      label: "Kunjungi GitHub Profil Asgar",
      icon: <Globe className="w-4 h-4 text-[#38BDF8]" />,
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
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? (filteredCommands.length || 1) - 1 : prev - 1,
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl overflow-hidden z-10 rounded-[20px] shadow-2xl"
            style={{
              background: "var(--color-surface, #1A1B1E)",
              border: "1px solid var(--color-border, #27272A)",
              fontFamily: "var(--font-body, 'Inter', sans-serif)",
            }}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ketik perintah atau cari (About, Proyek, Tema)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full text-sm bg-transparent outline-none text-white placeholder-zinc-500 font-sans"
              />
              <kbd className="text-[10px] px-2 py-0.5 rounded font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                ESC
              </kbd>
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
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-[#00E559] text-black font-semibold shadow-md"
                        : "text-zinc-300 hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0">{cmd.icon}</span>
                      <span className="truncate">{cmd.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 opacity-70">
                      <span className="text-[10px] uppercase font-mono tracking-wider">
                        {cmd.category}
                      </span>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}

              {filteredCommands.length === 0 && (
                <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                  Tidak ada perintah yang cocok dengan &quot;{query}&quot;
                </div>
              )}
            </div>

            {/* Footer Shortcut Hints */}
            <div className="px-5 py-3 text-[11px] font-mono flex items-center justify-between border-t border-zinc-800 text-zinc-500 bg-zinc-900/50">
              <span>↑↓ Navigasi</span>
              <span>↵ Eksekusi</span>
              <span>ESC Tutup</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
