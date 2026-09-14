import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import About from "../../components/About";
import Experience from "../../components/Experience";
import Projects from "../../components/Projects";
import ContactForm from "../../components/ContactForm";

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  data: any;
  is_active: boolean;
}

const PIXEL_FONT = "'Press Start 2P', monospace";
const INK = "#4A3B52";
const MUTED = "#8A7A93";
const CREAM = "#FFF6E9";

export default function Home() {
  const [sections, setSections] = useState<Record<string, Section>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await api.get("/sections/public");
        const mapping: Record<string, Section> = {};
        res.data.data.forEach((item: Section) => {
          mapping[item.key] = item;
        });
        setSections(mapping);
      } catch (err) {
        console.error("Gagal memuat konten publik:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-xs"
        style={{
          background: CREAM,
          color: MUTED,
          fontFamily: PIXEL_FONT,
          fontSize: "10px",
        }}
      >
        Loading experience...
      </div>
    );
  }

  const heroSec = sections["hero"];
  const aboutSec = sections["about"];
  const socialsSec = sections["socials"];

  return (
    <div className="min-h-screen" style={{ background: CREAM, color: INK }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6">
        {heroSec?.is_active && (
          <Hero
            title={heroSec.title}
            subtitle={heroSec.subtitle}
            data={heroSec.data}
          />
        )}

        {aboutSec?.is_active && (
          <About
            title={aboutSec.title}
            subtitle={aboutSec.subtitle}
            data={aboutSec.data}
          />
        )}

        <Experience />

        <Projects />

        <ContactForm />

        {/* Footer / Connect Section */}
        <footer
          id="contact"
          className="py-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs mt-20"
          style={{
            borderTop: `3px solid ${INK}`,
            color: MUTED,
            fontFamily: PIXEL_FONT,
            fontSize: "9px",
          }}
        >
          <div>© {new Date().getFullYear()} — Built with A2dev.</div>
          <div className="flex gap-4" style={{ color: INK }}>
            {socialsSec?.data?.github && (
              <a
                href={socialsSec.data.github}
                target="_blank"
                rel="noreferrer"
                style={{ color: INK, textDecoration: "none" }}
                className="hover:opacity-70 transition-opacity"
              >
                GitHub
              </a>
            )}
            {socialsSec?.data?.linkedin && (
              <a
                href={socialsSec.data.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{ color: INK, textDecoration: "none" }}
                className="hover:opacity-70 transition-opacity"
              >
                LinkedIn
              </a>
            )}
            {socialsSec?.data?.email && (
              <a
                href={`mailto:${socialsSec.data.email}`}
                style={{ color: INK, textDecoration: "none" }}
                className="hover:opacity-70 transition-opacity"
              >
                Email
              </a>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
