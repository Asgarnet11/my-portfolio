import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import About from "../../components/About";
import Experience from "../../components/Experience";
import Projects from "../../components/Projects";
import ContactForm from "../../components/ContactForm";

interface SectionData {
  statusBadge?: string;
  avatarUrl?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  email?: string;
  [key: string]: unknown;
}

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  data: SectionData;
  is_active: boolean;
}

const DEFAULT_SECTIONS: Record<string, Section> = {
  hero: {
    id: "default-hero",
    key: "hero",
    title: "Hi, I am Muh Asgar Fatwahyudi",
    subtitle: "Building clean backends and responsive user interfaces.",
    data: {
      avatarUrl:
        "https://relxttjsqsvhesreewha.supabase.co/storage/v1/object/public/portfolio-assets/projects/1789713386781-953399969.webp",
      statusBadge: "Available for new opportunities",
      ctaPrimaryLink: "#projects",
      ctaPrimaryText: "View Projects",
      ctaSecondaryLink: "#contact-form",
      ctaSecondaryText: "Contact Me",
    },
    is_active: true,
  },
  about: {
    id: "default-about",
    key: "about",
    title: "About Me",
    subtitle: "Crafting software with care and intentionality.",
    data: {
      bio: "Saya adalah lulusan Sistem Informasi yang memiliki ketertarikan kuat pada Web Development, Sistem Informasi, dan Data Management. Saat ini saya bekerja sebagai Pranata Komputer di BPVP Kendari, dengan pengalaman dalam mengembangkan dan memelihara sistem informasi, membangun dashboard monitoring, mengelola database dan API, melakukan pengujian sistem, serta menyelesaikan berbagai permasalahan teknis untuk mendukung digitalisasi proses kerja.\n\nSaya memiliki pengalaman menggunakan Laravel, PHP, JavaScript, TypeScript, React, Next.js, Node.js, Python, MySQL, Tailwind CSS, Git, dan GitHub. Pengalaman kerja sebelumnya di bidang operasional dan administrasi juga membentuk kemampuan saya dalam ketelitian, pengelolaan data, komunikasi, teamwork, problem solving, dan bekerja berdasarkan target.\n\nSaya terus mengembangkan kemampuan teknis dan profesional dengan tujuan menjadi Software/Web Developer yang mampu membangun solusi digital yang efektif, terstruktur, dan memberikan dampak nyata bagi pengguna maupun organisasi.",
      skills: [
        "TypeScript",
        "Express.js",
        "PostgreSQL",
        "React",
        "PHP",
        "Laravel",
        "Tailwind CSS",
        "mySQL",
      ],
    },
    is_active: true,
  },
  socials: {
    id: "default-socials",
    key: "socials",
    title: "Connect",
    subtitle: "Find me on the web",
    data: {
      email: "afatwahyudi@gmail.com",
      github: "https://github.com/Asgarnet11",
      linkedin: "https://www.linkedin.com/in/muh-asgar-fatwahyudi/",
    },
    is_active: true,
  },
};

export default function Home() {
  const [sections, setSections] =
    useState<Record<string, Section>>(DEFAULT_SECTIONS);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      try {
        const res = await api.get("/sections/public");
        const mapping: Record<string, Section> = {};
        res.data.data.forEach((item: Section) => {
          mapping[item.key] = item;
        });
        if (isMounted) setSections(mapping);
      } catch (err) {
        console.error("Gagal memuat konten publik:", err);
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const heroSec = sections["hero"];
  const aboutSec = sections["about"];
  const socialsSec = sections["socials"];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "var(--bg-primary, #FFF6E9)",
        color: "var(--color-ink, #4A3B52)",
      }}
    >
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
          className="py-10 sm:py-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs mt-12 sm:mt-20"
          style={{
            borderTop:
              "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
            color: "var(--color-muted, #504159)",
            fontFamily: "var(--font-body, monospace)",
            fontSize: "9px",
          }}
        >
          <div className="leading-relaxed">
            © {new Date().getFullYear()} — Built with A2dev.
          </div>
          <div
            className="flex flex-wrap gap-x-4 gap-y-2"
            style={{ color: "var(--color-ink, #4A3B52)" }}
          >
            {socialsSec?.data?.github && (
              <a
                href={socialsSec.data.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--color-ink, #4A3B52)",
                  textDecoration: "none",
                }}
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
                style={{
                  color: "var(--color-ink, #4A3B52)",
                  textDecoration: "none",
                }}
                className="hover:opacity-70 transition-opacity"
              >
                LinkedIn
              </a>
            )}
            {socialsSec?.data?.email && (
              <button
                type="button"
                onClick={() =>
                  handleCopyEmail(socialsSec.data.email as string)
                }
                style={{
                  color: "var(--color-ink, #4A3B52)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                }}
                className="hover:opacity-70 transition-opacity"
                title="Klik untuk salin alamat email"
              >
                {copiedEmail ? "✓ Email Tersalin!" : "Email"}
              </button>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
