import { useState, useEffect, lazy, Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
import { Search } from "lucide-react";

const CommandPalette = lazy(() => import("./CommandPalette"));

const THEMES = [
  { id: "pixel", label: "PIXEL" },
  { id: "modern", label: "MODERN" },
  { id: "terminal", label: "TERMINAL" },
] as const;

// Small pixel-style SVG icons, built from rects so they read as "pixel art"
// at any size, and colored via currentColor so every theme tints them for free.
function IconStar({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" aria-hidden="true">
      <path
        d="M4 0h1v3h3v1H5v1h1v1H5v1H4V6H3V5h1V4H3V3h1V0z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTriangle({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" aria-hidden="true">
      <rect x="4" y="0" width="1" height="1" fill="currentColor" />
      <rect x="3" y="1" width="3" height="1" fill="currentColor" />
      <rect x="2" y="2" width="5" height="1" fill="currentColor" />
      <rect x="1" y="3" width="7" height="1" fill="currentColor" />
      <rect x="0" y="4" width="9" height="1" fill="currentColor" />
    </svg>
  );
}

function IconDiamond({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" aria-hidden="true">
      <rect x="4" y="0" width="1" height="1" fill="currentColor" />
      <rect x="3" y="1" width="3" height="1" fill="currentColor" />
      <rect x="2" y="2" width="5" height="1" fill="currentColor" />
      <rect x="1" y="3" width="7" height="1" fill="currentColor" />
      <rect x="2" y="4" width="5" height="1" fill="currentColor" />
      <rect x="3" y="5" width="3" height="1" fill="currentColor" />
      <rect x="4" y="6" width="1" height="1" fill="currentColor" />
    </svg>
  );
}

function IconMail({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 7" aria-hidden="true">
      <rect
        x="0"
        y="0"
        width="9"
        height="7"
        fill="none"
        stroke="currentColor"
      />
      <path d="M0 0l4.5 4L9 0" fill="none" stroke="currentColor" />
    </svg>
  );
}

const LINKS = [
  { label: "About", href: "#about", Icon: IconStar },
  { label: "Work", href: "#experience", Icon: IconTriangle },
  { label: "Projects", href: "#projects", Icon: IconDiamond },
  { label: "Say Hi", href: "#contact-form", Icon: IconMail },
];

export default function PixelNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [blink, setBlink] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(i);
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

  return (
    <div style={{ fontFamily: "var(--font-heading, monospace)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          transform: mounted ? "translateY(0)" : "translateY(-48px)",
          opacity: mounted ? 1 : 0,
          transition:
            "transform 0.28s steps(6, end), opacity 0.28s steps(6,end)",
        }}
      >
        <div
          style={{
            background: "var(--bg-primary, #FFF6E9)",
            borderBottom:
              "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
            boxShadow: "0 4px 0 0 rgba(74,59,82,0.1)",
          }}
        >
          <div
            className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 py-3"
            style={{ maxWidth: 880, margin: "0 auto" }}
          >
            {/* Logo: pixel house + cursor blink + local time status */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#"
                aria-label="Asgar Fatwahyudi Portfolio Home"
                className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                style={{
                  textDecoration: "none",
                  color: "var(--color-ink, #4A3B52)",
                  whiteSpace: "nowrap",
                }}
              >
                <PixelHouse />
                <span className="text-[10px] sm:text-xs">
                  Asgar
                  <span
                    className="hidden sm:inline"
                    style={{ color: "var(--accent-color, #74489D)" }}
                  >
                    Fatwahyudi
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      opacity: blink ? 1 : 0,
                      color: "var(--color-ink, #4A3B52)",
                    }}
                  >
                    _
                  </span>
                </span>
              </a>

              {/* Live Location / Time Widget */}
              <div
                className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 text-[8px]"
                style={{
                  fontFamily: "var(--font-body, monospace)",
                  background: "var(--badge-bg, #E3F5E9)",
                  border:
                    "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                  borderRadius: "var(--border-radius, 0px)",
                  color: "var(--badge-dot, #2C6B47)",
                  fontWeight: 600,
                }}
                title="Waktu Lokal Makassar (WITA, UTC+8)"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                  style={{ background: "var(--badge-dot, #2C6B47)" }}
                />
                <span>MKS {localTime ? `• ${localTime}` : ""}</span>
              </div>
            </div>

            {/* Nav links, Command Palette Button & Theme Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <nav
                aria-label="Primary Navigation"
                className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar"
              >
                {LINKS.map(({ label, href, Icon }) => {
                  const isActive = active === label;
                  return (
                    <a
                      key={label}
                      href={href}
                      onMouseEnter={() => setActive(label)}
                      onMouseLeave={() => setActive(null)}
                      aria-label={label}
                      className="flex items-center gap-1 sm:gap-1.5 shrink-0"
                      style={{
                        position: "relative",
                        fontSize: 9,
                        textDecoration: "none",
                        color: "var(--color-ink, #4A3B52)",
                        background: isActive
                          ? "var(--bg-secondary, #FFD873)"
                          : "transparent",
                        border: "var(--border-width, 2px) solid",
                        borderColor: isActive
                          ? "var(--color-ink, #4A3B52)"
                          : "transparent",
                        borderRadius: "var(--border-radius, 0px)",
                        padding: "6px 6px",
                        transform: isActive
                          ? "translate(-1px,-1px)"
                          : "translate(0,0)",
                        boxShadow: isActive
                          ? "var(--box-shadow, 2px 2px 0 0 #4A3B52)"
                          : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon />
                      <span className="hidden xs:inline sm:inline">
                        {label}
                      </span>
                    </a>
                  );
                })}
              </nav>

              {/* Command Palette Trigger Button */}
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                aria-label="Buka Command Palette (Ctrl+K)"
                title="Buka Menu Aksi Cepat (Cmd+K / Ctrl+K)"
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 shrink-0 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                style={{
                  fontFamily: "var(--font-heading, monospace)",
                  fontSize: "8px",
                  background: "var(--bg-primary, #FFF6E9)",
                  border:
                    "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                  borderRadius: "var(--border-radius, 0px)",
                  boxShadow: "var(--box-shadow, 2px 2px 0 0 #4A3B52)",
                  color: "var(--color-ink, #4A3B52)",
                }}
              >
                <Search className="w-2.5 h-2.5 shrink-0" />
                <span className="hidden sm:inline">⌘K</span>
              </button>

              {/* Theme Switcher Toggle */}
              <div
                className="flex items-center shrink-0"
                style={{
                  border:
                    "var(--border-width, 2px) solid var(--color-ink, #4A3B52)",
                  borderRadius: "var(--border-radius, 0px)",
                  background: "var(--bg-primary, #FFF6E9)",
                  padding: "2px",
                  boxShadow: "var(--box-shadow, 2px 2px 0 0 #4A3B52)",
                }}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    aria-label={`Ganti ke tema ${t.label}`}
                    className="px-1 sm:px-1.5 py-1"
                    style={{
                      fontFamily: "var(--font-heading, monospace)",
                      fontSize: "7px",
                      background:
                        theme === t.id
                          ? "var(--color-ink, #4A3B52)"
                          : "transparent",
                      color:
                        theme === t.id
                          ? "var(--bg-primary, #FFF6E9)"
                          : "var(--color-ink, #4A3B52)",
                      border: "none",
                      borderRadius: "calc(var(--border-radius, 0px) - 1px)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden">{t.label[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Dialog (Lazy Loaded on demand) */}
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

function PixelHouse() {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 20 18"
      aria-hidden="true"
      className="shrink-0"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="8" y="0" width="4" height="4" fill="var(--color-ink, #4A3B52)" />
      <rect x="4" y="4" width="4" height="4" fill="var(--color-ink, #4A3B52)" />
      <rect
        x="12"
        y="4"
        width="4"
        height="4"
        fill="var(--color-ink, #4A3B52)"
      />
      <rect
        x="4"
        y="8"
        width="12"
        height="10"
        fill="var(--card-frame-bg, #FFC7D6)"
        stroke="var(--color-ink, #4A3B52)"
        strokeWidth="0"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="var(--bg-secondary, #FF9EB8)"
      />
      <rect x="8" y="12" width="4" height="6" fill="var(--badge-bg, #B8E6C9)" />
      <rect
        x="2"
        y="16"
        width="16"
        height="2"
        fill="var(--color-ink, #4A3B52)"
      />
    </svg>
  );
}
