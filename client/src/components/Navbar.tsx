import { useState, useEffect, lazy, Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
import { Search, Layers } from "lucide-react";

const CommandPalette = lazy(() => import("./CommandPalette"));

const THEMES = [
  { id: "neuform", label: "NEUFORM" },
  { id: "modern", label: "MODERN" },
  { id: "terminal", label: "TERMINAL" },
] as const;

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact-form" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Makassar",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setLocalTime(now);
      } catch {
        const d = new Date();
        setLocalTime(
          `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
        );
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-heading, 'Inter', sans-serif)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          transform: mounted ? "translateY(0)" : "translateY(-30px)",
          opacity: mounted ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
        }}
        className="w-full px-4 sm:px-6 pt-4 pb-2"
      >
        <div
          className="max-w-6xl mx-auto rounded-full backdrop-blur-xl border transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-2xl"
          style={{
            background: "rgba(26, 27, 30, 0.75)",
            borderColor: "var(--color-border, #27272A)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
          }}
        >
          {/* Logo & Status Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => handleNavClick(e, "#")}
              aria-label="Asgar Portfolio Home"
              className="flex items-center gap-2 group text-decoration-none cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(0,229,89,0.2) 0%, rgba(56,189,248,0.2) 100%)",
                  border: "1px solid rgba(0, 229, 89, 0.4)",
                  color: "var(--color-primary, #00E559)",
                }}
              >
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                ASGAR
                <span
                  className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0, 229, 89, 0.12)",
                    color: "var(--color-primary, #00E559)",
                    border: "1px solid rgba(0, 229, 89, 0.25)",
                  }}
                >
                  AI.v4
                </span>
              </span>
            </a>

            {/* Live Telemetry / Time Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                background: "rgba(39, 39, 42, 0.6)",
                border: "1px solid #27272A",
                color: "#A1A1AA",
              }}
              title="Waktu Lokal Makassar (WITA, UTC+8)"
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                style={{ background: "var(--color-primary, #00E559)" }}
              />
              <span className="text-white font-medium">MKS {localTime ? `• ${localTime}` : ""}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1"
          >
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="px-3.5 py-1.5 text-xs rounded-full font-medium transition-all duration-200 text-zinc-300 hover:text-white hover:bg-white/5 active:scale-95 cursor-pointer"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Controls: Command Palette & Theme Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Buka Command Palette (Ctrl+K)"
              title="Buka Menu Aksi Cepat (Cmd+K / Ctrl+K)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer hover:border-zinc-600 active:scale-95"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                background: "rgba(26, 27, 30, 0.9)",
                border: "1px solid var(--color-border, #27272A)",
                color: "var(--color-muted, #A1A1AA)",
              }}
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline text-[11px]">Command</span>
              <kbd
                className="text-[10px] px-1.5 py-0.2 rounded"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Theme Switcher Toggle */}
            <div
              className="flex items-center p-1 rounded-full gap-0.5"
              style={{
                background: "rgba(15, 15, 18, 0.9)",
                border: "1px solid var(--color-border, #27272A)",
              }}
            >
              {THEMES.map((t) => {
                const isActive = theme === t.id || (theme === "pixel" && t.id === "neuform");
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id === "neuform" ? "pixel" : t.id)}
                    aria-label={`Ganti ke tema ${t.label}`}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#00E559] text-black font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden">{t.label[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Dialog */}
      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={paletteOpen}
            onClose={() => setPaletteOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
