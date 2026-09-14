import { useState, useEffect } from "react";

const LINKS = [
  { label: "About", href: "#about", icon: "★" },
  { label: "Work", href: "#experience", icon: "▲" },
  { label: "Projects", href: "#projects", icon: "♦" },
  { label: "Say Hi", href: "#contact-form", icon: "✉" },
];

export default function PixelNavbar() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
      />

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
            background: "#FFF6E9",
            borderBottom: "4px solid #4A3B52",
            boxShadow: "0 4px 0 0 rgba(74,59,82,0.15)",
          }}
        >
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {/* Logo: little pixel house + cursor blink */}
            <a
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
                color: "#4A3B52",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              <PixelHouse />
              <span>
                Asgar<span style={{ color: "#B896D4" }}>Fatwahyudi</span>
                <span style={{ opacity: blink ? 1 : 0, color: "#4A3B52" }}>
                  _
                </span>
              </span>
            </a>

            {/* Nav links */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {LINKS.map((link, i) => {
                const isActive = active === link.label;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setActive(link.label)}
                    onMouseLeave={() => setActive(null)}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 9,
                      textDecoration: "none",
                      color: "#4A3B52",
                      background: isActive ? "#FFD873" : "transparent",
                      border: "3px solid",
                      borderColor: isActive ? "#4A3B52" : "transparent",
                      padding: "8px 10px",
                      transform: isActive
                        ? "translate(-2px,-2px)"
                        : "translate(0,0)",
                      boxShadow: isActive ? "3px 3px 0 0 #4A3B52" : "none",
                      transition:
                        "transform 0.1s steps(2,end), box-shadow 0.1s steps(2,end), background 0.1s steps(2,end), border-color 0.1s steps(2,end)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: iconColors[i % iconColors.length],
                      }}
                    >
                      {link.icon}
                    </span>
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}

const iconColors = ["#FF9EB8", "#7FCB9E", "#B896D4", "#FFB84C"];

function PixelHouse() {
  // tiny 8x8-ish pixel house built from divs, sits in a fixed box
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="8" y="0" width="4" height="4" fill="#4A3B52" />
      <rect x="4" y="4" width="4" height="4" fill="#4A3B52" />
      <rect x="12" y="4" width="4" height="4" fill="#4A3B52" />
      <rect
        x="4"
        y="8"
        width="12"
        height="10"
        fill="#FFC7D6"
        stroke="#4A3B52"
        strokeWidth="0"
      />
      <rect x="4" y="4" width="12" height="4" fill="#FF9EB8" />
      <rect x="8" y="12" width="4" height="6" fill="#B8E6C9" />
      <rect x="2" y="16" width="16" height="2" fill="#4A3B52" />
    </svg>
  );
}
