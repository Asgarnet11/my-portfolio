import { useState, useEffect, lazy, Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
import { Search, Layers, Moon, Sun } from "lucide-react";

const CommandPalette = lazy(() => import("./CommandPalette"));

const THEMES = [
  { id: "terminal", label: "MIDNIGHT", icon: Moon },
  { id: "editorial", label: "EDITORIAL", icon: Sun },
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

  const isTerminal = theme !== "editorial" && theme !== "modern" && theme !== "light";

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
          className="max-w-6xl mx-auto rounded-full backdrop-blur-xl border transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3"
          style={{
            background: "var(--bg-nav, rgba(26, 26, 36, 0.8))",
            borderColor: "var(--border-color, rgba(247, 249, 250, 0.12))",
            boxShadow: "var(--box-shadow)",
          }}
        >
          {/* Logo & Telemetry */}
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
                  background: "var(--badge-bg)",
                  border: "1px solid var(--badge-border)",
                  color: "var(--color-accent)",
                }}
              >
                <Layers className="w-4 h-4" />
              </div>
              <span
                className="font-semibold text-sm sm:text-base tracking-tight flex items-center gap-1.5"
                style={{ color: "var(--color-ink)" }}
              >
                ASGAR
                <span
                  className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    background: "var(--badge-bg)",
                    color: "var(--color-accent)",
                    border: "1px solid var(--badge-border)",
                  }}
                >
                  ENGINEER
                </span>
              </span>
            </a>

            {/* Live Telemetry / Time Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--color-muted)",
              }}
              title="Waktu Lokal Makassar / Kendari (WITA, UTC+8)"
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                style={{ background: "var(--color-accent)" }}
              />
              <span style={{ color: "var(--color-ink)" }} className="font-medium">
                WITA {localTime ? `• ${localTime}` : ""}
              </span>
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
                className="px-3.5 py-1.5 text-xs rounded-full font-medium transition-all duration-200 cursor-pointer"
                style={{
                  color: "var(--color-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-ink)";
                  e.currentTarget.style.background = "var(--border-subtle)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-muted)";
                  e.currentTarget.style.background = "transparent";
                }}
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer active:scale-95"
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--color-muted)",
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Command</span>
              <kbd
                className="text-[10px] px-1.5 py-0.2 rounded font-mono"
                style={{
                  background: "var(--border-subtle)",
                  border: "1px solid var(--border-color)",
                  color: "var(--color-ink)",
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Theme Switcher Toggle (Tema-utama / Modern-Design) */}
            <div
              className="flex items-center p-1 rounded-full gap-0.5"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              {THEMES.map((t) => {
                const isActive = t.id === "terminal" ? isTerminal : !isTerminal;
                const IconComponent = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    aria-label={`Ganti ke tema ${t.label}`}
                    title={`Mode ${t.label}`}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all duration-200 cursor-pointer ${
                      isActive ? "font-semibold shadow-sm" : "hover:opacity-80"
                    }`}
                    style={{
                      background: isActive ? "var(--color-accent)" : "transparent",
                      color: isActive ? "var(--on-accent)" : "var(--color-muted)",
                    }}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="hidden sm:inline">{t.label}</span>
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
